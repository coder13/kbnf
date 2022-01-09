
const isChar = (x) => /[a-zA-Z]/.test(x);

class Parser {
  constructor(options) {
    this.options = options;
  }

  error(msg) {
    console.error(`Syntax Error: ${msg.replaceAll('\n', '\\n')} at line ${this.line}:${this.col}`);
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

    console.log(this.pos);
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
    console.log(this.peek(), isChar(this.peek()))
    while (isChar(this.peek())) {
      ret += this.eat();
    }
    return ret;
  }

  ruleName() {
    const name = this.text();
    return name;
  }

  value() {
    if (this.peek() === '"') {
      return {
        literal: this.quotedLiteral(),
      }
    } else {
      return {
        rule: this.ruleName(),
      };
    }
  }

  values() {
    const values = [this.value()];
    while (this.peek() !== '\n') {
      values.push();
    }
    return values;
  }
  
  rule() {
    console.log('rule');
    const name = this.ruleName();
    this.optionalWhitespace();
    this.eat('=');
    const values = this.values();
    return {
      name,
      values,
    }
  }
  
  comment() {
    while (this.peek() !== '\n') {
      this.eat();
    }
    this.eat('\n');
  }
  
  grammar() {
    this.optionalWhitespace();
    const rules = [this.rule()];

    // while (!this.done()) {
      // if (this.peek() === '#') {
      //   this.comment();
      //   continue;
      // }
    // }

    return rules;
  }
    
  optionalWhitespace() {
    if (this.peek() === ' ' || this.peek() === '\t' || this.peek() === '\n') {
      this.eat();
      this.optionalWhitespace();
    }
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