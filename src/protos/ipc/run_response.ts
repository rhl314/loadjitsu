/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "ipc";

export interface RunResponse {
  uniqueId: string;
  hasLogs: boolean;
  logs: RunResponse_Log[];
  status: RunResponse_Status;
  description: string;
  time: number;
  intValues: { [key: string]: number };
  stringValues: { [key: string]: string };
  floatValues: { [key: string]: number };
  stepUniqueId: string;
  error: string;
}

export enum RunResponse_Status {
  SUCCESS = 0,
  ERROR = 1,
  TIMEOUT = 2,
  EXCEPTION = 3,
  UNRECOGNIZED = -1,
}

export function runResponse_StatusFromJSON(object: any): RunResponse_Status {
  switch (object) {
    case 0:
    case "SUCCESS":
      return RunResponse_Status.SUCCESS;
    case 1:
    case "ERROR":
      return RunResponse_Status.ERROR;
    case 2:
    case "TIMEOUT":
      return RunResponse_Status.TIMEOUT;
    case 3:
    case "EXCEPTION":
      return RunResponse_Status.EXCEPTION;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RunResponse_Status.UNRECOGNIZED;
  }
}

export function runResponse_StatusToJSON(object: RunResponse_Status): string {
  switch (object) {
    case RunResponse_Status.SUCCESS:
      return "SUCCESS";
    case RunResponse_Status.ERROR:
      return "ERROR";
    case RunResponse_Status.TIMEOUT:
      return "TIMEOUT";
    case RunResponse_Status.EXCEPTION:
      return "EXCEPTION";
    case RunResponse_Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface RunResponse_Log {
  timestamp: number;
  chunks: string[];
}

export interface RunResponse_IntValuesEntry {
  key: string;
  value: number;
}

export interface RunResponse_StringValuesEntry {
  key: string;
  value: string;
}

export interface RunResponse_FloatValuesEntry {
  key: string;
  value: number;
}

function createBaseRunResponse(): RunResponse {
  return {
    uniqueId: "",
    hasLogs: false,
    logs: [],
    status: 0,
    description: "",
    time: 0,
    intValues: {},
    stringValues: {},
    floatValues: {},
    stepUniqueId: "",
    error: "",
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
      RunResponse_Log.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.status !== 0) {
      writer.uint32(32).int32(message.status);
    }
    if (message.description !== "") {
      writer.uint32(42).string(message.description);
    }
    if (message.time !== 0) {
      writer.uint32(49).double(message.time);
    }
    Object.entries(message.intValues).forEach(([key, value]) => {
      RunResponse_IntValuesEntry.encode({ key: key as any, value }, writer.uint32(58).fork()).ldelim();
    });
    Object.entries(message.stringValues).forEach(([key, value]) => {
      RunResponse_StringValuesEntry.encode({ key: key as any, value }, writer.uint32(66).fork()).ldelim();
    });
    Object.entries(message.floatValues).forEach(([key, value]) => {
      RunResponse_FloatValuesEntry.encode({ key: key as any, value }, writer.uint32(74).fork()).ldelim();
    });
    if (message.stepUniqueId !== "") {
      writer.uint32(82).string(message.stepUniqueId);
    }
    if (message.error !== "") {
      writer.uint32(90).string(message.error);
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

          message.logs.push(RunResponse_Log.decode(reader, reader.uint32()));
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
          if (tag !== 49) {
            break;
          }

          message.time = reader.double();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          const entry7 = RunResponse_IntValuesEntry.decode(reader, reader.uint32());
          if (entry7.value !== undefined) {
            message.intValues[entry7.key] = entry7.value;
          }
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          const entry8 = RunResponse_StringValuesEntry.decode(reader, reader.uint32());
          if (entry8.value !== undefined) {
            message.stringValues[entry8.key] = entry8.value;
          }
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          const entry9 = RunResponse_FloatValuesEntry.decode(reader, reader.uint32());
          if (entry9.value !== undefined) {
            message.floatValues[entry9.key] = entry9.value;
          }
          continue;
        case 10:
          if (tag !== 82) {
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
      logs: globalThis.Array.isArray(object?.logs) ? object.logs.map((e: any) => RunResponse_Log.fromJSON(e)) : [],
      status: isSet(object.status) ? runResponse_StatusFromJSON(object.status) : 0,
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      time: isSet(object.time) ? globalThis.Number(object.time) : 0,
      intValues: isObject(object.intValues)
        ? Object.entries(object.intValues).reduce<{ [key: string]: number }>((acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        }, {})
        : {},
      stringValues: isObject(object.stringValues)
        ? Object.entries(object.stringValues).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      floatValues: isObject(object.floatValues)
        ? Object.entries(object.floatValues).reduce<{ [key: string]: number }>((acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        }, {})
        : {},
      stepUniqueId: isSet(object.stepUniqueId) ? globalThis.String(object.stepUniqueId) : "",
      error: isSet(object.error) ? globalThis.String(object.error) : "",
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
      obj.logs = message.logs.map((e) => RunResponse_Log.toJSON(e));
    }
    if (message.status !== 0) {
      obj.status = runResponse_StatusToJSON(message.status);
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.time !== 0) {
      obj.time = message.time;
    }
    if (message.intValues) {
      const entries = Object.entries(message.intValues);
      if (entries.length > 0) {
        obj.intValues = {};
        entries.forEach(([k, v]) => {
          obj.intValues[k] = Math.round(v);
        });
      }
    }
    if (message.stringValues) {
      const entries = Object.entries(message.stringValues);
      if (entries.length > 0) {
        obj.stringValues = {};
        entries.forEach(([k, v]) => {
          obj.stringValues[k] = v;
        });
      }
    }
    if (message.floatValues) {
      const entries = Object.entries(message.floatValues);
      if (entries.length > 0) {
        obj.floatValues = {};
        entries.forEach(([k, v]) => {
          obj.floatValues[k] = v;
        });
      }
    }
    if (message.stepUniqueId !== "") {
      obj.stepUniqueId = message.stepUniqueId;
    }
    if (message.error !== "") {
      obj.error = message.error;
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
    message.logs = object.logs?.map((e) => RunResponse_Log.fromPartial(e)) || [];
    message.status = object.status ?? 0;
    message.description = object.description ?? "";
    message.time = object.time ?? 0;
    message.intValues = Object.entries(object.intValues ?? {}).reduce<{ [key: string]: number }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = globalThis.Number(value);
        }
        return acc;
      },
      {},
    );
    message.stringValues = Object.entries(object.stringValues ?? {}).reduce<{ [key: string]: string }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = globalThis.String(value);
        }
        return acc;
      },
      {},
    );
    message.floatValues = Object.entries(object.floatValues ?? {}).reduce<{ [key: string]: number }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = globalThis.Number(value);
        }
        return acc;
      },
      {},
    );
    message.stepUniqueId = object.stepUniqueId ?? "";
    message.error = object.error ?? "";
    return message;
  },
};

