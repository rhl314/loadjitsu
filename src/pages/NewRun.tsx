import { useParams } from "react-router-dom";
import Run from "../components/Run";

const NewRun = () => {
  let { documentPath } = useParams();
  if (documentPath) {
    return <Run documentPath={documentPath} />;
  }
};

export default NewRun;
