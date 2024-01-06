import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon, SwatchIcon } from "@heroicons/react/24/solid";
import { Fragment, useEffect, useState } from "react";
import { ApiClient } from "../../../api_client/api_client";
import { Result } from "../../common/Result";
import FileUploader from "./FileUploader";

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "100px 1fr 140px 80px",
    gridTemplateAreas: "header main account footer",
  },
  header: {
    gridTemplate: "header",
  },
  main: {
    gridTemplate: "main",
    overflowY: "scroll",
  },
  account: {
    gridTemplate: "account",
    backgroundColor: "yellow",
  },
  footer: {
    gridTemplate: "footer",
    backgroundColor: "purple",
  },
};

interface IDownloadReportState {
  testerProfilePhoto?: string;
  testerName?: string;
  organisationName?: string;
  organisationLogo?: string;
}

export default function DownloadReport({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [state, setState] = useState<IDownloadReportState>({});
  const apiClient = new ApiClient();
  const loadDetails = async () => {
    const newState: IDownloadReportState = {};
    try {
      const testerNameOrError = await apiClient.getMetaDataString(
        "TESTER_NAME"
      );
      if (testerNameOrError.isSuccess) {
        newState.testerName = testerNameOrError.getValue();
      }
      const testerProfilePhotoOrError = await apiClient.getMetaDataString(
        "TESTER_PROFILE_PHOTO"
      );
      if (testerProfilePhotoOrError.isSuccess) {
        newState.testerProfilePhoto = testerProfilePhotoOrError.getValue();
      }

      const organisationNameOrError = await apiClient.getMetaDataString(
        "ORGANISATION_NAME"
      );
      if (organisationNameOrError.isSuccess) {
        newState.organisationName = organisationNameOrError.getValue();
      }
      const organisaitonLogo = await apiClient.getMetaDataString(
        "ORGANISATION_LOGO"
      );
      if (organisaitonLogo.isSuccess) {
        newState.organisationLogo = organisaitonLogo.getValue();
      }
    } catch (err) {
      console.error(err);
    }
    setState({
      ...state,
      ...newState,
    });
  };

  useEffect(() => {
    loadDetails();
  }, []);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-2xl">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4"></div>
                  </Transition.Child>

                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div
                      className="flex-1 h-full flex flex-col"
                      style={styles.root}
                    >
                      <div style={styles.header}>
                        <div className="bg-gray-50 px-4 py-6 sm:px-6 h-full">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                Download your results
                              </Dialog.Title>
                              <p className="text-sm text-gray-500">
                                You can download your results as videos and
                                pdfs.
                              </p>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="relative text-gray-400 hover:text-gray-500"
                                onClick={() => setOpen(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={styles.main}>
                        <div className="bg-white px-4 py-6 sm:px-6 h-full">
                          <div className="px-4 py-6 sm:px-6 grow">
                            <div className="space-y-12">
                              <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">
                                  Report formats
                                </h2>

                                <div className="space-y-10">
                                  <fieldset>
                                    <div className="mt-6 space-y-6">
                                      <div className="relative flex gap-x-3">
                                        <div className="flex h-6 items-center">
                                          <input
                                            id="comments"
                                            name="comments"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                          />
                                        </div>
                                        <div className="text-sm leading-6">
                                          <label
                                            htmlFor="comments"
                                            className="font-medium text-gray-900"
                                          >
                                            Video
                                          </label>
                                          <p className="text-gray-500">
                                            Export your results as a mp4 video.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="relative flex gap-x-3">
                                        <div className="flex h-6 items-center">
                                          <input
                                            id="candidates"
                                            name="candidates"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                          />
                                        </div>
                                        <div className="text-sm leading-6">
                                          <label
                                            htmlFor="candidates"
                                            className="font-medium text-gray-900"
                                          >
                                            PDF
                                          </label>
                                          <p className="text-gray-500">
                                            Export your results as a pdf report.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="col-span-full">
                                        <label
                                          htmlFor="about"
                                          className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                          Comments about the test
                                        </label>
                                        <div className="mt-2">
                                          <textarea
                                            id="about"
                                            name="about"
                                            rows={3}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            defaultValue={""}
                                          />
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-gray-600">
                                          These comments will be included in the
                                          report
                                        </p>
                                      </div>
                                    </div>
                                  </fieldset>
                                </div>
                              </div>
                              <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">
                                  Testers Profile
                                </h2>
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                  <div className="sm:col-span-3">
                                    <label
                                      htmlFor="first-name"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Name
                                    </label>
                                    <div className="mt-2">
                                      <input
                                        value={state.testerName}
                                        onChange={(e) => {
                                          setState({
                                            ...state,
                                            testerName: e.target.value,
                                          });
                                          apiClient.saveMetaDataString(
                                            "TESTER_NAME",
                                            e.target.value
                                          );
                                        }}
                                        type="text"
                                        name="name"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                  <div className="col-span-full">
                                    <label
                                      htmlFor="photo"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Photo
                                    </label>
                                    <div className="mt-2 flex items-center gap-x-3">
                                      {!state.testerProfilePhoto && (
                                        <UserCircleIcon
                                          className="h-12 w-12 text-gray-300"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {state.testerProfilePhoto && (
                                        <div
                                          className="w-[40px] h-[40px] rounded-full border border-gray"
                                          style={{
                                            backgroundImage: `url(${state.testerProfilePhoto})`,
                                            backgroundSize: "cover",
                                          }}
                                        ></div>
                                      )}
                                      <FileUploader
                                        allowedContentTypes={[
                                          "image/png",
                                          "image/jpg",
                                          "image/jpeg",
                                        ]}
                                        uploadFile={async (base64) => {
                                          const client = new ApiClient();

                                          setState({
                                            ...state,
                                            testerProfilePhoto: base64,
                                          });

                                          await client.saveMetaDataString(
                                            "TESTER_PROFILE_PHOTO",
                                            base64
                                          );
                                          return Result.ok();
                                        }}
                                        sizeLimtInKiloBytes={300}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">
                                  Organisation Profile
                                </h2>
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                  <div className="sm:col-span-3">
                                    <label
                                      htmlFor="first-name"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Organisation name
                                    </label>
                                    <div className="mt-2">
                                      <input
                                        value={state.organisationName}
                                        onChange={(e) => {
                                          setState({
                                            ...state,
                                            organisationName: e.target.value,
                                          });
                                          apiClient.saveMetaDataString(
                                            "ORGANISATION_NAME",
                                            e.target.value
                                          );
                                        }}
                                        type="text"
                                        name="name"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                  <div className="col-span-full">
                                    <label
                                      htmlFor="photo"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Logo
                                    </label>
                                    <div className="mt-2 flex items-center gap-x-3">
                                      {!state.organisationLogo && (
                                        <SwatchIcon
                                          className="h-10 w-10 text-gray-300"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {state.organisationLogo && (
                                        <div
                                          className="w-[40px] h-[40px]  border border-gray"
                                          style={{
                                            backgroundImage: `url(${state.organisationLogo})`,
                                            backgroundSize: "cover",
                                          }}
                                        ></div>
                                      )}
                                      <FileUploader
                                        allowedContentTypes={[
                                          "image/png",
                                          "image/jpg",
                                          "image/jpeg",
                                        ]}
                                        uploadFile={async (base64) => {
                                          const client = new ApiClient();
                                          setState({
                                            ...state,
                                            organisationLogo: base64,
                                          });
                                          const responseOrErrror =
                                            await client.saveMetaDataString(
                                              "ORGANISATION_LOGO",
                                              base64
                                            );

                                          return Result.ok();
                                        }}
                                        sizeLimtInKiloBytes={300}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={styles.account}>
                        <div className="bg-black px-4 py-6 sm:px-6 h-full">
                          <div className="flex items-start justify-between w-full">
                            <div className="space-y-1 w-full">
                              <Dialog.Title className="text-base font-semibold leading-6 text-white">
                                Your email
                              </Dialog.Title>

                              <input
                                type="text"
                                name="username"
                                id="username"
                                autoComplete="username"
                                className="rounded w-full py-1.5 pl-1 text-black placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="janesmith@work.com"
                              />
                              <p className="text-sm text-gray-50">
                                The reports will be generated and sent to this
                                email address
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={styles.footer}>
                        <div className="bg-gray-50 px-4 py-6 sm:px-6 h-full">
                          <div className="flex  space-x-3">
                            <button
                              type="submit"
                              onClick={() => {
                                try {
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                              className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              Download Results
                            </button>
                            <button
                              type="button"
                              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              onClick={() => setOpen(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
