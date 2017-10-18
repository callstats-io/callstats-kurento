const CallstatsPeer = require('./callstats').Peer;

class Peer extends CallstatsPeer {
  constructor({conference, webRtcPeer, remoteUserID}) {
    super({conference, remoteUserID});

    this.webRtcPeer = webRtcPeer;
  }

  get kurentoUtils() {
    return this.conference.kurentoUtils;
  }

  get peerConnection() {
    return (this.webRtcPeer ? this.webRtcPeer.peerConnection : null);
  }

  initialize(remoteUserID) {
    const WebRtcPeer = this.kurentoUtils.WebRtcPeer;
    const webRtcPeer = this.webRtcPeer;

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

    super.initialize(
      remoteUserID,
      fabricUsage,
      {endpointType, transmissionDirection}
    );

    Peer.setListeners(this);
  }


  static setListeners(peer) {
    const listeners = {
      _dispose: function() {
        peer.sendFabricEvent('fabricTerminated');
        cleanup();
      }
    };

    const webRtcPeer = peer.webRtcPeer;

    webRtcPeer.on('_dispose', listeners._dispose);

    return listeners;

    function cleanup() {
      webRtcPeer.removeListener('_dispose', listeners._dispose);
    }
  }
}


module.exports = Peer;
