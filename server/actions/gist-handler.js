/* @flow */
import type { $Request, $Response } from "express";

const GistUtil = require("../lib/utils/gist-util");

function gistHandler(req: $Request, res: $Response) {
  const { v } = req.params || {};
  console.log((req: any).hull);
  const helpers = (req: any).hull.helpers; // eslint-disable-line prefer-destructuring
  const { gist_id } = (req: any).hull.ship.private_settings;

  const gistUtil = new GistUtil();

  return gistUtil.getCodeForVersion(gist_id, v, "index.js").then(c => {
    helpers.updateSettings({
      gist_code: c,
      gist_version: v
    });

    return res.json({ ok: true });
  });
}

module.exports = gistHandler;
