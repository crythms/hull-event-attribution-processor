const { transformRawEvent, createTraitsFromEvent } = require("../../server/custom/attribution-logic");
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
        email: "somebody12345@hull.io",
        type: "ORGANIC"
      }
    };

    const expected = {
      lead_source: "PQL",
      lead_source_detail: "ORGANIC",
      lead_source_timestamp: "2018-02-10T09:38:48+00:00"
    };

    const traits = createTraitsFromEvent(eventData);

    expect(traits).toEqual(expected);
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
        email: "somebody12345@hull.io",
        type: "ORGANIC"
      }
    };

    const expected = {
      last_lead_source: "PQL",
      last_lead_source_detail: "ORGANIC",
      last_lead_source_timestamp: "2018-02-10T09:38:48+00:00"
    };

    const traits = createTraitsFromEvent(eventData, "last_");

    expect(traits).toEqual(expected);
  });

  test("should create attributes for event 'Email Captured [from Blog]' initial ", () => {
    const eventData = {
      id: "abkbiuegwlh",
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Email Captured",
      source: "segment",
      context: {
        days_since_signup: 0,
        page_url: "https://blog.drift.com/test-blog"
      },
      properties: {
        email_value: "marceloliveira@beyondcontrol.com"
      }
    };

    const expected = {
      lead_source: "MQL",
      lead_source_detail: eventData.context.page_url,
      lead_source_timestamp: "2018-02-10T09:38:48+00:00"
    };

    const traits = createTraitsFromEvent(eventData);

    expect(traits).toEqual(expected);
  });

  test("should create attributes for event 'Email Captured [from Blog]' last ", () => {
    const eventData = {
      id: "abkbiuegwlh",
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Email Captured",
      source: "segment",
      context: {
        days_since_signup: 0,
        page_url: "https://blog.drift.com/test-blog"
      },
      properties: {
        email_value: "marceloliveira@beyondcontrol.com"
      }
    };

    const expected = {
      last_lead_source: "MQL",
      last_lead_source_detail: eventData.context.page_url,
      last_lead_source_timestamp: "2018-02-10T09:38:48+00:00"
    };

    const traits = createTraitsFromEvent(eventData, "last_");

    expect(traits).toEqual(expected);
  });

  test("should create attributes for event 'Email Captured [Not From Blog]' initial ", () => {
    const eventData = {
      id: "abkbiuegwlh",
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Email Captured",
      source: "segment",
      context: {
        days_since_signup: 0,
        page_url: "https://drift.com/pricing"
      },
      properties: {
        email_value: "marceloliveira@beyondcontrol.com"
      }
    };

    const expected = {
      lead_source: "CQL",
      lead_source_detail: eventData.context.page_url,
      lead_source_timestamp: "2018-02-10T09:38:48+00:00"
    };

    const traits = createTraitsFromEvent(eventData);

    expect(traits).toEqual(expected);
  });

  test("should create attributes for event 'Email Captured [Not From Blog]' last ", () => {
    const eventData = {
      id: "abkbiuegwlh",
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Email Captured",
      source: "segment",
      context: {
        days_since_signup: 0,
        page_url: "https://drift.com/pricing"
      },
      properties: {
        email_value: "marceloliveira@beyondcontrol.com"
      }
    };

    const expected = {
      last_lead_source: "CQL",
      last_lead_source_detail: eventData.context.page_url,
      last_lead_source_timestamp: "2018-02-10T09:38:48+00:00"
    };

    const traits = createTraitsFromEvent(eventData, "last_");

    expect(traits).toEqual(expected);
  });

  test("should create attributes for event 'User created [Clearbit]' initial", () => {
    const eventData = {
      id: "abkbiuegwlh",
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "User created",
      source: "Clearbit",
      context: {
        days_since_signup: 0
      },
      properties: {
        first_name: "Maximilian",
        last_name: "Rast",
        "clearbit/employment_role": "marketing",
        email: "max.rast@abfall-durm.de"
      }
    };

    const expected = {
      lead_source: "Growth",
      lead_source_detail: "Anonymous Drift Visit",
      lead_source_timestamp: "2018-02-10T09:38:48+00:00"
    };

    const traits = createTraitsFromEvent(eventData);

    expect(traits).toEqual(expected);
  });

  test("should create attributes for event 'User created [Clearbit]' last", () => {
    const eventData = {
      id: "abkbiuegwlh",
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "User created",
      source: "Clearbit",
      context: {
        days_since_signup: 0
      },
      properties: {
        first_name: "Maximilian",
        last_name: "Rast",
        "clearbit/employment_role": "marketing",
        email: "max.rast@abfall-durm.de"
      }
    };

    const expected = {
      last_lead_source: "Growth",
      last_lead_source_detail: "Anonymous Drift Visit",
      last_lead_source_timestamp: "2018-02-10T09:38:48+00:00"
    };

    const traits = createTraitsFromEvent(eventData, "last_");

    expect(traits).toEqual(expected);
  });

  test("should create attributes for event 'Visited G2Crowd Page' initial", () => {
    const eventData = {
      id: "abkbiuegwlh",
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Visited G2Crowd Page",
      source: "segment",
      context: {
        days_since_signup: 0
      },
      properties: {
        country: "Netherlands (NL)",
        organization: "unknown",
        "isp?": false,
        industry: "unknown",
        "first visit": "Your Site",
        "first user visited": "https://www.drift.com/",
        "at time": "February 09, 2018 08:34 AM CST",
        "then user visited": "/compare/drift-vs-intercom",
        "time between events": "19 minutes"
      }
    };

    const expected = {
      lead_source: "Growth",
      lead_source_detail: "G2Crowd",
      lead_source_timestamp: "2018-02-10T09:38:48+00:00"
    };

    const traits = createTraitsFromEvent(eventData);

    expect(traits).toEqual(expected);
  });

  test("should create attributes for event 'Visited G2Crowd Page' last", () => {
    const eventData = {
      id: "abkbiuegwlh",
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Visited G2Crowd Page",
      source: "segment",
      context: {
        days_since_signup: 0
      },
      properties: {
        country: "Netherlands (NL)",
        organization: "unknown",
        "isp?": false,
        industry: "unknown",
        "first visit": "Your Site",
        "first user visited": "https://www.drift.com/",
        "at time": "February 09, 2018 08:34 AM CST",
        "then user visited": "/compare/drift-vs-intercom",
        "time between events": "19 minutes"
      }
    };

    const expected = {
      last_lead_source: "Growth",
      last_lead_source_detail: "G2Crowd",
      last_lead_source_timestamp: "2018-02-10T09:38:48+00:00"
    };

    const traits = createTraitsFromEvent(eventData, "last_");

    expect(traits).toEqual(expected);
  });
});

