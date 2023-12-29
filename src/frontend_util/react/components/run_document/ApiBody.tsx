import * as _ from "lodash";
import { useContext, useState } from "react";
import { ProtoHelper } from "../../../common/ProtoHelper";
import {
  ApiBody,
  ApiStep,
  EnumApiBodyType,
  enumApiBodyTypeToJSON,
} from "../../../ipc/api";
import { RunDocumentAppContext } from "../../RunDocumentContext";
import ApiBodyFormDataElement from "./ApiBodyFormData";
import ApiBodyRawData from "./ApiBodyRawData";

export interface ApiBodyUpdated {
  (apiBody: ApiBody): void;
}
export default function ApiBodyElement(props: {
  apiStep: ApiStep;
  bodyUpdated: ApiBodyUpdated;
}) {
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string>("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { state, dispatch } = useContext(RunDocumentAppContext);
  const configuration = state.runDocument?.configuration;

  const typeDropDown = () => {
    return (
      <div className="w-full flex flex-row">
        {ProtoHelper.enumKeysAsIntegers(EnumApiBodyType).map((enumKey) => {
          return (
            <div className="mx-4 flex flex-row">
              <input
                type="radio"
                key={enumKey}
                data-enum-key={enumKey}
                name="radio-10"
                onClick={(ev: any) => {
                  const type = parseInt(
                    ev.target.getAttribute("data-enum-key")
                  );
                  // @ts-ignore
                  const updatedBody: ApiBody = {
                    ...props.apiStep.body,
                    type,
                  };
                  props.bodyUpdated(updatedBody);
                }}
                className="radio radio-xs mt-1 mr-2"
                checked={
                  (props.apiStep.body?.type as EnumApiBodyType) === enumKey
                }
              />
              <p>{_.startCase(_.toLower(enumApiBodyTypeToJSON(enumKey)))}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const formData = () => {
    if (
      (props.apiStep.body?.type as EnumApiBodyType) ===
        EnumApiBodyType.X_URL_FORM_ENCODED ||
      (props.apiStep.body?.type as EnumApiBodyType) ===
        EnumApiBodyType.FORM_DATA
    ) {
      return (
        <ApiBodyFormDataElement
          apiBody={props.apiStep.body as ApiBody}
          formDataUpdated={(updatedFormData) => {
            const formData = props.apiStep.body?.formData;
            const index = _.findIndex(formData, {
              uniqueId: updatedFormData.uniqueId,
            });
            if (index < 0) {
              formData?.push(updatedFormData);
            } else {
              formData?.splice(index, 1, updatedFormData);
            }
            const updatedBody = {
              ...props.apiStep.body,
              formData,
            };
            props.bodyUpdated(updatedBody as ApiBody);
          }}
        />
      );
    }
  };

  const rawData = () => {
    const type = props.apiStep.body?.type as EnumApiBodyType;
    if (
      _.includes(
        [
          EnumApiBodyType.EMPTY,
          EnumApiBodyType.X_URL_FORM_ENCODED,
          EnumApiBodyType.FORM_DATA,
        ],
        type
      ) === true
    ) {
      return;
    }

    return (
      <ApiBodyRawData
        apiBody={props.apiStep.body as ApiBody}
        rawDataUpdated={(data) => {
          const updatedBody = {
            ...props.apiStep.body,
            data,
          };
          props.bodyUpdated(updatedBody as ApiBody);
        }}
      />
    );
  };

  return (
    <div className="container-fluid mx-auto">
      <div className="row">
        <div className="col-12 d-flex">{typeDropDown()}</div>
        <div className="col-12 mt-4">
          {formData()}
          {rawData()}
        </div>
      </div>
    </div>
  );
}
