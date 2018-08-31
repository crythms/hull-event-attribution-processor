// @flow
import type { IEventSearchResult } from "../lib/types";

const _ = require("lodash");

function transformRawEvent(rawData: any): any {
  if (!rawData) {
    return {};
  }
  const evtObj = _.pick(rawData, ["indexed_at", "created_at", "event", "source", "session_id", "type", "context"]);
  _.set(evtObj, "id", _.get(rawData, "_id"));

  if (!rawData.props) {
    return evtObj;
  }

  // Transform props
  _.forEach(rawData.props, prop => {
    if (_.has(prop, "date_value")) {
      _.set(evtObj, `properties.${prop.field_name}`, _.get(prop, "date_value", null));
    } else if (_.has(prop, "num_value")) {
      _.set(evtObj, `properties.${prop.field_name}`, _.get(prop, "num_value", 0));
    } else if (_.has(prop, "bool_value")) {
      _.set(evtObj, `properties.${prop.field_name}`, _.get(prop, "bool_value", null));
    } else {
      _.set(evtObj, `properties.${prop.field_name}`, _.get(prop, "text_value", ""));
    }
  });
  return evtObj;
}

function createTraitsFromEvent(eventData: any, prefix: string = ""): any {
  const traits = {};

  if (!eventData) {
    return traits;
  }

  if (eventData.event === "Signed Up") {
    const route = _.get(eventData, "properties.route") ? _.get(eventData, "properties.route").split("?")[0] : "ORGANIC";
    if (route.indexOf("app.drift.com/white-glove") !== -1) {
      _.set(traits, `${prefix}lead_source`, "Other");
      _.set(traits, `${prefix}lead_source_detail`, "Deal Link");
    } else {
      _.set(traits, `${prefix}lead_source`, "PQL");
      if (_.get(eventData, "properties.type") === "INVITE") {
        _.set(traits, `${prefix}lead_source_detail`, "INVITE");
      } else if (route.indexOf("drift.com/sales") !== -1) {
        _.set(traits, `${prefix}lead_source_detail`, "Drift.com/sales");
      } else if (route.indexOf("drift.com/university") !== -1) {
        _.set(traits, `${prefix}lead_source`, "CMU");
        _.set(traits, `${prefix}lead_source_detail`, "drift.com/university");
      } else {
        _.set(traits, `${prefix}lead_source_detail`, route);
      }
    }
  } else if (_.get(eventData, "properties.isTestDrive")) {
    const pageUrl = _.get(eventData, "context.page_url", "").split("?")[0];
    _.set(traits, `${prefix}lead_source`, "Test Drive");
    _.set(traits, `${prefix}lead_source_detail`, pageUrl);
  } else if (eventData.event === "Email Captured") {
    const pageUrl = (_.get(eventData, "properties.route", "") || _.get(eventData, "context.page_url", "")).split("?")[0];
    if (pageUrl.indexOf("drift.com/webinars") !== -1) {
      _.set(traits, `${prefix}lead_source`, "Webinar");
      _.set(traits, `${prefix}lead_source_detail`, pageUrl);
    } else if (pageUrl.indexOf("drift.com/video") !== -1) {
      _.set(traits, `${prefix}lead_source`, "Content");
      _.set(traits, `${prefix}lead_source_detail`, "Drift Video Subscription");
    } else if (pageUrl.indexOf("drift.com/coffee") !== -1) {
      _.set(traits, `${prefix}lead_source`, "Content");
      _.set(traits, `${prefix}lead_source_detail`, "Drift Video Subscription");
    } else if (pageUrl.indexOf("drift.com/blog") !== -1) {
      _.set(traits, `${prefix}lead_source`, "MQL");
      _.set(traits, `${prefix}lead_source_detail`, pageUrl);
    } else if (pageUrl.indexOf("drift.com/startups") !== -1) {
      _.set(traits, `${prefix}lead_source`, "CQL");
      _.set(traits, `${prefix}lead_source_detail`, "Startup Program");
    } else if (pageUrl.indexOf("getmyresponsetime") !== -1) {
      _.set(traits, `${prefix}lead_source`, "Growth");
      _.set(traits, `${prefix}lead_source_detail`, "Secret Shopper");
    } else if (pageUrl.indexOf("drift.com/testdrive") !== -1) {
      _.set(traits, `${prefix}lead_source`, "Test Drive");
      _.set(traits, `${prefix}lead_source_detail`, pageUrl);
    } else if (pageUrl.indexOf("drift.com/unscalable") !== -1) {
      _.set(traits, `${prefix}lead_source`, "Content");
      _.set(traits, `${prefix}lead_source_detail`, "Unscalable Book");
    } else if (pageUrl.indexOf("drift.com/summit") !== -1) {
      _.set(traits, `${prefix}lead_source`, "Webinar");
      _.set(traits, `${prefix}lead_source_detail`, "Conversational Marketing Summit 2018");
    } else {
      _.set(traits, `${prefix}lead_source`, "CQL");
      _.set(traits, `${prefix}lead_source_detail`, pageUrl);
    }
  } else if (eventData.event === "User created" && eventData.source === "Clearbit") {
    _.set(traits, `${prefix}lead_source`, "Growth");
    _.set(traits, `${prefix}lead_source_detail`, "Anonymous Drift Visit");
  } else if (eventData.event === "Visited G2Crowd Page") {
    _.set(traits, `${prefix}lead_source`, "Growth");
    _.set(traits, `${prefix}lead_source_detail`, "G2Crowd");
  } else {
    return traits;
  }

  // Always set the timestamp
  _.set(traits, `${prefix}lead_source_timestamp`, eventData.created_at);

  return traits;
}

