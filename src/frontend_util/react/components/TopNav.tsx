import { getVersion } from "@tauri-apps/api/app";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShimmerButton from "../../../components/magicui/ShimmerButton";
import Logo from "./logo";
import { open } from "@tauri-apps/api/shell";
import RegisterLicense from "./RegisterLicense";

export default function TopNav() {
  const navigate = useNavigate();
  const [version, setVersion] = useState("");
  const [showRegisterLicense, setShowRegisterLicense] = useState(false);
  useEffect(() => {
    getVersion().then((version) => {
      setVersion(version);
    });
  });

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <div
            className="btn btn-ghost normal-case text-xl"
            onClick={() => {
              navigate("/");
            }}
          >
            <Logo height={30} />
            Loadjitsu
          </div>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <span className="pt-3.5 whitespace-pre-wrap text-center  leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10">
                v{version}
              </span>
            </li>
            <li
              onClick={async () => {
                setShowRegisterLicense(true);
              }}
            >
              <ShimmerButton className="shadow-2xl" onClick={() => {}}>
                <span className="whitespace-pre-wrap text-center  leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10">
                  Free trial. Upgrade now
                </span>
              </ShimmerButton>
            </li>
          </ul>
        </div>
      </div>
      <RegisterLicense
        open={showRegisterLicense}
        setOpen={setShowRegisterLicense}
      />
    </>
  );
}
