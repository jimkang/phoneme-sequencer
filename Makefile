PHMN = node_modules/phonemenon
CMUDICT = $(PHMN)/ext/cmudict.0.7a

test: test-choose
	node tests/sequencertests.js
	node tests/stopjudgetests.js
	node tests/index-tests.js

test-choose: data/phoneme-follow-frequencies-in-syllables.json data/phoneme-preceding-frequencies-in-syllables.json
	node tests/choosetests.js
	node tests/guidedchoosetests.js

data/phoneme-follow-frequencies-in-syllables.json:
	cat $(CMUDICT) | node $(PHMN)/phonemize-analyze-ff.js \
	--analyze-in-syllables > data/phoneme-follow-frequencies-in-syllables.json

data/phoneme-preceding-frequencies-in-syllables.json:
	cat $(CMUDICT) | node $(PHMN)/phonemize-analyze-ff.js --reverse true \
	--analyze-in-syllables > data/phoneme-preceding-frequencies-in-syllables.json
