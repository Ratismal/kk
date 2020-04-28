const fs = require('fs');
const path = require('path');

const Parser = require('./parser');

const inputFile = process.argv[2] || 'input.txt'
const outputFile = process.argv[3] || 'output.txt';

const input = fs.readFileSync(path.resolve(inputFile), { encoding: 'utf8' });

const parser = new Parser();

parser.parse(input);

const output = parser.output();
console.log(output);

if (parser.errors.length > 0) {
  console.log('Unknown words:', parser.errors.map(JSON.stringify).join(', '));
  console.log('Please replace these words with more common words that sound alike!');
}

fs.writeFileSync(path.resolve(outputFile), output);

// // format into pronounciATION
// for (const inputLine of inputLines) {
//   const line = [];

//   for (const word of inputLine) {
//     line.push(cmu.getWord(word) || word);
//   }

//   pronounciation.push(line);
// }

// console.log(pronounciation);


// // parse language

// const parsed = [];

// for (const inputLine of pronounciation) {
//   const line = [];

//   for (const word of inputLine) {
//     let syllable = [];
//     line.push(syllable)
    // for (const part of word) {
    //   if (cmu.getPhone(part) === 'stop' && syllable.length > 0) {
    //     syllable = [];
    //     syllables.push(syllable);
    //   }
    //   syllable.push(part);
    // }

//     line.push(syllables);
//   }

//   parsed.push(line);
// }

// console.dir(parsed, { depth: 5 });