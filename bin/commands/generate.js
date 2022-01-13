const fs = require('fs');
const { Parser, Generator } = require('../../lib');

const parser = new Parser();

module.exports = {
  command: 'generate <rule>',
  aliases: 'gen',
  desc: 'Generates random data based on the rule defined from the source grammar file',
  builder: (yargs) => {
    yargs
      .positional('rule', {
        describe: 'Rule to randomly generate data from',
        type: 'string',
      })
      .option('stringify')
  },
  handler: (argv) => {
    const file = fs.readFileSync(argv.grammar);
    const contents = String(file);
    const generator = new Generator(parser.parse(contents));
    if (!argv.stringify) {
      console.log(JSON.stringify(generator.generate(argv.rule)));
    } else {
      console.log(generator.generate(argv.rule, true));
    }
  }
};
