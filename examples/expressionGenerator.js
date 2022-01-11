const { Parser, Generator } = require('../');

const grammar = (new Parser()).parse(`
<num> = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
<int> = 0 | <num> | <num> <int>
<float> = <int> "." <int>
<number> = <int> | <float>
<operator> = " + " | " - " | " * " | " / " | "^"
<binaryOperation> = <number> <operator> <number>
<expression> = <binaryOperation> | "(" <binaryOperation> ")" | <binaryOperation> <operator> <expression> | "("<binaryOperation> <operator> <expression>")"
`);

const generator = new Generator(grammar);

console.log(generator.generate('expression', true));
