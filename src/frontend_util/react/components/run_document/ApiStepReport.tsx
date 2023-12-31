import { Button, DropdownButton, InputGroup } from "react-bootstrap";
import { ApiStep, httpActionToJSON } from "../../../ipc/api";

export interface ApiStepComponentUpdated {
  (apiStep: ApiStep): void;
}
interface ICurlImport {
  show: boolean;
  data: string;
  error: string | null;
}

export default function ApiStepReport(props: { step: ApiStep }) {
  const { step: apiStep } = props;

  return (
    <div className="container container-narrow mx-auto mt-5">
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item d-flex">
              <div className="nav-link active">Api details</div>
            </li>
          </ul>
          <div className="card">
            <div className="card-body pt-4 pb-4">
              <div className="row">
                <div className="col-12">
                  <>
                    <InputGroup>
                      <DropdownButton
                        variant="secondary"
                        title={httpActionToJSON(props.step.action)}
                        id="input-group-dropdown-3"
                      ></DropdownButton>
                      <input
                        value={props.step.endpoint}
                        className="form-control"
                      />
                      <Button
                        variant="secondary"
                        title="Dropdown"
                        id="input-group-dropdown-4"
                      >
                        Timeout(ms)
                      </Button>
                      <input
                        value={props.step.timeoutInMs}
                        style={{ width: "10%", maxWidth: "10%" }}
                        className="form-control"
                      />
                    </InputGroup>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
