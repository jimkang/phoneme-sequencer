phoneme-sequencer
=================

This module contains functions for ordering phonemes.

Installation
------------

    npm install phoneme-sequencer

Usage
-----

    var sequencer = require('phoneme-sequencer');

    var sequence = sequencer.createSequence();
    while (sequence.next(seed, filter));
    return sequence.getPhonemes();

    Get first
    Get next(previous)
    Get next(previous)
    done

TODO: post-build step with phenemenon.

[Specification](specification.md)
-----------

Tests
-----

Run tests with `make test`.

License
-------

MIT.
