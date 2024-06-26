import { useEffect, useReducer } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  AccountAppContext,
  accountReducer,
  INITIAL_ACCOUNT_STATE,
} from "./frontend_util/react/AccountContext";
import Execution from "./pages/Execution";
import Home from "./pages/Home";
import NewRun from "./pages/NewRun";
import Welcome from "./pages/Welcome";
import Root from "./Root";
import "./styles.css";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
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

const App = () => {
  const [accountState, dispatch] = useReducer(
    accountReducer,
    INITIAL_ACCOUNT_STATE
  );
  const load = async () => {
    // Initialize an agent at application startup.
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    console.log("INDIA", result.visitorId);
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <AccountAppContext.Provider value={{ state: accountState, dispatch }}>
      <RouterProvider router={router}></RouterProvider>
    </AccountAppContext.Provider>
  );
};

export default App;
