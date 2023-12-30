import React, { useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ExecutionAppContext } from "../../ExecutionContext";

interface IExecutionGraphProps {}

interface IDataPoint {
  name: string;
  SUCCESS: number;
  ERROR: number;
  TIMEOUT: number;
}

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const ExecutionGraph = (props: IExecutionGraphProps) => {
  const { state, dispatch } = useContext(ExecutionAppContext);
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
  return (
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

          <Line type="monotone" dataKey="SUCCESS" stroke="green" dot={false} />
          <Line type="monotone" dataKey="ERROR" stroke="red" dot={false} />
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
  );
};

export default ExecutionGraph;
