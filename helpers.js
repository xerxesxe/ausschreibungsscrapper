const cheerio = require('cheerio');
const moment = require('moment');

function extractListingsFromHTML (html) {
  const $ = cheerio.load(html);
  const vacancyRows = $('.view-Vacancies tbody tr');

  const vacancies = [];
  vacancyRows.each((i, el) => {

    // Extract information from each row of the jobs table
    let closing = $(el).children('.views-field-field-vacancy-deadline').first().text().trim();
    let job = $(el).children('.views-field-title').first().text().trim();
    let location = $(el).children('.views-field-name').text().trim();
    closing = moment(closing.slice(0, closing.indexOf('-') - 1), 'DD/MM/YYYY').toISOString();

    vacancies.push({closing, job, location});
  });

  return vacancies;
}

module.exports = {
  extractListingsFromHTML
};