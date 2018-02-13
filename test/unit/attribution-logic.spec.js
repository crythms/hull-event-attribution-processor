const { createTraitsFromEvent } = require("../../server/custom/attribution-logic");
// const { getClientMock } = require("../support/hull-mock");

describe("createTraitsFromEvent", () => {
  test("should create attributes for event 'Signed Up' initial", () => {
    const eventData = {
      id: "abkbiuegwlh",
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Signed Up",
      source: "segment",
      context: {
        days_since_signup: 0
      },
      properties: {
        email: "lsdvincent@gmail.com",
        type: "ORGANIC"
      }
    };

    const expected = {
      lead_source: "PQL",
      lead_source_detail: "ORGANIC",
      lead_source_timestamp: "2018-02-10T09:38:48+00:00"
    };

    const traitsInitial = createTraitsFromEvent(eventData);

    expect(traitsInitial).toEqual(expected);
  });

  test("should create attributes for event 'Signed Up' last", () => {
    const eventData = {
      id: "abkbiuegwlh",
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Signed Up",
      source: "segment",
      context: {
        days_since_signup: 0
      },
      properties: {
        email: "lsdvincent@gmail.com",
        type: "ORGANIC"
      }
    };

    const expected = {
      last_lead_source: "PQL",
      last_lead_source_detail: "ORGANIC",
      last_lead_source_timestamp: "2018-02-10T09:38:48+00:00"
    };

    const traitsInitial = createTraitsFromEvent(eventData, "last_");

    expect(traitsInitial).toEqual(expected);
  });
});
