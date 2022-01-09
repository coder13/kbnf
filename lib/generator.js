const randInt = (x) => Math.floor(Math.random() * x);

class Generator {
  constructor(grammar) {
    this.grammar = grammar;
  }

  findRule(name) {
    return this.grammar.rules.find((rule) => rule.name === name);
  }

  generate(name) {
    const rule = this.findRule(name);
    if (!rule) {
      throw new Error('Invalid rule name');
    }

    const randomValue = rule.values[randInt(rule.values.length)];
    if (randomValue.type === 'rule') {
      return this.generate(randomValue.value);
    } else {
      return randomValue.value;
    }
  }
}

module.exports = Generator;
