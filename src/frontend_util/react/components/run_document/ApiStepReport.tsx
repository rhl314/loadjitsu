import { capitalize, findIndex, startCase } from "lodash";
import React, { useState } from "react";
import { Button, Dropdown, DropdownButton, InputGroup, Modal } from 'react-bootstrap';
import { StepClient } from "../../../../api_client/ApiStepClient";
import { ProtoHelper } from "../../../common/ProtoHelper";
import { CurlParser } from "../../../factories/CurlParser";
import { ApiStep, HttpAction, httpActionToJSON } from "../../../ipc/api";
import { RunResponse, RunResponse_Status, runResponse_StatusToJSON } from "../../../ipc/run_response";
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
                      >
                      </DropdownButton>
                      <input
                        value={props.step.endpoint}
                        className="form-control" />
                      <Button
                        variant="secondary"
                        title="Dropdown"
                        id="input-group-dropdown-4"
                      >
                        Timeout(ms)
                      </Button>
                      <input
                        value={props.step.timeoutInMs}
                        style={{ width: '10%', maxWidth: '10%' }}
                        className="form-control" />
                    </InputGroup>
                  </>
                </div>
              </div>

            </div>
          </div>
        </div>


      </div>
    </div>)
}