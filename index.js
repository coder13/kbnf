
const isChar = (x) => /[a-zA-Z]/.test(x);
const isNum = (x) => /[0-9]/.test(x);

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
    const digits = this.eat();
    while (!this.done() && isNum(this.peek())) {
      digits += this.peek();
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
        literal: this.quotedString(),
      }
    } else if (isNum(this.peek())) {
      return {
        type: 'literal',
        literal: this.integer(),
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
    console.log('Parsing rule', name)
    this.optionalWhitespace();
    this.eat('=');
    this.optionalWhitespace();
    const values = this.values();
    console.log(106, name, values)
    return {
      name,
      values,
    }
  }
  
  comment() {
    while (!this.done() && this.peek() !== '\n') {
      this.eat();
    }
    this.eat('\n');
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
      if (this.peek() === '\n') {
        this.eat();
        continue;
      } else if (this.peek() === '#') {
        this.comment();
        continue;
      }
      grammar.rules.push(this.rule());
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