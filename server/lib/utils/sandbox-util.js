// @flow
import type { ISandbox } from "../types";

function applyLoggingUtils(sandbox: ISandbox): ISandbox {
  const sandboxConsole = sandbox;
  sandboxConsole.console = {
    log: (message?: any, ...optionalParams: any[]) => {
      sandboxConsole.logs.push(message, optionalParams);
    },
    warn: (message?: any, ...optionalParams: any[]) => {
      sandboxConsole.logs.push(message, optionalParams);
    },
    error: (message?: any, ...optionalParams: any[]) => {
      sandboxConsole.errors.push(message, optionalParams);
    },
    info: (message?: any, ...optionalParams: any[]) => {
      sandboxConsole.logs.push(message, optionalParams);
    },
    debug: (message?: any, ...optionalParams: any[]) => {
      sandboxConsole.logs.push(message, optionalParams);
    },
  };

  return sandboxConsole;
}

function applyUtils(sandbox: ISandbox): ISandbox {
  const sandboxWithUtils = applyLoggingUtils(sandbox);

  return sandboxWithUtils;
}

module.exports = applyUtils;
