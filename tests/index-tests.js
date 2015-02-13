var test = require('tape');
var index = require('../index');
var seedrandom = require('seedrandom');

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

    var completeSequence = index.createSyllableCapSequencer({
      random: seedrandom(kit.seed)
    });

    var sequence = completeSequence({
      base: kit.startingChain
    });
    
    t.deepEqual(sequence, kit.resultChain);
  });
});
