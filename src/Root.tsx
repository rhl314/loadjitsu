import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import "./App.css";
import { IRunFile } from "./types/common";
import { useNavigate } from "react-router-dom";

function Root() {
  const navigate = useNavigate();
  async function getRecentRuns() {
    const response = (await invoke("getRecentRuns")) as IRunFile[];
    if (response.length === 0) {
      navigate("/runs/new");
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
