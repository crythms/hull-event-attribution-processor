const payload = require("./user-noaccount-scenario01.json");

module.exports = (ctxMock) => {
  ctxMock.client.post = jest.fn(() => Promise.resolve(payload));
};
