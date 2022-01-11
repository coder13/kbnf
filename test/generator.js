const should = require("chai").should();
const { Generator, Parser } = require('../lib/index.js');

const generator = new Generator(new Parser().parse(`
<num> = 1 | 2 | 3 | 4 | 5
<letter> = "a" | "b" | "c"
<rule> = <num> | <letter>
<rules> = <rule> | <rule> "+" <rules>
`));

const numberGenerator = new Generator(new Parser().parse(`
<digit> = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9
<digits> = <digit> | <digit> <digits> | <digit> <digit> <digits>
`))

describe('Generator', function () {
  it('generates random literals', function () {
    const letter = generator.generate('letter');
    letter.should.be.an('array');
    letter[0].should.match(/a|b|c/);

    const num = generator.generate('num');
    num.should.be.an('array');
    num[0].should.be.above(0).and.below(6);
  });

  it('generates random from rule', function () {
    const rule = generator.generate('rule');
    rule.should.be.an('array');
    rule.toString().should.match(/a|b|c|[0-5]/);
  });

  it('generates rule recursively and stringify', function () {
    const digits = numberGenerator.generate('digits', true);
    digits.should.match(/\d*/)
  });

  it('throws error for invalid rule name', function () {
    (() => {
      numberGenerator.generate('foo')
    }).should.throw('Invalid rule name: foo')
  })
});