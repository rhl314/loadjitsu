import { useContext } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { ExecutionAppContext } from "../../ExecutionContext";

interface IDataPoint {
  name: string;
  SUCCESS: number;
  ERROR: number;
  TIMEOUT: number;
}

const ExecutionGraph = () => {
  const { state } = useContext(ExecutionAppContext);
  const dataMapped: IDataPoint[] = [];
  dataMapped.push({
    name: "0",
    SUCCESS: 0,
    ERROR: 0,
    TIMEOUT: 0,
  });
  for (const executionStatusCount of state.executionResults
    ?.execution_count_by_status_and_run_second || []) {
    let dataPoint = dataMapped.find((dp) => {
      return dp.name === executionStatusCount.run_second.toString();
    });
    if (!dataPoint) {
      dataPoint = {
        name: executionStatusCount.run_second.toString(),
        SUCCESS: 0,
        ERROR: 0,
        TIMEOUT: 0,
      };
      dataMapped.push(dataPoint);
    }
    switch (executionStatusCount.status) {
      case "SUCCESS":
        dataPoint.SUCCESS += executionStatusCount.count;
        break;
      case "ERROR":
        dataPoint.ERROR += executionStatusCount.count;
        break;
      case "EXCEPTION":
        dataPoint.ERROR += executionStatusCount.count;
        break;
      case "TIMEOUT":
        dataPoint.TIMEOUT += executionStatusCount.count;
        break;
    }
  }
  for (let i = 1; i < dataMapped.length; i += 1) {
    dataMapped[i].SUCCESS += dataMapped[i - 1].SUCCESS;
    dataMapped[i].ERROR += dataMapped[i - 1].ERROR;
    dataMapped[i].TIMEOUT += dataMapped[i - 1].TIMEOUT;
  }
  const getCountByStatus = (status: string) => {
    let count = 0;
    for (const executionStatusCount of state.executionResults
      ?.execution_count_by_status || []) {
      if (executionStatusCount.status === status) {
        count += executionStatusCount.count;
      }
    }
    return count;
  };
  const executionSummary =
    state.executionResults?.execution_summary.length === 0
      ? null
      : state.executionResults?.execution_summary[0];

  return (
    <>
      <div className="app-container">
        <div>
          <div className="mb-8">
            <div className="grid grid-cols-12">
              <div className="col-span-12 flex items-center content-center mx-auto">
                <div className="mr-8 dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn-group btn-group-vertical lg:btn-group-horizontal border border-1"
                  >
                    <button className="btn btn-xs btn-error">Abort test</button>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <a>Response times</a>
                    </li>
                  </ul>
                </div>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn-group btn-group-vertical lg:btn-group-horizontal border border-1"
                  >
                    <button className="btn btn-xs">Viewing now</button>
                    <button className="btn btn-xs btn-active">
                      Response statuses
                    </button>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <a>Response times</a>
                    </li>
                  </ul>
                </div>
                <div className="ml-8">
                  <p className="text-white">Edit and run again</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <LineChart
            width={960}
            height={480}
            data={dataMapped}
            className="mx-auto"
          >
            <XAxis
              dataKey="name"
              tickCount={30}
              interval={"equidistantPreserveStart"}
            />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="SUCCESS"
              stroke="green"
              dot={false}
            />
            <Line type="monotone" dataKey="ERROR" stroke="red" dot={false} />
            <Line
              type="monotone"
              dataKey="TIMEOUT"
              stroke="orange"
              dot={false}
            />
          </LineChart>
        </div>
        <div>
          <div className="mb-8">
            <div className="grid grid-cols-12">
              <div className="col-span-12 items-center content-center mx-auto">
                <div className="text-center my-4">
                  <h1 className="text-white">
                    <span>Success</span>
                    <span> </span>
                    <span>Errors</span>

                    <span> </span>
                    <span>Timeouts</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="min-h-[6rem] border-t-0 border-neutral-700">
          <div className="grid grid-cols-12">
            <div className="col-span-3 items-center content-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="red"
                className="w-[60px] mx-auto mt-3"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="col-span-3 flex items-center content-center mx-auto">
              <p className="text-white text-center mt-2 text-4xl">
                {getCountByStatus("SUCCESS")}
              </p>
            </div>
            <div className="col-span-3 flex items-center content-center mx-auto">
              <p className="text-white text-center mt-2 text-4xl">
                {getCountByStatus("TIMEOUT")}
              </p>
            </div>
            <div className="col-span-3 flex items-center content-center mx-auto">
              <p className="text-white text-center mt-2 text-4xl">
                {getCountByStatus("ERROR")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-12 mb-8">
            <div className="col-span-3">
              <div>
                <p className="text-white text-center">Abort test</p>
              </div>
            </div>
            <div className="col-span-3">
              <div>
                <p className="text-white text-center">Success</p>
              </div>
            </div>
            <div className="col-span-3">
              <div>
                <p className="text-white text-center">Timeouts</p>
              </div>
            </div>
            <div className="col-span-3">
              <div>
                <p className="text-white text-center">Errors</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="min-h-[6rem] border-t-0 border-neutral-700">
          <div className="grid grid-cols-12">
            <div className="col-span-3 items-center content-center mx-auto">
              <p className="text-white text-center mt-2 text-4xl">
                {Math.round(executionSummary?.avg_response_time || 0)}
              </p>
            </div>
            <div className="col-span-3 flex items-center content-center mx-auto">
              <p className="text-white text-center mt-2 text-4xl">
                {Math.round(executionSummary?.max_response_time || 0)}
              </p>
            </div>
            <div className="col-span-3 flex items-center content-center mx-auto">
              <p className="text-white text-center mt-2 text-4xl">
                {Math.round(executionSummary?.avg_latency || 0)}
              </p>
            </div>
            <div className="col-span-3 flex items-center content-center mx-auto">
              <p className="text-white text-center mt-2 text-4xl">
                {Math.round(executionSummary?.avg_response_time || 0)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-12 mb-8">
            <div className="col-span-3">
              <div>
                <p className="text-white text-center">Avg response time (ms)</p>
              </div>
            </div>
            <div className="col-span-3">
              <div>
                <p className="text-white text-center">Max response time (ms)</p>
              </div>
            </div>
            <div className="col-span-3">
              <div>
                <p className="text-white text-center">Avg latency (ms)</p>
              </div>
            </div>
            <div className="col-span-3">
              <div>
                <p className="text-white text-center">Max latency (ms)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExecutionGraph;
