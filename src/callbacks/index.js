const geocode = require('./geocode');
const weather = require('./weather');

module.exports = address => {
  geocode(address, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      weather(result, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          print(result);
        }
      });
    }
  });

  const print = ({ address, summary, temperature }) => {
    console.log(
      `\n----------------`,
      `\nAddress:\t${address}`,
      `\nSummary:\t${summary}`,
      `\nTemperature:\t${temperature}`,
      `\n----------------\n`
    );
  };
};
