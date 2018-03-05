/* eslint-disable global-require, import/no-dynamic-require */
const Promise = require("bluebird");

module.exports = (ctxMock, scenarioName) => {
  const payload = require(`./${scenarioName}.json`);
  // const postCallback = jest.fn((ops, params) => {
  //   console.log(`[POST] ${ops}`, params);
  //   return Promise.resolve(payload);
  // });
  // ctxMock.client.post = postCallback;
  console.log(">>> CLIENT", ctxMock.client.asUser());
  ctxMock.client.post = () => Promise.resolve(payload);
};
