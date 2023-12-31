import { findIndex, startCase } from "lodash";
import { useState } from "react";
import { ApiClient } from "../../../../api_client/api_client";
import { ProtoHelper } from "../../../common/ProtoHelper";
import {
  ApiStep,
  HttpAction,
  httpActionFromJSON,
  httpActionToJSON,
} from "../../../ipc/api";
import {
  RunResponse,
  RunStatus,
  runStatusFromJSON,
} from "../../../ipc/run_response";
import ApiBodyElement from "./ApiBody";
import ApiHeaders from "./ApiHeaders";

export interface ApiStepComponentUpdated {
  (apiStep: ApiStep): void;
}

export interface ApiStepValidate {
  (apiStep: ApiStep): boolean;
}
/*interface ICurlImport {
  show: boolean;
  data: string;
  error: string | null;
}*/

export default function ApiStepComponent(props: {
  apiStep: ApiStep;
  onUpdated: ApiStepComponentUpdated;
  validate: ApiStepValidate;
}) {
  const { apiStep } = props;
  /*
  const [curlImport, setCurlImport] = useState<ICurlImport>({
    show: false,
    data: "",
    error: null,
  });*/

  const [testConnectionState, setTestConnectionState] = useState("IDLE");
  const [testConnectionResponse, setTestConnectionResponse] =
    useState<RunResponse>({} as RunResponse);
  const [subSection, setSubSection] = useState("HEADERS");
  const testConnectionCta = () => {
    if (testConnectionState === "RUNNING") {
      return "Testing ...";
    } else if (testConnectionState === "EXCEPTION") {
      return "Try again.";
    }
    return "Test connection";
  };

  /*
  const testConnectionException = () => {
    if (testConnectionState !== "EXCEPTION") {
      return;
    }
    return (
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-warning" role="alert">
            Something went wrong. Please try again
          </div>
        </div>
      </div>
    );
  };

  const testConnectionResults = () => {
    if (testConnectionState !== "READY") {
      return;
    }
    interface IResults {
      key: string;
      value: string;
    }
    const results: IResults[] = [];
    results.push({
      key: "STATUS",
      value: runStatusToJSON(testConnectionResponse.status),
    });
    if (testConnectionResponse.status != RunStatus.SUCCESS) {
      results.push({
        key: "ERROR",
        value: testConnectionResponse.description,
      });
    }
    results.push({
      key: "TIME_IN_MS",
      value: `${testConnectionResponse.time}`,
    });

    return (
      <div className="row mt-4">
        <div className="col-12">
          <table className="table mt-4">
            <tbody>
              {results.map((result) => {
                return (
                  <tr key={result.key}>
                    <th scope="row">{capitalize(startCase(result.key))}</th>
                    <td>{result.value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          className="col-12"
          onClick={() => {
            setTestConnectionState("IDLE");
          }}
        >
          <div className="float-end" style={{ cursor: "pointer" }}>
            <button className="btn btn-sm">Hide results</button>
          </div>
        </div>
      </div>
    );
  };*/

  const testConnection = async () => {
    if (testConnectionState === "RUNNING") {
      return;
    }
    setTestConnectionState("RUNNING");
    const valid = props.validate(apiStep);
    if (valid !== true) {
      setTestConnectionState("INVALID");
      return;
    }
    const apiStepClient = new ApiClient();
    const responseOrError = await apiStepClient.runApiStepOnce(apiStep);
    console.log(responseOrError);
    if (responseOrError.isFailure) {
      setTestConnectionState("EXCEPTION");
      return;
    }

    const runResponse = responseOrError.getValue();

    setTestConnectionResponse(runResponse);
    setTestConnectionState("READY");
  };

  const subSectionsCtas = () => {
    const sections = ["HEADERS", "BODY"];
    return (
      <div className="tabs z-10 -mb-px">
        {sections.map((section) => {
          let className = "tab tab-lifted";
          if (section === subSection) {
            className = className + " tab-active";
          }
          return (
            <button
              className={className}
              onClick={() => {
                setSubSection(section);
              }}
              key={section}
            >
              {startCase(section.toLowerCase())}
            </button>
          );
        })}
      </div>
    );
  };

  const section = () => {
    if (subSection === "HEADERS") {
      return (
        <ApiHeaders
          apiStep={apiStep}
          headerUpdated={(apiHeader) => {
            const headers = apiStep.headers;
            const index = findIndex(headers, {
              uniqueId: apiHeader.uniqueId,
            });
            if (index < 0) {
              headers.push(apiHeader);
            } else {
              apiStep.headers.splice(index, 1, apiHeader);
            }
            const updatedApiStep = {
              ...props.apiStep,
              headers,
            };
            props.onUpdated(updatedApiStep);
          }}
        />
      );
    } else if (subSection === "BODY") {
      return (
        <ApiBodyElement
          apiStep={apiStep}
          bodyUpdated={(updatedApiBody) => {
            const updatedApiStep = {
              ...props.apiStep,
              body: updatedApiBody,
            };
            props.onUpdated(updatedApiStep);
          }}
        />
      );
    }
  };

  /*
  const curlImportModal = () => {
    return (
      <Modal
        show={curlImport.show}
        onHide={() => {
          setCurlImport({
            ...curlImport,
            show: false,
          });
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Import curl</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            value={curlImport.data}
            onChange={(ev) => {
              setCurlImport({
                ...curlImport,
                data: ev.target.value,
              });
            }}
            className="form-control"
            rows={7}
          />
          {curlImport.error !== null && (
            <div className="alert alert-warning">{curlImport.error}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setCurlImport({
                ...curlImport,
                show: false,
              });
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const curlParser = new CurlParser(curlImport.data);
              const results = curlParser.parse();
              if (results.isFailure) {
                setCurlImport({
                  ...curlImport,
                  error:
                    "Could not import. Please make sure you provide a correct curl command.",
                });
                return;
              } else {
                setCurlImport({
                  ...curlImport,
                  error: null,
                  data: "",
                  show: false,
                });
              }

              const apiStep = results.getValue();
              apiStep.uniqueId = props.apiStep.uniqueId;
              props.onUpdated(apiStep);
            }}
          >
            Import
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };*/
  const endpointValidationErrors = (field: string) => {
    const errors = (apiStep.validationErrors || []).filter((error) => {
      return error.field === field;
    });
    return errors;
  };
  return (
    <>
      <div className="app_container mx-auto">
        <div className="my-4"></div>
        <div className="grid">
          <div className="tabs z-10 -mb-px">
            <button className="tab tab-lifted tab-active">Settings</button>
          </div>
          <div className="relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
              <div className="join w-full">
                <select
                  className="select select-bordered join-item w-2/12"
                  onChange={(ev: any) => {
                    const action = httpActionFromJSON(
                      httpActionToJSON(ev.target.value)
                    );
                    const updatedApiStep = {
                      ...props.apiStep,
                      action,
                    };
                    setTestConnectionState("IDLE");
                    props.onUpdated(updatedApiStep);
                  }}
                >
                  {ProtoHelper.enumKeysAsIntegers(HttpAction).map((enumKey) => {
                    return (
                      <option key={enumKey} data-enum-key={enumKey}>
                        {httpActionToJSON(enumKey)}
                      </option>
                    );
                  })}
                </select>
                <div className="w-10/12">
                  <div>
                    <input
                      value={props.apiStep.endpoint}
                      className={`input input-bordered join-item w-full ${
                        endpointValidationErrors("endpoint").length > 0
                          ? "input-warning"
                          : ""
                      }`}
                      onChange={(event: any) => {
                        const updatedApiStep = {
                          ...props.apiStep,
                          endpoint: event?.target?.value,
                        };
                        setTestConnectionState("IDLE");
                        props.onUpdated(updatedApiStep);
                      }}
                    />
                    {endpointValidationErrors("endpoint").map((error) => {
                      return (
                        <div className="text-warning text-sm">
                          {error.message}
                        </div>
                      );
                    })}
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
                      value={props.apiStep.timeoutInMs}
                      className={`input input-bordered join-item w-full ${
                        endpointValidationErrors("timeoutInMs").length > 0
                          ? "input-warning"
                          : ""
                      }`}
                      onChange={(event: any) => {
                        const updatedApiStep = {
                          ...props.apiStep,
                          timeoutInMs: parseInt(event?.target?.value, 10),
                        };
                        props.onUpdated(updatedApiStep);
                      }}
                    />
                    {endpointValidationErrors("timeoutInMs").map((error) => {
                      return (
                        <div className="text-warning text-sm">
                          {error.message}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="w-1/12"></div>
                <div className="indicator w-6/12">
                  <button
                    className="btn join-item w-full"
                    onClick={testConnection}
                  >
                    {testConnectionCta()}
                  </button>
                </div>
              </div>

              {testConnectionState === "RUNNING" && (
                <div className="alert mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-info shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Connecting ...</span>
                </div>
              )}
              {testConnectionState === "READY" &&
                runStatusFromJSON(testConnectionResponse.status) ===
                  RunStatus.SUCCESS && (
                  <div className="alert alert-success mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {apiStep.endpoint} replied with{" "}
                      {testConnectionResponse.statusCode} in{" "}
                      {testConnectionResponse.time} milliseconds
                    </span>
                  </div>
                )}
              {testConnectionState === "READY" &&
                runStatusFromJSON(testConnectionResponse.status) ===
                  RunStatus.EXCEPTION && (
                  <div className="alert alert-warning mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>{testConnectionResponse.error} </span>
                  </div>
                )}
              {testConnectionState === "READY" &&
                runStatusFromJSON(testConnectionResponse.status) ===
                  RunStatus.ERROR && (
                  <div className="alert alert-warning mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>
                      {apiStep.endpoint} replied with{" "}
                      {testConnectionResponse.statusCode} in{" "}
                      {testConnectionResponse.time} milliseconds
                    </span>
                  </div>
                )}
              {testConnectionState === "READY" &&
                runStatusFromJSON(testConnectionResponse.status) ===
                  RunStatus.TIMEOUT && (
                  <div className="alert alert-warning mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>
                      {apiStep.endpoint} timed out in{" "}
                      {testConnectionResponse.time} milliseconds
                    </span>
                  </div>
                )}
              {testConnectionState === "EXCEPTION" && (
                <div className="alert alert-warning mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>
                    We are unable to test the connection. This seems to be a
                    problem with Loadjitsu itself and should get resolved on
                    retrying. Please contact support@loadjitsu.com if this
                    happens again.
                  </span>
                </div>
              )}
              {testConnectionState === "INVALID" && (
                <div className="alert alert-warning mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>
                    Please fix the errors highlighted in red before running the
                    load test
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="app_container mx-auto">
        <div className="my-4"></div>
        <div className="grid">
          {subSectionsCtas()}
          <div className="relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
              {section()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
