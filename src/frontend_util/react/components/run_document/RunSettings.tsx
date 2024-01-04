import _ from "lodash";
import { useContext, useState } from "react";
import { ApiClient } from "../../../../api_client/api_client";
import { useNavigate } from "react-router-dom";
import { RunDocumentAppContext } from "../../RunDocumentContext";

import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import ImportCurl from "../ImportCurl";

export default function RunSettings() {
  const navigate = useNavigate();
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [openCurlImporter, setOpenCurlImporter] = useState(false);
  const [_error, setError] = useState<string>("");
  const handleClose = () => setShowTitleModal(false);

  const { state, dispatch } = useContext(RunDocumentAppContext);
  const configuration = state.runDocument?.configuration;

  function TitleModal() {
    return (
      <Transition.Root show={showTitleModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setShowTitleModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          We need a name for this test
                        </Dialog.Title>
                        <div className="mt-2 w-full">
                          <input
                            type="text"
                            value={state.runDocument.title}
                            onChange={(event: any) => {
                              (state.runDocument.title = event?.target?.value),
                                dispatch({
                                  runDocument: {
                                    ...state.runDocument,
                                  },
                                });
                            }}
                            placeholder="Type here"
                            className="input input-bordered w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => startExecution()}
                    >
                      Save and run
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setShowTitleModal(false)}
                    >
                      Back
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }

  const startExecution = async () => {
    if (_.isEmpty(_.trim(state?.runDocument?.title))) {
      setShowTitleModal(true);
      return;
    }
    setShowTitleModal(false);
    console.log(state.runDocument);
    if (_.isNil(state.runDocument)) {
      return;
    }

    const apiClient = new ApiClient();
    try {
      const executionDocumentOrError = await apiClient.runLoadTest({
        runDocument: state.runDocument,
        runDocumentPath: state.runDocumentPath as string,
      });
      if (executionDocumentOrError.isFailure) {
        console.log(executionDocumentOrError.error);
        // TODO dispatch error
        return;
      }
      const exce = executionDocumentOrError.getValue();
      console.log(executionDocumentOrError);
      navigate(`/runs/api/${state.runDocumentPath}/executions/${exce.id}`);
    } catch (err: any) {
      console.error(err);
      const code = err?.response?.data?.code;
      if (code === "ALREADY_RUNNING") {
        return; /*router.push(
          `/run/${runTypeToJSON(state.runDocument.type)}/${
            state.runDocument.uniqueId
          }/runs/${err?.response?.data?.uniqueId}`
        );*/
      } else if (code === "LICENSE_REQUIRED") {
        setError(err?.response?.data?.message);
      }
    }
    handleClose();
  };
  return (
    <>
      <div className="app_container mx-auto">
        <div className="grid">
          <div className="tabs z-10 -mb-px">
            <button className="tab tab-lifted tab-active">Settings</button>
            <button
              className="tab tab-lifted btn-sm btn-primary"
              onClick={() => {
                setOpenCurlImporter(true);
              }}
            >
              Import curl
            </button>
          </div>
          <div className="bg-base-300  relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  min-h-[6rem] w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
              <div className="grid grid-cols-3 gap-2 flex items-center h-full">
                <div className="text-center">
                  <div className="text-[42px] w-full">
                    <input
                      onChange={(ev: any) => {
                        if (state?.runDocument?.configuration) {
                          state.runDocument.configuration.rps = parseInt(
                            ev?.target?.value || 0,
                            10
                          );
                        }
                        dispatch({
                          runDocument: {
                            ...state.runDocument,
                          },
                        });
                      }}
                      pattern="\d*"
                      value={configuration?.rps}
                      maxLength={5}
                      className="w-full text-center"
                      type="text"
                      placeholder="rps"
                    />
                  </div>
                  <div>Requests per second</div>
                </div>
                <div className="text-center">
                  <div className="text-[42px] w-full text-center">
                    <input
                      onChange={(ev: any) => {
                        if (state?.runDocument?.configuration) {
                          state.runDocument.configuration.durationInSeconds =
                            parseInt(ev?.target?.value || 0, 10);
                        }
                        dispatch({
                          runDocument: {
                            ...state.runDocument,
                          },
                        });
                      }}
                      pattern="\d*"
                      value={configuration?.durationInSeconds}
                      maxLength={4}
                      className="w-full text-center"
                      type="text"
                      placeholder="seconds"
                    />
                  </div>
                  <div>Test duration in seconds</div>
                </div>
                <div className="text-center">
                  <div
                    onClick={() => {
                      startExecution();
                    }}
                  >
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
      </div>
      <TitleModal />
      <ImportCurl
        open={openCurlImporter}
        setOpen={setOpenCurlImporter}
        onData={(curlAsJson: any) => {
          console.log(curlAsJson);
        }}
      />
    </>
  );
}
