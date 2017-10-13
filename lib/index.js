'use strict';

// const Logger = require('./Logger');
// const SessionHandler = require('./SessionHandler');

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


function main(AppID, AppSecretOrTokenGenerator, localUserID, csInitCallback, csStatsCallback, configParams, conferenceID)
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

  const ctx = {
    appId: AppID,
    appSecret: AppSecretOrTokenGenerator,
    localUserID,
    csInitCallback,
    csStatsCallback,
    configParams,
    callstats,
    kurentoUtils,
  };

  return createCall(ctx, conferenceID || 'some-call-id-' + Date.now());
};

function handlePeer(ctx, webRtcPeer, remoteUserID) {
  const WebRtcPeer = ctx.kurentoUtils.WebRtcPeer;

  const endpointType = 'peer';
  let transmissionDirection = 'inactive';
  let fabricUsage = 'unbundled';

  if (webRtcPeer.enabled) {
    if (webRtcPeer instanceof WebRtcPeer.WebRtcPeerRecvonly) {
      transmissionDirection = 'receiveonly';
    } else if (webRtcPeer instanceof WebRtcPeer.WebRtcPeerSendonly) {
      transmissionDirection = 'sendonly';
    } else {
      transmissionDirection = 'sendrecv';
    }
  }

  const hasAudio = webRtcPeer.audioEnabled;
  const hasVideo = webRtcPeer.videoEnabled;
  const hasData = !!webRtcPeer.dataChannel;

  if (hasAudio + hasVideo + hasData > 0) {
    fabricUsage = 'multiplex';
  } else {
    if (hasAudio) {
      fabricUsage = 'audio';
    } else if (hasVideo) {
      fabricUsage = 'video';
    } else if (hasData) {
      fabricUsage = 'data';
    }
  }

  const peer = {
    id: webRtcPeer,
    endpointType,
    transmissionDirection,
    webRtcPeer
  };

  const pc = webRtcPeer.peerConnection;
  const callID = ctx.call.id;
  const callstats = ctx.callstats;

  peer.sendFabricEvent = function(event, data = {}) {
    callstats.sendFabricEvent(
      pc,
      event,
      callID,
      data
    );
  };

  callstats.addNewFabric(
    pc,
    remoteUserID,
    fabricUsage,
    callID,
    {endpointType, transmissionDirection}
  );

  setPeerListeners(ctx, peer);

  return peer;
}

function setPeerListeners(ctx, peer) {
  const listeners = {
    _dispose: function() {
      console.log('setPeerListeners::_dispose(): GOT WEBRTC _dispose() EVENT');
      peer.sendFabricEvent('fabricTerminated');
      cleanup();
    }
  };

  const webRtcPeer = peer.webRtcPeer;

  webRtcPeer.on('_dispose', listeners._dispose);

  return listeners;

  function cleanup() {
    console.log('setPeerListeners::cleanup()');
    webRtcPeer.removeListener('_dispose', listeners._dispose);
  }
}

function createCall(ctx, callID) {

  if (!callID) {
    throw new TypeError('callID argument required');
  }

  const call = {
    id: callID,
    starting: false,
    started: false
  };

  ctx = Object.assign({}, ctx, {call});

  call.start = function(callback) {

    if (typeof callback !== 'function') {
      callback = noop;
    }

    if (!call.starting && !call.started) {
      call.starting = true;

      ctx.callstats.initialize(
        ctx.appId,
        ctx.appSecret,
        ctx.localUserID,
        onStart,
        onStatsCallback,
        ctx.configParams
      );

      return call;
    }

    if (call.starting) {
      throw new TypeError('Call is already starting');
    }

    if (call.started) {
      throw new TypeError('Call already started');
    }

    return call;

    function onStart(csError, csErrMsg) {
      if (call.starting || !call.started) {
        call.starting = false;

        if (csError === 'success') {
          call.started = true;
          callback();
        } else if (csError !== 'authOngoing') {
          call.started = false;
          callback(new TypeError(csErrMsg));
        }
      }
    }

    function onStatsCallback() {

    }
  };

  call.handlePeer = function(peer) {
    if (!call.started) {
      throw new TypeError('Cannot handle a peer in a closed call');
    }

    return handlePeer(ctx, peer);
  };

  call.createCall = function(id) {
    return createCall(ctx, id || callID);
  };

  return call;
}


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

function noop() {}
