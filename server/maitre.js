const axios = require('axios');
const cheerio = require('cheerio');


/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */

parse = data => {
    const $ = cheerio.load(data);
    
    var name = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5 > span:nth-child(1) > strong').text();
    name = name.replace('�',"o").replace('ô','o').replace('\'',"").replace('ö','o').replace('ù','u').replace('û','u').replace('ü','u').replace("î","i").replace("ï","i").replace("à","a").replace("â","a").replace("ä","a").replace("é","e").replace("è","e").replace("ê","e").replace("ë","e").replace("ç","c");  
    name = name.toUpperCase()
    
    var adress = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-content-infos.row > div.ep-infos-txt > div.infos-complement > a').attr('href');
    adress = adress.slice(34,-1)
    adress = adress.replace('�',"é").replace('ô','o').replace('\'',"").replace('ö','o').replace('ù','u').replace('û','u').replace('ü','u').replace("î","i").replace("ï","i").replace("à","a").replace("â","a").replace("ä","a").replace("é","e").replace("è","e").replace("ê","e").replace("ë","e").replace("ç","c");
    adress = adress.replace("+",", ").replace("+",", ")
    adress = adress.toUpperCase() 
    
    var phone = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5').text();
    const regex = /(([0-9]{2} ){4}[0-9]{2})|([0-9]{10})/g
    phone = phone.match(regex)
    phone = phone.toString()
    phone = phone.replace(/ /g,"")
    return {name, adress, phone};
};

parseLink = (data, restaurantsLink) => {
  const $ = cheerio.load(data);
  var numberOfRestaurants = $('body > div.col-md-3.annuaire_sidebar > div > div.col-md-12 > div.title1.nbresults.hide_desk').text();
  const regex = /[0-9]+/g
  numberOfRestaurants = Math.ceil(parseInt(numberOfRestaurants.match(regex))/10);
  const listLink = $('div.single_desc > div.single_libel > a').each(function(){
    restaurantsLink.push("https://www.maitresrestaurateurs.fr/"+$(this).attr('href'));
  });
  return {numberOfRestaurants,restaurantsLink};
};

scrapeRestaurant = async url => {
  const response = await axios(url);
  const {data, status} = response;
  if (status >= 200 && status < 300) {
    return parse(data);
  }
  console.error(status);
  return null;
}

scrapeLinkRestaurant = async (pageNumber, restaurantsLink) => {
  const response = await axios({
    method: 'post',
    url: 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult#',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // we get the request_id with DevTools in network
    data: `page=${pageNumber}&sort=undefined&request_id=26d16d7da92c0664b4690be3c52cfb86&annuaire_mode=standard`
  });  
  const {data, status} = response;
  if (status >= 200 && status < 300) {
    await parseLink(data,restaurantsLink);
  }
};

/**
 * Get all France located maitre restaurants
 * @return {Array} restaurants
 */

module.exports.get = async () => {
  var restaurantsLink = [];
  const init = await scrapeLinkRestaurant(1,restaurantsLink);
  // we get all links from maitre restaurant
  for(let i=2; i<2; i++){
    const h = await scrapeLinkRestaurant(i,restaurantsLink)
    //console.log(h)
  }
  for(let i=0 ; i<restaurantsLink.length; i++){
    const restaurant = await scrapeRestaurant(restaurantsLink[i])
    console.log(restaurant)
  }
}



