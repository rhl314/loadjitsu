import shortid from "shortid";

import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useReducer } from "react";
import { AppUtil } from "../api_client/AppUtil";
import { RunDocumentFactory } from "../frontend_util/factories/run_document_factory";
import { ApiStep } from "../frontend_util/ipc/api";
import { RunDocument, RunType } from "../frontend_util/ipc/run_document";
import {
  INITIAL_RUN_DOCUMENT_APP_STATE,
  RunDocumentAppContext,
  runDocumentReducer,
} from "../frontend_util/react/RunDocumentContext";
import Runs from "../frontend_util/react/components/Runs";
import TopNav from "../frontend_util/react/components/TopNav";
import ApiSteps from "../frontend_util/react/components/run_document/ApiSteps";
import RunNavigation from "../frontend_util/react/components/run_document/RunNavigation";
import RunSettings from "../frontend_util/react/components/run_document/RunSettings";

const Run = (args: { documentPath: string }) => {
  const type = RunType.API;
  const [runDocumentAppState, dispatch] = useReducer(runDocumentReducer, {
    ...INITIAL_RUN_DOCUMENT_APP_STATE,
    runDocumentPath: args.documentPath,
  });
  const loadRunDocument = async () => {
    try {
      const runDocumentSerialized = (await invoke("loadRunDocument", {
        runDocumentPath: args.documentPath,
      })) as string;
      const appUtil = new AppUtil();
      const runDocument = RunDocument.decode(
        appUtil.base64ToUint8Array(runDocumentSerialized)
      );
      dispatch({
        runDocument,
        state: "IDLE",
      });
    } catch (err) {
      if (err === "DOCUMENT_NOT_FOUND") {
        let apiStepFromLocalStorage: ApiStep | null = null;
        try {
          const importedCurl = localStorage.getItem("importedCurl");
          if (importedCurl) {
            const base64ToUint8Array = Uint8Array.from(
              atob(importedCurl),
              (c) => c.charCodeAt(0)
            );
            apiStepFromLocalStorage = ApiStep.decode(base64ToUint8Array);
            console.log({ apiStepFromLocalStorage });
          }
        } catch (err) {
          console.error(err);
          apiStepFromLocalStorage = null;
        }
        const runDocument = RunDocumentFactory.newRunDocument(
          RunType.API,
          shortid.generate(),
          apiStepFromLocalStorage as ApiStep
        );
        dispatch({
          runDocument,
          state: "IDLE",
        });
        return;
      }
    }
  };
  useEffect(() => {
    loadRunDocument();
  }, []);

  const steps = () => {
    switch (type) {
      case RunType.API:
        return <ApiSteps />;
    }
  };

  const main = () => {
    if (runDocumentAppState.state == "LOADING") {
      return <div />;
    }
    return (
      <>
        <RunDocumentAppContext.Provider
          value={{ state: runDocumentAppState, dispatch }}
        >
          <div>
            <TopNav />
            <RunNavigation />
            <RunSettings />
            {steps()}
          </div>
          <div>
            <Runs />
          </div>
        </RunDocumentAppContext.Provider>
      </>
    );
  };

  return <div>{main()}</div>;
};

export default Run;
