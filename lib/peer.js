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

    if (webRtcPeer.remoteVideo) {
      this.associateMst('remote-video', webRtcPeer.remoteVideo);
    }
  }

  associateMst(usageLabel, associatedVideoTag) {
    const pc = this.peerConnection;
    // Extracting SSRC from SDP
    const validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
    const reg = /^ssrc:(\d*) ([\w_]*):(.*)/;

    let ssrcs = [];
    const _associateMst = (ssrc) => super.associateMst(ssrc, usageLabel, associatedVideoTag);

    pc.localDescription.sdp.split(/(\r\n|\r|\n)/).filter(validLine).forEach(function(l) {
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
      _associateMst(ssrc);
    });

  }

  static setListeners(peer) {
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
}


module.exports = Peer;
