// @flow
import type { IEventSearchResult } from "../lib/types";

function attributionLogic(hull: Object, eventResult: IEventSearchResult): Promise<any> {
  // TODO: Perform attribution logic here until the next revision
  // Working idea: Pull gist in that is performed in sandbox the allow versioning.
  console.log(eventResult);
  return Promise.resolve(eventResult);
}

module.exports = attributionLogic;
