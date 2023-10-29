import shortid from "shortid";

import { useEffect, useReducer } from "react";
import { RunDocumentFactory } from "../frontend_util/factories/run_document_factory";
import { RunType, runTypeFromJSON } from "../frontend_util/ipc/run_document";
import {
  INITIAL_RUN_DOCUMENT_APP_STATE,
  RunDocumentAppContext,
  runDocumentReducer,
} from "../frontend_util/react/RunDocumentContext";
import Executions from "../frontend_util/react/components/Executions";
import TopNav from "../frontend_util/react/components/TopNav";
import ApiSteps from "../frontend_util/react/components/run_document/ApiSteps";
import RunNavigation from "../frontend_util/react/components/run_document/RunNavigation";
import RunSettings from "../frontend_util/react/components/run_document/RunSettings";

const Home = () => {
  const type = RunType.API;
  const [runDocumentAppState, dispatch] = useReducer(
    runDocumentReducer,
    INITIAL_RUN_DOCUMENT_APP_STATE
  );
  const loadRunDocument = async () => {
    const runType = runTypeFromJSON(RunType.API);
    const runDocument = RunDocumentFactory.newRunDocument(
      runType,
      shortid.generate()
    );

    dispatch({
      runDocument,
      state: "IDLE",
    });
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
            <TopNav container="container-fluid" />
            <RunNavigation />
            <RunSettings />
            {steps()}
          </div>
        </RunDocumentAppContext.Provider>
        <Executions />
      </>
    );
  };

  return <div>{main()}</div>;
};

export default Home;

const RunOld = () => {
  return (
    <>
      <div className="app_container mx-auto">
        <article className="prose prose-lg my-4">
          <h2>Untitled test</h2>
        </article>
        <div className="grid">
          <div className="tabs z-10 -mb-px">
            <button className="tab tab-lifted tab-active">Settings</button>
          </div>
          <div className="bg-base-300  relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  min-h-[6rem] w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
              <div className="grid grid-cols-3 gap-2 flex items-center h-full">
                <div className="text-center">
                  <div className="text-[42px]">100</div>
                  <div>Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-[42px]">100</div>
                  <div>Seconds</div>
                </div>
                <div className="text-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-[60px] mx-auto"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>Start Test</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-4"></div>
        <div className="grid">
          <div className="tabs z-10 -mb-px">
            <button className="tab tab-lifted tab-active">Settings</button>
          </div>
          <div className="bg-base-300  relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
              <div className="join w-full">
                <select className="select select-bordered join-item w-2/12">
                  <option selected>GET</option>
                  <option>Sci-fi</option>
                  <option>Drama</option>
                  <option>Action</option>
                </select>
                <div className="w-10/12">
                  <div>
                    <input
                      className="input input-bordered join-item w-full"
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>
              <div className="my-4"></div>
              <div className="join w-full">
                <div className="indicator w-2/12">
                  <button className="btn join-item w-full border">
                    Timeout (ms)
                  </button>
                </div>
                <div className="w-3/12">
                  <div>
                    <input
                      className="input input-bordered join-item w-full"
                      placeholder="Search"
                    />
                  </div>
                </div>
                <div className="w-1/12"></div>
                <div className="indicator w-6/12">
                  <button className="btn join-item w-full">
                    Test connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
