/* eslint-disable global-require, import/no-dynamic-require */
module.exports = (ctxMock, scenarioName) => {
  const payload = require(`./${scenarioName}.json`);
  ctxMock.client.post = jest.fn(() => Promise.resolve(payload));
};
