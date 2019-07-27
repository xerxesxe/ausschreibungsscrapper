const request = require('axios');
const {extractListingsFromHTML} = require('./helpers');

module.exports.scrapper = (event, context, callback) => {
  request('https://www.zgs-consult.de/aktuelles/?tx_news_pi1%5BoverwriteDemand%5D%5Bcategories%5D=1&cHash=9529b5226579c5b717c0b795dc74af06')
    .then(({data}) => {
      const jobs = extractListingsFromHTML(data);
      callback(null, {jobs});
    })
    .catch(callback);
};