function attributionLogic(hull: Object, eventResult: IEventSearchResult): Promise<any> {
  // TODO: Perform attribution logic here until the next revision
  // Working idea: Pull gist in that is performed in sandbox the allow versioning.
  const sortedEvents = _.sortBy(eventResult.events, ["created_at"]);
  let traitsObj = {};
  let accountTraitsObj = {};
  // Step 1 - Check if the user has attribution/lead_source set, if not process the first
  //          matching event as the initial attribution
  if (_.get(eventResult.user, "traits_attribution/lead_source", "n/a") === "n/a") {
    // Get the oldest event and process it
    let firstRaw = _.first(sortedEvents);
    let firstEvent = transformRawEvent(firstRaw);

    let eventTraits = createTraitsFromEvent(firstEvent);

    let eventIndex = 0;

    while (_.keys(eventTraits).length === 0 && eventIndex < sortedEvents.length) {
      eventIndex += 1;
      firstRaw = _.nth(sortedEvents, eventIndex);
      firstEvent = transformRawEvent(firstRaw);
      eventTraits = createTraitsFromEvent(firstEvent);
    }

    traitsObj = _.merge(traitsObj, eventTraits);

    // Check if the user is linked with an account and if this account
    // has attribution/lead_source set, if not assign the same attribution as for
    // the user
    if (eventResult.account.id && _.get(eventResult.account, "attribution/lead_source", "n/a") === "n/a") {
      accountTraitsObj = _.merge(accountTraitsObj, eventTraits);
    }
  }

  const asUser = hull.asUser(eventResult.user);

  // Step 2 - Process the last event every time
  let lastRaw = _.last(sortedEvents);
  let lastEvent = transformRawEvent(lastRaw);
  let lastEventTraits = createTraitsFromEvent(lastEvent, "last_");

  let lastEventIndex = 0;

  while (_.keys(lastEventTraits).length === 0 && Math.abs(lastEventIndex) <= sortedEvents.length) {
    lastEventIndex -= 1;
    lastRaw = _.nth(sortedEvents, lastEventIndex);
    lastEvent = transformRawEvent(lastRaw);
    lastEventTraits = createTraitsFromEvent(lastEvent, "last_");
  }

  traitsObj = _.merge(traitsObj, lastEventTraits);

  if (eventResult.account.id) {
    if (_.get(eventResult.account, "attribution/last_lead_source_timestamp", "1900-01-01T00:00:00Z") < _.get(lastEventTraits, "last_lead_source_timestamp")) {
      accountTraitsObj = _.merge(accountTraitsObj, lastEventTraits);
    }
  }

  return asUser.traits(traitsObj, { source: "attribution" })
    .then(() => {
      if (eventResult.account.id && _.keys(accountTraitsObj).length > 0) {
        asUser.logger.info("incoming.user.success", { data: traitsObj });
        const asAccount = hull.asAccount(eventResult.account);
        return asAccount.traits(accountTraitsObj, { source: "attribution" }).then(() => {
          return asAccount.logger.info("incoming.account.success", { data: accountTraitsObj });
        });
      }
      return asUser.logger.info("incoming.user.success", { data: traitsObj });
    });
}

module.exports = { attributionLogic, transformRawEvent, createTraitsFromEvent };
