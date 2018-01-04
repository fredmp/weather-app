const fs = require('fs');
const request = require('request');

module.exports = ({ address, latitude, longitude }, cb) => {
  const baseUrl = 'https://api.darksky.net/forecast';
  const apiKey = JSON.parse(fs.readFileSync('api_key.json', { encoding: 'utf8', flag: 'a+' })).weather_api_key;
  const params = 'exclude=minutely,hourly,daily,alerts,flags&lang=pt&units=si';
  request({
    url: `${baseUrl}/${apiKey}/${latitude},${longitude}?${params}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      cb('Unable to connect to darksky servers');
    } else if (response.statusCode === 200) {
      const { summary, temperature } = body.currently
      cb(undefined, {
        address,
        summary,
        temperature
      });
    } else {
      cb(`Error: ${body}`);
    }
  });
};
