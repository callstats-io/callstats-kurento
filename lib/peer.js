const CallstatsPeer = require('./callstats').Peer;

class Peer extends CallstatsPeer {
  constructor({conference, webRtcPeer, remoteUserID = 'KMS'}) {
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
    const Peer = this;

    const listeners = {
      _dispose: function() {
        peer.sendFabricEvent(peer.callstats.fabricEvent.fabricTerminated);
        cleanup();
      },
      signalingstatechange: function() {
        const pc = peer.peerConnection;

        if (pc.signalingState === 'stable') {
          if (pc.localDescription && pc.localDescription.sdp && webRtcPeer.localVideo) {
            Peer.associateMst(peer, pc.localDescription, 'localVideo', webRtcPeer.localVideo);
          }
        }
      }
    };

    const webRtcPeer = peer.webRtcPeer;
    const pc = peer.peerConnection;

    webRtcPeer.on('_dispose', listeners._dispose);
    pc.addEventListener('signalingstatechange', listeners.signalingstatechange);

    return listeners;

    function cleanup() {
      webRtcPeer.removeListener('_dispose', listeners._dispose);
      pc.removeEventListener('signalingstatechange', listeners.signalingstatechange);
    }
  }

  static associateMst(peer, description, usageLabel, associatedVideoTag) {
    const validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
    const reg = /^ssrc:(\d*) ([\w_]*):(.*)/;

    let ssrcs = [];

    description.sdp.split(/(\r\n|\r|\n)/).filter(validLine).forEach(function(l) {
      const type = l[0];
      const content = l.slice(2);
      if(type === 'a') {
        if (reg.test(content)) {
          const match = content.match(reg);
          if((ssrcs.indexOf(match[1]) === -1)) {
            ssrcs.push(match[1]);
          }
        }
      }
    });

    ssrcs.forEach(function(ssrc) {
      peer.associateMst(ssrc, usageLabel, associatedVideoTag);
    });
  }
}


module.exports = Peer;
