/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ApiStep } from "./api";

export const protobufPackage = "ipc";

export enum RunType {
  NONE = 0,
  API = 1,
  WEBSITE = 2,
  REDIS = 3,
  MYSQL = 4,
  MONGODB = 5,
  POSTGRES = 6,
  NEO4J = 7,
  MSSQL = 8,
  GRAPHQL = 9,
  ELASTICSEARCH = 10,
  WEBSOCKETS = 11,
  UNRECOGNIZED = -1,
}

export function runTypeFromJSON(object: any): RunType {
  switch (object) {
    case 0:
    case "NONE":
      return RunType.NONE;
    case 1:
    case "API":
      return RunType.API;
    case 2:
    case "WEBSITE":
      return RunType.WEBSITE;
    case 3:
    case "REDIS":
      return RunType.REDIS;
    case 4:
    case "MYSQL":
      return RunType.MYSQL;
    case 5:
    case "MONGODB":
      return RunType.MONGODB;
    case 6:
    case "POSTGRES":
      return RunType.POSTGRES;
    case 7:
    case "NEO4J":
      return RunType.NEO4J;
    case 8:
    case "MSSQL":
      return RunType.MSSQL;
    case 9:
    case "GRAPHQL":
      return RunType.GRAPHQL;
    case 10:
    case "ELASTICSEARCH":
      return RunType.ELASTICSEARCH;
    case 11:
    case "WEBSOCKETS":
      return RunType.WEBSOCKETS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RunType.UNRECOGNIZED;
  }
}

export function runTypeToJSON(object: RunType): string {
  switch (object) {
    case RunType.NONE:
      return "NONE";
    case RunType.API:
      return "API";
    case RunType.WEBSITE:
      return "WEBSITE";
    case RunType.REDIS:
      return "REDIS";
    case RunType.MYSQL:
      return "MYSQL";
    case RunType.MONGODB:
      return "MONGODB";
    case RunType.POSTGRES:
      return "POSTGRES";
    case RunType.NEO4J:
      return "NEO4J";
    case RunType.MSSQL:
      return "MSSQL";
    case RunType.GRAPHQL:
      return "GRAPHQL";
    case RunType.ELASTICSEARCH:
      return "ELASTICSEARCH";
    case RunType.WEBSOCKETS:
      return "WEBSOCKETS";
    case RunType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum RunShape {
  CONSTANT = 0,
  SHAPED = 1,
  RAMP = 2,
  UNRECOGNIZED = -1,
}

export function runShapeFromJSON(object: any): RunShape {
  switch (object) {
    case 0:
    case "CONSTANT":
      return RunShape.CONSTANT;
    case 1:
    case "SHAPED":
      return RunShape.SHAPED;
    case 2:
    case "RAMP":
      return RunShape.RAMP;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RunShape.UNRECOGNIZED;
  }
}

export function runShapeToJSON(object: RunShape): string {
  switch (object) {
    case RunShape.CONSTANT:
      return "CONSTANT";
    case RunShape.SHAPED:
      return "SHAPED";
    case RunShape.RAMP:
      return "RAMP";
    case RunShape.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface RunConfiguration {
  rps: number;
  durationInSeconds: number;
  shape: RunShape;
}

export interface RunDocument {
  /** Unique ID string */
  uniqueId: string;
  title: string;
  type: RunType;
  configuration: RunConfiguration | undefined;
  apiSteps: ApiStep[];
}

function createBaseRunConfiguration(): RunConfiguration {
  return { rps: 0, durationInSeconds: 0, shape: 0 };
}

export const RunConfiguration = {
  encode(message: RunConfiguration, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rps !== 0) {
      writer.uint32(8).int32(message.rps);
    }
    if (message.durationInSeconds !== 0) {
      writer.uint32(16).int32(message.durationInSeconds);
    }
    if (message.shape !== 0) {
      writer.uint32(24).int32(message.shape);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RunConfiguration {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRunConfiguration();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.rps = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.durationInSeconds = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.shape = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RunConfiguration {
    return {
      rps: isSet(object.rps) ? globalThis.Number(object.rps) : 0,
      durationInSeconds: isSet(object.durationInSeconds) ? globalThis.Number(object.durationInSeconds) : 0,
      shape: isSet(object.shape) ? runShapeFromJSON(object.shape) : 0,
    };
  },

  toJSON(message: RunConfiguration): unknown {
    const obj: any = {};
    if (message.rps !== 0) {
      obj.rps = Math.round(message.rps);
    }
    if (message.durationInSeconds !== 0) {
      obj.durationInSeconds = Math.round(message.durationInSeconds);
    }
    if (message.shape !== 0) {
      obj.shape = runShapeToJSON(message.shape);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RunConfiguration>, I>>(base?: I): RunConfiguration {
    return RunConfiguration.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RunConfiguration>, I>>(object: I): RunConfiguration {
    const message = createBaseRunConfiguration();
    message.rps = object.rps ?? 0;
    message.durationInSeconds = object.durationInSeconds ?? 0;
    message.shape = object.shape ?? 0;
    return message;
  },
};

function createBaseRunDocument(): RunDocument {
  return { uniqueId: "", title: "", type: 0, configuration: undefined, apiSteps: [] };
}

export const RunDocument = {
  encode(message: RunDocument, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.uniqueId !== "") {
      writer.uint32(10).string(message.uniqueId);
    }
    if (message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    if (message.type !== 0) {
      writer.uint32(24).int32(message.type);
    }
    if (message.configuration !== undefined) {
      RunConfiguration.encode(message.configuration, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.apiSteps) {
      ApiStep.encode(v!, writer.uint32(170).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RunDocument {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRunDocument();
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

          message.title = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.configuration = RunConfiguration.decode(reader, reader.uint32());
          continue;
        case 21:
          if (tag !== 170) {
            break;
          }

          message.apiSteps.push(ApiStep.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RunDocument {
    return {
      uniqueId: isSet(object.uniqueId) ? globalThis.String(object.uniqueId) : "",
      title: isSet(object.title) ? globalThis.String(object.title) : "",
      type: isSet(object.type) ? runTypeFromJSON(object.type) : 0,
      configuration: isSet(object.configuration) ? RunConfiguration.fromJSON(object.configuration) : undefined,
      apiSteps: globalThis.Array.isArray(object?.apiSteps) ? object.apiSteps.map((e: any) => ApiStep.fromJSON(e)) : [],
    };
  },

  toJSON(message: RunDocument): unknown {
    const obj: any = {};
    if (message.uniqueId !== "") {
      obj.uniqueId = message.uniqueId;
    }
    if (message.title !== "") {
      obj.title = message.title;
    }
    if (message.type !== 0) {
      obj.type = runTypeToJSON(message.type);
    }
    if (message.configuration !== undefined) {
      obj.configuration = RunConfiguration.toJSON(message.configuration);
    }
    if (message.apiSteps?.length) {
      obj.apiSteps = message.apiSteps.map((e) => ApiStep.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RunDocument>, I>>(base?: I): RunDocument {
    return RunDocument.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RunDocument>, I>>(object: I): RunDocument {
    const message = createBaseRunDocument();
    message.uniqueId = object.uniqueId ?? "";
    message.title = object.title ?? "";
    message.type = object.type ?? 0;
    message.configuration = (object.configuration !== undefined && object.configuration !== null)
      ? RunConfiguration.fromPartial(object.configuration)
      : undefined;
    message.apiSteps = object.apiSteps?.map((e) => ApiStep.fromPartial(e)) || [];
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
