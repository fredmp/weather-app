const request = require('request');

const callbacks = (api_key, { address, latitude, longitude }, cb) => {
  const URL = 'https://api.darksky.net/forecast';
  const PARAMS = 'exclude=minutely,hourly,daily,alerts,flags&lang=pt&units=si';
  request({
    url: `${URL}/${api_key}/${latitude},${longitude}?${PARAMS}`,
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

const promises = (api_key, { address, latitude, longitude }) => {
  return new Promise((resolve, reject) => {
    const URL = 'https://api.darksky.net/forecast';
    const PARAMS = 'exclude=minutely,hourly,daily,alerts,flags&lang=pt&units=si';
    request({
      url: `${URL}/${api_key}/${latitude},${longitude}?${PARAMS}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        reject('Unable to connect to darksky servers');
      } else if (response.statusCode === 200) {
        const { summary, temperature } = body.currently
        resolve({
          address,
          summary,
          temperature
        });
      } else {
        reject(`Error: ${body}`);
      }
    });
  });
};

module.exports = {
  callbacks,
  promises
}
