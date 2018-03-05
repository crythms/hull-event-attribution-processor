/* eslint-disable global-require, import/no-dynamic-require */
const _ = require("lodash");
const { ContextMock } = require("./helper/connector-mock");

const Agent = require("../../server/lib/agent");

describe("Agent", () => {
  let ctxMock;

  beforeEach(() => {
    ctxMock = new ContextMock();
  });

  test("smoke test", () => {
    expect(ctxMock).toBeDefined();
  });

  describe("sendUserMessages", () => {
    const scenariosToRun = [
      "user-noaccount-scenario01",
      "user-noaccount-scenario02",
      "user-noaccount-scenario03",
      "user-noaccount-scenario04",
      "user-noaccount-scenario05"
    ];

    scenariosToRun.forEach((scenarioName) => {
      test(`${scenarioName}`, () => {
        const smartNotifierPayload = require(`./fixtures/smart-notifier-payloads/${scenarioName}`);
        console.log(smartNotifierPayload);
        ctxMock.connector = _.cloneDeep(smartNotifierPayload.connector);
        ctxMock.ship = _.cloneDeep(smartNotifierPayload.connector);

        require("./fixtures/search-events/loader")(ctxMock, scenarioName);

        const agent = new Agent(ctxMock.client, ctxMock.connector, ctxMock.metric);

        return agent.sendUserMessages(smartNotifierPayload.messages)
          .then(() => {
            require(`./fixtures/expectations/${scenarioName}`)(ctxMock);
          });
      });
    });
  });
});
