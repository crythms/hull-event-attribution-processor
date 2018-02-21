/* eslint-disable global-require, import/no-dynamic-require */
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
        const smartNotifierPayload = require(`./fixtures/smart-notifier-payloads/${scenarioName}.json`);

        ctxMock.connector = smartNotifierPayload.connector;
        ctxMock.ship = smartNotifierPayload.connector;

        const agent = new Agent(ctxMock.client, ctxMock.connector, ctxMock.metric);

        require("./fixtures/search-events/loader")(ctxMock, scenarioName);

        return agent.sendUserMessages(smartNotifierPayload.messages)
          .then(() => {
            require(`./fixtures/expectations/${scenarioName}`)(ctxMock);
          });
      });
    });
  });
});
