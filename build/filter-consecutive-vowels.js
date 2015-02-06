var phonemeTypes = require('phoneme-types');
var _ = require('lodash');

if (process.argv.length < 2) {
  console.log('Usage: cat <freq file> | node filter-consecutive-vowels.js');
}

var inputText = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    inputText += chunk;
  }
});

process.stdin.on('end', function() {
  var freqDict = JSON.parse(inputText);
  var filteredDict = filterConsecutiveVowels(freqDict);
  process.stdout.write(JSON.stringify(filteredDict, null, '  '));
});

function filterConsecutiveVowels(freqDict) {
  var filteredDict = {};

  for (var base in freqDict) {
    var followers = freqDict[base];
    var newFollowers = {};
    if (phonemeTypes.isVowelish(base)) {
      for (var phoneme in followers) {
        if (!phonemeTypes.isVowelish(phoneme)) {
          newFollowers[phoneme] = followers[phoneme];
        }
      }
    }
    else {
      newFollowers = _.cloneDeep(followers);
    }

    filteredDict[base] = newFollowers;
  }

  return filteredDict;
}
