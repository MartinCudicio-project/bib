const axios = require('axios');
const cheerio = require('cheerio');


parseRestaurantBib = data => {
  const $ = cheerio.load(data);
  var name = $('.section-main h2.restaurant-details__heading--title').text();
  name = name.replace(/�/g,"o").replace(/ô/,'o').replace(/ö/g,'o').replace(/ù/g,'u').replace(/û/g,'u').replace(/ü/g,'u').replace(/î/g,"i").replace(/ï/g,"i").replace(/à/g,"a").replace(/â/g,"a").replace(/ä/g,"a").replace(/é/g,"e").replace(/è/g,"e").replace(/ê/g,"e").replace(/ë/g,"e").replace(/ç/g,"c");  
  name = name.toUpperCase();

  var adress = $('.section-main .restaurant-details__heading--list li:nth-child(1)').text();
  adress = adress.replace(/�/g,"o").replace(/ô/,'o').replace(/ö/g,'o').replace(/ù/g,'u').replace(/û/g,'u').replace(/ü/g,'u').replace(/î/g,"i").replace(/ï/g,"i").replace(/à/g,"a").replace(/â/g,"a").replace(/ä/g,"a").replace(/é/g,"e").replace(/è/g,"e").replace(/ê/g,"e").replace(/ë/g,"e").replace(/ç/g,"c");  
  adress = adress.toUpperCase();
  adress = adress.split(", ")
  adress = {street: adress[0],city: adress[1], zip: adress[2]}
  
  var phone = $('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section:nth-child(4) > div.row > div:nth-child(1) > div > div:nth-child(1) > div > div > span.flex-fill').text();
  phone = phone.replace("+33 ","0").replace(/ /g,"")
  //const price = $('.section-main li.restaurant-details__heading-price').text();
  //const experience = $('#experience-section > ul > li:nth-child(2)').text();
  var avis = $('.section-main .restaurant-details__description--text div p').text();
  //const services = $('div.restaurant-details__services--content ').text();
  return {name, adress, phone, avis};
};

const parseLinkBib = (data,restaurantsLink) => {

  const $ = cheerio.load(data);
  
  const links = $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items > div.col-md-6.col-lg-6.col-xl-3 > div > a').each(function(){
    restaurantsLink.push("https://guide.michelin.com"+$(this).attr('href'))});
  
  var numberOfRestaurants = $('body > main > section.section-main.search-results.search-listing-result > div > div > div.search-results__count > div.d-flex.align-items-end.search-results__status.box-placeholder > div.flex-fill.js-restaurant__stats > h1').text();
  const regex = /[0-9]{3,4}/g
  const numberOfPages = Math.ceil(parseInt(numberOfRestaurants.match(regex))/40);
  
  return {numberOfPages,restaurantsLink};
};

scrapeRestaurantBib = async url => {
  console.log(`🕵️‍♀️  browsing ${url}`);
  const response = await axios(url);
  const {data, status} = response;
  if (status >= 200 && status < 300) {
    return parseRestaurantBib(data);
  }
  console.error(status);
  return null;
};

scrapeLinkRestaurantBib = async (url,restaurantsLink) => {
  const response = await axios(url);  
  const {data, status} = response;
  if (status >= 200 && status < 300) {
    return await parseLinkBib(data,restaurantsLink);
  }
}
/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */



module.exports.get = async () => {
  var restaurantsLink = [];
  var restaurantsList = [];
  const init = await scrapeLinkRestaurantBib("https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/1",restaurantsLink)
  for(let i=2; i<=init.numberOfPages; i++){
    await scrapeLinkRestaurantBib(`https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/${i}`,restaurantsLink)
  }
  for(let i=0 ; i<restaurantsLink.length; i++){
    const restaurant = await scrapeRestaurantBib(restaurantsLink[i])
    restaurantsList.push(restaurant)
  }
  return await restaurantsList;
};

