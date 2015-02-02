var test = require('tape');
var phonemeSequencer = require('../phoneme-sequencer');

var smarchPhonemes = [
  'START',
  'S',
  'M',
  'AA',
  'R',
  'CH',
  'END'
];

function chooseNextInSmarch(phoneme) {
  var index = smarchPhonemes.indexOf(phoneme);

  if (index < smarchPhonemes.length - 1) {
    return smarchPhonemes[index + 1];
  }
  else {
    return 'END';
  }
}

function choosePrevInSmarch(phoneme) {
  var index = smarchPhonemes.indexOf(phoneme);
  if (index > 0) {
    return smarchPhonemes[index - 1];
  }
  else {
    return 'START';
  }
}

test('createSequenceCompleter with missing params', function ctorParams(t) {
  t.plan(4);

  t.throws(
    function throwScope() {
      phonemeSequencer.createSequenceCompleter();
    },
    /Missing opts\./
  );

  // TODO: Should provide missing choosePrev and chooseNext instead of throwing.

  t.throws(
    function throwScope() {
      phonemeSequencer.createSequenceCompleter({
        base: ['TH'],
        chooseNext: function() { return 'END'; }
      });
    },
    /Missing `choosePrev` parameter\./
  );

  t.throws(
    function throwScope() {
      phonemeSequencer.createSequenceCompleter({
        base: ['TH'],
        choosePrev: function() { return 'START'; }
      });
    },
    /Missing `chooseNext` parameter\./
  );

  t.doesNotThrow(
    function throwScope() {
      phonemeSequencer.createSequenceCompleter({
        base: ['TH'],
        chooseNext: function() { return 'END'; },
        choosePrev: function() { return 'START'; }
      });
    }
  );
});

test('completeSequence with missing params', function completeSequenceParams(t) {
  t.plan(7);

  var completeSequence = phonemeSequencer.createSequenceCompleter({
    chooseNext: function() { return 'END'; },
    choosePrev: function() { return 'START'; }
  });

  t.throws(
    function throwScope() {
      completeSequence();
    },
    /Missing opts\./
  );

  t.throws(
    function throwScope() {
      completeSequence({
        base: undefined
      });
    },
    /Missing `base` parameter\./
  );

  t.throws(
    function throwScope() {
      completeSequence({
        base: []
      });
    },
    /Missing `base` parameter\./
  );

  t.throws(
    function throwScope() {
      completeSequence({
        base: 'TH'
      });
    },
    /Missing `base` parameter\./
  );

  t.doesNotThrow(
    function throwScope() {
      completeSequence({
        base: ['TH'],
        chooseNext: function() { return 'END'; },
        choosePrev: function() { return 'START'; }
      });
    }
  );

  t.throws(
    function throwScope() {
      var badCompleteSequence = phonemeSequencer.createSequenceCompleter({
        chooseNext: function() { return 'ASDF'; },
        choosePrev: function() { return 'START'; }        
      });
      badCompleteSequence({
        base: ['TH']
      });
    },
    /Bad `chooseNext` function: Called 10000 times without getting 'END'\./
  );

  t.throws(
    function throwScope() {
      var badCompleteSequence = phonemeSequencer.createSequenceCompleter({
        chooseNext: function() { return 'END'; },        
        choosePrev: function() { return 'ZXCV'; }
      });
      badCompleteSequence({
        base: ['TH']
      });
    },
    /Bad `choosePrev` function: Called 10000 times without getting 'START'\./
  );

});

test('completeSequence from middle', function testMiddle(t) {
  t.plan(6);

  var completeSequence = phonemeSequencer.createSequenceCompleter({
    chooseNext: function chooseNextInOrder(phoneme) {
      t.ok('Calls chooseNext (should be called twice).');
      return chooseNextInSmarch(phoneme);
    },
    choosePrev: function choosePrevInOrder(phoneme) {
      t.ok('Calls choosePrev (should be called three times).');
      return choosePrevInSmarch(phoneme);
    }
  });

  var sequence = completeSequence({
    base: ['AA', 'R'],
  });

  t.deepEqual(sequence, smarchPhonemes);
});

test('completeSequence from start', function testStart(t) {
  t.plan(7);

  var completeSequence = phonemeSequencer.createSequenceCompleter({
    chooseNext: function chooseNextInOrder(phoneme) {
      t.ok('Calls chooseNext (should be called six times).');
      return chooseNextInSmarch(phoneme);
    },
    choosePrev: function choosePrevInOrder(phoneme) {
      t.fail('Does not call choosePrev.');
    }
  });

  var sequence = completeSequence({
    base: ['START']
  });
  
  t.deepEqual(sequence, smarchPhonemes);
});

test('completeSequence from end', function testEnd(t) {
  t.plan(6);

  var completeSequence = phonemeSequencer.createSequenceCompleter({
    chooseNext: function chooseNextInOrder(phoneme) {
      t.fail('Does not call chooseNext.');
    },
    choosePrev: function choosePrevInOrder(phoneme) {
      t.ok('Calls choosePrev (should be called five times).');
      return choosePrevInSmarch(phoneme);
    }
  });

  var sequence = completeSequence({
    base: ['CH', 'END']
  });
  
  t.deepEqual(sequence, smarchPhonemes);
});

