// @flow
const _ = require("lodash");

class FilterUtil {
  whitelistedEvents: Array<string>

  constructor(privateSettings: Object) {
    this.whitelistedEvents = _.get(privateSettings, "whitelisted_events", []);
  }

  filterMessagesWithEvents(messages: Array<Object>): Array<Object> {
    // Check for User created event
    const includeUserCreated = _.includes(this.whitelistedEvents, "User created");

    const filteredMessages = _.filter(messages, m => {
      if (includeUserCreated && _.get(m, "changes.is_new", false) === true) {
        return true;
      }
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
