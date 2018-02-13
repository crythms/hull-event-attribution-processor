/* @flow */
import type { $Request, $Response } from "express";

const _ = require("lodash");

function statusCheckAction(req: $Request, res: $Response): void {
  if (_.has(req, "hull.ship.private_settings")) {
    const { ship = {}, client = {} } = (req: any).hull;
    const messages: Array<string> = [];
    let status: string = "ok";

    if (_.isEmpty(_.get(ship, "private_settings.whitelisted_events", []))) {
      status = "error";
      messages.push("No user or account will be processed because the list of events is empty.");
    }

    res.json({ status, messages });
    client.put(`${ship.id}/status`, { status, messages });
    return;
  }

  res.status(404).json({ status: 404, messages: ["Request doesn't contain data about the connector"] });
}

module.exports = statusCheckAction;
