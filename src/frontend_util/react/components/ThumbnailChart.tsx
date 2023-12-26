import { Line, LineChart } from "recharts";
import { IExecutionStatusCount } from "../ExecutionContext";

interface IDataPoint {
  name: string;
  SUCCESS: number;
  ERROR: number;
  TIMEOUT: number;
}

const ThumbnailChart = (props: { statusCounts: IExecutionStatusCount[] }) => {
  const dataMapped: IDataPoint[] = [];
  dataMapped.push({
    name: "0",
    SUCCESS: 0,
    ERROR: 0,
    TIMEOUT: 0,
  });
  for (const executionStatusCount of props.statusCounts) {
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
    <LineChart
      width={100}
      height={50}
      data={dataMapped}
      className="bg-primary rounded"
    >
      <Line type="monotone" dataKey="SUCCESS" stroke="green" dot={false} />
      <Line type="monotone" dataKey="ERROR" stroke="red" dot={false} />
      <Line type="monotone" dataKey="TIMEOUT" stroke="gray" dot={false} />
    </LineChart>
  );
};

export default ThumbnailChart;
