var phonemeSequencer = require('./phoneme-sequencer');
var stopAtVowelJudge = require('./stop-at-vowel-judge');
var choose = require('./choose');
var jsonfile = require('jsonfile');

var createSequenceCompleter = phonemeSequencer.createSequenceCompleter;
var createStopAtVowelJudge = stopAtVowelJudge.createJudge;
var createChooser = choose.createChooser;


var followFreqs = jsonfile.readFileSync(__dirname +
  '/data/phoneme-follow-frequencies-in-syllables.json'
);
var precedeFreqs = jsonfile.readFileSync(__dirname +
  '/data/phoneme-preceding-frequencies-in-syllables.json'
);

// Fills in a sequence either from the beginning to before the vowel or from 
// the end to before the vowel. See stopjudgetests.js to see how this works.

function createSyllableCapSequencer(opts) {
  var random = Math.random;

  if (opts && opts.random) {
    random = opts.random;
  }
  
  var chooseNext = createChooser({
    random: random,
    followFreqsData: followFreqs
  });

  var choosePrev = createChooser({
    random: random,
    followFreqsData: precedeFreqs
  });

  return phonemeSequencer.createSequenceCompleter({
    chooseNext: chooseNext,
    choosePrev: choosePrev,
    stopJudge: createStopAtVowelJudge()
  });
}

module.exports = {
  createSequenceCompleter: createSequenceCompleter,
  createStopAtVowelJudge: createStopAtVowelJudge,
  createChooser: createChooser,
  createSyllableCapSequencer: createSyllableCapSequencer
};

