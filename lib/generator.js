const randInt = (x) => Math.floor(Math.random() * x);

class Generator {
  constructor(grammar) {
    this.grammar = grammar;
  }

  findRule(name) {
    return this.grammar.rules.find((rule) => rule.name === name);
  }

  /**
   * Generates random values based on the rule name given
   * @param {*} name The rule name
   * @param {boolean|string} stringifyParam
   * If stringifyParam is true, then the arrays are joined with an empty string ''
   * If stringParam is a string, then the arrays are joined with whatever string is specified
   * @returns {array<array|string|number>|string|number} the random values generated based on each term and value defined by the rule
   */
  generate(name, stringifyParam) {
    const rule = this.findRule(name);
    if (!rule) {
      throw new Error(`Invalid rule name: ${name}`);
    }

    const randomValue = rule.values[randInt(rule.values.length)];
    const generatedValues = randomValue.map(({ type, value }) =>
      type === 'rule' ? this.generate(value, stringifyParam) : value
    );

    if (typeof stringifyParam === 'boolean') {
      return generatedValues.join('');
    } else if (typeof stringifyParam === 'string') {
      return generatedValues.join(stringifyParam);
    }

    return generatedValues;
  }
}

module.exports = Generator;
