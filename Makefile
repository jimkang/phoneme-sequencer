test: test-choose
	node tests/sequencertests.js

test-choose: data/phoneme-follow-frequencies-in-syllables.js data/phoneme-preceding-frequencies-in-syllables.js
	node tests/choosenexttests.js

data/phoneme-follow-frequencies-in-syllables.js:
	cd node_modules/phonemenon && \
	make phoneme-follow-frequencies-in-syllables.js && \
	cp phoneme-follow-frequencies-in-syllables.js ../../data

data/phoneme-preceding-frequencies-in-syllables.js:
	cd node_modules/phonemenon && \
	make phoneme-preceding-frequencies-in-syllables.js && \
	cp phoneme-preceding-frequencies-in-syllables.js ../../data
