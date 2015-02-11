var phonemeTypes = require('phoneme-types');
var _ = require('lodash');

function createFilterStateMachine(stateMachineOpts) {
  var state = 'forward/no vowel yet';

  if (stateMachineOpts && stateMachineOpts.initialState) {
    state = stateMachineOpts.initialState;
  }

  var filtersForStates = {
    'forward/no vowel yet': function forwardNoVowelYetFilter(opts) {
      if (phonemeTypes.isVowelish(opts.currentPhoneme)) {
        state = 'forward/vowel encountered';
      }
      return opts.probabilitiesForNextChoices;
    },
    'forward/vowel encountered': function forwardVowelEncounteredFilter(opts) {
      var filteredChoices = {};

      if (phonemeTypes.isSyllableEnder(opts.currentPhoneme)) {
        // END should be the only choice after this.
        filteredChoices['END'] = 1;
      }
      else {
        // No vowels should come after this point.
        for (var phoneme in opts.probabilitiesForNextChoices) {
          // If we filter by isConsonantish, we eliminate START and END.
          if (!phonemeTypes.isVowelish(phoneme)) {
            filteredChoices[phoneme] = opts.probabilitiesForNextChoices[phoneme];
          }
        }
      }

      return filteredChoices;
    },
    'backward/no end yet': function backwardNoEndYetFilter(opts) {
      if (opts.currentPhoneme === 'END') {
        state = 'backward/no vowel yet';
      }

      return filterObjectByKeys(
        opts.probabilitiesForNextChoices, phonemeDoesNotLeaveWordHanging
      );
    },
    'backward/no vowel yet': function backwardNoVowelYet(opts) {
      var filteredChoices = opts.probabilitiesForNextChoices;
      if (phonemeTypes.isVowelish(opts.currentPhoneme)) {
        state = 'backward/vowel encountered';
      }
      else {
        // Cannot allow the chain to hit START unless we've come across a vowel.
        filteredChoices = filterObjectByKeys(
          opts.probabilitiesForNextChoices, phonemeIsNotStart
        );
      }
      return filteredChoices;
    },
    'backward/vowel encountered': function backwardVowelEncounteredFilter(opts) {
      // The chain can now complete, but no vowels should happen after this 
      // point.
      return filterObjectByKeys(
        opts.probabilitiesForNextChoices, isNotVowelish
      );
    }
  };

  function getNextFilter(opts) {
    return filtersForStates[state](opts);
  }

  return {
    getNextFilter: getNextFilter
  };
};

function createSingleVowelSyllableGuide(opts) {
  var filterStateMachine = createFilterStateMachine({
    initialState: (opts && opts.direction === 'backward') ? 
      'backward/no end yet' : 'forward/no vowel yet'
  });

  return {
    filterChoices: filterStateMachine.getNextFilter
  };
}

function phonemeDoesNotLeaveWordHanging(phoneme) {
  return phonemeTypes.isSyllableEnder(phoneme) || 
    phonemeTypes.isVowelish(phoneme);
}

function isNotVowelish(phoneme) {
  return !phonemeTypes.isVowelish(phoneme);
}

function phonemeIsNotStart(phoneme) {
  return phoneme !== 'START';
}

function filterObjectByKeys(obj, predicate) {
  return _.pick(obj, _.filter(_.keys(obj), predicate));
}

module.exports = {
  createGuide: createSingleVowelSyllableGuide
};
