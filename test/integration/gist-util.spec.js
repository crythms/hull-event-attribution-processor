const nock = require("nock");

const GistUtil = require("../../server/lib/utils/gist-util");

const gistResponse = require("./fixtures/api-responses/gist.json");
const gistVersionResponse = require("./fixtures/api-responses/gist-version.json");
const gistRawResponse = require("./fixtures/api-responses/gist-raw.json");

describe("GistUtil", () => {
  const BASE_URL = "https://api.github.com/gists";

  afterEach(() => {
    nock.cleanAll();
  });

  test("should list version history", () => {
    nock(BASE_URL)
      .get("/aa5a315d61ae9438b18d")
      .reply(200, () => {
        return gistResponse;
      });

    const util = new GistUtil();

    return util.listVersions("aa5a315d61ae9438b18d").then(versions => {
      expect(versions).toEqual(gistResponse.history);
      expect(nock.isDone()).toBe(true);
    });
  });

  test("should return the content of a gist file", () => {
    nock(BASE_URL)
      .get("/aa5a315d61ae9438b18d/57a7f021a713b1c5a6a199b54cc514735d2d462f")
      .reply(200, () => {
        return gistVersionResponse;
      });

    nock("https://gist.githubusercontent.com")
      .get("/raw/365370/8c4d2d43d178df44f4c03a7f2ac0ff512853564e/ring.erl")
      .reply(200, () => {
        return gistRawResponse.content;
      });
    const util = new GistUtil();

    return util.getCodeForVersion("aa5a315d61ae9438b18d", "57a7f021a713b1c5a6a199b54cc514735d2d462f", "ring.erl")
      .then(raw => {
        expect(raw).toEqual("const foo = \"moo\";");
        expect(nock.isDone()).toBe(true);
      });
  });
});
