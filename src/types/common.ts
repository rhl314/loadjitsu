export interface IRunFile {
  path: string;
}

export enum EnumVariableType {
  UUID = "UUID",
  RANDOM_NUMBER = "RANDOM_NUMBER",
  RANDOM_STRING = "RANDOM_STRING",
  FROM_LIST = "FROM_LIST",
  RANDOM_FROM_LIST = "RANDOM_FROM_LIST",
}

export interface IRunVariable {
  type: EnumVariableType;
  name: string;
  randomNumberRange: {
    start: number;
    end: number;
  };
}
