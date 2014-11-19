Specification
=============

All method params will be described in the spec as a list, but in practice, they will be keys in an options object. e.g. `say(guys, words)` will be implemented as `say(opts)`, where opts will look like:

    {
      guys: ['Bonus Cat', 'Dr. Wily'],
      words: ['ohay', 'guys']
    }

getFollowingPhoneme(getFollowerTable, chooseFromTable, phoneme, seed)
--------

  > Given:

  - **getFollowerTable(phoneme)** returns a rangeTable object that maps ranges to follower phonemes. (Will commonly be curried.)
    - The `rangeTable` object has the methods defined in [probable's createRangeTable](https://github.com/jimkang/probable/blob/master/probable.js#L19).
  e.g. `getFollowerTable('ZH')` returns a range table with contents like this:

          [
            247: "AH",
            92: "ER",
            63: "END",
            45: "IH",
            24: "IY",
            24: "AA",
            13: "EH",
            12: "UW",
            9: "EY",
            6: "AO",
            6: "OW",
            6: "AW",
            5: "W",
            4: "D",
            4: "UH",
            3: 'AY',
            1: 'AE'
          ]
  - **chooseFromTable(table, seed)** is a function that chooses from a `rangeTable`. It can assume that the rangeTable is arranged from high probability to low probability. It may or may not use the given `seed`. (Probably going to commonly be curried.)
  - **phoneme** is a phoneme for which the function will find a follower.
  - **seed** is a number that can be used to decide which sequence should be picked.
  - **done** is a standard callback that takes `error` and `phoneme` (the resulting phoneme).

> Then:

  - It creates `followerTable` by calling `getFollowerTable` with `phoneme`.
  - It returns the value of `chooseFromTable(followerTable, seed)`.

getAntecedentTableForPhoneme(probable, phonemeFollowFreqMap, phoneme, done)
-----
This function follows the `getFollowerTable` specification.

  > Given:

- `probable` is a module like [probable](https://github.com/jimkang/probable).
- `phonemeFollowFreqMap` (will commonly be curried) is a map that maps key phonemes to phonemes that follow them (as observed in a corpus) along with the number of times the follower has been observed following the key phoneme. e.g.:

      {
        "EH": {
          "K": 2479,
          "N": 3607,
          "S": 1709,
          "F": 258,
          "END": 11849,
          "TH": 83,
          ...
        },
        "K": {
          "S": 2675,
          "END": 12195,
          "L": 997,
          ...
        }
      }

- `phoneme` is a string representing a phoneme as in cmudict.0.7a.phones.txt. The pseudophonemes 'START' and 'END' are also valid values.
- **done** is a standard callback that takes `error` and `table` (the result).

> Then:

- Calls back with the result of `probable.createRangeTableFromDict` with `phonemeFollowFreqMap` to get a **rangeTable**. The range table should list all of the most frequent followers first and the least frequent ones last. TODO: Update probable to do this.

getNextPhoneme(chooseFromTable, phoneme, seed, done)
----------------------------------------------------

This is `getFollowingPhoneme`, curried with `getAntecedentTableForPhoneme` for the getFollowerTable param.

getPrevPhoneme(chooseFromTable, phoneme, seed, done)
----------------------------------------------------

This is `getFollowingPhoneme`, curried with `getPrecedentTableForPhoneme` for the getFollowerTable param.
