require('chai').should();
const { Parser } = require('../lib/index.js');

const parser = new Parser();

describe('Errors', function () {
  it('Reports errors with invalid input', function () {
    (function () {
      parser.parse('1');
    }).should.throw('Unexpected beginning to line: 1');
  });
});
