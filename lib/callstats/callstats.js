let globalCallstats = (typeof window !== 'undefined' && window ? window.callstats : undefined);

module.exports.get = function() {
  return globalCallstats;
};

module.exports.set = function(callstats) {
  globalCallstats = callstats;
};
