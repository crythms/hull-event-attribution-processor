// @flow
import type { THullObject } from "hull";
import type { IEventSearchResult } from "../types";

const Promise = require("bluebird");

class SearchUtil {
  hullClient: Object;
  metricsClient: Object;

  constructor(hull: Object, metric: Object) {
    this.hullClient = hull;
    this.metricsClient = metric;
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

    this.metricsClient.increment("ship.hull_api.search_events", 1);
    return this.hullClient.post("search/events", params).then((res: any) => {
      return { user, events: res.data };
    });
  }
}

module.exports = SearchUtil;
