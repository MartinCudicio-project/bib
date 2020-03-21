const axios = require('axios');
const cheerio = require('cheerio');


/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */

parseRestaurantMaitre = data => {
    const $ = cheerio.load(data);
    
    var name = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-content-infos.row > div.ep-infos-txt').text();
    
    if(name!=null){
      name = name.replace(/�/g,"o").replace(/ô/,'o').replace(/ö/g,'o').replace(/ù/g,'u').replace(/û/g,'u').replace(/ü/g,'u').replace(/î/g,"i").replace(/ï/g,"i").replace(/à/g,"a").replace(/â/g,"a").replace(/ä/g,"a").replace(/é/g,"e").replace(/è/g,"e").replace(/ê/g,"e").replace(/ë/g,"e").replace(/ç/g,"c");  
      name = name.toUpperCase()
      const regex = /\w+( \w+)*/g
      name = name.match(regex)
      name = name.toString()
      const spl = name.split(',')
      name = spl[0]
    }
    else{
      name ="None"
    }
    var adress = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-content-infos.row > div.ep-infos-txt > div.infos-complement > a').attr('href');
    if(adress!=null){
      adress = adress.slice(34,-1)
      adress = adress.replace(/�/g,"o").replace(/ô/,'o').replace(/ö/g,'o').replace(/ù/g,'u').replace(/û/g,'u').replace(/ü/g,'u').replace(/î/g,"i").replace(/ï/g,"i").replace(/à/g,"a").replace(/â/g,"a").replace(/ä/g,"a").replace(/é/g,"e").replace(/è/g,"e").replace(/ê/g,"e").replace(/ë/g,"e").replace(/ç/g,"c");  
      adress = adress.replace("+",", ").replace("+",", ")
      adress = adress.toUpperCase()
      adress = adress.split(", ")
      adress = {street: adress[0],city: adress[1], zip: adress[2]}
    }
    else{
      adress = {street: "None",city: "None", zip: "None"}
    }
    
    
    var phone = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5').text();
    const regex = /(([0-9]{2} ){4}[0-9]{2})|([0-9]{10})/g
    phone = phone.match(regex)
    if(phone!=null){
      phone = phone.toString()
      phone = phone.replace(/ /g,"")
    }
    else{
      phone=null
    }
    
    return {name, adress, phone};
};

parseLinkMaitre = (data, restaurantsLink) => {
  const $ = cheerio.load(data);
  var numberOfRestaurants = $('body > div.col-md-3.annuaire_sidebar > div > div.col-md-12 > div.title1.nbresults.hide_desk').text();
  const regex = /[0-9]+/g
  var numberOfPages = Math.ceil(parseInt(numberOfRestaurants.match(regex))/10);
  const listLink = $('div.single_desc > div.single_libel > a').each(function(){
    restaurantsLink.push("https://www.maitresrestaurateurs.fr"+$(this).attr('href'));
  });
  return {numberOfPages,restaurantsLink};
};

scrapeRestaurantMaitre = async url => {
  console.log(`🕵️‍♀️  browsing ${url}`);
  const response = await axios(url);
  const {data, status} = response;
  if (status >= 200 && status < 300) {
    return parseRestaurantMaitre(data);
  }
  console.error(status);
  return null;
}

scrapeLinkRestaurantMaitre = async (pageNumber, restaurantsLink) => {
  const response = await axios({
    method: 'post',
    url: 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult#',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // we get the request_id with DevTools in network
    data: `page=${pageNumber}&sort=undefined&request_id=26d16d7da92c0664b4690be3c52cfb86&annuaire_mode=standard`
  });  
  const {data, status} = response;
  if (status >= 200 && status < 300) {
    return await parseLinkMaitre(data,restaurantsLink);
  }
};

/**
 * Get all France located maitre restaurants
 * @return {Array} restaurants
 */

module.exports.get = async () => {
  var restaurantsLink = [];
  var restaurantsList = [];
  const init = await scrapeLinkRestaurantMaitre(1,restaurantsLink);
  // we get all links from maitre restaurant
  for(let i=2; i<init.numberOfPages; i++){
    await scrapeLinkRestaurantMaitre(i,restaurantsLink)
    console.log(i)
  }
  for(let i=0 ; i<restaurantsLink.length; i++){
    const restaurant = await scrapeRestaurantMaitre(restaurantsLink[i])
    restaurantsList.push(restaurant)
  }
  return restaurantsList;
}



