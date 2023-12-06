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
  EXCEPTION: number;
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
    EXCEPTION: 0,
    TIMEOUT: 0,
  });
  for (const executionStatusCount of state.executionStatusCounts) {
    let dataPoint = dataMapped.find((dp) => {
      return dp.name === executionStatusCount.run_second.toString();
    });
    if (!dataPoint) {
      dataPoint = {
        name: executionStatusCount.run_second.toString(),
        SUCCESS: 0,
        ERROR: 0,
        EXCEPTION: 0,
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
        dataPoint.EXCEPTION += executionStatusCount.count;
        break;
      case "TIMEOUT":
        dataPoint.TIMEOUT += executionStatusCount.count;
        break;
    }
  }
  for (let i = 1; i < dataMapped.length; i += 1) {
    dataMapped[i].SUCCESS += dataMapped[i - 1].SUCCESS;
    dataMapped[i].ERROR += dataMapped[i - 1].ERROR;
    dataMapped[i].EXCEPTION += dataMapped[i - 1].EXCEPTION;
    dataMapped[i].TIMEOUT += dataMapped[i - 1].TIMEOUT;
  }
  return (
    <>
      <LineChart width={960} height={480} data={dataMapped}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="SUCCESS" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="ERROR" stroke="#82ca9d" dot={false} />
      </LineChart>
    </>
  );
};

export default ExecutionGraph;
