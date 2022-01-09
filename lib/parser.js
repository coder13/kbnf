
const isChar = (x) => x && /[a-zA-Z]/.test(x);
const isNum = (x) => x && /[0-9]/.test(x);

class Parser {
  constructor(options) {
    this.options = options;
  }

  error(msg) {
    console.error(`Syntax Error: ${msg.replaceAll('\n', '\\n')} at line ${this.line}:${this.col}`);
    console.trace();
    process.exit(1);
  }

  done() {
    return this.pos >= this.source.length;
  }

  peek() {
    if (this.done()) {
      return;
    }

    return this.source[this.pos];
  }

  eat(expected) {
    const char = this.peek();
    if (typeof expected === 'string' && char !== expected) {
      this.error(`Expected ${expected} but got ${char}`);
    } else if (typeof expected === 'array' && expected.indexOf(char) !== -1) {
      this.error(`Expected ${char} to be among ${expected}`);
    } else if (typeof expected === 'function' && !expected(char)) {
      this.error(`Expected ${char} to be valid according to ${expected}`);
    }

    this.pos++;

    if (char === '\n') {
      this.line++;
      this.col = 0;
    } else {
      this.col++;
    }

   return char;
  }

  text() {
    let ret = '';
    while (!this.done() && isChar(this.peek())) {
      ret += this.eat();
    }
    return ret;
  }

  ruleName() {
    return this.text();
  }

  integer() {
    let digits = this.eat();
    while (!this.done() && isNum(this.peek())) {
      digits += this.eat();
    }
    return Number.parseInt(digits, 10);
  }

  quotedString() {
    this.eat('"');
    const string = this.text();
    this.eat('"');
    return string;
  }

  value() {
    if (this.peek() === '"') {
      return {
        type: 'literal',
        value: this.quotedString(),
      }
    } else if (isNum(this.peek())) {
      return {
        type: 'literal',
        value: this.integer(),
      }
    } else {
      return {
        type: 'rule',
        value: this.text(),
      };
    }
  }

  values() {
    const values = [this.value()];
    this.optionalWhitespace();
    while (!this.done() && this.peek() === '|') {
      this.eat('|');
      this.optionalWhitespace();
      values.push(this.value());
      this.optionalWhitespace();
      if (this.peek() === '\n') {
        break;
      }
    }
    return values;
  }
  
  rule() {
    const name = this.ruleName();
    this.optionalWhitespace();
    this.eat('=');
    this.optionalWhitespace();
    const values = this.values();
    return {
      name,
      values,
    }
  }
  
  comment() {
    while (!this.done() && this.peek() !== '\n') {
      this.eat();
    }

    if (this.peek() === '\n') {
      this.eat('\n');
    }
  }
    
  optionalWhitespace() {
    if (this.peek() === ' ' || this.peek() === '\t') {
      this.eat();
      this.optionalWhitespace();
    }
  }
  
  grammar() {
    const grammar = {
      rules: [],
    };

    while (!this.done()) {
      this.optionalWhitespace();
      if (this.done()) {
        break;
      }

      if (this.peek() === '\n') {
        this.eat();
      } else if (this.peek() === '#') {
        this.comment();
      } else if (isChar(this.peek())) {
        grammar.rules.push(this.rule());
      }
    }

    return grammar;
  }

  parse(source) {
    this.source = source;
    this.pos = 0;
    this.line = 1;
    this.col = 0;

    return this.grammar();
  }
}

module.exports = Parser;