// @flow
import type { THullObject } from "hull";

export interface IEventSearchResult {
  user: THullObject;
  account: any;
  events: Array<Object>
}

export interface IGistHistoryLog {
  url: string;
  version: string;
  user: any;
  change_status: any;
  committed_at: string;
}

export interface ISandboxConsole {
  log(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  debug(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
}

export interface ISandbox {
  errors: Array<any>;
  logs: Array<any>;
  logsForLogger: Array<any>;
  console?: ISandboxConsole;
  results: Array<any>;
}
