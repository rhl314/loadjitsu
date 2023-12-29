import React, { useState } from "react";
import shortid from "shortid";
import { ApiBody, ApiBodyFormData } from "../../../ipc/api";
import PlusButton from "./PlusButton";
import TrashButton from "./TrashButton";

export interface ApiBodyFormDataUpdated {
  (apiBodyFormData: ApiBodyFormData): void;
}
interface IAutoFocusInput {
  keyUniqueId?: string;
  valueUniqueId?: string;
  key?: string;
  value?: string;
}
export default function ApiBodyFormDataElement(props: {
  apiBody: ApiBody;
  formDataUpdated: ApiBodyFormDataUpdated;
}) {
  const [autoFocusInput, setAutoFocusInput] = useState<IAutoFocusInput>({
    key: "",
    value: "",
  });
  return (
    <div className="container mx-auto">
      <table className="table">
        <tbody>
          {props.apiBody.formData
            .filter((formData) => {
              return formData.deleted === false;
            })
            .map((formData) => {
              return (
                <tr key={formData.uniqueId}>
                  <th className="text-center">
                    <input
                      onChange={() => {
                        const updatedFormData = {
                          ...formData,
                          active: !formData.active,
                        };
                        props.formDataUpdated(updatedFormData);
                      }}
                      type="checkbox"
                      checked={formData.active}
                    />
                  </th>
                  <td>
                    <input
                      autoFocus={
                        autoFocusInput.keyUniqueId === formData.uniqueId
                      }
                      onChange={(event: any) => {
                        const updatedFormData = {
                          ...formData,
                          key: event?.target?.value,
                        };
                        props.formDataUpdated(updatedFormData);
                      }}
                      className="input input-bordered w-full"
                      value={formData.key}
                      type="text"
                    />
                  </td>
                  <td>
                    <input
                      autoFocus={
                        autoFocusInput.valueUniqueId === formData.uniqueId
                      }
                      onChange={(event: any) => {
                        const updatedFormData = {
                          ...formData,
                          value: event?.target?.value,
                        };
                        props.formDataUpdated(updatedFormData);
                      }}
                      className="input input-bordered w-full"
                      value={formData.value}
                      type="text"
                    />
                  </td>

                  <td
                    style={{ width: "40px" }}
                    onClick={() => {
                      const updatedFormData = {
                        ...formData,
                        deleted: true,
                      };
                      props.formDataUpdated(updatedFormData);
                    }}
                  >
                    <button className="btn">
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
                  const data: ApiBodyFormData = {
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
                    keyUniqueId: data.uniqueId,
                    key: "",
                  });
                  props.formDataUpdated(data);
                }}
                className="input input-bordered w-full"
                type="text"
              />
            </td>
            <td>
              <input
                value={autoFocusInput.value}
                onChange={(event: any) => {
                  const data: ApiBodyFormData = {
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
                    valueUniqueId: data.uniqueId,
                    value: "",
                  });
                  props.formDataUpdated(data);
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
