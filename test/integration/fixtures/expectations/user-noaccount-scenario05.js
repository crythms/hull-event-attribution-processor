
module.exports = (ctxMock) => {
  const expectedTraits = {
    lead_source: "PQL",
    lead_source_detail: "ORGANIC",
    lead_source_timestamp: "2018-02-20T20:52:24Z",
    last_lead_source: "PQL",
    last_lead_source_detail: "ORGANIC",
    last_lead_source_timestamp: "2018-02-20T20:52:25Z"
  };

  expect(ctxMock.client.logger.info.mock.calls).toHaveLength(1);

  expect(ctxMock.client.logger.info.mock.calls[0])
    .toEqual([
      "incoming.user.success",
      {
        data: expectedTraits
      }
    ]);

  expect(ctxMock.metric.increment.mock.calls).toHaveLength(1);
  expect(ctxMock.metric.increment.mock.calls[0])
    .toEqual(["ship.hull_api.search_events", 1]);
};
