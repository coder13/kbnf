# KBNF

## Installation

```bash
npm install kbnf
```

# Usage


Usage:

```js
const { Parser, Generator } = require('kbnf');

const parser = new Parser();

const grammar = parser.parse(`
# this is a comment
# the lhs of each rule denotes the rule's name
# the right hand side is a "|" separated list of values to be randomly returned
# numbers and letters are currently supported for generating random values
num = 1 | 2 | 3 | 4 | 5
letter = "a" | "b" | "c"
# rules can be referenced to create more complex generators
numOrLetter = num | letter
`);

const generator = new Generator(grammar);

generator.generate('num'); // one of 1, 2, 3, 4, or 5
generator.generate('letter'); // one of a, b, or c
generator.generate('numOrLetter'); // one of 1-5 or a-c
```
