import { useContext, useEffect, useState } from "react";
import { ApiClient, IExecution } from "../../../api_client/api_client";
import { RunDocumentAppContext } from "../RunDocumentContext";
import ExecutionSummary from "./ExecutionSummary";

export default function Runs() {
  const runDocumentAppContext = useContext(RunDocumentAppContext);
  const [executions, setExecutions] = useState<IExecution[]>([]);
  const [_state, setState] = useState("IDLE");
  const loadExecutions = async () => {
    const apiClient = new ApiClient();

    const executionsOrError = await apiClient.getRuns({
      runDocumentPath: runDocumentAppContext.state.runDocumentPath as string,
    });
    if (executionsOrError.isFailure) {
      setState("ERROR");
      return;
    }
    setExecutions(executionsOrError.getValue());
  };

  useEffect(() => {
    loadExecutions();
  }, []);

  if (executions.length === 0) {
    return <div />;
  }
  return (
    <>
      <div className="app_container mx-auto mt-10">
        <div className="grid">
          <div className="tabs z-10 -mb-px">
            <button className="tab tab-lifted tab-active">Past runs</button>
          </div>
          <div className="bg-base-300  relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  min-h-[6rem] w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
              <div className="overflow-x-auto">
                <table className="table">
                  <tbody>
                    {executions
                      .sort((a, b) => {
                        return new Date(a.started_at) > new Date(b.started_at)
                          ? -1
                          : 1;
                      })
                      .map((execution) => {
                        return (
                          <ExecutionSummary
                            key={execution.id}
                            execution={execution}
                          />
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
