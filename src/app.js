const yargs = require('yargs');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather',
      string: true
    },
    c: {
      demand: false,
      alias: 'callbacks',
      describe: 'Use callbacks instead of promises',
      boolean: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

if (argv.callbacks) {
  console.log('Using callbacks and request library\n');
  require('./callbacks/index')(argv.address);
} else {
  console.log('Using promises and axios library\n');
  require('./promises/index')(argv.address);
}
