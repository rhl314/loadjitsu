import React, { createContext } from "react";

export interface IAccountState {
  licenseKey?: string;
  licenseStatus: "VALID" | "INVALID" | "NOT_AVAILABLE";
  state: "IDLE" | "LOADING" | "SAVING" | "ERROR" | "PROCESSING" | "READY";
  errors: Record<string, string>;
}

export function accountReducer(
  state: IAccountState,
  update: Partial<IAccountState>
) {
  const newState = {
    ...state,
    ...update,
  };
  return newState;
}

export const INITIAL_ACCOUNT_STATE: IAccountState = {
  state: "LOADING",
  licenseStatus: "NOT_AVAILABLE",
  errors: {},
};

export interface IAccountAppContext {
  state: IAccountState;
  dispatch: React.Dispatch<Partial<IAccountState>>;
}

export const AccountAppContext = createContext<IAccountAppContext>({
  state: INITIAL_ACCOUNT_STATE,
  dispatch: () => undefined,
});
