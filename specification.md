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

createChooseNext(random, followFreqsData)
----------------------

> Given:
- `random` is a function that returns a value between 0 and 1, like Math.random or [seedrandom](https://github.com/davidbau/seedrandom).
- `followFreqsData` is something like `phoneme-follow-frequencies-in-syllables.js`

> Then:
- Creates a `probable` instance using `random`.
- Creates `followFreqsTable` (a dictionary of `probable` range tables) using probable and `followFreqsData`.
- Returns a function (phoneme) that:
  - Returns the next phoneme by calling `followFreqsTable[phoneme].roll()`;

createChoosePrev(seed)
----------------------

Does the same thing as `createChooseNext` except that it uses `phoneme-preceding-frequencies-in-syllables.js` instead.


TODO: Store probability table data as arrays of ranges, not dictionaries.

TODO: Restrictions needed on chooser:
- Do not pick two consecutive vowel phonemes.
- Pick closing phonemes in the family specified. e.g. avoid rhyming "C AA P" "K AA R T". "K AA T" would be OK, though. I guess that's a hard consonant vs. a soft one (T vs. R)?

So, for ['AA'], this could yield something like K AA N Z, which maps to the workds:

ZIRCONS
ICAHN'S
MICHCON'S
KAHN'S
KHAN'S
KONZ
NITHUEKAN'S
PECANS(2)
AFRIKAANS
CAEN'S(1)
CONS
