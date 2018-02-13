// @flow
import type { THullObject } from "hull";
import type { IEventSearchResult } from "../types";

const Promise = require("bluebird");

class SearchUtil {
  hullClient: Object;

  constructor(hull: Object) {
    this.hullClient = hull;
  }

  searchEvents(user: THullObject, events: Array<string>): Promise<IEventSearchResult> {
    // TODO: Implement pagination
    const params = {
      raw: true,
      limit: 500, // MAX for the moment
      query: {
        and: [
          { term: { _parent: user.id } },
          { terms: { event: events } }
        ]
      }
    };
    return this.hullClient.post("search/events", params).then((res: any) => {
      return { user, events: res.data };
    });
  }
}

module.exports = SearchUtil;
