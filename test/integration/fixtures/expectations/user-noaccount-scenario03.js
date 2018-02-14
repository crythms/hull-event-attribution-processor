
module.exports = (ctxMock) => {
  expect(ctxMock.client.logger.info.mock.calls).toHaveLength(0);

  expect(ctxMock.metric.increment.mock.calls).toHaveLength(0);
};
