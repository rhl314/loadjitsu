import { capitalize, findIndex, startCase } from "lodash";
import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownButton,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { StepClient } from "../../../../api_client/ApiStepClient";
import { ProtoHelper } from "../../../common/ProtoHelper";
import { CurlParser } from "../../../factories/CurlParser";
import { ApiStep, HttpAction, httpActionToJSON } from "../../../ipc/api";
import {
  RunResponse,
  RunResponse_Status,
  runResponse_StatusToJSON,
} from "../../../ipc/run_response";
import ApiBodyElement from "./ApiBody";
import ApiHeaders from "./ApiHeaders";
import PlusButton from "./PlusButton";

export interface ApiStepComponentUpdated {
  (apiStep: ApiStep): void;
}
interface ICurlImport {
  show: boolean;
  data: string;
  error: string | null;
}

export default function ApiStepComponent(props: {
  apiStep: ApiStep;
  onUpdated: ApiStepComponentUpdated;
}) {
  const { apiStep } = props;
  const [curlImport, setCurlImport] = useState<ICurlImport>({
    show: false,
    data: "",
    error: null,
  });

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
      value: runResponse_StatusToJSON(testConnectionResponse.status),
    });
    if (testConnectionResponse.status != RunResponse_Status.SUCCESS) {
      results.push({
        key: "ERROR",
        value: testConnectionResponse.description,
      });
    }
    results.push({
      key: "TIME_IN_MS",
      value: `${testConnectionResponse.time}`,
    });
    if (testConnectionResponse.stringValues) {
      for (const key in testConnectionResponse.stringValues) {
        results.push({
          key,
          value: testConnectionResponse.stringValues[key],
        });
      }
    }
    if (testConnectionResponse.floatValues) {
      for (const key in testConnectionResponse.floatValues) {
        results.push({
          key,
          value: `${testConnectionResponse.floatValues[key]}`,
        });
      }
    }
    if (testConnectionResponse.intValues) {
      for (const key in testConnectionResponse.intValues) {
        results.push({
          key,
          value: `${testConnectionResponse.intValues[key]}`,
        });
      }
    }

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
  };

  const testConnection = async () => {
    if (testConnectionState === "RUNNING") {
      return;
    }
    setTestConnectionState("RUNNING");
    const apiStepClient = new StepClient();
    const responseOrError = await apiStepClient.runApiStepOnce(apiStep);
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
      <li className="nav-item d-flex">
        {sections.map((section) => {
          let className = "nav-link cursor-pointer";
          if (section === subSection) {
            className = className + " active active-nested";
          }
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSubSection(section);
              }}
              className={className}
              key={section}
            >
              {startCase(section.toLowerCase())}
            </div>
          );
        })}
      </li>
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
  };
  return (
    <>
      <div className="app_container mx-auto">
        <div className="my-4"></div>
        <div className="grid">
          <div className="tabs z-10 -mb-px">
            <button className="tab tab-lifted tab-active">Settings</button>
          </div>
          <div className="bg-base-300  relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
              <div className="join w-full">
                <select className="select select-bordered join-item w-2/12">
                  {ProtoHelper.enumKeysAsIntegers(HttpAction).map((enumKey) => {
                    return (
                      <option
                        selected={apiStep.action === enumKey}
                        onClick={(ev: any) => {
                          const action = parseInt(
                            ev.target.getAttribute("data-enum-key")
                          );
                          const updatedApiStep = {
                            ...props.apiStep,
                            action,
                          };
                          props.onUpdated(updatedApiStep);
                        }}
                        key={enumKey}
                        data-enum-key={enumKey}
                      >
                        {httpActionToJSON(enumKey)}
                      </option>
                    );
                  })}
                </select>
                <div className="w-10/12">
                  <div>
                    <input
                      value={props.apiStep.endpoint}
                      className="input input-bordered join-item w-full"
                      onChange={(event: any) => {
                        const updatedApiStep = {
                          ...props.apiStep,
                          endpoint: event?.target?.value,
                        };
                        props.onUpdated(updatedApiStep);
                      }}
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
                      value={props.apiStep.timeoutInMs}
                      className="input input-bordered join-item w-full"
                      onChange={(event: any) => {
                        const updatedApiStep = {
                          ...props.apiStep,
                          timeoutInMs: parseInt(event?.target?.value, 10),
                        };
                        props.onUpdated(updatedApiStep);
                      }}
                    />
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
/*
const Old = () => {
  <div className="container container-narrow mx-auto mt-5">
    <div className="row">
      <ul className="nav nav-tabs">
        <li className="nav-item d-flex">
          <div className="nav-link active">Api details</div>
          <div
            onClick={() => {
              setCurlImport({
                ...curlImport,
                show: true,
              });
            }}
            className="nav-link d-flex ps-1 text-warning cursor-pointer"
          >
            <div
              style={{
                width: "20px",
                marginTop: "-2px",
                marginRight: "5px",
              }}
            >
              <PlusButton />
            </div>
            Import curl
          </div>
        </li>
      </ul>
      <div className="card">
        <div className="card-body pt-4 pb-4">
          <div className="row">
            <div className="col-12">
              <>
                <InputGroup>
                  <Button
                    onClick={testConnection}
                    variant="secondary"
                    title="Dropdown"
                    id="input-group-dropdown-4"
                  >
                    Timeout(ms)
                  </Button>

                  <Button
                    variant="secondary"
                    title="Dropdown"
                    id="input-group-dropdown-4"
                  >
                    {}
                  </Button>
                </InputGroup>
              </>
            </div>
          </div>
          {testConnectionException()}
          {testConnectionResults()}
          <div className="row mt-4">
            <div className="col-12">
              <ul className="nav nav-tabs">{subSectionsCtas()}</ul>
              <div
                className="card"
                style={{ backgroundColor: "black", marginTop: "-5px" }}
              >
                <div className="card-body" style={{ backgroundColor: "black" }}>
                  {section()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {curlImportModal()}
  </div>;
};
*/
