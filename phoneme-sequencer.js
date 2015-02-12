var maxChooseNextCalls = 10000;
var maxChoosePrevCalls = 10000;

function createSequenceCompleter(completerOpts) {
  if (!completerOpts) {
    throw new Error('Missing opts.');
  }
  if (!completerOpts.chooseNext) {
    throw new Error('Missing `chooseNext` parameter.');
  }
  if (!completerOpts.choosePrev) {
    throw new Error('Missing `choosePrev` parameter.');
  }

  if (completerOpts.stopJudge) {
    var stopJudge = completerOpts.stopJudge;
  }

  var chooseNext = completerOpts.chooseNext;
  var choosePrev = completerOpts.choosePrev;

  function completeSequence(opts) {
    if (!opts) {
      throw new Error('Missing opts.');
    }
    if (!opts.base || !Array.isArray(opts.base) || opts.base.length < 1) {
      throw new Error('Missing `base` parameter.');
    }

    var newSequence = opts.base.slice();

    // This might be a good place for a generator.  
    var lastPhoneme = newSequence[newSequence.length - 1];

    var chooseNextCalls = 0;
    var choosePrevCalls = 0;

    while (lastPhoneme !== 'END') {
      if (chooseNextCalls >= maxChooseNextCalls) {
        throw new Error('Bad `chooseNext` function: Called ' +
          maxChooseNextCalls + ' times without getting \'END\'.');
      }

      lastPhoneme = chooseNext(lastPhoneme);
      chooseNextCalls += 1;

      if (stopJudge &&
        stopJudge({nextPhonemeCandidate: lastPhoneme})) {

        break;
      }

      newSequence.push(lastPhoneme);
    }

    var firstPhoneme = newSequence[0];

    while (firstPhoneme !== 'START') {
      if (choosePrevCalls >= maxChoosePrevCalls) {
        throw new Error('Bad `choosePrev` function: Called ' +
          maxChoosePrevCalls + ' times without getting \'START\'.');
      }

      firstPhoneme = choosePrev(firstPhoneme);
      choosePrevCalls += 1;

      if (stopJudge &&
        stopJudge({nextPhonemeCandidate: firstPhoneme})) {

        break;
      }

      newSequence.unshift(firstPhoneme);
    }

    return newSequence;
  }

  return completeSequence;
}

module.exports = {
  createSequenceCompleter: createSequenceCompleter
};
