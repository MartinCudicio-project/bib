const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);
  const name = $('.section-main h2.restaurant-details__heading--title').text();
  const adress = $('.section-main .restaurant-details__heading--list li:nth-child(1)').text();
  //const price = $('.section-main li.restaurant-details__heading-price').text();
  //const experience = $('#experience-section > ul > li:nth-child(2)').text();
  const avis = $('.section-main .restaurant-details__description--text div p').text();
  //const services = $('div.restaurant-details__services--content ').text();

  return {name, adress, avis};
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */


module.exports.scrapeRestaurant = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = () => {
  return [];
};
