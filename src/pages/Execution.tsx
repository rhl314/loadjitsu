import * as _ from "lodash";
import { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiClient } from "../api_client/api_client";
import {
  ExecutionAppContext,
  INITIAL_EXECUTION_APP_STATE,
  executionReducer,
} from "../frontend_util/react/ExecutionContext";
import ExecutionGraph from "../frontend_util/react/components/run_document/ExecutionGraph";
import { ScrollToTop } from "../ScrollToTop";

const Execution = () => {
  const navigation = useNavigate();
  let { documentPath, executionId } = useParams();
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
      const executionStatusCountsOrError =
        await apiClient.getExecutionStatusCounts({
          runDocumentPath: documentPath as string,
          executionDocumentId: executionId as string,
        });
      if (executionStatusCountsOrError.isFailure) {
        return dispatch({
          state: "ERROR",
        });
      }
      const executionStatusCounts = executionStatusCountsOrError.getValue();
      console.log({ executionStatusCounts });

      dispatch({
        executionStatusCounts,
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
              <li>
                <a className="btn btn-sm">Download report</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="app_container py-8 mx-auto">
          <ExecutionGraph />
          <div>
            <div className="min-h-[6rem] border-t-0 border-neutral-700">
              <div className="grid grid-cols-12">
                <div className="col-span-3 items-center content-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="red"
                    className="w-[60px] mx-auto mt-3"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="col-span-3 flex items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
                <div className="col-span-3 flex items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
                <div className="col-span-3 flex items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-12 mb-8">
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">Abort test</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">Success</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">Errors</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">Timeouts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="min-h-[6rem] border-t-0 border-neutral-700">
              <div className="grid grid-cols-12">
                <div className="col-span-3 items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
                <div className="col-span-3 flex items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
                <div className="col-span-3 flex items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
                <div className="col-span-3 flex items-center content-center mx-auto">
                  <p className="text-white text-center mt-2 text-4xl">
                    9999999
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-12 mb-8">
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">
                      Avg response time (ms)
                    </p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">
                      Max response time (ms)
                    </p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">Avg latency (ms)</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="text-white text-center">Max latency (ms)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    </ExecutionAppContext.Provider>
  );
};

export default Execution;
