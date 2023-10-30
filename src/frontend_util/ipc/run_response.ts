/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "ipc";

export enum RunStatus {
  SUCCESS = 0,
  ERROR = 1,
  TIMEOUT = 2,
  EXCEPTION = 3,
  INVALID = 4,
  UNRECOGNIZED = -1,
}

export function runStatusFromJSON(object: any): RunStatus {
  switch (object) {
    case 0:
    case "SUCCESS":
      return RunStatus.SUCCESS;
    case 1:
    case "ERROR":
      return RunStatus.ERROR;
    case 2:
    case "TIMEOUT":
      return RunStatus.TIMEOUT;
    case 3:
    case "EXCEPTION":
      return RunStatus.EXCEPTION;
    case 4:
    case "INVALID":
      return RunStatus.INVALID;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RunStatus.UNRECOGNIZED;
  }
}

export function runStatusToJSON(object: RunStatus): string {
  switch (object) {
    case RunStatus.SUCCESS:
      return "SUCCESS";
    case RunStatus.ERROR:
      return "ERROR";
    case RunStatus.TIMEOUT:
      return "TIMEOUT";
    case RunStatus.EXCEPTION:
      return "EXCEPTION";
    case RunStatus.INVALID:
      return "INVALID";
    case RunStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface RunLog {
  timestamp: number;
  chunks: string[];
}

export interface RunResponse {
  uniqueId: string;
  hasLogs: boolean;
  logs: RunLog[];
  status: RunStatus;
  description: string;
  time: number;
  latency: number;
  stepUniqueId: string;
  error: string;
  statusCode: number;
}

function createBaseRunLog(): RunLog {
  return { timestamp: 0, chunks: [] };
}

export const RunLog = {
  encode(message: RunLog, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.timestamp !== 0) {
      writer.uint32(8).int64(message.timestamp);
    }
    for (const v of message.chunks) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RunLog {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRunLog();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.timestamp = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.chunks.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RunLog {
    return {
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
      chunks: globalThis.Array.isArray(object?.chunks) ? object.chunks.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: RunLog): unknown {
    const obj: any = {};
    if (message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    if (message.chunks?.length) {
      obj.chunks = message.chunks;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RunLog>, I>>(base?: I): RunLog {
    return RunLog.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RunLog>, I>>(object: I): RunLog {
    const message = createBaseRunLog();
    message.timestamp = object.timestamp ?? 0;
    message.chunks = object.chunks?.map((e) => e) || [];
    return message;
  },
};

function createBaseRunResponse(): RunResponse {
  return {
    uniqueId: "",
    hasLogs: false,
    logs: [],
    status: 0,
    description: "",
    time: 0,
    latency: 0,
    stepUniqueId: "",
    error: "",
    statusCode: 0,
  };
}

export const RunResponse = {
  encode(message: RunResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.uniqueId !== "") {
      writer.uint32(10).string(message.uniqueId);
    }
    if (message.hasLogs === true) {
      writer.uint32(16).bool(message.hasLogs);
    }
    for (const v of message.logs) {
      RunLog.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.status !== 0) {
      writer.uint32(32).int32(message.status);
    }
    if (message.description !== "") {
      writer.uint32(42).string(message.description);
    }
    if (message.time !== 0) {
      writer.uint32(48).uint64(message.time);
    }
    if (message.latency !== 0) {
      writer.uint32(56).uint64(message.latency);
    }
    if (message.stepUniqueId !== "") {
      writer.uint32(66).string(message.stepUniqueId);
    }
    if (message.error !== "") {
      writer.uint32(90).string(message.error);
    }
    if (message.statusCode !== 0) {
      writer.uint32(96).uint64(message.statusCode);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RunResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRunResponse();
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
          if (tag !== 16) {
            break;
          }

          message.hasLogs = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.logs.push(RunLog.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.description = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.time = longToNumber(reader.uint64() as Long);
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.latency = longToNumber(reader.uint64() as Long);
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.stepUniqueId = reader.string();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.error = reader.string();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.statusCode = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RunResponse {
    return {
      uniqueId: isSet(object.uniqueId) ? globalThis.String(object.uniqueId) : "",
      hasLogs: isSet(object.hasLogs) ? globalThis.Boolean(object.hasLogs) : false,
      logs: globalThis.Array.isArray(object?.logs) ? object.logs.map((e: any) => RunLog.fromJSON(e)) : [],
      status: isSet(object.status) ? runStatusFromJSON(object.status) : 0,
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      time: isSet(object.time) ? globalThis.Number(object.time) : 0,
      latency: isSet(object.latency) ? globalThis.Number(object.latency) : 0,
      stepUniqueId: isSet(object.stepUniqueId) ? globalThis.String(object.stepUniqueId) : "",
      error: isSet(object.error) ? globalThis.String(object.error) : "",
      statusCode: isSet(object.statusCode) ? globalThis.Number(object.statusCode) : 0,
    };
  },

  toJSON(message: RunResponse): unknown {
    const obj: any = {};
    if (message.uniqueId !== "") {
      obj.uniqueId = message.uniqueId;
    }
    if (message.hasLogs === true) {
      obj.hasLogs = message.hasLogs;
    }
    if (message.logs?.length) {
      obj.logs = message.logs.map((e) => RunLog.toJSON(e));
    }
    if (message.status !== 0) {
      obj.status = runStatusToJSON(message.status);
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.time !== 0) {
      obj.time = Math.round(message.time);
    }
    if (message.latency !== 0) {
      obj.latency = Math.round(message.latency);
    }
    if (message.stepUniqueId !== "") {
      obj.stepUniqueId = message.stepUniqueId;
    }
    if (message.error !== "") {
      obj.error = message.error;
    }
    if (message.statusCode !== 0) {
      obj.statusCode = Math.round(message.statusCode);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RunResponse>, I>>(base?: I): RunResponse {
    return RunResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RunResponse>, I>>(object: I): RunResponse {
    const message = createBaseRunResponse();
    message.uniqueId = object.uniqueId ?? "";
    message.hasLogs = object.hasLogs ?? false;
    message.logs = object.logs?.map((e) => RunLog.fromPartial(e)) || [];
    message.status = object.status ?? 0;
    message.description = object.description ?? "";
    message.time = object.time ?? 0;
    message.latency = object.latency ?? 0;
    message.stepUniqueId = object.stepUniqueId ?? "";
    message.error = object.error ?? "";
    message.statusCode = object.statusCode ?? 0;
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

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
