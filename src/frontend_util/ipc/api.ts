/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ValidationError } from "./error";

export const protobufPackage = "ipc";

export enum HttpAction {
  GET = 0,
  POST = 1,
  PUT = 2,
  PATCH = 3,
  DELETE = 4,
  HEAD = 5,
  UNRECOGNIZED = -1,
}

export function httpActionFromJSON(object: any): HttpAction {
  switch (object) {
    case 0:
    case "GET":
      return HttpAction.GET;
    case 1:
    case "POST":
      return HttpAction.POST;
    case 2:
    case "PUT":
      return HttpAction.PUT;
    case 3:
    case "PATCH":
      return HttpAction.PATCH;
    case 4:
    case "DELETE":
      return HttpAction.DELETE;
    case 5:
    case "HEAD":
      return HttpAction.HEAD;
    case -1:
    case "UNRECOGNIZED":
    default:
      return HttpAction.UNRECOGNIZED;
  }
}

export function httpActionToJSON(object: HttpAction): string {
  switch (object) {
    case HttpAction.GET:
      return "GET";
    case HttpAction.POST:
      return "POST";
    case HttpAction.PUT:
      return "PUT";
    case HttpAction.PATCH:
      return "PATCH";
    case HttpAction.DELETE:
      return "DELETE";
    case HttpAction.HEAD:
      return "HEAD";
    case HttpAction.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum EnumApiBodyType {
  EMPTY = 0,
  FORM_DATA = 1,
  X_URL_FORM_ENCODED = 2,
  TEXT = 3,
  JSON = 4,
  HTML = 5,
  XML = 6,
  UNRECOGNIZED = -1,
}

export function enumApiBodyTypeFromJSON(object: any): EnumApiBodyType {
  switch (object) {
    case 0:
    case "EMPTY":
      return EnumApiBodyType.EMPTY;
    case 1:
    case "FORM_DATA":
      return EnumApiBodyType.FORM_DATA;
    case 2:
    case "X_URL_FORM_ENCODED":
      return EnumApiBodyType.X_URL_FORM_ENCODED;
    case 3:
    case "TEXT":
      return EnumApiBodyType.TEXT;
    case 4:
    case "JSON":
      return EnumApiBodyType.JSON;
    case 5:
    case "HTML":
      return EnumApiBodyType.HTML;
    case 6:
    case "XML":
      return EnumApiBodyType.XML;
    case -1:
    case "UNRECOGNIZED":
    default:
      return EnumApiBodyType.UNRECOGNIZED;
  }
}

export function enumApiBodyTypeToJSON(object: EnumApiBodyType): string {
  switch (object) {
    case EnumApiBodyType.EMPTY:
      return "EMPTY";
    case EnumApiBodyType.FORM_DATA:
      return "FORM_DATA";
    case EnumApiBodyType.X_URL_FORM_ENCODED:
      return "X_URL_FORM_ENCODED";
    case EnumApiBodyType.TEXT:
      return "TEXT";
    case EnumApiBodyType.JSON:
      return "JSON";
    case EnumApiBodyType.HTML:
      return "HTML";
    case EnumApiBodyType.XML:
      return "XML";
    case EnumApiBodyType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum HttpAuthType {
  NONE_AUTH = 0,
  BASIC_AUTH = 1,
  UNRECOGNIZED = -1,
}

export function httpAuthTypeFromJSON(object: any): HttpAuthType {
  switch (object) {
    case 0:
    case "NONE_AUTH":
      return HttpAuthType.NONE_AUTH;
    case 1:
    case "BASIC_AUTH":
      return HttpAuthType.BASIC_AUTH;
    case -1:
    case "UNRECOGNIZED":
    default:
      return HttpAuthType.UNRECOGNIZED;
  }
}

export function httpAuthTypeToJSON(object: HttpAuthType): string {
  switch (object) {
    case HttpAuthType.NONE_AUTH:
      return "NONE_AUTH";
    case HttpAuthType.BASIC_AUTH:
      return "BASIC_AUTH";
    case HttpAuthType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ApiBodyFormData {
  key: string;
  value: string;
  description: string;
  active: boolean;
  deleted: boolean;
  uniqueId: string;
  validationErrors: ValidationError[];
}

export interface ApiBody {
  type: EnumApiBodyType;
  contentType: string;
  data: string;
  formData: ApiBodyFormData[];
}

export interface ApiHeader {
  key: string;
  value: string;
  description: string;
  active: boolean;
  deleted: boolean;
  uniqueId: string;
  validationErrors: ValidationError[];
}

export interface HttpAuthBasic {
  username: string;
  password: string;
  validationErrors: ValidationError[];
}

export interface ApiStep {
  /** Unique ID string */
  uniqueId: string;
  endpoint: string;
  action: HttpAction;
  timeoutInMs: number;
  body: ApiBody | undefined;
  headers: ApiHeader[];
  authType: HttpAuthType;
  authBasic: HttpAuthBasic | undefined;
  validationErrors: ValidationError[];
}

function createBaseApiBodyFormData(): ApiBodyFormData {
  return { key: "", value: "", description: "", active: false, deleted: false, uniqueId: "", validationErrors: [] };
}

export const ApiBodyFormData = {
  encode(message: ApiBodyFormData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.active === true) {
      writer.uint32(32).bool(message.active);
    }
    if (message.deleted === true) {
      writer.uint32(40).bool(message.deleted);
    }
    if (message.uniqueId !== "") {
      writer.uint32(50).string(message.uniqueId);
    }
    for (const v of message.validationErrors) {
      ValidationError.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ApiBodyFormData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseApiBodyFormData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.description = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.active = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.deleted = reader.bool();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.uniqueId = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.validationErrors.push(ValidationError.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ApiBodyFormData {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      active: isSet(object.active) ? globalThis.Boolean(object.active) : false,
      deleted: isSet(object.deleted) ? globalThis.Boolean(object.deleted) : false,
      uniqueId: isSet(object.uniqueId) ? globalThis.String(object.uniqueId) : "",
      validationErrors: globalThis.Array.isArray(object?.validationErrors)
        ? object.validationErrors.map((e: any) => ValidationError.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ApiBodyFormData): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.active === true) {
      obj.active = message.active;
    }
    if (message.deleted === true) {
      obj.deleted = message.deleted;
    }
    if (message.uniqueId !== "") {
      obj.uniqueId = message.uniqueId;
    }
    if (message.validationErrors?.length) {
      obj.validationErrors = message.validationErrors.map((e) => ValidationError.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ApiBodyFormData>, I>>(base?: I): ApiBodyFormData {
    return ApiBodyFormData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ApiBodyFormData>, I>>(object: I): ApiBodyFormData {
    const message = createBaseApiBodyFormData();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    message.description = object.description ?? "";
    message.active = object.active ?? false;
    message.deleted = object.deleted ?? false;
    message.uniqueId = object.uniqueId ?? "";
    message.validationErrors = object.validationErrors?.map((e) => ValidationError.fromPartial(e)) || [];
    return message;
  },
};

function createBaseApiBody(): ApiBody {
  return { type: 0, contentType: "", data: "", formData: [] };
}

export const ApiBody = {
  encode(message: ApiBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.contentType !== "") {
      writer.uint32(18).string(message.contentType);
    }
    if (message.data !== "") {
      writer.uint32(26).string(message.data);
    }
    for (const v of message.formData) {
      ApiBodyFormData.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ApiBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseApiBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.contentType = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.data = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.formData.push(ApiBodyFormData.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ApiBody {
    return {
      type: isSet(object.type) ? enumApiBodyTypeFromJSON(object.type) : 0,
      contentType: isSet(object.contentType) ? globalThis.String(object.contentType) : "",
      data: isSet(object.data) ? globalThis.String(object.data) : "",
      formData: globalThis.Array.isArray(object?.formData)
        ? object.formData.map((e: any) => ApiBodyFormData.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ApiBody): unknown {
    const obj: any = {};
    if (message.type !== 0) {
      obj.type = enumApiBodyTypeToJSON(message.type);
    }
    if (message.contentType !== "") {
      obj.contentType = message.contentType;
    }
    if (message.data !== "") {
      obj.data = message.data;
    }
    if (message.formData?.length) {
      obj.formData = message.formData.map((e) => ApiBodyFormData.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ApiBody>, I>>(base?: I): ApiBody {
    return ApiBody.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ApiBody>, I>>(object: I): ApiBody {
    const message = createBaseApiBody();
    message.type = object.type ?? 0;
    message.contentType = object.contentType ?? "";
    message.data = object.data ?? "";
    message.formData = object.formData?.map((e) => ApiBodyFormData.fromPartial(e)) || [];
    return message;
  },
};

function createBaseApiHeader(): ApiHeader {
  return { key: "", value: "", description: "", active: false, deleted: false, uniqueId: "", validationErrors: [] };
}

export const ApiHeader = {
  encode(message: ApiHeader, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.active === true) {
      writer.uint32(32).bool(message.active);
    }
    if (message.deleted === true) {
      writer.uint32(40).bool(message.deleted);
    }
    if (message.uniqueId !== "") {
      writer.uint32(50).string(message.uniqueId);
    }
    for (const v of message.validationErrors) {
      ValidationError.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ApiHeader {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseApiHeader();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.description = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.active = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.deleted = reader.bool();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.uniqueId = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.validationErrors.push(ValidationError.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ApiHeader {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      active: isSet(object.active) ? globalThis.Boolean(object.active) : false,
      deleted: isSet(object.deleted) ? globalThis.Boolean(object.deleted) : false,
      uniqueId: isSet(object.uniqueId) ? globalThis.String(object.uniqueId) : "",
      validationErrors: globalThis.Array.isArray(object?.validationErrors)
        ? object.validationErrors.map((e: any) => ValidationError.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ApiHeader): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.active === true) {
      obj.active = message.active;
    }
    if (message.deleted === true) {
      obj.deleted = message.deleted;
    }
    if (message.uniqueId !== "") {
      obj.uniqueId = message.uniqueId;
    }
    if (message.validationErrors?.length) {
      obj.validationErrors = message.validationErrors.map((e) => ValidationError.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ApiHeader>, I>>(base?: I): ApiHeader {
    return ApiHeader.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ApiHeader>, I>>(object: I): ApiHeader {
    const message = createBaseApiHeader();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    message.description = object.description ?? "";
    message.active = object.active ?? false;
    message.deleted = object.deleted ?? false;
    message.uniqueId = object.uniqueId ?? "";
    message.validationErrors = object.validationErrors?.map((e) => ValidationError.fromPartial(e)) || [];
    return message;
  },
};

function createBaseHttpAuthBasic(): HttpAuthBasic {
  return { username: "", password: "", validationErrors: [] };
}

export const HttpAuthBasic = {
  encode(message: HttpAuthBasic, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    for (const v of message.validationErrors) {
      ValidationError.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HttpAuthBasic {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHttpAuthBasic();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.validationErrors.push(ValidationError.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): HttpAuthBasic {
    return {
      username: isSet(object.username) ? globalThis.String(object.username) : "",
      password: isSet(object.password) ? globalThis.String(object.password) : "",
      validationErrors: globalThis.Array.isArray(object?.validationErrors)
        ? object.validationErrors.map((e: any) => ValidationError.fromJSON(e))
        : [],
    };
  },

  toJSON(message: HttpAuthBasic): unknown {
    const obj: any = {};
    if (message.username !== "") {
      obj.username = message.username;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    if (message.validationErrors?.length) {
      obj.validationErrors = message.validationErrors.map((e) => ValidationError.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HttpAuthBasic>, I>>(base?: I): HttpAuthBasic {
    return HttpAuthBasic.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HttpAuthBasic>, I>>(object: I): HttpAuthBasic {
    const message = createBaseHttpAuthBasic();
    message.username = object.username ?? "";
    message.password = object.password ?? "";
    message.validationErrors = object.validationErrors?.map((e) => ValidationError.fromPartial(e)) || [];
    return message;
  },
};

function createBaseApiStep(): ApiStep {
  return {
    uniqueId: "",
    endpoint: "",
    action: 0,
    timeoutInMs: 0,
    body: undefined,
    headers: [],
    authType: 0,
    authBasic: undefined,
    validationErrors: [],
  };
}

export const ApiStep = {
  encode(message: ApiStep, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.uniqueId !== "") {
      writer.uint32(10).string(message.uniqueId);
    }
    if (message.endpoint !== "") {
      writer.uint32(18).string(message.endpoint);
    }
    if (message.action !== 0) {
      writer.uint32(24).int32(message.action);
    }
    if (message.timeoutInMs !== 0) {
      writer.uint32(32).int32(message.timeoutInMs);
    }
    if (message.body !== undefined) {
      ApiBody.encode(message.body, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.headers) {
      ApiHeader.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.authType !== 0) {
      writer.uint32(56).int32(message.authType);
    }
    if (message.authBasic !== undefined) {
      HttpAuthBasic.encode(message.authBasic, writer.uint32(66).fork()).ldelim();
    }
    for (const v of message.validationErrors) {
      ValidationError.encode(v!, writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ApiStep {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseApiStep();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.uniqueId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.endpoint = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.action = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.timeoutInMs = reader.int32();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.body = ApiBody.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.headers.push(ApiHeader.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.authType = reader.int32() as any;
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.authBasic = HttpAuthBasic.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.validationErrors.push(ValidationError.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ApiStep {
    return {
      uniqueId: isSet(object.uniqueId) ? globalThis.String(object.uniqueId) : "",
      endpoint: isSet(object.endpoint) ? globalThis.String(object.endpoint) : "",
      action: isSet(object.action) ? httpActionFromJSON(object.action) : 0,
      timeoutInMs: isSet(object.timeoutInMs) ? globalThis.Number(object.timeoutInMs) : 0,
      body: isSet(object.body) ? ApiBody.fromJSON(object.body) : undefined,
      headers: globalThis.Array.isArray(object?.headers) ? object.headers.map((e: any) => ApiHeader.fromJSON(e)) : [],
      authType: isSet(object.authType) ? httpAuthTypeFromJSON(object.authType) : 0,
      authBasic: isSet(object.authBasic) ? HttpAuthBasic.fromJSON(object.authBasic) : undefined,
      validationErrors: globalThis.Array.isArray(object?.validationErrors)
        ? object.validationErrors.map((e: any) => ValidationError.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ApiStep): unknown {
    const obj: any = {};
    if (message.uniqueId !== "") {
      obj.uniqueId = message.uniqueId;
    }
    if (message.endpoint !== "") {
      obj.endpoint = message.endpoint;
    }
    if (message.action !== 0) {
      obj.action = httpActionToJSON(message.action);
    }
    if (message.timeoutInMs !== 0) {
      obj.timeoutInMs = Math.round(message.timeoutInMs);
    }
    if (message.body !== undefined) {
      obj.body = ApiBody.toJSON(message.body);
    }
    if (message.headers?.length) {
      obj.headers = message.headers.map((e) => ApiHeader.toJSON(e));
    }
    if (message.authType !== 0) {
      obj.authType = httpAuthTypeToJSON(message.authType);
    }
    if (message.authBasic !== undefined) {
      obj.authBasic = HttpAuthBasic.toJSON(message.authBasic);
    }
    if (message.validationErrors?.length) {
      obj.validationErrors = message.validationErrors.map((e) => ValidationError.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ApiStep>, I>>(base?: I): ApiStep {
    return ApiStep.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ApiStep>, I>>(object: I): ApiStep {
    const message = createBaseApiStep();
    message.uniqueId = object.uniqueId ?? "";
    message.endpoint = object.endpoint ?? "";
    message.action = object.action ?? 0;
    message.timeoutInMs = object.timeoutInMs ?? 0;
    message.body = (object.body !== undefined && object.body !== null) ? ApiBody.fromPartial(object.body) : undefined;
    message.headers = object.headers?.map((e) => ApiHeader.fromPartial(e)) || [];
    message.authType = object.authType ?? 0;
    message.authBasic = (object.authBasic !== undefined && object.authBasic !== null)
      ? HttpAuthBasic.fromPartial(object.authBasic)
      : undefined;
    message.validationErrors = object.validationErrors?.map((e) => ValidationError.fromPartial(e)) || [];
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
