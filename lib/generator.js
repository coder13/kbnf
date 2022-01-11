const randInt = (x) => Math.floor(Math.random() * x);

class Generator {
  constructor(grammar) {
    this.grammar = grammar;
  }

  findRule(name) {
    return this.grammar.rules.find((rule) => rule.name === name);
  }

  generate(name, stringify) {
    const rule = this.findRule(name);
    if (!rule) {
      throw new Error(`Invalid rule name: ${name}`);
    }

    const randomValue = rule.values[randInt(rule.values.length)];
    const generatedValues = randomValue.map(({ type, value }) =>
      type === 'rule' ? this.generate(value, stringify) : value
    );

    if (stringify) {
      return generatedValues.join('');
    }

    return generatedValues;
  }
}

module.exports = Generator;
