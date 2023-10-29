import JSTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import _ from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import TimeAgo from "react-time-ago";
import { ApiClient } from "../../../../api_client/api_client";
import { RunDocument } from "../../../ipc/run_document";
import { RunDocumentAppContext } from "../../RunDocumentContext";

JSTimeAgo.addDefaultLocale(en);

export default function RunNavigation() {
  const { state, dispatch } = useContext(RunDocumentAppContext);
  const [lastSavedAt, setLastSavedAt] = useState(new Date());
  const [queueSave, setQueueSave] = useState(0);

  const save = async () => {
    /*if (_.isNil(state.runDocument)) {
      return;
    }
    const bytes = RunDocument.encode(state.runDocument).finish();
    const serialized = Buffer.from(bytes).toString("base64");
    const apiClient = new ApiClient();
    try {
      await apiClient.save(serialized);
      setLastSavedAt(new Date());
    } catch (err) {
      console.error(err);
    }*/
  };
  const saveCallback = useCallback(save, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      save();
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [state]);
  if (_.isNil(state.runDocument)) {
    return <div />;
  }
  return (
    <>
      <div className="app_container mx-auto">
        <article className="prose prose-lg my-4">
          <h2>
            <input
              type="text"
              className="fs-4"
              value={state.runDocument.title}
              onChange={(event: any) => {
                (state.runDocument.title = event?.target?.value),
                  dispatch({
                    runDocument: {
                      ...state.runDocument,
                    },
                  });
              }}
              style={{ backgroundColor: "transparent", border: "none" }}
            />
          </h2>
        </article>
      </div>
    </>
  );
}

const Old = () => {
  return (
    <div className="container-narrow mx-auto">
      <header className="d-flex flex-wrap justify-content-center py-3">
        <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
          <input
            type="text"
            className="fs-4 text-white"
            style={{ backgroundColor: "transparent", border: "none" }}
          />
        </div>

        <ul className="nav nav-pills">
          <li className="nav-item">
            <a href="#" className="nav-link">
              Auto saved <TimeAgo date={new Date()} locale="en-US" />
            </a>
          </li>
        </ul>
      </header>
    </div>
  );
};
