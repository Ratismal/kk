const fs = require('fs');
const path = require('path');

const rawDict = fs.readFileSync(path.join(__dirname, 'cmudict-0.7b'), { encoding: 'utf8' });
const rawPhones = fs.readFileSync(path.join(__dirname, 'cmudict-0.7b.phones'), { encoding: 'utf8' });
const rawSymbols = fs.readFileSync(path.join(__dirname, 'cmudict-0.7b.symbols'), { encoding: 'utf8' });

const dict = {};
const phones = {};
const symbols = rawSymbols.replace(/\r/g, '').split('\n');

let lines = rawDict.replace(/\r/g, '').split('\n');

const dictRegex = /^(.+) {2}(.+)$/;
for (const line of lines) {
  if (!line || line.startsWith(';')) {
    continue;
  }

  const matches = line.match(dictRegex);
  if (matches)
    dict[matches[1].toLowerCase()] = matches[2].split(' ');
  else console.log('Could not parse dict line:', line);
}

lines = rawPhones.replace(/\r/g, '').split('\n');

const phonesRegex = /^(.+)\t(.+)$/;
for (const line of lines) {
  if (!line) continue;

  const matches = line.match(phonesRegex);

  if (matches)
    phones[matches[1]] = matches[2];
  else console.log('Could not parse phones line:', line)
}

module.exports = {
  dict, phones, symbols
}

fs.writeFileSync(path.join(__dirname, '..', 'parser', 'cmu.json'), JSON.stringify(module.exports));
