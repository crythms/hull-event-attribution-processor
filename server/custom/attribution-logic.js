// @flow
import type { IEventSearchResult } from "../lib/types";

const _ = require("lodash");

function transformRawEvent(rawData: any): any {
  const evtObj = _.pick(rawData, ["indexed_at", "created_at", "event", "source", "session_id", "type", "context"]);
  _.set(evtObj, "id", _.get(rawData, "_id"));
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

  if (eventData.event === "Signed Up") {
    _.set(traits, `${prefix}lead_source`, "PQL");
    _.set(traits, `${prefix}lead_source_detail`, _.get(eventData, "properties.type", "ORGANIC"));
  } else if (eventData.event === "Email Captured") {
    if (_.get(eventData, "context.page_url", "").indexOf("blog.drift.com") === -1) {
      _.set(traits, `${prefix}lead_source`, "CQL");
    } else {
      _.set(traits, `${prefix}lead_source`, "MQL");
    }
    _.set(traits, `${prefix}lead_source_detail`, _.get(eventData, "context.page_url"));
  } else if (eventData.event === "User created" && eventData.source === "Clearbit") {
    _.set(traits, `${prefix}lead_source`, "Growth");
    _.set(traits, `${prefix}lead_source_detail`, "Anonymous Drift Visit");
  } else if (eventData.event === "Visited G2Crowd Page") {
    _.set(traits, `${prefix}lead_source`, "Growth");
    _.set(traits, `${prefix}lead_source_detail`, "G2Crowd");
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
  // Step 1 - Check if the user has attribution/lead_source set, if not process the first
  //          matching event as the initial attribution
  if (_.get(eventResult.user, "traits_attribution/lead_source", "n/a") === "n/a") {
    // Get the oldest event and process it
    const firstRaw = _.first(sortedEvents);
    const firstEvent = transformRawEvent(firstRaw);

    traitsObj = _.merge(traitsObj, createTraitsFromEvent(firstEvent));
  }

  const asUser = hull.asUser(eventResult.user);

  // Step 2 - Process the last event every time
  const lastRaw = _.last(sortedEvents);
  const lastEvent = transformRawEvent(lastRaw);

  traitsObj = _.merge(traitsObj, createTraitsFromEvent(lastEvent));

  return asUser.traits(traitsObj, { source: "attribution" })
    .then(() => {
      return asUser.logger.info("incoming.user.success", { data: traitsObj });
    });
}

module.exports = { attributionLogic, transformRawEvent, createTraitsFromEvent };
