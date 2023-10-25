import { IRunVariable } from "./common";

export enum EnumHttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface IHttpHeader {
  uniqueId: string;
  key: string;
  value: string;
}

export interface IHttpApi {
  uniqueId: string;
  method: EnumHttpMethod;
  url: string;
  timeoutMs: number;
  variables: IRunVariable[];
}
