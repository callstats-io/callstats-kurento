let modCallstats = require('./callstats');
const Conference = require('./conference');

class App {
  constructor({AppID, AppSecret, localUserID, configParams, callstats = modCallstats.get(), logger}) {
    this.AppID = AppID;
    this.AppSecret = AppSecret;
    this.localUserID = localUserID;
    this.configParams = configParams;
    this.logger = logger;
    this.callstats = callstats;
  }

  initialize(localUserID, csInitCallback, csStatsCallback, configParams) {
    if (typeof localUserID === 'function') {
      configParams = csStatsCallback;
      csStatsCallback = csInitCallback;
      csInitCallback = localUserID;
      localUserID = undefined;
    }

    if (typeof csStatsCallback !== 'function' && !configParams) {
      configParams = csStatsCallback;
      csStatsCallback = undefined;
    }

    return this.callstats.initialize(
      this.AppID,
      this.AppSecret,
      localUserID || this.localUserID,
      csInitCallback,
      csStatsCallback,
      configParams || this.configParams
    );
  }

  createConference(conferenceID, logger, callstats) {
    return new Conference({
      conferenceID,
      logger,
      app: this,
      callstats
    });
  }
}

module.exports = App;
