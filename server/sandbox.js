/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
const maitre = require('./maitre')
const fs = require('fs');
var stringSimilarity = require('string-similarity');

async function getAllRestaurants(){
  // get michelin bib restaurants
  const bibRestaurants = await michelin.get();
  let dataBib = JSON.stringify(bibRestaurants,null,2);
  fs.writeFileSync('./app/src/files/bibRestaurants.json', dataBib);
  console.log("bibRestaurants has been created")
  
  // get maitre restaurateur restaurants
  const maitreRestaurants = await maitre.get()
  let dataMaitre = JSON.stringify(maitreRestaurants,null,2);
  fs.writeFileSync('./app/src/files/maitreRestaurants.json', dataMaitre);
  console.log("maitreRestaurants has been created")
}

function manipulateRestaurant(){

  var matchRestaurant = []
  const bib = require('../app/src/files/bibRestaurants.json')
  var maitre = require('../app/src/files/maitreRestaurants.json')
  var countBib = Object.keys(bib).length;
  var countMaitre = Object.keys(maitre).length;

  // we start by creating a list of all the names of the restaurants in the Michelin Guide.
  var bibName = []
  for(let i=0; i<countBib;i++){
    const name = bib[i].name
    bibName.push(name)
  }

  // we will compare one by one the name of the master restaurants with the list of bibName
  // we're going to use the stringSimilarity "findBestMatch" method
  for(let i=0; i<countMaitre;i++){
    var matches = stringSimilarity.findBestMatch(maitre[i].name, bibName)
    // we set an 60% degree of similarity
    if(matches.bestMatch.rating>0.6){
      if(maitre[i].adress.zip==bib[matches.bestMatchIndex].adress.zip){
        if(maitre[i].phone==bib[matches.bestMatchIndex].phone){
          matchRestaurant.push(bib[matches.bestMatchIndex])
        }
        if(maitre[i].phone==null){
          matchRestaurant.push(bib[matches.bestMatchIndex])
        }
      }
    }
  }
  let dataRest = JSON.stringify(matchRestaurant,null,2);
  fs.writeFileSync('./app/src/files/matchRestaurants.json', dataRest);
  console.log("matchRestaurants has been created")
}

// getAllRestaurants()
// manipulateRestaurant()

