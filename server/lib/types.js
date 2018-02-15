// @flow
import type { THullObject } from "hull";

export interface IEventSearchResult {
  user: THullObject;
  events: Array<Object>
}

export interface IGistHistoryLog {
  url: string;
  version: string;
  user: any;
  change_status: any;
  committed_at: string;
}
