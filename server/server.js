// @flow
import type { $Application } from "express";

const { notifHandler, smartNotifierHandler } = require("hull/lib/utils");

const actions = require("./actions/index");

function server(app: $Application): $Application {
  app.post("/smart-notifier", smartNotifierHandler({
    handlers: {
      "user:update": actions.userUpdateHandler({
        flowControl: {
          type: "next",
          size: parseInt(process.env.FLOW_CONTROL_SIZE, 10) || 200,
          in: parseInt(process.env.FLOW_CONTROL_IN, 10) || 5
        }
      })
    }
  }));

  app.post("/batch", notifHandler({
    userHandlerOptions: {
      maxSize: 200
    },
    handlers: {
      "user:update": actions.userUpdateHandler()
    }
  }));

  app.get("/admin", actions.adminHandler);
  return app;
}

module.exports = server;
