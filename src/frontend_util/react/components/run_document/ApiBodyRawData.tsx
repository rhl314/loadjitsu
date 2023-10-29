//import { Controlled as CodeMirror } from "react-codemirror2";
import { ApiBody } from "../../../ipc/api";

export interface ApiBodyRawDataUpdated {
  (apiBodyRawData: string): void;
}

export default function ApiBodyRawData(props: {
  apiBody: ApiBody;
  rawDataUpdated: ApiBodyRawDataUpdated;
}) {
  return (
    <div className="container-fluid mx-auto">
      <div className="row">
        <div className="col-12"></div>
      </div>
    </div>
  );
}
