require("chai").should();
const { Parser } = require('../lib/index.js');

const parser = new Parser();

describe('Parser', function () {
  it('Parses empty code', function () {
    parser.parse('');
  });

  it('Parses whitespace', function () {
    parser.parse('\n   \t   \n   ');
  });

  it('Parses comments', function () {
    parser.parse('\n# foo bar baz \n #boop');
  });

  it('Parses rules with basic string literals', function () {
    const grammar = parser.parse('<foo> = "a"');
    grammar.should.deep.equal({
      rules: [{
        name: 'foo',
        values: [[{
          type: 'literal',
          value: 'a',
        }]],
      }]
    });
  });

  it('Parses rules with multiple string literals', function () {
    const grammar = parser.parse('<foo> = "a" | "b" | "c"');
    grammar.should.deep.equal({
      rules: [{
        name: 'foo',
        values: [[{
          type: 'literal',
          value: 'a',
        }], [{
          type: 'literal',
          value: 'b',
        }], [{
          type: 'literal',
          value: 'c',
        }]],
      }]
    });
  });

  it('Parses rules with numbers', function () {
    const grammar = parser.parse('<foo> = 0 | 1 | 12');
    grammar.should.deep.equal({
      rules: [{
        name: 'foo',
        values: [[{
          type: 'literal',
          value: 0,
        }], [{
          type: 'literal',
          value: 1,
        }], [{
          type: 'literal',
          value: 12,
        }]],
      }]
    });
  });

  it('Parses rules referencing other rules', function () {
    const grammar = parser.parse('<foo> = <bar> | <baz>');
    grammar.should.deep.equal({
      rules: [{
        name: 'foo',
        values: [[{
          type: 'rule',
          value: 'bar',
        }], [{
          type: 'rule',
          value: 'baz',
        }]],
      }]
    });
  });

  it('Parses multiple rules', function () {
    const grammar = parser.parse(`
      <foo> = <bar> | <baz>
      <bar> = "a" | "b" | "c"
      <baz> = 1 | 2 | 3
    `);
    grammar.should.deep.equal({
      rules: [{
        name: 'foo',
        values: [[{
          type: 'rule',
          value: 'bar',
        }], [{
          type: 'rule',
          value: 'baz',
        }]],
      }, {
        name: 'bar',
        values: [[{
          type: 'literal',
          value: 'a',
        }], [{
          type: 'literal',
          value: 'b',
        }], [{
          type: 'literal',
          value: 'c',
        }]],
      }, {
        name: 'baz',
        values: [[{
          type: 'literal',
          value: 1,
        }], [{
          type: 'literal',
          value: 2,
        }], [{
          type: 'literal',
          value: 3,
        }]],
      }]
    });
  });

  it('Parses multi-part values', function() {
    const grammar = parser.parse(`<bars> = "a" | "a" <bars>`);
    grammar.should.deep.equal({
      rules: [{
        name: 'bars',
        values: [[{
          type: 'literal',
          value: 'a'
        }], [{
          type: 'literal',
          value: 'a'
        }, {
          type: 'rule',
          value: 'bars',
        }]]
      }],
    });
  });
});
