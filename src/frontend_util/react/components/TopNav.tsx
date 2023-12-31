import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IActivationDetails } from "../../../api_client/api_client";
import Logo from "./logo";

export default function TopNav(props: { container: string }) {
  const navigate = useNavigate();
  useState<IActivationDetails | null>(null);

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
            <a className="bg-base-200">v0.01</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
