const cheerio = require('cheerio');
const moment = require('moment');

function extractListingsFromHTML (html) {
  const $ = cheerio.load(html);
  const vacancyRows = $('.col-md-12');

  const vacancies = [];
  vacancyRows.each((i, el) => {

    // Extract information from each row of the jobs table
    let date = $(el).children('.extra').children('time').first().text().trim();
    let type = $(el).children('.extra').children('span').first().text().trim();
    let title = $(el).children('h2').first().text().trim();
    let description = $(el).children('div').children('p').first().text().trim();
    let link = $(el).children('div').children('.internal-link').first().text().trim();
    //closing = moment(closing.slice(0, closing.indexOf('-') - 1), 'DD/MM/YYYY').toISOString();

    vacancies.push({date, type, title, description, link});
  });

  return vacancies;
}

module.exports = {
  extractListingsFromHTML
};