/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
const maitre = require('./maitre')
const fs = require('fs');


async function sandbox(searchLink = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/'){
  try {
    console.log(`🕵️‍♀️  browsing ${searchLink} source`);
    return await michelin.scrapeRestaurant(searchLink);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, searchLink] = process.argv;
// sandbox(searchLink)

function getListOfRestaurantsSequentiel(){
  const r = michelin.get()
  r.then(restaurants_link=>{
  console.log("liens recup")
  const restaurants = async () => {
  console.log("debut")
  var res = [];
  for(let index=0; index<421;index++){
    const restaurant = await sandbox(restaurants_link[index])
    res.push(restaurant)
  }
  console.log("end");
  return res;
  };
  const res = restaurants()
  res.then(r=>{
    let data = JSON.stringify(r,null,2);
    fs.writeFileSync('./restaurants.json', data);
  })
})
}

async function getAllRestaurants(){
  // get michelin bib restaurants
  const bibRestaurants = await michelin.get();
  let dataBib = JSON.stringify(bibRestaurants,null,2);
  fs.writeFileSync('./src/bibRestaurants.json', dataBib);
  console.log("bibRestaurants has been created")
  
  // // get maitre restaurateur restaurants
  const maitreRestaurants = await maitre.get()
  let dataMaitre = JSON.stringify(maitreRestaurants,null,2);
  fs.writeFileSync('./src/maitreRestaurants.json', dataMaitre);
  console.log("maitreRestaurants has been created")
}

//getAllRestaurants()
function manipulateRestaurant(){
  const bib = require('../src/bibRestaurants.json')
  var maitre = require('../src/maitreRestaurants.json')
  var count = Object.keys(bib).length;
  console.log(count)
}

manipulateRestaurant()