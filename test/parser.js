require("chai").should();
const Parser = require('../');

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

  it('Parses basic string literal rules', function () {
    const grammar = parser.parse('foo = "a"');
    grammar.should.deep.equal({
      rules: [{
        name: 'foo',
        values: [{
          type: 'literal',
          value: 'a',
        }],
      }]
    });
  });

  it('Parses rules with multiple string literals', function () {
    const grammar = parser.parse('foo = "a" | "b" | "c"');
    grammar.should.deep.equal({
      rules: [{
        name: 'foo',
        values: [{
          type: 'literal',
          value: 'a',
        }, {
          type: 'literal',
          value: 'b',
        }, {
          type: 'literal',
          value: 'c',
        }],
      }]
    });
  });

  it('Parses rules with numbers', function () {
    const grammar = parser.parse('foo = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 12');
    grammar.should.deep.equal({
      rules: [{
        name: 'foo',
        values: [{
          type: 'literal',
          value: 0,
        }, {
          type: 'literal',
          value: 1,
        }, {
          type: 'literal',
          value: 2,
        }, {
          type: 'literal',
          value: 3,
        }, {
          type: 'literal',
          value: 4,
        }, {
          type: 'literal',
          value: 5,
        }, {
          type: 'literal',
          value: 6,
        }, {
          type: 'literal',
          value: 7,
        }, {
          type: 'literal',
          value: 8,
        }, {
          type: 'literal',
          value: 9,
        }, {
          type: 'literal',
          value: 12,
        }],
      }]
    });
  });

  it('Parses rules referencing other rules', function () {
    const grammar = parser.parse('foo = bar | baz');
    grammar.should.deep.equal({
      rules: [{
        name: 'foo',
        values: [{
          type: 'rule',
          value: 'bar',
        }, {
          type: 'rule',
          value: 'baz',
        }],
      }]
    });
  });

  it('Parses multiple rules', function () {
    const grammar = parser.parse(`
      foo = bar | baz
      bar = "a" | "b" | "c"
      baz = 1 | 2 | 3
    `);
    grammar.should.deep.equal({
      rules: [{
        name: 'foo',
        values: [{
          type: 'rule',
          value: 'bar',
        }, {
          type: 'rule',
          value: 'baz',
        }],
      }, {
        name: 'bar',
        values: [{
          type: 'literal',
          value: 'a',
        }, {
          type: 'literal',
          value: 'b',
        }, {
          type: 'literal',
          value: 'c',
        }],
      }, {
        name: 'baz',
        values: [{
          type: 'literal',
          value: 1,
        }, {
          type: 'literal',
          value: 2,
        }, {
          type: 'literal',
          value: 3,
        }],
      }]
    });
  });

});
