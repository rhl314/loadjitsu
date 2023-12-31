import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import * as _ from "lodash";
import { Line } from "react-chartjs-2";
import { IResultStatus } from "../../../api_client/api_client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options: any = {
  responsive: true,
  plugins: {
    legend: false,
    title: {
      display: false,
      text: "Load test results",
    },
  },
};

const colorMap: any = {
  ERROR: {
    border: "rgba(255, 99, 132, 1)",
    background: "rgba(255, 99, 132, 0.5)",
  },
  SUCCESS: {
    border: "rgba(106, 216, 104, 1)",
    background: "rgba(106, 216, 104, 0.5)",
  },
  TIMEOUT: {
    border: "rgba(254, 206, 26, 1)",
    background: "rgba(254, 206, 26, 0.5)",
  },
};

export default function Chart(props: { statuses: IResultStatus[] }) {
  let uniqueStatuses: string[] = [];

  const timestamps = _.uniq(
    props.statuses.map((s) => {
      uniqueStatuses.push(s.Status);
      return s.Timestamp;
    })
  );

  const minTimestamp = _.min(timestamps) || timestamps[0];
  const normalizedTimestamps = _.map(timestamps, (t) => {
    return t - minTimestamp;
  });

  uniqueStatuses = _.uniq(uniqueStatuses);
  const datasets = [];
  for (const status of uniqueStatuses) {
    let cumulative = 0;
    const data = _.map(timestamps, (t) => {
      const result = _.find(props.statuses, (s) => {
        return s.Timestamp === t && s.Status === status;
      });
      if (_.isNil(result)) {
        return cumulative;
      }
      cumulative += result.Count;
      return cumulative;
    });
    datasets.push({
      label: status,
      data,
      borderColor: colorMap[status]?.border,
      backgroundColor: colorMap[status]?.background,
      pointRadius: 0,
    });
  }

  return (
    <Line options={options} data={{ labels: normalizedTimestamps, datasets }} />
  );
}
