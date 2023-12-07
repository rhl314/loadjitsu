import { invoke } from "@tauri-apps/api/tauri";
import axios, { AxiosInstance } from "axios";
import _ from "lodash";
import { Result } from "../frontend_util/common/Result";
import { ApiStep } from "../frontend_util/ipc/api";
import { RunDocument } from "../frontend_util/ipc/run_document";
import { RunResponse } from "../frontend_util/ipc/run_response";
import { AppUtil } from "./AppUtil";
import { IBootApiResponse } from "./IBootApiResponse";
import {
  IExecutionDocument,
  IExecutionStatusCount,
} from "../frontend_util/react/ExecutionContext";
export interface ICreateAdminUserRequest {
  handle: string;
  password: string;
}
export interface ICreateAdminUserResponse {
  token: string;
}
export interface IResponseTimes {
  Min: number;
  Max: number;
  Avg: number;
}

export interface IExecutionResultRow {
  UniqueId: string;
  CreatedAt: string;
  StepUniqueId: string;
  DataType: string;
  DataKey: string;
  StringValue: string;
  IntValue: number;
  FloatValue: number;
}
export interface IExecutionResult {
  runDocument: string;
  statuses: IResultStatus[];
  statusGroups: IStatusGroup[];
  times: IResponseTimes;
  running: boolean;
  executionResults: IExecutionResultRow[];
}
export interface IResultStatus {
  Timestamp: number;
  Count: number;
  Status: string;
}
export interface IStatusGroup {
  Count: number;
  Status: string;
}

export interface ILicensee {
  firstName: string;
  lastName: string;
  email: string;
}
export interface IActivationDetails {
  licenseKey: string;
  licenseActivationId: string;
  nonce: number;
  licensee: ILicensee;
}
export interface IGetLicenseApiResponse {
  licenseStatus: string;
  activationDetails: IActivationDetails;
  buildVersion: string;
}

export interface IExecution {
  id: string;
}

export class ApiClient {
  private apiHost: string;
  private token: string;
  private static LOADJITSU_TOKEN = "LOADJITSU_TOKEN";
  constructor() {
    this.apiHost = ""; //process.env.NEXT_PUBLIC_API_HOST as string;
    this.token = localStorage.getItem(ApiClient.LOADJITSU_TOKEN) as string;
  }

  protected client(): AxiosInstance {
    return axios.create({
      baseURL: this.apiHost,
      headers: { "X-LOADJITSU-TOKEN": this.token },
    });
  }

  public async boot(): Promise<IBootApiResponse> {
    const response = await this.client().get(
      `${this.apiHost}/api/v1/public/boot`
    );
    return response.data as IBootApiResponse;
  }

  public async getLicense(): Promise<IGetLicenseApiResponse> {
    const response = await this.client().get(
      `${this.apiHost}/api/v1/private/license`
    );
    return response.data as IGetLicenseApiResponse;
  }

  public async getExecutions(args: {
    runDocumentPath: string;
  }): Promise<Result<IExecution[]>> {
    try {
      console.log("Getting runs");
      const response = (await invoke("getExecutions", {
        runDocumentPath: args.runDocumentPath,
      })) as IExecution[];
      console.log(response);
      return Result.ok<IExecution[]>(response);
    } catch (err: any) {
      console.error(err);
      return Result.fail<IExecution[]>({
        code: "INTERNAL_SERVER_ERROR",
        message: "Please try again",
      });
    }
  }

  public async getExecutionDocument(args: {
    runDocumentPath: string;
    executionDocumentId: string;
  }): Promise<Result<IExecutionDocument>> {
    try {
      console.log("Getting execution document");
      const response = (await invoke("getExecutionDocument", {
        runDocumentPath: args.runDocumentPath,
        executionDocumentId: args.executionDocumentId,
      })) as IExecutionDocument;
      console.log({ response });
      return Result.ok<IExecutionDocument>(response);
    } catch (err: any) {
      console.log("Errored");
      console.error(err);
      return Result.fail({
        code: "INTERNAL_SERVER_ERROR",
        message: "Please try again",
      });
    }
  }

  public async getExecutionResults(args: {
    runDocumentPath: string;
    executionDocumentId: string;
  }): Promise<Result<IExecutionStatusCount[]>> {
    try {
      console.log("Getting runs");
      const response = (await invoke("getExecutionResults", {
        runDocumentPath: args.runDocumentPath,
        executionDocumentId: args.executionDocumentId,
      })) as IExecutionStatusCount[];
      console.log({ response });
      return Result.ok<IExecutionStatusCount[]>(response);
    } catch (err: any) {
      console.log("Errored");
      console.error(err);
      return Result.fail({
        code: "INTERNAL_SERVER_ERROR",
        message: "Please try again",
      });
    }
  }

  public async activateLicense(key: string): Promise<Result<string>> {
    try {
      const response = await this.client().post(
        `${this.apiHost}/api/v1/private/activateLicense`,
        { key }
      );
      return Result.ok<string>(response.data?.activationState);
    } catch (apiErorr: any) {
      return Result.fail<string>(
        apiErorr?.response?.data || {
          code: "ACTIVATION_ERROR",
          message: "Someting went wrong. Please try again",
        }
      );
    }
  }

