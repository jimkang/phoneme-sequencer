var test = require('tape');
var createChooseNext = require('../choose-next').createChooseNext;
var seedrandom = require('seedrandom');
var followFreqs = require('../data/phoneme-follow-frequencies-in-syllables');

var expectedChainsForSeeds = {
  smidgeo: [
    'START',
    'F',
    'ER',
    'END'
  ],
  'Dr. Wily': [
    'START',
    'B',
    'AH',
    'M',
    'AY',
    'END'
  ],
  '1423015785021': [
    'START',
    'M',
    'AH',
    'N',
    'END'
  ]
};

Object.keys(expectedChainsForSeeds).forEach(function runTest(seed) {
  test('Test with seed ' + seed, function testChooseNext(t) {
    t.plan(1);

    var chooseNext = createChooseNext({
      random: seedrandom(seed),
      followFreqsData: followFreqs
    });

    var phonemeChain = ['START'];
    var lastPhoneme = 'START';

    while (lastPhoneme !== 'END') {
      phonemeChain.push(chooseNext(lastPhoneme));
      lastPhoneme = phonemeChain[phonemeChain.length - 1];
    }

    t.deepEqual(
      phonemeChain, 
      expectedChainsForSeeds[seed],
      'Produces the expected chain for seed ' + seed
    );
  });
});
