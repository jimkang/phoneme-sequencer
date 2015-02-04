var probableLib = require('probable');

function createChooseNext(opts) {
  var probable = probableLib.createProbable({
    random: opts.random
  });
  var followFreqsData = opts.followFreqsData;
  
  var freqTables = {};

  (function init() {
    for (var phoneme in followFreqsData) {
      var freqsDict = followFreqsData[phoneme];
      freqTables[phoneme] = probable.createRangeTableFromDict(freqsDict);
    }
  })();

  return function chooseNext(phoneme) {
    var next;

    if (phoneme in freqTables) {
      next = freqTables[phoneme].roll();
    }

    return next;
  };
}

module.exports = {
  createChooseNext: createChooseNext
};
