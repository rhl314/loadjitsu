import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import "./App.css";
import { IRunDocumentFile } from "./types/common";
import { useNavigate } from "react-router-dom";

function Root() {
  const navigate = useNavigate();
  async function getRecentRuns() {
    const response = (await invoke("getRecentRuns")) as IRunDocumentFile[];
    console.log(response);
    if (response.length === 0) {
      //const temporaryDocumentPath = await invoke("getTemporaryDocumentPath");
      //navigate(`/runs/api/${temporaryDocumentPath}`);
      navigate("/welcome");
    } else {
      navigate("/home");
    }
  }

  useEffect(() => {
    getRecentRuns();
  }, []);

  return <div className="container"></div>;
}

export default Root;
