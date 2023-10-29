import Logo from "./logo";
import { useEffect, useState } from "react";
import ActivateLicense from "./ActivateLicense";
import { ApiClient, IActivationDetails } from "../../../api_client/api_client";

export default function TopNav(props: { container: string }) {
  const [showLicense, setShowLicense] = useState(false);
  const [licenseState, setLicenseState] = useState("IDLE");
  const [buildVersion, setBuildVersion] = useState("");
  const [activationDetails, setActivationDetails] =
    useState<IActivationDetails | null>(null);
  const getLicense = async () => {
    try {
      const apiClient = new ApiClient();
      const response = await apiClient.getLicense();
      setLicenseState(response.licenseStatus);
      setActivationDetails(response.activationDetails);
      setBuildVersion(response.buildVersion);
    } catch (err) {
      setLicenseState("ERROR");
      setActivationDetails(null);
    }
  };
  const licenseCta = () => {
    if (licenseState === "IDLE") {
      return (
        <li>
          <a className="bg-base-200">Loading ...</a>
        </li>
      );
    } else if (licenseState === "ACTIVE") {
      return (
        <li
          onClick={() => {
            setShowLicense(true);
          }}
        >
          <a className="bg-base-200">Pro license</a>
        </li>
      );
    } else if (licenseState === "NOT_FOUND") {
      return (
        <li
          onClick={() => {
            setShowLicense(true);
          }}
        >
          <a className="bg-base-200">Unlicensed</a>
        </li>
      );
    } else {
      return (
        <li
          onClick={() => {
            getLicense();
          }}
        >
          <a className="bg-base-200">Please refresh</a>
        </li>
      );
    }
  };
  useEffect(() => {
    // getLicense();
  }, []);
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">
          <Logo height={30} />
          Loadjitsu
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a className="bg-base-200">Unlicensed</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
