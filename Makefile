test:
	node tests/sequencertests.js

data/phoneme-follow-frequencies-in-syllables.js:
	cd node_modules/phonemenon && \
	make phoneme-follow-frequencies-in-syllables.js && \
	cp phoneme-follow-frequencies-in-syllables.js ../../data

data/phoneme-preceding-frequencies-in-syllables.js:
	cd node_modules/phonemenon && \
	make phoneme-preceding-frequencies-in-syllables.js && \
	cp phoneme-preceding-frequencies-in-syllables.js ../../data
