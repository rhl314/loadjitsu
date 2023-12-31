import { getVersion } from "@tauri-apps/api/app";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./logo";

export default function TopNav(props: { container: string }) {
  const navigate = useNavigate();
  const [version, setVersion] = useState("");
  useEffect(() => {
    getVersion().then((version) => {
      setVersion(version);
    });
  });

  return (
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
            <a className="bg-base-200">{version}</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
