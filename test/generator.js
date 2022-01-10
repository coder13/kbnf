require("chai").should();
const { Generator, Parser } = require('../lib/index.js');

const generator = new Generator(new Parser().parse(`
<num> = 1 | 2 | 3 | 4 | 5
<letter> = "a" | "b" | "c"
<rule> = <num> | <letter>
<rules> = <rule> | <rule> "," <rules>
`));

describe('Generator', function () {
  it('generates random literals', function () {
    generator.generate('letter').should.match(/a|b|c/);
    generator.generate('num').should.be.above(0).and.below(6);
  });

  it('generates random from rule', function () {
    generator.generate('rule').toString().should.match(/a|b|c|[0-5]/);
  });

  it('generates rule recursively', function () {
    generator.generate('rule').toString().should.match(/a|b|c|[0-5]/);
  });
});