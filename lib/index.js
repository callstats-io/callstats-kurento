'use strict';

// const Logger = require('./Logger');
// const SessionHandler = require('./SessionHandler');
// const Peer = require('./peer');
// const Conference = require('./conference');
const App = require('./app');

const debug = require('debug');
const logger = {
  debug: debug('callstats-kurento'),
  log: console.log.bind(console, 'callstats-kurento'),
  warn: console.warn.bind(console, 'callstats-kurento'),
  error: console.error.bind(console, 'callstats-kurento'),
};

// The callstats.io main module.
let callstatsModule;
let kurentoUtils;
// eslint-disable-next-line no-unused-vars
let callstatsApp;

function main(AppID, AppSecret, localUserID, csInitCallback, csStatsCallback, configParams)
{
	logger.debug('handle() [AppID:"%s"]', AppID);

	// If unset, set callstatsModule with window.callstats
	callstatsModule = callstatsModule || window.callstats;
  kurentoUtils = kurentoUtils || window.kurentoUtils;

	if (typeof callstatsModule !== 'function')
		throw new TypeError('callstats not found');

  if (typeof kurentoUtils !== 'object' || !kurentoUtils.WebRtcPeer) {
    throw new TypeError('kurento-utils not found');
  }

	if (!localUserID) {
    throw new TypeError('localUserID argument is required');
	}

	if (!csInitCallback)
	{
		csInitCallback = (csError, csErrMsg) =>
		{
			if (csError === 'success')
				logger.debug('csInitCallback success: %s', csErrMsg);
			else
				logger.warn('csInitCallback %s: %s', csError, csErrMsg);
		};
	}

	// Create and initialize the callstats object.

	let callstats = callstatsModule();

  const app = new App({AppID, AppSecret, localUserID, csInitCallback, csStatsCallback, configParams, callstats});

  app.initialize();

  return app;
};


/**
 * Set the callstats main module.
 * @param  {function} module - The callstats.io main module.
 */
main.setCallstatsModule = function(mod) {
	logger.debug('setCallstatsModule()');

	callstatsModule = mod;
};

main.setKurentoUtils = function(mod) {
  logger.debug('setKurentoUtils()');
  kurentoUtils = mod;
};

module.exports = main;
