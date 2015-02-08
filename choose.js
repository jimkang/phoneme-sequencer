var probableLib = require('probable');

function createChooser(opts) {
  var probable = probableLib.createProbable({
    random: opts.random
  });
  var followFreqsData = opts.followFreqsData;
  var guide = opts.guide;
  
  return function chooseSuccessor(phoneme) {
    if (phoneme in followFreqsData) {
      followDict = followFreqsData[phoneme];

      if (guide) {
        followDict = guide.filterChoices({
          currentPhoneme: phoneme,
          probabilitiesForNextChoices: followDict
        });
      }
    }

    return probable.createRangeTableFromDict(followDict).roll();
  };
}

module.exports = {
  createChooser: createChooser
};
