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

// getListOfRestaurantsSequentiel()
// the execution of 'getListOfRestaurants' takes between 6 minutes 30 and 7 minutes 30

// this function does not work with many links at the same time. 
// The limit for my CPU and my connection is 30 links
// it is therefore not suitable for retrieving the list of all our restaurants

// function getListOfRestaurantsAsync(){
  // console.log("liens recup")
  // const restaurants = async () => {
  //   console.log("debut")
  //   var res;
  //   const promises = await restaurants_link.map( async link=>{
  //       res = await sandbox(link)
  //       return res;
  //   })
  //   const restaurantList = await Promise.all(promises);
  //   return restaurantList;
  // };
  // const res = restaurants()
  // res.then(r=>console.log(r))
// }


const maitreRestaurant = maitre.get()