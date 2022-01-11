# KBNF

## Installation

```bash
npm install kbnf
```

## Usage

```js
const { Parser, Generator } = require('kbnf');

const parser = new Parser();

const grammar = parser.parse(`
# this is a comment
# the lhs of each rule denotes the rule's name
# the right hand side is a "|" separated list of values to be randomly returned
# numbers and letters are currently supported for generating random values
<num> = 1 | 2 | 3 | 4 | 5
<letter> = "a" | "b" | "c"
# rules can be referenced to create more complex generators
<numOrLetter> = <num> | <letter>
# values can consist of multiple terms that optionally are separated with whitespace
<nums> = <num> | <num> <nums>
<addition> = <nums>"+"<nums>
`);

const generator = new Generator(grammar);

// generator.generate will return an array for each term specified in the rule.
generator.generate('num'); // returns an array where the only element is one of 1, 2, 3, 4 or 5.

generator.generate('letter'); // array with only element being one of a, b, or c
generator.generate('numOrLetter'); // array with only element being one of 1-5 or a-c

// passing in true as the 2nd argument will stringify all the output rather than returning a nested set of arrays.
generator.generate('nums', true); // any digit length
```

## Examples

- [Mathematical expression generator](examples/expressionGenerator.js)
