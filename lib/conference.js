const Logger = require('./logger');
const CallstatsConference = require('./callstats').Conference;
const Peer = require('./peer');

class Call extends CallstatsConference {
  constructor({conferenceID, app, callstats, logger = new Logger()}) {
    super({conferenceID, app, callstats, logger});

    this._peers = [];
  }

  get callstats() {
    return this.app.callstats;
  }

  set callstats(cs) {
  }

  get kurentoUtils() {
    return this.app.kurentoUtils;
  }

  createPeer(webRtcPeer, remoteUserID) {
    const peer = new Peer({
      webRtcPeer,
      remoteUserID,
      conference: this
    });

    peer.initialize();

    return peer;
  }

  handle(webRtcPeer, remoteUserID) {
    const call = this;
    const peer = this.createPeer(webRtcPeer, remoteUserID);

    call._peers.push(peer);

    return peer;
  }

  stop() {

  }
}

module.exports = Call;