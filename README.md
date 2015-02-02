phoneme-sequencer
=================

This module contains functions for ordering phonemes.

Installation
------------

    npm install phoneme-sequencer

Usage
-----

    var sequencer = require('phoneme-sequencer');

    var seq = sequencer.completeSequence(
      {
        base: ['START', 'L'] // Does not have to include 'START' or 'END'
        boundary: 'syllable' // or 'word'
        seed: 800
      }
    );

    console.log(seq);

    // ['START', 'L', 'EH', 'K', 'S', 'END']

TODO: post-build step with phonemenon.

[Specification](specification.md)
-----------

Tests
-----

Run tests with `make test`.

License
-------

MIT.
