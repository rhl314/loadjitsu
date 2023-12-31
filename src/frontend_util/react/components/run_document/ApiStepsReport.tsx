import { ApiStep } from "../../../ipc/api";
import ApiStepReport from "./ApiStepReport";

export default function ApiStepsReport(props: { steps: ApiStep[] }) {
  return (
    <div>
      {props.steps?.map((apiStep: ApiStep) => {
        return <ApiStepReport key={apiStep.uniqueId} step={apiStep} />;
      })}
    </div>
  );
}
