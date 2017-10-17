
class CallstatsPeer {
  constructor({remoteUserID, peerConnection, conference}) {
    this.remoteUserID = remoteUserID;

    if (conference)
      this.conference = conference;

    if (peerConnection)
      this.peerConnection = peerConnection;
  }

  get callstats() {
    return this.conference.callstats;
  }

  initialize(remoteUserID, fabricUsage, fabricAttributes) {
    this.conference.addNewFabric(
      this.peerConnection,
      remoteUserID || this.remoteUserID,
      fabricUsage,
      fabricAttributes
    );

    return this;
  }

  sendFabricEvent(event, data = {}) {
    this.conference.sendFabricEvent(
      this.peerConnection,
      event,
      data
    );
  }

  associateMst(SSRC, usageLabel, associatedVideoTag) {
    this.conference.associateMstWithUserID(
      this.peerConnection,
      this.remoteUserID,
      SSRC,
      usageLabel,
      associatedVideoTag
    );
  }

  reportUserIDChange(newUserID, userIDType) {
    this.conference.reportUserIDChange(
      this.peerConnection,
      newUserID,
      userIDType
    );
  }

  reportError(wrtcFuncName, error) {
    this.conference.reportError(this.peerConnection, wrtcFuncName, error);
  }
}

module.exports = CallstatsPeer;
