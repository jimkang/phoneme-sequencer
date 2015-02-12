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
      state = 'backward/no vowel yet';

      if (phonemeTypes.isVowelish(opts.currentPhoneme)) {
        state = 'backward/vowel encountered';
      }

      if (opts.currentPhoneme === 'END') {
        // If we're starting with the END psuedo-phoneme, then the penultimate 
        // phoneme cannot be one that leaves the word "hanging".
        return filterObjectByKeys(
          opts.probabilitiesForNextChoices, phonemeDoesNotLeaveWordHanging
        );
      }
      else {
        return opts.probabilitiesForNextChoices
      }
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
  var initialState = 'forward/no vowel yet';
  if (opts && opts.direction === 'backward') {
    initialState = 'backward/no end yet';
  }

  var filterStateMachine = createFilterStateMachine({
    initialState: initialState
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
