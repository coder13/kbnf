const isLetter = (x) => x && /[a-zA-Z]/.test(x);
const isNum = (x) => x && /[0-9]/.test(x);
const isSymbol = (x) => x && "| !#$%&()*+,-./:;>=<?@[\\]^_`{}~".indexOf(x) > 0;
const isQuote = (x) => x && /[\"\']/.test(x);
const isChar = (x) => isLetter(x) || isNum(x) || isSymbol(x);
const isRuleChar = (x) => isLetter(x) || isNum(x) || x === '-';
const isLiteral = (x) => isLetter(x) || isNum(x) || isSymbol(x) || isQuote(x);

class Parser {
  constructor(options) {
    this.options = options;
  }

  error(msg) {
    throw new SyntaxError(`${msg.replace(/\n/g, '\\n')} at line ${this.line}:${this.col}`);
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

  peekNext() {
    if (this.pos + 1 >= this.source.length) {
      return;
    }

    return this.source[this.pos + 1];
  }

  eat(expected) {
    const char = this.peek();
    if (typeof expected === 'string' && char !== expected) {
      this.error(`Expected ${expected} but got ${char}`);
    } else if (typeof expected === 'array' && expected.indexOf(char) !== -1) {
      this.error(`Expected ${char} to be among ${expected}`);
    } else if (expected instanceof RegExp && !expected.test(char)) {
      this.error(`Expected ${char} to match ${expected}`);
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

  // <digit> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  digit() {
    return this.eat(isNum);
  }

  // <integer> ::= <digit> | <digit> <integer>
  integer(x) {
    let digits = this.digit();
    while (isNum(this.peek())) {
      digits += this.digit();
    }
    return Number.parseInt(digits, 10);
  }

  // <text> ::= <char> | <char> <text>
  text() {
    const text = this.eat(isChar);
    if (isChar(this.peek())) {
      return text + this.text();
    }

    return text;
  }

  // <literal> ::= "'" <text> "'" | '"' <text> '"' | <digits>
  literal() {
    if (this.peek() === '"' || this.peek() === '\'') {
      const quoteStart = this.eat();
      const text = this.text();
      this.eat(quoteStart);
      return text;
    }

    return this.integer();
  }

  // <term> ::= <literal> | <ruldef>
  term() {
    if (this.peek() === '<') {
      return {
        type: 'rule',
        value: this.ruledef(),
      };
    }

    return {
      type: 'literal',
      value: this.literal(),
    };
  }

  // <terms> ::= <term> | <term> <owsp> <terms>
  terms() {
    const terms = [this.term()];
    this.optionalWhitespace();

    const next = this.peek();
    if (isLiteral(next) || next === '<') {
      return terms.concat(this.terms());
    }

    return terms;
  }

  // <values> ::= <terms> | <terms> <owsp> "|" <owsp> <values>
  values() {
    const values = [this.terms()];
    this.optionalWhitespace();
    if (this.peek() === '|') {
      this.eat();
      this.optionalWhitespace();
      return values.concat(this.values());
    }

    return values;
  }

  // <rule-char> ::= <letter> | <digits> | "-"
  ruleChar() {
    return this.eat(isRuleChar);
  }

  // <rule-text> ::= <rule-char> <rule-text>
  ruleText() {
    const text = this.ruleChar();
    if (isRuleChar(this.peek())) {
      return text + this.ruleText();
    }

    return text;
  }

  // <rule-name> ::= <letter> <rule-char> | <letter>
  ruleName() {
    const name = this.eat(isLetter);
    if (isRuleChar(this.peek())) {
      return name + this.ruleText();
    }
  }

  // <ruledef> ::= "<" <rule-name> ">"
  ruledef() {
    this.eat('<');
    const name = this.ruleName();
    this.eat('>');
    return name;
  }
  
  // <rule> ::= <ruledef> <owsp> "=" <owsp> <expression> 
  rule() {
    const name = this.ruledef();
    this.optionalWhitespace();
    this.eat('=');
    this.optionalWhitespace();
    const values = this.values();
    return {
      name,
      values,
    };
  }
  
  // comment ::= "#" <text> "\n"
  comment() {
    while (!this.done() && this.peek() !== '\n') {
      this.eat();
    }

    if (this.peek() === '\n') {
      this.eat('\n');
    }
  }

  // optionalWhitespace ::= " " <optionalWhitespace>
  optionalWhitespace() {
    if (this.peek() === ' ' || this.peek() === '\t') {
      this.eat();
      this.optionalWhitespace();
    }
  }

  // grammar ::= <rule> | <rule> <grammar> | <comment> <grammar>
  grammar() {
    const grammar = {
      rules: [],
    };

    while (!this.done()) {
      this.optionalWhitespace();
      if (this.done()) {
        break;
      }

      const token = this.peek();

      if (token === '\n' || token === '\r') {
        this.eat();
      } else if (token === '#') {
        this.comment();
      } else if (token === '<') {
        grammar.rules.push(this.rule());
      } else {
        this.error(`Unexpected beginning to line: ${token}`);
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
