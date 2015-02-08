var phonemeTypes = require('phoneme-types');
var _ = require('lodash');

function createSingleVowelSyllableGuide(opts) {
  // var consonantFilter = isEnder;
  var vowelEncountered = false;
  var consonantEncountered = false;
  var unfollowableEncountered = false;
  var unprecedableEncountered = false;

  var forward = (opts && opts.direction === 'backward') ? false : true;

  function filterChoices(opts) {
    // return opts.probabilitiesForNextChoices;

    var filteredChoices = {};

    // TODO: Shape it so that the syllable ends.
    if (vowelEncountered) {
      debugger;
      for (var phoneme in opts.probabilitiesForNextChoices) {
        // If we filter by isConsonantish, we eliminate START and END.
        if (!phonemeTypes.isVowelish(phoneme)) {
          filteredChoices[phoneme] = opts.probabilitiesForNextChoices[phoneme];
        }
      }
    }
    else {
      vowelEncountered = phonemeTypes.isVowelish(opts.currentPhoneme);
      filteredChoices = opts.probabilitiesForNextChoices;
    }
    // if (phonemeTypes.isConsonantish(prev)) {
    //   return nextChoices.filter(consonantFilter);
    // }
    return filteredChoices;
  }

  return {
    filterChoices: filterChoices
  };
}

module.exports = {
  createGuide: createSingleVowelSyllableGuide
};
