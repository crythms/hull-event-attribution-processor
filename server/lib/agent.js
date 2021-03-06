// @flow
import type { THullUserUpdateMessage } from "hull";
import type { IEventSearchResult } from "./types";

const _ = require("lodash");
const Promise = require("bluebird");

const FilterUtil = require("./utils/filter-util");
const SearchUtil = require("./utils/search-util");
const { attributionLogic } = require("../custom/attribution-logic");

class Agent {
  hullClient: Object;
  metricsClient: Object;
  filterUtil: FilterUtil;
  searchUtil: SearchUtil;
  whitelistedEvents: Array<string>;

  constructor(client: Object, connector: Object, metric: Object) {
    this.hullClient = client;
    this.metricsClient = metric;
    this.filterUtil = new FilterUtil(connector.private_settings);
    this.searchUtil = new SearchUtil(client, metric);
    this.whitelistedEvents = _.get(connector, "private_settings.whitelisted_events", []);
  }

  sendUserMessages(messages: Array<THullUserUpdateMessage>, isBatch: boolean = false): Promise<any> {
    const filteredMessages = isBatch ? messages : this.filterUtil.filterMessagesWithEvents(messages);
    const self = this;

    _.forEach(messages, (m) => {
      try {
        this.hullClient.asUser(m.user)
          .logger.debug("incoming.user.start", { events: _.map(m.events, "event"), is_new: _.get(m, "changes.is_new") });
      } catch (error) {
        // don't ever fail on a log call
      }
    });
    // Return immediately, if no messages have whitelisted events
    if (!filteredMessages || filteredMessages.length === 0) {
      return Promise.resolve([]);
    }

    return Promise.map(filteredMessages, (m) => {
      return this.searchUtil.searchEvents(m.user, m.account, self.whitelistedEvents);
    }, { concurrency: parseInt(process.env.SEARCH_OPERATION_CONCURRENCY, 10) || 1 })
      .then((res: Array<IEventSearchResult>) => {
        return Promise.map(res, (searchResult: IEventSearchResult) => {
          return attributionLogic(self.hullClient, searchResult);
        }, { concurrency: 5 }); // TODO: Check if we wanna control via env variable
      });
  }
}

module.exports = Agent;