function createBaseRunResponse_Log(): RunResponse_Log {
  return { timestamp: 0, chunks: [] };
}

export const RunResponse_Log = {
  encode(message: RunResponse_Log, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.timestamp !== 0) {
      writer.uint32(8).int64(message.timestamp);
    }
    for (const v of message.chunks) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RunResponse_Log {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRunResponse_Log();
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

  fromJSON(object: any): RunResponse_Log {
    return {
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
      chunks: globalThis.Array.isArray(object?.chunks) ? object.chunks.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: RunResponse_Log): unknown {
    const obj: any = {};
    if (message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    if (message.chunks?.length) {
      obj.chunks = message.chunks;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RunResponse_Log>, I>>(base?: I): RunResponse_Log {
    return RunResponse_Log.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RunResponse_Log>, I>>(object: I): RunResponse_Log {
    const message = createBaseRunResponse_Log();
    message.timestamp = object.timestamp ?? 0;
    message.chunks = object.chunks?.map((e) => e) || [];
    return message;
  },
};

function createBaseRunResponse_IntValuesEntry(): RunResponse_IntValuesEntry {
  return { key: "", value: 0 };
}

export const RunResponse_IntValuesEntry = {
  encode(message: RunResponse_IntValuesEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).int64(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RunResponse_IntValuesEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRunResponse_IntValuesEntry();
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
          if (tag !== 16) {
            break;
          }

          message.value = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RunResponse_IntValuesEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.Number(object.value) : 0,
    };
  },

  toJSON(message: RunResponse_IntValuesEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RunResponse_IntValuesEntry>, I>>(base?: I): RunResponse_IntValuesEntry {
    return RunResponse_IntValuesEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RunResponse_IntValuesEntry>, I>>(object: I): RunResponse_IntValuesEntry {
    const message = createBaseRunResponse_IntValuesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? 0;
    return message;
  },
};

function createBaseRunResponse_StringValuesEntry(): RunResponse_StringValuesEntry {
  return { key: "", value: "" };
}

export const RunResponse_StringValuesEntry = {
  encode(message: RunResponse_StringValuesEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RunResponse_StringValuesEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRunResponse_StringValuesEntry();
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
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RunResponse_StringValuesEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: RunResponse_StringValuesEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RunResponse_StringValuesEntry>, I>>(base?: I): RunResponse_StringValuesEntry {
    return RunResponse_StringValuesEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RunResponse_StringValuesEntry>, I>>(
    object: I,
  ): RunResponse_StringValuesEntry {
    const message = createBaseRunResponse_StringValuesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseRunResponse_FloatValuesEntry(): RunResponse_FloatValuesEntry {
  return { key: "", value: 0 };
}

export const RunResponse_FloatValuesEntry = {
  encode(message: RunResponse_FloatValuesEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(17).double(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RunResponse_FloatValuesEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRunResponse_FloatValuesEntry();
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
          if (tag !== 17) {
            break;
          }

          message.value = reader.double();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RunResponse_FloatValuesEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.Number(object.value) : 0,
    };
  },

  toJSON(message: RunResponse_FloatValuesEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== 0) {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RunResponse_FloatValuesEntry>, I>>(base?: I): RunResponse_FloatValuesEntry {
    return RunResponse_FloatValuesEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RunResponse_FloatValuesEntry>, I>>(object: I): RunResponse_FloatValuesEntry {
    const message = createBaseRunResponse_FloatValuesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? 0;
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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
