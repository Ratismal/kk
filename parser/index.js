const cmu = require('./cmu.js');

const KKSounds = {
  way: ['EY', 'AY', 'ARX', 'IH',],
  nah: ['AE', 'AH', 'AX'],
  me: ['I', 'IX', 'IY'],
  now: ['AW', 'ER', 'EH'],
  oh: ['AO', 'UW', 'R', 'OW', 'OY', 'UH', 'UW', 'UX', 'AA']
}

class Word {
  constructor(parser, word) {
    this.parser = parser;
    this.original = word;

    this.parts = [];
    this.syllables = [];
  }

  parse() {
    this.parts = cmu.getWord(this.original) || [];

    if (this.parts.length === 0 && !this.parser.errors.includes(this.original)) {
      this.parser.errors.push(this.original);
    }

    let syllable = [];
    let started = false;
    this.syllables.push(syllable)
    for (let i = 0; i < this.parts.length; i++) {
      let prev = cmu.getPhone(this.parts[i - 1]);
      let part = this.parts[i];
      let phone = cmu.getPhone(part);
      let next = cmu.getPhone(this.parts[i + 1]);
      if ((phone !== 'vowel' && next === 'vowel' && started && syllable.length > 0)
        || (phone === 'vowel' && prev === 'vowel')) {
        syllable = [];
        this.syllables.push(syllable);
        // if (started) {
        //   this.syllables.push(syllable);
        //   syllable = [];
        // } else {
        //   started = true;
        // }
      } else if (phone === 'vowel') {
        started = true;
      }
      syllable.push(part);
    }
  }

  determineSounds() {
    const sounds = [];

    for (const syllable of this.syllables) {
      let sound;
      for (const part of syllable) {
        let base = part.substring(0, 2);
        if (cmu.getPhone(base) === 'vowel') {
          for (const [key, vowels] of Object.entries(KKSounds)) {
            if (vowels.includes(base)) {
              sound = key;
              break;
            }
          }

          break;
        }
      }

      if (!sound) sound = '*';

      sounds.push(sound);
    }

    return sounds;
  }
}

class Line {
  constructor(parser, line) {
    this.parser = parser;
    this.original = line.split(/\s+/);

    this.words = [];
  }

  parse() {
    for (const rawWord of this.original) {
      if (!rawWord) continue;
      const word = new Word(this.parser, rawWord);
      this.words.push(word);
      word.parse();
    }
  }
}

class Parser {
  constructor() {
    this.original = [];
    this.lines = [];
    this.errors = [];
  }

  parse(input) {
    this.original = input.replace(/[^A-Z0-9 \n']/gi, '').split('\n');

    for (const rawLine of this.original) {
      const line = new Line(this, rawLine);
      this.lines.push(line);

      line.parse();
    }
  }

  output() {
    const lines = [];
    for (const line of this.lines) {
      let raw = [];
      let phonetic = [];
      let sounds = [];

      for (const word of line.words) {
        let _p = word.syllables.map(s => s.join(' '));
        let _s = word.determineSounds();

        let p = [];
        let s = [];

        for (let i = 0; i < _p.length; i++) {
          let __p = _p[i];
          let __s = _s[i] || '';
          let length = Math.max(__p.length, __s.length);

          p.push(__p.padEnd(length, ' '));
          s.push(__s.padEnd(length, ' '));
        }

        p = p.join('  ');
        s = s.join('  ');
        let r = word.original;

        let length = Math.max(p.length, s.length, r.length);
        phonetic.push(p.padEnd(length, ' '));
        sounds.push(s.padEnd(length, ' '));
        raw.push(r.padEnd(length, ' '));
      }

      lines.push(raw.join('   '), phonetic.join(' | '), sounds.join(' | ') + '\n');
    }

    return lines.join('\n')
  }
}

module.exports = Parser;
