import _ from "lodash";
import { IExecutionResultRow } from "../../../api_client/api_client";
import ExecutionResultRow from "./ExecutionResultRow";

export interface IExecutionResultData {
  uniqueId: string;
  rows: IExecutionResultRow[];
}

export default function ExecutionResults(props: {
  rows: IExecutionResultRow[];
}) {
  if (props.rows.length === 0) {
    return <div />;
  }
  const uniqueIds = _.uniq(_.map(props.rows, (row) => row.UniqueId));
  const executionResultData = _.map(uniqueIds, (uniqueId) => {
    return {
      uniqueId,
      rows: _.filter(props.rows, (row) => {
        return row.UniqueId === uniqueId;
      }),
    };
  });

  return (
    <div className="container mx-auto mt-5 mb-5">
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item d-flex">
              <a className="nav-link active" href="#">
                Test runs
              </a>
            </li>
          </ul>
          <div className="card">
            <div className="card-body pt-4 pb-4">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12 p-4" style={{ background: "black" }}>
                    {executionResultData.map((data) => {
                      return (
                        <ExecutionResultRow key={data.uniqueId} data={data} />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
