const request = require('axios');
const {extractListingsFromHTML} = require('./helpers');

module.exports.linkedinscrapper = (event, context, callback) => {
  request('https://www.thedonkeysanctuary.org.uk/vacancies')
    .then(({data}) => {
      const jobs = extractListingsFromHTML(data);
      callback(null, {jobs});
    })
    .catch(callback);
};