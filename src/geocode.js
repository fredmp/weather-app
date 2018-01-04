const request = require('request');

const callbacks = (address, cb) => {
  return request({
    url: `http://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      cb('Unable to connect to google servers');
    } else if (body.status === 'ZERO_RESULTS') {
      cb('Unable to find the address');
    } else if (body.status === 'OK') {
      cb(undefined, {
        address: body.results[0].formatted_address,
        latitude: body.results[0].geometry.location.lat,
        longitude: body.results[0].geometry.location.lng
      });
    } else {
      cb(`Unexpected status: ${body.status}`);
    }
  });
};

const promises = (address) => {
  return new Promise((resolve, reject) => {
    return request({
      url: `http://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        reject('Unable to connect to google servers');
      } else if (body.status === 'ZERO_RESULTS') {
        reject('Unable to find address');
      } else if (body.status === 'OK') {
        resolve({
          address: body.results[0].formatted_address,
          latitude: body.results[0].geometry.location.lat,
          longitude: body.results[0].geometry.location.lng
        });
      } else {
        reject(`Unexpected status: ${body.status}`);
      }
    });
  });
};

module.exports = {
  callbacks,
  promises
}
