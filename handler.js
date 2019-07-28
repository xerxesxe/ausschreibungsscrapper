const request = require('axios');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { differenceWith, isEqual } = require('lodash');
const { extractListingsFromHTML } = require('./helpers');

module.exports.getscrapper = (event, context, callback) => {
  let newAus, allAus;

  request('https://www.zgs-consult.de/aktuelles/?tx_news_pi1%5BoverwriteDemand%5D%5Bcategories%5D=1&cHash=9529b5226579c5b717c0b795dc74af06')
    .then(({data}) => {
      allAus = extractListingsFromHTML(data);

      // Retrieve yesterday's Ausschreibungen
      return dynamo.scan({
        TableName: 'scrapper'
      }).promise();
    })
    .then(response => {
      // Figure out which Ausschreibungen are new
      let yesterdaysAus = response.Items[0] ? response.Items[0].ausschreibungen : [];

      newAus = differenceWith(allAus, yesterdaysAus, isEqual);

      // Get the ID of yesterday's Ausschreibungen which can now be deleted
      const AusToDelete = response.Items[0] ? response.Items[0].listingId : null;

      // Delete old Ausschreibungen
      if (AusToDelete) {
        return dynamo.delete({
          TableName: 'scrapper',
          Key: {
            listingId: AusToDelete
          }
        }).promise();
      } else return;
    })
    .then(() => {
      // Save the list of today's Ausschreibungen
      return dynamo.put({
        TableName: 'scrapper',
        Item: {
          listingId: new Date().toString(),
          ausschreibungen: allAus
        }
      }).promise();
    })
    .then(() => {
      callback(null, { ausschreibungens: newAus });
    })
    .catch(callback);
};