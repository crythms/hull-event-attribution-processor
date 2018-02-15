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
