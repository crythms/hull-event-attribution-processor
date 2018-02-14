# hull-event-attribution-processor

Processor to use events for attribution of users and accounts
**Status: Closed Beta - Not released**

## Usage

``` node
yarn run start
```

## Development

To run in development mode:

``` node
yarn run start:dev
```

To run test suite:

``` node
yarn run test
```

## Metrics

- ship.hull_api.search_events counts the number of calls to the search/events endpoint of the Hull API

## Status

- error:No user or account will be processed because the list of events is empty. -> no events are whitelisted
