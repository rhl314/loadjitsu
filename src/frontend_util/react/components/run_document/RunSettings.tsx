import _ from "lodash";
import { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ApiClient } from "../../../../api_client/api_client";
// @ts-ignore
import PlaySvg from "../../../../assets/svg/play.svg?react";
import { RunDocument } from "../../../ipc/run_document";
import { RunDocumentAppContext } from "../../RunDocumentContext";

export default function RunSettings() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string>("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { state, dispatch } = useContext(RunDocumentAppContext);
  const configuration = state.runDocument?.configuration;
  const displayError = () => {
    if (_.isEmpty(_.trim(error))) {
      return null;
    }
    return (
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-warning">{error}</div>
        </div>
      </div>
    );
  };
  const startExecution = async () => {
    if (_.isNil(state.runDocument)) {
      return;
    }
    const bytes = RunDocument.encode(state.runDocument).finish();
    const serialized = Buffer.from(bytes).toString("base64");
    const apiClient = new ApiClient();
    try {
      const response = await apiClient.execute(serialized);
      const uniqueId = response?.data?.uniqueId;
      if (_.isNil(uniqueId)) {
        throw new Error("Unique id not found in result");
      }
      /*router.push(
        `/run/${runTypeToJSON(state.runDocument.type)}/${
          state.runDocument.uniqueId
        }/runs/${uniqueId}`
      );*/
    } catch (err: any) {
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
      </div>
    </>
  );
}

const Old = () => {
  return (
    <div className="container container-narrow mx-auto">
      <div className="row">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#">
              Settings
            </a>
          </li>
        </ul>
        <div className="card">
          <div className="card-body pt-4 pb-4">
            <div className="row w-100">
              <div className="col-5">
                <div className="text-center mt-4">Requests per second</div>
              </div>
              <div className="col-4">
                <div className="text-center mt-4">Test duration in seconds</div>
              </div>
              <div
                className="col-3"
                onClick={() => {
                  /*setShow(true);*/
                }}
              >
                <div className="mx-auto" style={{ width: "4rem" }}>
                  <PlaySvg />
                </div>
                <div className="text-center mt-4">Start Test</div>
              </div>
            </div>
            {/*displayError()*/}
          </div>
        </div>
      </div>
      <Modal show={false} onHide={() => {}} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Please confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Loadjitsu is a powerful tool. You can easily ddos your own apis and
            cause production outages.
          </p>
          <p>Are you sure you want to run this load test ?</p>
          <div className="text-center">
            <h4 className="text-warning">
              {/*state?.runDocument?.configuration?.rps*/} Requests per second{" "}
            </h4>
            <h4> for </h4>
            <h4 className="text-warning">
              {" "}
              {/*state?.runDocument?.configuration?.durationInSeconds*/} Seconds{" "}
            </h4>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {}}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              //startExecution();
            }}
          >
            Start load test
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
