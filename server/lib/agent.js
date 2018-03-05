// @flow
import type { THullUserUpdateMessage } from "hull";
import type { IEventSearchResult, ISandbox } from "./types";

const _ = require("lodash");
const Promise = require("bluebird");
const vm = require("vm");
const deepFreeze = require("deep-freeze");

const FilterUtil = require("./utils/filter-util");
const SearchUtil = require("./utils/search-util");
// const { attributionLogic } = require("../custom/attribution-logic");
const applyUtils = require("./utils/sandbox-util");

class Agent {
  connector: any;
  hullClient: any;
  metricsClient: any;
  filterUtil: FilterUtil;
  searchUtil: SearchUtil;
  whitelistedEvents: Array<string>;
  sandbox: ISandbox;

  constructor(client: any, connector: any, metric: any) {
    this.hullClient = client;
    this.metricsClient = metric;
    this.filterUtil = new FilterUtil(connector.private_settings);
    this.searchUtil = new SearchUtil(client, metric);
    this.whitelistedEvents = _.get(connector, "private_settings.whitelisted_events", []);
    this.sandbox = {
      hull: deepFreeze(client),
      _,
      results: [],
      errors: [],
      logs: [],
      logsForLogger: []
    };
    this.sandbox = applyUtils(this.sandbox);
    this.connector = connector;
    vm.createContext(this.sandbox);
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
        console.log(">>> Search Results", res);
        return Promise.map(res, (searchResult: IEventSearchResult) => {
          _.set(this.sandbox, "data", null); // ensure we reset the data
          _.set(this.sandbox, "data", searchResult);
          const code = _.get(this.connector, "private_settings.gist_code", "Promise.resolve();");
          const script = new vm.Script(`
            try {
              results.push(function() {
                "use strict";
                ${code}
              })();
            } catch(err) {
              const msg = err.toString();
              errors.push(msg);
              console.error("outgoing.user.error", { error: msg });
            }
          `, {});
          script.runInContext((self.sandbox: any));

          const promises = self.sandbox.results.map(p => Promise.resolve(p).timeout(10000));

          return Promise.all(promises)
            .then(() => {
              // Make sure we log all the stuff here
              return {
                user: searchResult.user,
                account: searchResult.account,
                logs: self.sandbox.logs,
                logsForLogger: self.sandbox.logsForLogger,
                errors: self.sandbox.errors
              };
            });

          // return attributionLogic(self.hullClient, searchResult);
        }, { concurrency: 5 }).then(({
          user, account, logs, logsForLogger, errors
        }) => {
          // this.hullClient.asUser(user)
          //   .logger.info("incoming.user.success", { message: "TBD" });
          console.log(user, account, logs, logsForLogger, errors);
        }); // TODO: Check if we wanna control via env variable
      });
  }
}

module.exports = Agent;
