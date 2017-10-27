# Documentation


## API

The main module `callstatskurento` is a function that receives parameters for [`callstats.initialize()`](https://www.callstats.io/api/#callstats-initialize-with-app-secret).

The main module also exports the following functions:
- `setCallstatsModule()`
- `setKurentoUtils()`


#### callstatskurento(AppID, AppSecretOrTokenGenerator, localUserID *[, csInitCallback [, csStatsCallback [, configParams]]]*)

See  [callstats.initialize()](http://www.callstats.io/api/#callstats-initialize-with-app-secret)


#### callstatskurento.setCallstatsModule(module)

| Params   | Argument  | Type        | Description                  |
|----------|-----------|-------------|------------------------------|
| `module` | Required  | `function`  | The `callstats` main module. |

By default this library uses `window.callstats` (assuming that the **callstats.io** library has been previously loaded via a `<script>` tag.

However, the **callstats.io** library can also be loaded using loaders such as [require.js](http://www.requirejs.org/) meaning that it may be not exposed as a global `window.callstats`. In that case, `callstatskurento.setCallstatsModule()` can be used to provide the **callstats-kurento** library with the **callstats.io** main module.

#### callstatskurento.setKurentoUtils(module)

| Params   | Argument  | Type        | Description                  |
|----------|-----------|-------------|------------------------------|
| `module` | Required  | `function`  | The `kurentoUtils` main module. |

By default this library uses `window.kurentoUtils` (assuming that the **kurento-utils** library has been previously loaded via a `<script>` tag.

However, the **kurentoUtils** library can also be loaded using loaders such as [require.js](http://www.requirejs.org/) meaning that it may be not exposed as a global `window.kurentoUtils`. In that case, `callstatskurento.setKurentoUtils()` can be used to provide the **callstats-kurento** library with the **kurentoUtils** main module.


### `App` Class

#### constructor({AppID, AppSecret, localUserID, configParams, callstats, kurentoUtils, logger})

Creates a new `App` instance.

#### App.createConference(conferenceID)

Creates a new [`Conference`](#conferenceclass) instance.

### `Conference` Class

#### constructor({conferenceID, app, callstats, logger})

Create a new `Conference` instance.

| Properties       | Argument  | Type              | Description                           |
|------------------|-----------|-------------------|---------------------------------------|
| `conferenceID`   | Required  | `String`          | The conference ID |
| `app`            | Required  | `App`             | |
| `callstats`      | Optional  | `Object`          | |
| `logger`         | Optional  | `Logger` instance | |

#### Conference.prototype.callstats

A getter that provides the already initialized `callstats` object.

#### Conference.prototype.kurentoUtils

A getter that provides the already initialized `kurentoUtils` object.

#### Conference.prototype.createPeer(webRtcPeer, remoteUserID)

Create a new `Peer` instance, and initialize it.

*Note: `Conference.prototype.handlePeer()` is preferred over this method.*

| Params         | Argument  | Type                  | Description                           |
|----------------|-----------|-----------------------|---------------------------------------|
| `webRtcPeer`   | Required  | `kurento.WebRtcPeer`  | a `kurentoUtils.WebRtcPeer` instance. |
| `remoteUserID` | Required  | `string`, `object`    | See [remoteUserID](https://www.callstats.io/api/#callstats-addnewfabric) |

#### Conference.prototype.handlePeer(webRtcPeer, remoteUserID)

Same as `Conference.prototype.createPeer()` but also adds the new `Peer` instance to the list of `peers` handled by the `Call` instance.

| Params         | Argument  | Type                  | Description                           |
|----------------|-----------|-----------------------|---------------------------------------|
| `webRtcPeer`   | Required  | `kurento.WebRtcPeer`  | a `kurentoUtils.WebRtcPeer` instance. |
| `remoteUserID` | Required  | `string`, `object`    | See [remoteUserID](https://www.callstats.io/api/#callstats-addnewfabric) |

#### Conference.prototype.addNewFabric(pcObject, remoteUserID, fabricUsage, fabricAttributes, callback)

See [https://www.callstats.io/api/#callstats-addnewfabric](https://www.callstats.io/api/#callstats-addnewfabric)
*Note:* `conferenceID` parameter is automatically provided by getting the `Conference.prototype.conferenceID` variable.

#### Conference.prototype.associateMstWithUserID(pcObject, userID, SSRC, usageLabel, associatedVideoTag)

See [https://www.callstats.io/api/#callstats-associatemstwithuserid](https://www.callstats.io/api/#callstats-associatemstwithuserid)
*Note:* `conferenceID` parameter is automatically provided by getting the `Conference.prototype.conferenceID` variable.

#### Conference.prototype.reportUserIDChange(pcObject, newUserID, userIDType)

*TODO: Add missing link to callstats documentation for `reportUserIDChange()`
*Note:* `conferenceID` parameter is automatically provided by getting the `Conference.prototype.conferenceID` variable.

#### Conference.prototype.sendUserFeedback(feedback, pcCallback)

See [https://www.callstats.io/api/#callstats-senduserfeedback](https://www.callstats.io/api/#callstats-senduserfeedback)
*Note:* `conferenceID` parameter is automatically provided by getting the `Conference.prototype.conferenceID` variable.

#### Conference.prototype.sendFabricEvent(pcObject, fabricEvent, eventData)

See [https://www.callstats.io/api/#callstats-sendfabricevent](https://www.callstats.io/api/#callstats-sendfabricevent)
*Note:* `conferenceID` parameter is automatically provided by getting the `Conference.prototype.conferenceID` variable.

#### Conference.prototype.reportError(pcObject, wrtcFuncName, error)

See [https://www.callstats.io/api/#callstats-reporterror](hhttps://www.callstats.io/api/#callstats-reporterror)
*Note:* `conferenceID` parameter is automatically provided by getting the `Conference.prototype.conferenceID` variable.

### `Peer` Class

#### constructor({conference, webRtcPeer, remoteUserID})

Create a new `Peer` instance.

| Properties       | Argument  | Type               | Description                           |
|------------------|-----------|--------------------|---------------------------------------|
| `conferenceID`   | Required  | `String`           | The conference ID |
| `webRtcPeer`     | Required  | `Object`           | The `kurento.WebRtcPeer` instance.
| `remoteUserID`   | Required  | `String`, `Object` | |

#### Peer.prototype.kurentoUtils

Getter for the `kurentoUtils` module.

*Alias to `this.conference.kurentoUtils`*

#### Peer.prototype.peerConnection

Getter for the `RTCPeerConnection` object.

*Alias to `this.webRtcPeer.peerConnection`*

#### Peer.prototype.initialize(remoteUserID)

Initializes a `Peer` instance, with the given `remoteUserID`.

| Properties       | Argument  | Type               | Description                           |
|------------------|-----------|--------------------|---------------------------------------|
| `remoteUserID`   | Required  | `String`           | The peer user ID |

*Calls `this.conference.addNewFabric()`*

#### Peer.prototype.sendFabricEvent(event, data = {})

See `Conference.prototype.sendFabricEvent()`, with `pcObject` set to `Peer.prototype.peerConnection`

#### Peer.prototype.associateMst(SSRC, usageLabel, associatedVideoTag)

See `Conference.prototype.associateMst()`, with `pcObject` set to `Peer.prototype.peerConnection`

#### Peer.prototype.reportUserIDChange(newUserID, userIDType)

See `Conference.prototype.reportUserIDChange()`, with `pcObject` set to `Peer.prototype.peerConnection`

#### Peer.prototype.reportError(wrtcFuncName, error)

See `Conference.prototype.reportError()`, with `pcObject` set to `Peer.prototype.peerConnection`

#### Peer.associateMst(peer, description, usageLabel, associatedVideoTag)

Inspects all SSRCs in `description` and calls `Peer.prototype.associateMst` with the determined `SSRC` and provided `usageLabel`, `associatedVideoTag` parameters.

