
module.exports = (ctxMock) => {
  const expectedTraits = {
    lead_source: "Growth",
    lead_source_detail: "G2Crowd",
    lead_source_timestamp: "2018-01-21T19:28:55+00:00",
    last_lead_source: "Growth",
    last_lead_source_detail: "G2Crowd",
    last_lead_source_timestamp: "2018-01-21T19:28:55+00:00"
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
