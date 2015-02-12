var phonemeSequencer = require('../phoneme-sequencer');
var createChooser = require('../choose').createChooser;
var createGuide = require('../single-vowel-syllable-guide').createGuide;
var seedrandom = require('seedrandom');
var jsonfile = require('jsonfile');

if (process.argv.length < 3) {
  console.log('Usage: node grow-from-middle <middle phoneme to grow sequence from, e.g.: AH>');
}

var middlePhoneme = process.argv[2];

var followFreqs = jsonfile.readFileSync(__dirname +
  '/../data/phoneme-follow-frequencies-in-syllables.json'
);
var precedeFreqs = jsonfile.readFileSync(__dirname +
  '/../data/phoneme-preceding-frequencies-in-syllables.json'
);

var seed = (new Date).getTime().toString();
console.log('seed:', seed);

var completeSequence = phonemeSequencer.createSequenceCompleter({
  chooseNext: createChooser({
    random: seedrandom(seed),
    followFreqsData: followFreqs,
    guide: createGuide()
  }),
  choosePrev: createChooser({
    random: seedrandom(seed),
    followFreqsData: precedeFreqs,
    guide: createGuide({
      direction: 'backward'
    })
  })
});

var sequence = completeSequence({
  base: [middlePhoneme],
});

console.log(sequence);

