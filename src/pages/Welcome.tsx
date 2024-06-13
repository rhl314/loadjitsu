import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../frontend_util/react/components/TopNav";
import { IRunDocumentFile } from "../types/common";

const Welcome = () => {
  const navigate = useNavigate();
  const [showImportCurl, setShowImportCurl] = useState<boolean>(false);
  const [recentRuns, setRecentRuns] = useState<IRunDocumentFile[]>([]);
  async function getRecentRuns() {
    const response = (await invoke("getRecentRuns")) as IRunDocumentFile[];
    setRecentRuns(response);
  }

  useEffect(() => {
    getRecentRuns();
  }, []);
  const openNewLoadTest = async () => {
    const temporaryDocumentPath = await invoke("getTemporaryDocumentPath");
    navigate(`/runs/api/${temporaryDocumentPath}`);
  };
  return (
    <>
      <div>
        <TopNav />
        <h1>Hellow world</h1>
      </div>
    </>
  );
};

export default Welcome;
