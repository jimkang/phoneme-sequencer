var test = require('tape');
var phonemeSequencer = require('../phoneme-sequencer');
var createChooser = require('../choose').createChooser;
var createJudge = require('../stop-at-vowel-judge').createJudge;
var seedrandom = require('seedrandom');
var jsonfile = require('jsonfile');

// Note: re: why this matters:
// e.g. Getting 'GL' from 'P': Start the chain with a phoneme from the same 
// class (a stop) like 'G'. Then, run the chain until a vowel is hit.

var followFreqs = jsonfile.readFileSync(__dirname +
  '/../data/phoneme-follow-frequencies-in-syllables.json'
);
var precedeFreqs = jsonfile.readFileSync(__dirname +
  '/../data/phoneme-preceding-frequencies-in-syllables.json'
);

var expected = [
  {
    title: 'Grow start of syllable',
    seed: 'smidgeo2dd',
    startingChain: ['START', 'G'],
    resultChain: ['START', 'G', 'L']
  },
  {
    title: 'Grow end of syllable',
    seed: '2',
    startingChain: ['T', 'END'],
    resultChain: ['N', 'T', 'END']
  }
  
];

expected.forEach(function runTestKit(kit) {
  test(kit.title, function runTest(t) {
    t.plan(1);

    var chooseNext = createChooser({
      random: seedrandom(kit.seed),
      followFreqsData: followFreqs
    });

    var choosePrev = createChooser({
      random: seedrandom(kit.seed),
      followFreqsData: precedeFreqs
    });

    var completeSequence = phonemeSequencer.createSequenceCompleter({
      chooseNext: chooseNext,
      choosePrev: choosePrev,
      stopJudge: createJudge()
    });

    var sequence = completeSequence({
      base: kit.startingChain
    });
    
    t.deepEqual(sequence, kit.resultChain);
  });
});
