//import { Controlled as CodeMirror } from "react-codemirror2";
import { ApiBody } from "../../../ipc/api";
import CodeEditor from "./CodeEditor";

export interface ApiBodyRawDataUpdated {
  (apiBodyRawData: string): void;
}

export default function ApiBodyRawData(props: {
  apiBody: ApiBody;
  rawDataUpdated: ApiBodyRawDataUpdated;
}) {
  return (
    <div className="container-fluid mx-auto">
      <CodeEditor
        text={props.apiBody.data}
        setText={props.rawDataUpdated}
        heightClass="h-[400px]"
      />
    </div>
  );
}
