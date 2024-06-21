import * as _ from "lodash";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiClient } from "../api_client/api_client";
import {
  ExecutionAppContext,
  INITIAL_EXECUTION_APP_STATE,
  executionReducer,
} from "../frontend_util/react/ExecutionContext";
import TopNav from "../frontend_util/react/components/TopNav";

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
import { faker } from "@faker-js/faker";
import React from "react";
import { Line } from "react-chartjs-2";
import RunNavigation from "../frontend_util/react/components/run_document/RunNavigation";
import ExecutionGraph from "../frontend_util/react/components/run_document/ExecutionGraph";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "grid",
    gridTemplateAreas: `"nav nav" "left header"  "left top_stats" "left bottom_stats" "left main" "left footer"`,
    gridTemplateRows: "80px 80px  80px 80px 1fr 80px",
    gridTemplateColumns: "1fr 4fr",
  },
  header: {
    gridArea: "header",
    background: "white",
  },
  trunk: {
    gridArea: "trunk",
    backgroundColor: "#f5f5f5",
  },
  main: {
    gridArea: "main",
    overflow: "auto",
  },
  left: {
    gridArea: "left",
    overflow: "auto",
  },
  top_stats: {
    gridArea: "top_stats",
    backgroundColor: "yello",
  },
  bottom_stats: {
    gridArea: "bottom_stats",
    backgroundColor: "pink",
  },
  nav: {
    gridArea: "nav",
  },
  footer: {
    gridArea: "footer",
  },
};

const Execution = () => {
  const navigation = useNavigate();
  let { documentPath, executionId } = useParams();
  const [showDownloadReport, setShowDownloadReport] = useState(false);
  const [executionAppState, dispatch] = useReducer(executionReducer, {
    ...INITIAL_EXECUTION_APP_STATE,
    runDocumentPath: documentPath as string,
    executionId: executionId as string,
  });
  let title = executionAppState.runDocument?.title;
  if (_.isEmpty(title)) {
    title = executionAppState.runDocument?.title || "Untitled test";
  }
  title = _.truncate(title, { length: 40 });
  const loadExecution = async () => {
    try {
      const apiClient = new ApiClient();
      const executionDocumentOrError = await apiClient.getExecutionDocument({
        runDocumentPath: documentPath as string,
        executionDocumentId: executionId as string,
      });
      if (executionDocumentOrError.isFailure) {
        return dispatch({
          state: "ERROR",
        });
      }

      const executionDocument = executionDocumentOrError.getValue();
      console.log({ executionDocument });
      console.log("INDIA", executionDocument.status);
      dispatch({
        executionDocument,
      });
      const runDocumentOrError = await apiClient.getRunDocumentByRevisionId({
        runDocumentPath: documentPath as string,
        documentRevisionId: executionDocument.document_revision_id,
        runMigrations: false,
      });
      if (runDocumentOrError.isFailure) {
        return dispatch({
          state: "ERROR",
        });
      }
      const runDocument = runDocumentOrError.getValue();
      dispatch({
        runDocument,
      });
      const executionResultsOrError = await apiClient.getExecutionResults({
        runDocumentPath: documentPath as string,
        executionDocumentId: executionId as string,
      });
      if (executionResultsOrError.isFailure) {
        return dispatch({
          state: "ERROR",
        });
      }
      const executionResults = executionResultsOrError.getValue();
      console.log({ ready: executionResults });

      dispatch({
        executionResults: executionResults,
        state: "READY",
      });
      if (
        executionDocument.status === "RUNNING" ||
        executionDocument.status === "REQUESTED_ABORT"
      ) {
        setTimeout(() => {
          loadExecution();
        }, 1000);
      }
    } catch (err) {
      if (err === "DOCUMENT_NOT_FOUND") {
        return;
      }
      return dispatch({
        state: "ERROR",
      });
    }
  };

  useEffect(() => {
    loadExecution();
  }, []);
  return (
    <ExecutionAppContext.Provider
      value={{ state: executionAppState, dispatch }}
    >
      <ExecutionGraph />
    </ExecutionAppContext.Provider>
  );
};

export default Execution;
