const yargs = require('yargs');
const fs = require('fs');

const geocode = require('./geocode');
const weather = require('./weather');

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
  console.log('Using callbacks\n');
  geocode.callbacks(argv.address, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      const apiKeyFile = JSON.parse(fs.readFileSync('api_key.json', { encoding: 'utf8', flag: 'a+' }));
      weather.callbacks(apiKeyFile.weather_api_key, result, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          print(result);
        }
      });
    }
  });
} else {
  console.log('Using promises\n');
  geocode.promises(argv.address)
    .then(result => {
      const apiKeyFile = JSON.parse(fs.readFileSync('api_key.json', { encoding: 'utf8', flag: 'a+' }));
      return weather.promises(apiKeyFile.weather_api_key, result);
    })
    .then(result => {
      print(result);
    })
    .catch((error) => {
      console.log(error);
    })
}

const print = ({ address, summary, temperature }) => {
  console.log(
    `\n----------------`,
    `\nAddress:\t${address}`,
    `\nSummary:\t${summary}`,
    `\nTemperature:\t${temperature}`,
    `\n----------------\n`
  );
};
