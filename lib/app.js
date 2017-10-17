const CallstatsApp = require('./callstats').App;
const Conference = require('./conference');
const globalKurentoUtils = (typeof windows && window ? window.kurentoUtils : undefined);

class App extends CallstatsApp {
  constructor({AppID, AppSecret, localUserID, configParams, callstats, kurentoUtils, logger}) {
    super({AppID, AppSecret, localUserID, configParams, callstats, logger});

    this.kurentoUtils = kurentoUtils || globalKurentoUtils;
  }

  createConference(conferenceID) {
    const app = this;

    const conf = new Conference({
      conferenceID,
      app,
    });

    return conf;
  }

}

module.exports = App;