  public async createAdminUser(
    request: ICreateAdminUserRequest
  ): Promise<ICreateAdminUserResponse> {
    const response = await axios.post(
      `${this.apiHost}/api/v1/public/createUser`,
      request
    );
    const data = response.data as ICreateAdminUserResponse;
    localStorage.setItem(ApiClient.LOADJITSU_TOKEN, data.token);
    return data;
  }

  public async login(
    request: ICreateAdminUserRequest
  ): Promise<ICreateAdminUserResponse> {
    const response = await axios.post(
      `${this.apiHost}/api/v1/public/login`,
      request
    );
    const data = response.data as ICreateAdminUserResponse;
    localStorage.setItem(ApiClient.LOADJITSU_TOKEN, data.token);
    return data;
  }

  public logout(): void {
    localStorage.removeItem(ApiClient.LOADJITSU_TOKEN);
  }

  public async save(payload: string) {
    const response = await this.client().post(
      `${this.apiHost}/api/v1/private/saveDocument`,
      {
        payload,
      }
    );
  }

  public async saveRunDocument(args: {
    runDocument: RunDocument;
    runDocumentPath: string;
    execute: boolean;
  }) {
    const bytes = RunDocument.encode(args.runDocument).finish();
    const appUtil = new AppUtil();
    const serialized = await appUtil.uint8ArrayToBase64(bytes);
    const response = (await invoke("saveRunDocument", {
      runDocumentSerialized: serialized,
      runDocumentPath: args.runDocumentPath,
      execute: args.execute.toString(),
    })) as string;
    console.log(response);
  }

  public async abort(executionUniqueId: string): Promise<Result<void>> {
    try {
      await this.client().post(
        `${this.apiHost}/api/v1/private/abort/${executionUniqueId}`,
        {}
      );
      return Result.ok<void>();
    } catch (err) {
      console.error(err);
      return Result.fail<void>({
        code: "ERROR_ABORTING",
        message: "Something went wrong",
      });
    }
  }

  public async getResults(
    documentUniqueId: string,
    executionDocumentUniqueId: string
  ): Promise<Result<IExecutionResult>> {
    try {
      const response = await this.client().get(
        `${this.apiHost}/api/v1/private/getResults/${documentUniqueId}/execution/${executionDocumentUniqueId}`
      );
      return Result.ok<IExecutionResult>(response.data as IExecutionResult);
    } catch (err) {
      console.error(err);
      return Result.fail<IExecutionResult>({
        code: "ERROR_FETCHING_RESULTS",
        message: "Something went wrong",
      });
    }
  }

  public async getRunDocument(documentUniqueId: string): Promise<
    Result<{
      document?: RunDocument;
      alreadyRunning?: boolean;
      executionUniqueId?: string;
    }>
  > {
    try {
      const { data } = await this.client().get(
        `${this.apiHost}/api/v1/private/getDocument/${documentUniqueId}`
      );
      const payload = data?.payload;
      if (_.isNil(payload)) {
        return Result.ok({});
      }
      return Result.ok({
        document: RunDocument.decode(Buffer.from(payload, "base64")),
        executionUniqueId: data?.executionUniqueId,
        alreadyRunning: data?.alreadyRunning,
      });
    } catch (err: any) {
      console.error(err);
      return Result.fail({
        code: "INTERNAL_SERVER_ERROR",
        message: err.mesage,
      });
    }
  }

  public async getDocuments(
    page: number,
    limit: number
  ): Promise<
    Result<{
      documents: RunDocument[];
      total: number;
      page: number;
      limit: number;
      runningDocuments: Record<string, string>;
    }>
  > {
    try {
      const { data } = await this.client().get(
        `${this.apiHost}/api/v1/private/getDocuments?page=${page}&limit=${limit}`
      );
      const documents: RunDocument[] = _.compact(
        (data?.documents || []).map((payload: any) => {
          try {
            return RunDocument.decode(
              Buffer.from(payload.RunDocument, "base64")
            );
          } catch (err) {
            return null;
          }
        })
      );

      return Result.ok({
        documents,
        total: data.total as number,
        page: data.page as number,
        limit: data.limit as number,
        runningDocuments: data.runningDocumentMap as Record<string, string>,
      });
    } catch (err: any) {
      console.error(err);
      return Result.fail({
        code: "INTERNAL_SERVER_ERROR",
        message: err.mesage,
      });
    }
  }

  public async runApiStepOnce(step: ApiStep): Promise<Result<RunResponse>> {
    try {
      const serialized = ApiStep.encode(step).finish();

      const appUtil = new AppUtil();
      const base64 = await appUtil.uint8ArrayToBase64(serialized);
      const response = (await invoke("runApiStepOnce", {
        serialized: base64,
      })) as string;
      const runResponse = RunResponse.decode(
        appUtil.base64ToUint8Array(response)
      );
      return Result.ok<RunResponse>(runResponse);
    } catch (err) {
      console.error(err);
      return Result.fail<RunResponse>({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Please try again",
      });
    }
  }
}
