import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useContext } from "react";
import { Line } from "react-chartjs-2";
import { ExecutionAppContext } from "../../ExecutionContext";
import TopNav from "../TopNav";
import { useNavigate } from "react-router-dom";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface IDataPoint {
  name: string;
  SUCCESS: number;
  ERROR: number;
  TIMEOUT: number;
  EXCEPTION: number;
}

const ExecutionGraph = () => {
  const navigation = useNavigate();
  const { state } = useContext(ExecutionAppContext);
  const dataMapped: IDataPoint[] = [];
  dataMapped.push({
    name: "0",
    SUCCESS: 0,
    ERROR: 0,
    TIMEOUT: 0,
    EXCEPTION: 0,
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
        EXCEPTION: 0,
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };

  const data = {
    labels: dataMapped.map((dp) => dp.name),
    datasets: [
      {
        label: "Success",
        data: dataMapped.map((dp) => dp.SUCCESS),
        borderColor: "rgba(46, 204, 113, 1)",
        backgroundColor: "rgba(46, 204, 113, 0.5)",
      },
      {
        label: "Errors",
        data: dataMapped.map((dp) => dp.ERROR),
        borderColor: "rgba(231, 76, 60, 1)",
        backgroundColor: "rgba(231, 76, 60, 0.5)",
      },
      {
        label: "Timeouts",
        data: dataMapped.map((dp) => dp.TIMEOUT),
        borderColor: "rgba(243, 156, 18, 1)",
        backgroundColor: "rgba(243, 156, 18, 0.5)",
      },
      {
        label: "Exceptions",
        data: dataMapped.map((dp) => dp.EXCEPTION),
        borderColor: "rgba(155, 89, 182, 1)",
        backgroundColor: "rgba(155, 89, 182, 0.5)",
      },
    ],
  };

  return (
    <div>
      <TopNav />
      <div className="app_container_wide mx-auto">
        <article className="prose prose-lg my-4 cursor-pointer">
          <h2
            onClick={() => {
              navigation(`/runs/api/${state.runDocumentPath || ""}`);
            }}
          >
            {state.runDocument?.title}
          </h2>
        </article>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-2">
            <div className="grid">
              <div className="tabs z-10 -mb-px">
                <button className="tab tab-lifted tab-active">Status</button>
              </div>
              <div className="bg-base-300  relative overflow-x-auto">
                <div className="preview border-base-300 bg-base-100  min-h-[6rem] w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
                  {state.executionDocument?.status === "RUNNING" && (
                    <div>
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
                      <div className="text-center">
                        <p>Abort test</p>
                      </div>
                    </div>
                  )}
                  {(state.executionDocument?.status === "COMPLETED" ||
                    state.executionDocument?.status === "ABORTED") && (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        navigation(`/runs/api/${state.runDocumentPath || ""}`);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="green"
                        className="w-[60px] mx-auto mt-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="text-center">
                        <p>Run again</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid mt-10">
              <div className="tabs z-10 -mb-px">
                <button className="tab tab-lifted tab-active">Status</button>
              </div>
              <div className="bg-base-300  relative overflow-x-auto">
                <div className="preview border-base-300 bg-base-100  min-h-[6rem] w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
                  <article className="prose prose-lg my-4 text-center">
                    <h2>
                      {Math.round(executionSummary?.avg_response_time || 0)}
                    </h2>
                  </article>
                  <div className="text-center">
                    <p>Avg Response time (ms)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-10">
            <div className="grid">
              <div className="tabs z-10 -mb-px">
                <button className="tab tab-lifted tab-active">Status</button>
              </div>
              <div className="bg-base-300  relative overflow-x-auto">
                <div className="preview border-base-300 bg-base-100  min-h-[6rem] w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
                  <div className="grid grid-cols-4 gap-2 flex items-center h-full">
                    <div className="text-center">
                      <div className="text-[42px] w-full">
                        {getCountByStatus("SUCCESS")}
                      </div>
                      <div>Success</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[42px] w-full text-center">
                        {getCountByStatus("ERROR")}
                      </div>
                      <div>Errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[42px] w-full text-center">
                        {getCountByStatus("TIMEOUT")}
                      </div>
                      <div>Timeouts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[42px] w-full text-center">
                        {getCountByStatus("EXCEPTION")}
                      </div>
                      <div>Exceptions (500x)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid mt-10">
              <div className="tabs z-10 -mb-px">
                <button className="tab tab-lifted tab-active">Graph</button>
              </div>
              <div className="bg-base-300  relative overflow-x-auto">
                <div className="preview border-base-300 bg-base-100  min-h-[6rem] w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
                  <Line options={options} data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionGraph;
