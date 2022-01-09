const Parser = require('./');

const parser = new Parser();

console.log(parser.parse(`
   
 
 
 
foo = bar | baz
bar = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
baz = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
`))
