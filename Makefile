PHMN = node_modules/phonemenon
CMUDICT = $(PHMN)/ext/cmudict.0.7a

test: test-choose
	node tests/sequencertests.js

test-choose: data/phoneme-follow-frequencies-in-syllables.js data/phoneme-preceding-frequencies-in-syllables.js
	node tests/choosetests.js

data/phoneme-follow-frequencies-in-syllables.json:
	cat $(CMUDICT) | node $(PHMN)/phonemize-analyze-ff.js \
	--analyze-in-syllables > data/phoneme-follow-frequencies-in-syllables.json

data/phoneme-preceding-frequencies-in-syllables.json:
	cat $(CMUDICT) | node $(PHMN)/phonemize-analyze-ff.js --reverse true \
	--analyze-in-syllables > data/phoneme-preceding-frequencies-in-syllables.json

data/loose-rhyme-follow-freqs.json: data/phoneme-follow-frequencies-in-syllables.json
	cat data/phoneme-follow-frequencies-in-syllables.json | \
	node build/filter-consecutive-vowels.js > \
	data/loose-rhyme-follow-freqs.json
