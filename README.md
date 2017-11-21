# callstats-kurento

[Kurento Utils](http://www.kurento.org/) interface to [callstats.io](http://callstats.io/).


## Install

* Adding a `<script>` tag in the HTML.

In case no module loaded is used, a global `window.callstatskurento` is exposed.

_NOTE:_ This library does not include the **callstats.io** library (it must be added separately).


## Documentation

* Read the full [documentation](docs/index.md) in the docs folder.


## Usage example

In the HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Load callstats.io library (it provides window.callstats -->
    <script src="https://api.callstats.io/static/callstats.min.js"></script>
    <!-- Load Kurento Utils library -->
    <script src="bower_components/kurento-utils/js/kurento-utils.js"></script>
    <!-- Load callstats-kurento library (it provides window.callstatskurento) -->
    <script src="js/callstats-kurento.js"></script>
    <!-- Load our app code -->
    <script src="js/app.js"></script>
  </head>

  <body>
    <!-- your stuff -->
  </body>
</html>
```

In `app.js`:

```javascript
// Create a callstats-kurento App instance.
var ckApp;
var ckConference;

window.onload = function() {
    ckApp = callstatskurento(
        AppID,
        AppSecret,
        localUserID
    );

  // Create a callstats kurento conference interface, by supplying the CONFERENCE_ID
  ckConference = cskApp.createConference(CONFERENCE_ID);
}
```

```javascript
webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
    if(error) return onError(error);

    // Create a callstats-kurento peer, by handling the the webrTc peer returned by kurentoUtils
    // and supplying a PEER_ID (a session ID).
    var ckPeer = ckConference.handle(webRtcPeer, PEER_ID);

    this.generateOffer(onOfferPresenter);
});
```


## Development

When using Bower or a `<script>` tag, the provided library is built with [browserify](http://browserify.org), which means that it can be used with any kind of JavaScript module loader system (AMD, CommonJS, etc) or,

NPM/Bower libraries have been published to the NPM/Bower registries.

* Using NPM: `$ npm install callstats-kurento`
* Using Bower: `$ bower install callstats-kurento`


Install NPM development dependencies:

```bash
$ npm install
```

Install `gulp-cli` globally (which provides the `gulp` command):

```bash
$ npm install -g gulpjs
```

* `gulp prod` generates a production/minified `dist/callstats-kurento.min.js` bundle.
* `gulp dev` generates a development non-minified and sourcemaps enabled `dist/callstats-kurento.js` bundle.
