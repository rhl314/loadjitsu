import { Result } from "../frontend_util/common/Result";
import { ApiStep } from "../frontend_util/ipc/api";
import { RunType, runTypeToJSON } from "../frontend_util/ipc/run_document";
import { RunResponse } from "../frontend_util/ipc/run_response";
import { AppUtil } from "./AppUtil";
import { ApiClient } from "./api_client";
import { invoke } from "@tauri-apps/api/tauri";

export class StepClient extends ApiClient {
  private async runSerializedStepOnce(
    serialized: Uint8Array,
    type: RunType
  ): Promise<Result<RunResponse>> {
    try {
      const base64 = await new AppUtil().uint8ArrayToBase64(serialized);
      const response = await invoke("runApiStepOnce", { serialized: base64 });
      debugger;
      /*const response = await this.client().post("/api/v1/private/runOnce", {
        payload: base64,
        runType: runTypeToJSON(type),
      });
      const runResponsePayload = response.data.runResponsePayload;
      const runResponse = RunResponse.decode(
        Buffer.from(runResponsePayload, "base64")
      );*/
      return Result.ok<RunResponse>();
    } catch (err) {
      console.error(err);
      return Result.fail<RunResponse>({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Please try again",
      });
    }
  }
  public async runApiStepOnce(step: ApiStep): Promise<Result<RunResponse>> {
    console.log({ step });
    debugger;
    const serialized = ApiStep.encode(step).finish();
    return this.runSerializedStepOnce(serialized, RunType.API);
  }
}
