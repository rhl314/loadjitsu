import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import NewRun from "./pages/NewRun";
import Root from "./Root";
import "./styles.css";
import Execution from "./pages/Execution";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/runs/api/:documentPath",
    element: <NewRun />,
  },
  {
    path: "/runs/api/:documentPath/executions/:executionId",
    element: <Execution />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
