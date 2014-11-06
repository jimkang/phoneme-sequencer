Specification
=============

getFollowingPhoneme(getFollowerTable, chooseFromTable, phoneme, seed)
--------

  > Given:

  - **getFollowerTable** returns a rangeTable object that maps ranges to follower phonemes. (Probably going to commonly be curried.)
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

> Then:

  - It creates `followerTable` by calling `getFollowerTable` with `phoneme`.
  - It returns the value of `chooseFromTable(followerTable, seed)`.
