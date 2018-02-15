/* @flow */
import type { $Request, $Response } from "express";

const _ = require("lodash");
const GistUtil = require("../lib/utils/gist-util");

function adminHandler(req: $Request, res: $Response) {
  const { gist_id } = (req: any).hull.ship.private_settings;
  const versions = [];

  const gistUtil = new GistUtil();

  if (gist_id && gist_id.length && gist_id.length > 2) {
    gistUtil.listVersions(gist_id).then(vers => {
      res.render("home.html", {
        name: "Event Attribution Processor",
        versions: vers,
        _
      });
    });
  } else {
    res.render("home.html", {
      name: "Event Attribution Processor",
      versions,
      _
    });
  }
}

module.exports = adminHandler;
