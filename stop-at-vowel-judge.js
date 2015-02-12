var phonemeTypes = require('phoneme-types');

function createStopAtVowelJudge() {
  return function shouldTerminate(opts) {
    return (
      opts.nextPhonemeCandidate === 'START' ||
      opts.nextPhonemeCandidate === 'END' ||
      phonemeTypes.isVowelish(opts.nextPhonemeCandidate)
    );
  };
}

module.exports = {
  createJudge: createStopAtVowelJudge
};
