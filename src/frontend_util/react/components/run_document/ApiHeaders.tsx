import _ from "lodash";
import { useContext, useState } from "react";
import shortid from "shortid";
import { ApiHeader, ApiStep } from "../../../ipc/api";
import { RunDocumentAppContext } from "../../RunDocumentContext";
import PlusButton from "./PlusButton";
import TrashButton from "./TrashButton";

export interface ApiHeaderUpdated {
  (apiHeader: ApiHeader): void;
}
interface IAutoFocusInput {
  keyUniqueId?: string;
  valueUniqueId?: string;
  key?: string;
  value?: string;
}
export default function ApiHeaders(props: {
  apiStep: ApiStep;
  headerUpdated: ApiHeaderUpdated;
}) {
  const [autoFocusInput, setAutoFocusInput] = useState<IAutoFocusInput>({
    key: "",
    value: "",
  });
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

  return (
    <div className="container mx-auto">
      <table className="table">
        <tbody>
          {props.apiStep.headers
            .filter((header) => {
              return header.deleted === false;
            })
            .map((header) => {
              return (
                <tr key={header.uniqueId}>
                  <th className="text-center">
                    <input
                      onChange={() => {
                        const updatedHeader = {
                          ...header,
                          active: !header.active,
                        };
                        props.headerUpdated(updatedHeader);
                      }}
                      type="checkbox"
                      checked={header.active}
                    />
                  </th>
                  <td>
                    <input
                      autoFocus={autoFocusInput.keyUniqueId === header.uniqueId}
                      onChange={(event: any) => {
                        const updatedHeader = {
                          ...header,
                          key: event?.target?.value,
                        };
                        props.headerUpdated(updatedHeader);
                      }}
                      className="input input-bordered w-full"
                      value={header.key}
                      type="text"
                    />
                  </td>
                  <td>
                    <input
                      autoFocus={
                        autoFocusInput.valueUniqueId === header.uniqueId
                      }
                      onChange={(event: any) => {
                        const updatedHeader = {
                          ...header,
                          value: event?.target?.value,
                        };
                        props.headerUpdated(updatedHeader);
                      }}
                      className="input input-bordered w-full"
                      value={header.value}
                      type="text"
                    />
                  </td>

                  <td
                    style={{ width: "40px" }}
                    onClick={() => {
                      const updatedHeader = {
                        ...header,
                        deleted: true,
                      };
                      props.headerUpdated(updatedHeader);
                    }}
                  >
                    <button className="btn">
                      {" "}
                      <TrashButton />
                    </button>
                  </td>
                </tr>
              );
            })}
          <tr>
            <td style={{ width: "40px" }}>
              <button className="btn btn-sm" style={{ width: "40px" }}>
                {" "}
                <PlusButton />
              </button>
            </td>
            <td>
              <input
                value={autoFocusInput.key}
                onChange={(event: any) => {
                  const apiHeader: ApiHeader = {
                    uniqueId: shortid.generate(),
                    active: true,
                    deleted: false,
                    key: event?.target?.value,
                    value: "",
                    description: "",
                    validationErrors: [],
                  };
                  setAutoFocusInput({
                    ...autoFocusInput,
                    keyUniqueId: apiHeader.uniqueId,
                    key: "",
                  });
                  props.headerUpdated(apiHeader);
                }}
                className="input input-bordered w-full"
                type="text"
              />
            </td>
            <td>
              <input
                value={autoFocusInput.value}
                onChange={(event: any) => {
                  const apiHeader: ApiHeader = {
                    uniqueId: shortid.generate(),
                    active: true,
                    deleted: false,
                    key: "",
                    value: event?.target?.value,
                    description: "",
                    validationErrors: [],
                  };
                  setAutoFocusInput({
                    ...autoFocusInput,
                    valueUniqueId: apiHeader.uniqueId,
                    value: "",
                  });
                  props.headerUpdated(apiHeader);
                }}
                className="input input-bordered w-full"
                type="text"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
