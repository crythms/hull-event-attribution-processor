// @flow
const _ = require("lodash");

class FilterUtil {
  whitelistedEvents: Array<string>

  constructor(privateSettings: Object) {
    this.whitelistedEvents = _.get(privateSettings, "whitelisted_events", []);
  }

  filterMessagesWithEvents(messages: Array<Object>): Array<Object> {
    // TODO: Filter messages
    const filteredMessages = _.filter(messages, m => {
      const messageEvents = _.get(m, "events", []);
      if (messageEvents.length > 0) {
        const matches = _.some(messageEvents, e => _.includes(this.whitelistedEvents, e.event));
        return matches;
      }
      return false;
    });

    return filteredMessages;
  }
}

module.exports = FilterUtil;