describe("transformRawEvent", () => {
  test("should transform boolean value properly for raw event", () => {
    const rawData = {
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Free Plan",
      app_id: null,
      app_name: null,
      source: "segment",
      session_id: "426da7bc-b1b3-402e-a570-3f3f7d969da5-2018-02-10",
      type: "track",
      props: [
        {
          field_name: "request_demo",
          bool_value: true,
          text_value: "true"
        }
      ],
      context: { days_since_signup: 0 },
      _id: "2a5559d8-f7b2-4f29-82ca-261d5754d043",
      _type: "event",
      _index: "organization_12345678_user_reports_v2_20180201180839857",
      _score: 1.4142135
    };

    const expected = {
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Free Plan",
      source: "segment",
      session_id: "426da7bc-b1b3-402e-a570-3f3f7d969da5-2018-02-10",
      type: "track",
      properties: {
        request_demo: true
      },
      context: { days_since_signup: 0 },
      id: "2a5559d8-f7b2-4f29-82ca-261d5754d043",
    };

    const actual = transformRawEvent(rawData);

    expect(actual).toEqual(expected);
  });

  test("should transform numeric value properly for raw event", () => {
    const rawData = {
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Free Plan",
      app_id: null,
      app_name: null,
      source: "segment",
      session_id: "426da7bc-b1b3-402e-a570-3f3f7d969da5-2018-02-10",
      type: "track",
      props: [
        {
          field_name: "integrations",
          num_value: 2,
          text_value: "2"
        }
      ],
      context: { days_since_signup: 0 },
      _id: "2a5559d8-f7b2-4f29-82ca-261d5754d043",
      _type: "event",
      _index: "organization_12345678_user_reports_v2_20180201180839857",
      _score: 1.4142135
    };

    const expected = {
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Free Plan",
      source: "segment",
      session_id: "426da7bc-b1b3-402e-a570-3f3f7d969da5-2018-02-10",
      type: "track",
      properties: {
        integrations: 2
      },
      context: { days_since_signup: 0 },
      id: "2a5559d8-f7b2-4f29-82ca-261d5754d043",
    };

    const actual = transformRawEvent(rawData);

    expect(actual).toEqual(expected);
  });

  test("should transform date value properly for raw event", () => {
    const rawData = {
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Free Plan",
      app_id: null,
      app_name: null,
      source: "segment",
      session_id: "426da7bc-b1b3-402e-a570-3f3f7d969da5-2018-02-10",
      type: "track",
      props: [
        {
          field_name: "clearbit/fetched_at",
          num_value: 1518170359,
          date_value: "2018-02-09T09:59:19Z",
          text_value: "2018-02-09T09:59:19.328Z"
        }
      ],
      context: { days_since_signup: 0 },
      _id: "2a5559d8-f7b2-4f29-82ca-261d5754d043",
      _type: "event",
      _index: "organization_12345678_user_reports_v2_20180201180839857",
      _score: 1.4142135
    };

    const expected = {
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Free Plan",
      source: "segment",
      session_id: "426da7bc-b1b3-402e-a570-3f3f7d969da5-2018-02-10",
      type: "track",
      properties: {
        "clearbit/fetched_at": "2018-02-09T09:59:19Z"
      },
      context: { days_since_signup: 0 },
      id: "2a5559d8-f7b2-4f29-82ca-261d5754d043",
    };

    const actual = transformRawEvent(rawData);

    expect(actual).toEqual(expected);
  });

  test("should transform string array value properly for raw event", () => {
    const rawData = {
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Free Plan",
      app_id: null,
      app_name: null,
      source: "segment",
      session_id: "426da7bc-b1b3-402e-a570-3f3f7d969da5-2018-02-10",
      type: "track",
      props: [
        {
          field_name: "clearbit_company/tags",
          text_value: [
            "B2B",
            "Technology",
            "Information Technology & Services",
            "Web Services & Apps",
            "SAAS"
          ]
        }
      ],
      context: { days_since_signup: 0 },
      _id: "2a5559d8-f7b2-4f29-82ca-261d5754d043",
      _type: "event",
      _index: "organization_12345678_user_reports_v2_20180201180839857",
      _score: 1.4142135
    };

    const expected = {
      indexed_at: "2018-02-10T09:43:57+00:00",
      created_at: "2018-02-10T09:38:48+00:00",
      event: "Free Plan",
      source: "segment",
      session_id: "426da7bc-b1b3-402e-a570-3f3f7d969da5-2018-02-10",
      type: "track",
      properties: {
        "clearbit_company/tags": [
          "B2B",
          "Technology",
          "Information Technology & Services",
          "Web Services & Apps",
          "SAAS"
        ]
      },
      context: { days_since_signup: 0 },
      id: "2a5559d8-f7b2-4f29-82ca-261d5754d043",
    };

    const actual = transformRawEvent(rawData);

    expect(actual).toEqual(expected);
  });
});
