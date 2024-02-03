import * as _ from "lodash";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiClient } from "../api_client/api_client";
import {
  ExecutionAppContext,
  INITIAL_EXECUTION_APP_STATE,
  executionReducer,
} from "../frontend_util/react/ExecutionContext";
import ExecutionGraph from "../frontend_util/react/components/run_document/ExecutionGraph";
import { ScrollToTop } from "../ScrollToTop";
import DownloadReport from "../frontend_util/react/components/DownloadReport";

const Execution = () => {
  const navigation = useNavigate();
  let { documentPath, executionId } = useParams();
  const [showDownloadReport, setShowDownloadReport] = useState(false);
  const [executionAppState, dispatch] = useReducer(executionReducer, {
    ...INITIAL_EXECUTION_APP_STATE,
    runDocumentPath: documentPath as string,
    executionId: executionId as string,
  });
  let title = executionAppState.runDocument?.title;
  if (_.isEmpty(title)) {
    title = executionAppState.runDocument?.title || "Untitled test";
  }
  title = _.truncate(title, { length: 40 });
  const loadExecution = async () => {
    try {
      const apiClient = new ApiClient();
      const executionDocumentOrError = await apiClient.getExecutionDocument({
        runDocumentPath: documentPath as string,
        executionDocumentId: executionId as string,
      });
      if (executionDocumentOrError.isFailure) {
        return dispatch({
          state: "ERROR",
        });
      }
      const executionDocument = executionDocumentOrError.getValue();
      console.log({ executionDocument });
      const runDocumentOrError = await apiClient.getRunDocumentByRevisionId({
        runDocumentPath: documentPath as string,
        documentRevisionId: executionDocument.document_revision_id,
        runMigrations: false,
      });
      if (runDocumentOrError.isFailure) {
        return dispatch({
          state: "ERROR",
        });
      }
      const runDocument = runDocumentOrError.getValue();
      dispatch({
        runDocument,
      });
      const executionResultsOrError = await apiClient.getExecutionResults({
        runDocumentPath: documentPath as string,
        executionDocumentId: executionId as string,
      });
      if (executionResultsOrError.isFailure) {
        return dispatch({
          state: "ERROR",
        });
      }
      const executionResults = executionResultsOrError.getValue();
      console.log({ ready: executionResults });

      dispatch({
        executionResults: executionResults,
        state: "READY",
      });
      if (executionDocument.status === "RUNNING") {
        setTimeout(() => {
          loadExecution();
        }, 1000);
      }
    } catch (err) {
      if (err === "DOCUMENT_NOT_FOUND") {
        return;
      }
      return dispatch({
        state: "ERROR",
      });
    }
  };
  useEffect(() => {
    loadExecution();
  }, []);
  return (
    <ExecutionAppContext.Provider
      value={{ state: executionAppState, dispatch }}
    >
      <ScrollToTop />
      <div className="bg-primary">
        <div className="navbar">
          <div className="flex-1">
            <p
              className="btn btn-ghost normal-case text-xl text-white text-ellipsis"
              onClick={() => {
                navigation(`/runs/api/${documentPath}`);
              }}
            >
              {title}
            </p>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li
                onClick={() => {
                  setShowDownloadReport(true);
                }}
              >
                <a className="btn btn-sm">Download Results</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="app_container py-8 mx-auto">
          <ExecutionGraph />
        </div>
      </div>
      <div className="app_container mx-auto mt-10">
        <div className="grid">
          <div className="tabs z-10 -mb-px">
            <button className="tab tab-lifted tab-active">Past runs</button>
          </div>
          <div className="bg-base-300  relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  min-h-[6rem] w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4"></div>
          </div>
        </div>
      </div>
      <DownloadReport
        runDocumentPath={documentPath as string}
        executionId={executionId as string}
        open={showDownloadReport}
        setOpen={setShowDownloadReport}
      />
    </ExecutionAppContext.Provider>
  );
};

export default Execution;
