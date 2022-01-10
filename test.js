const { Parser } = require('./lib/index.js');

console.log((new Parser()).parse(`<foo> = 2`));