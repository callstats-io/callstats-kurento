const modCallstats = require('./callstats');
const Peer = require('./peer');

class CallstatsConference {
  constructor({conferenceID, app, logger, callstats}) {
    this.conferenceID = conferenceID;
    this.app = app;
    this.logger = logger;
    this.callstats = callstats || (this.app ? this.app.callstats : undefined) || modCallstats.get();
  }

  createPeer(peerConnection, remoteUserID) {
    return new Peer({
      peerConnection,
      remoteUserID,
      conference: this
    });
  }

  initialize(AppID, AppSecret, localUserID, csInitCallback, csStatsCallback, configParams) {
    this.callstats.initialize(
      // AppID,
      AppID,
      // AppSecret,
      AppSecret,
      // localUserID,
      localUserID,
      // csInitCallback,
      csInitCallback,
      // csStatsCallback,
      csStatsCallback,
      // configParams
      configParams
    );

    return this;
  }

  addNewFabric(pcObject, remoteUserID, fabricUsage, fabricAttributes, callback) {

    if (typeof fabricUsage === 'function') {
      callback = fabricUsage;
      fabricUsage = undefined;
      fabricAttributes = undefined;
    }

    if (typeof fabricAttributes === 'function') {
      callback = fabricAttributes;
      fabricAttributes = undefined;
    }

    if (typeof callback !== 'function') {
      callback = noop;
    }

    if (!fabricUsage) {
      fabricUsage = this.callstats.fabricUsage.multiplex;
    }

    console.log('adding new fabric:', pcObject, remoteUserID, fabricUsage, this.conferenceID, fabricAttributes, callback);
    // Create a new callstats fabric.
    this.callstats.addNewFabric(
      // pcObject
      pcObject,
      // remoteUserID
      remoteUserID,
      // fabricUsage
      fabricUsage,
      // conferenceID
      this.conferenceID,
      // fabricAttributes,
      fabricAttributes,
      // pcCallback
      callback
    );
  }

  associateMstWithUserID(pcObject, userID, SSRC, usageLabel, associatedVideoTag) {
    if (this.logger) {
      this.logger.debug('associatedVideoTag()');
    }

		this.callstats.associateMstWithUserID(
			// pcObject
			pcObject,
			// userID
			userID,
			// conferenceID
			this.conferenceID,
			// SSRC
			SSRC,
			// usageLabel
			usageLabel,
			// associatedVideoTag
			associatedVideoTag
		);
	}

	reportUserIDChange(pcObject, newUserID, userIDType) {
    if (this.logger) {
      this.logger.debug('reportUserIDChange()');
    }

		this.callstats.reportUserIDChange(
			// pcObject
			pcObject,
			// conferenceID
			this.conferenceID,
			// newUserID
			newUserID,
			// userIDType
			userIDType
		);
	}

	sendUserFeedback(feedback, pcCallback) {
    if (this.logger) {
      this.logger.debug('sendUserFeedback()');
    }

		this.callstats.sendUserFeedback(
			// conferenceID
			this.conferenceID,
			// feedback
			feedback,
			// pcCallback
			pcCallback
		);
	}

  sendFabricEvent(pcObject, fabricEvent, eventData) {
    if (this.logger) {
      this.logger.debug('sendFabricEvent() [fabricEvent:%s]', fabricEvent);
    }

		this.callstats.sendFabricEvent(
			// pcObject
			pcObject,
			// fabricEvent
			fabricEvent,
			// conferenceID
			this.conferenceID,
      // eventData
      eventData
		);
	}

  reportError(pcObject, wrtcFuncName, error) {
    if (this.logger) {
      if (wrtcFuncName === this.callstats.webRTCFunctions.applicationLog)
        this.logger.debug('reportError() [wrtcFuncName:%s, msg:"%s"]', wrtcFuncName, error);
      else
        this.logger.warn('reportError() [wrtcFuncName:%s, error:%o]', wrtcFuncName, error);
    }

		this.callstats.reportError(
			// pcObject
			pcObject,
			// conferenceID
			this.conferenceID,
			// wrtcFuncName
			wrtcFuncName,
			// domError
			error,
			// localSDP
			pcObject.localDescription ? pcObject.localDescription.sdp : null,
			// remoteSDP
			pcObject.remoteDescription ? pcObject.remoteDescription.sdp : null
		);
	}
}

function noop() {};

module.exports = CallstatsConference;
