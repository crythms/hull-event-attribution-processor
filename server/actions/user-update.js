/* @flow */
const Promise = require("bluebird");
const Agent = require("../lib/agent");

function userUpdateHandlerFactory(options: Object = {}): Function {
  const { flowControl = null, isBatch = false } = options;

  return function userUpdateHandler(ctx: Object, messages: Array<Object>): Promise {
    if (ctx.smartNotifierResponse && flowControl) {
      ctx.smartNotifierResponse.setFlowControl(flowControl);
    }

    if (messages.length > 0) {
      const agent = new Agent(ctx.client, ctx.ship, ctx.metric);
      return agent.sendUserMessages(messages, isBatch);
    }

    return Promise.resolve();
  };
}

module.exports = userUpdateHandlerFactory;
