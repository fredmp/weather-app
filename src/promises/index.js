const fs = require('fs');
const axios = require('axios');

module.exports = address => {
  const geoCodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}`;
  let formattedAddress;

  axios.get(geoCodeUrl)
    .then(response => {
      if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find address');
      }
      formattedAddress = response.data.results[0].formatted_address;
      const { lat, lng } = response.data.results[0].geometry.location;
      const baseUrl = 'https://api.darksky.net/forecast';
      const apiKey = JSON.parse(fs.readFileSync('api_key.json', { encoding: 'utf8', flag: 'a+' })).weather_api_key;
      const params = 'exclude=minutely,hourly,daily,alerts,flags&lang=pt&units=si';
      const weatherUrl = `${baseUrl}/${apiKey}/${lat},${lng}?${params}`;
      return axios.get(weatherUrl);
    })
    .then(response => {
      const { summary, temperature } = response.data.currently
      print(formattedAddress, summary, temperature);
    })
    .catch(error => {
      if (error.code === 'ENOTFOUND') {
        console.log('Unable to connect to API servers');
      } else {
        console.log(error.message);
      }
    });
};

const print = (address, summary, temperature) => {
  console.log(
    `\n----------------`,
    `\nAddress:\t${address}`,
    `\nSummary:\t${summary}`,
    `\nTemperature:\t${temperature}`,
    `\n----------------\n`
  );
};
