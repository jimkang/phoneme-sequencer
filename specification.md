Specification
=============

All method params will be described in the spec as a list, but in practice, they will be keys in an options object.

createSequenceCompleter(chooseNext, choosePrev)
------------------------------------

> Given:

- chooseNext: function (phoneme)
- Returns the phoneme that should go after the given phoneme.
- choosePrev: function (phoneme)
- Returns the phoneme that should go after the given phoneme.

> Then:

- Saves `chooseNext` and `choosePrev` if they are given, otherwise creates them with `createChooseNext` and `createChoosePrev`.
- Returns `completeSequence`, which has scope access to `chooseNext` and `choosePrev`.

completeSequence(base)
----------------------

> Given:

- base: An array of phonemes, which can include 'START' and 'END'.

> Then:

- Until it reaches 'END', does the following, starting with the the last element in `base`:
  - Picks a phoneme using `chooseNext`.
  - Adds that phoneme to the new sequence.
- Until it reaches 'START', does the following, starting with the first element in `base`:
  - Picks a phoneme using `choosePrev`.
  - Adds that phoneme to the front of the new sequence.
- Returns the new sequence.

createChooseNext(seed)
----------------------

- Creates a [seedrandom](https://github.com/davidbau/seedrandom) generator named `seedRandom` if seed is defined.
- Creates `followFreqsTable` (a dictionary of `probable` range tables) using probable and `phoneme-follow-frequencies-in-syllables.js`.
- Returns a function (phoneme) that:
  - Returns the next phoneme by calling `followFreqsTable[phoneme].roll()` if `seedRandom` is undefined.
  - Returns the next phoneme by calling `followFreqsTable[phoneme].outcomeAtIndex(Math.floor(seedRandom() * followFreqsTable[phoneme].length))` if `seedRandom` is undefined.

createChoosePrev(seed)
----------------------

Does the same thing as `createChooseNext` except that it uses `phoneme-preceding-frequencies-in-syllables.js` instead.


TODO: Store probability table data as arrays of ranges, not dictionaries.
