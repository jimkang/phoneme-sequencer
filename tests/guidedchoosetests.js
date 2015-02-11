var test = require('tape');
var createChooser = require('../choose').createChooser;
var createGuide = require('../single-vowel-syllable-guide').createGuide;
var seedrandom = require('seedrandom');
var jsonfile = require('jsonfile');

var followFreqs = jsonfile.readFileSync(__dirname +
  '/../data/phoneme-follow-frequencies-in-syllables.json'
);
var precedeFreqs = jsonfile.readFileSync(__dirname +
  '/../data/phoneme-preceding-frequencies-in-syllables.json'
);

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
  'Atma Weapon': [
    'START',
    'Z',
    'AH',
    'END'
  ],
  '0': [
    'START',
    // 'SH',
    // 'AH',
    // 'B',
    // 'AA',
    'R',
    'EY',
    'END'
  ],
  '1423015785022': [
    'START',
    'T',
    'AH',
    'N',
    'T',
    'END'
  ]
};

Object.keys(expectedForwardChainsForSeeds).forEach(function runTest(seed) {
  test('Test (forward direction) with seed ' + seed, function testChooseNext(t) {
    t.plan(1);

    var chooseNext = createChooser({
      random: seedrandom(seed),
      followFreqsData: followFreqs,
      guide: createGuide()
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
  test('Test (backward direction) with seed ' + seed, function testChoosePrev(t) {
    t.plan(1);

    var choosePrev = createChooser({
      random: seedrandom(seed),
      followFreqsData: precedeFreqs,
      guide: createGuide({
        direction: 'backward'
      })
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

test('Test from middle (forward direction)', function testForwardFromMiddle(t) {
  t.plan(1);

  var chooseNext = createChooser({
    random: seedrandom('from middle, forward'),
    followFreqsData: followFreqs,
    guide: createGuide()
  });

  var phonemeChain = ['AE'];
  var lastPhoneme = 'AE';

  while (lastPhoneme !== 'END') {
    phonemeChain.push(chooseNext(lastPhoneme));
    lastPhoneme = phonemeChain[phonemeChain.length - 1];
  }

  t.deepEqual(
    phonemeChain,
    ['AE', 'D', 'END'],
    'Produces the expected chain, moving forward from the middle.'
  );
});

test('Test from middle (backward direction)', function testBackwardFromMiddle(t) {
  t.plan(1);

  var choosePrev = createChooser({
    random: seedrandom('from middle, backward'),
    followFreqsData: precedeFreqs,
    guide: createGuide({direction: 'backward'})
  });

  var phonemeChain = ['AE'];
  var lastPhoneme = 'AE';

  while (lastPhoneme !== 'START') {
    phonemeChain.unshift(choosePrev(lastPhoneme));
    lastPhoneme = phonemeChain[0];
  }

  t.deepEqual(
    phonemeChain,
    ['START', 'S', 'IH', 'K', 'AE'],
    'Produces the expected chain, moving backward from the middle.'
  );
});
