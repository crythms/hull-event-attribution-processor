// @flow
import type { IGistHistoryLog } from "../types";

const _ = require("lodash");
const Promise = require("bluebird");
const request = require("request");

const BASE_API = "https://api.github.com/gists";

class GistUtil {
  listVersions(id: string): Promise<Array<IGistHistoryLog>> {
    return new Promise((resolve, reject) => {
      const opts = {
        url: `${BASE_API}/${id}`,
        method: "GET",
        headers: {
          "user-agent": "Hull Node Client"
        }
      };

      request(opts, (err, res) => {
        if (err) {
          return reject(err);
        }

        let gistData = res.body;
        console.log(res.body);
        if (_.isString(res.body)) {
          gistData = JSON.parse(res.body);
        }

        return resolve(gistData.history);
      });
    });
  }

  getCodeForVersion(id: string, sha: string, file: string): Promise<string> {
    const opts = {
      url: `${BASE_API}/${id}/${sha}`,
      method: "GET"
    };

    return new Promise((resolve, reject) => {
      request(opts, (err, res) => { // eslint-disable-line consistent-return
        if (err) {
          return reject(err);
        }

        let gistData = res.body;

        if (_.isString(res.body)) {
          gistData = JSON.parse(res.body);
        }

        const rawUrl = gistData.files[file].raw_url;

        console.log(gistData, rawUrl);

        const rawOpts = {
          url: rawUrl,
          method: "GET"
        };

        request(rawOpts, (errRaw, resRaw) => {
          if (errRaw) {
            return reject(errRaw);
          }

          return resolve(resRaw.body);
        });
      });
    });
  }
}

module.exports = GistUtil;
