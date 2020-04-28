const cmu = require('./cmu.json');

module.exports = {
  getWord(word) {
    return cmu.dict[word.toLowerCase()];
  },
  getPhone(symbol = '') {
    return cmu.phones[symbol.substring(0, 2)];
  },
  getSymbols() {
    return cmu.symbols;
  }
}