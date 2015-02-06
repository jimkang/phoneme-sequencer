var test = require('tape');
var createChooser = require('../choose').createChooser;
var seedrandom = require('seedrandom');
var jsonfile = require('jsonfile');

var followFreqs = require('../data/phoneme-follow-frequencies-in-syllables');
var precedeFreqs = require('../data/phoneme-preceding-frequencies-in-syllables');

var expectedForwardChainsForSeeds = {
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

var expectedBackwardChainsForSeeds = {
  smidgeo: [
    'START',
    'D',
    'END'
  ],
  'Dr. Wily': [
    'START',
    'B',
    'AA',
    'B',
    'R',
    'OW',
    'END'
  ],
  '1423015785021': [
    'START',
    'S',
    'END'
  ]
};

Object.keys(expectedForwardChainsForSeeds).forEach(function runTest(seed) {
  test('Test (forward direction) with seed ' + seed, function testChooseNext(t) {
    t.plan(1);

    var chooseNext = createChooser({
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
      expectedForwardChainsForSeeds[seed],
      'Produces the expected chain for seed ' + seed
    );
  });
});

Object.keys(expectedBackwardChainsForSeeds).forEach(function runTest(seed) {
  test('Test (forward direction) with seed ' + seed, function testChoosePrev(t) {
    t.plan(1);

    var choosePrev = createChooser({
      random: seedrandom(seed),
      followFreqsData: precedeFreqs
    });

    var phonemeChain = ['END'];
    var lastPhoneme = 'END';

    while (lastPhoneme !== 'START') {
      phonemeChain.unshift(choosePrev(lastPhoneme));
      lastPhoneme = phonemeChain[0];
    }

    t.deepEqual(
      phonemeChain, 
      expectedBackwardChainsForSeeds[seed],
      'Produces the expected chain for seed ' + seed
    );
  });
});
