import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RetroGrid from "../components/magicui/RetroGrid";
import TopNav from "../frontend_util/react/components/TopNav";
import { IRunDocumentFile } from "../types/common";
import ShimmerButton from "../components/magicui/ShimmerButton";

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
    <div
      className="relative flex flex-col h-full w-full  items-center justify-center overflow-hidden rounded-lg  bg-background p-20 md:shadow-xl"
      style={{ height: "100vh" }}
    >
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-6xl font-bold leading-none tracking-tighter text-transparent">
        Welcome !, <br />
        let the adventure begin!
      </span>

      <div className="z-10 flex min-h-[16rem] items-center justify-center">
        <ShimmerButton className="shadow-2xl">
          <span className="whitespace-pre-wrap text-center text-xl font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-2xl">
            Start your first load test
          </span>
        </ShimmerButton>
      </div>
      <p className="text-white text-xl">or Import from curl</p>

      <RetroGrid />
    </div>
  );
};

export default Welcome;
