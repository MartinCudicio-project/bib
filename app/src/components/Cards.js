import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
  } from "react-router-dom"

var restaurants = require('../files/matchRestaurants.json')

class Cards extends Component {

    render(){
        return(
            <section class="section">
        {restaurants.map((restaurant,index)=>{
          console.log(restaurant)
          return (
            <div class="container center">
              <div class = "columns is-centered">
                <div class="column is-half">
                  <div class="card">
                    <div class="card-image">
                      <figure class="image is-4by3">
                        <img src={restaurant.picture} alt="Placeholder image"></img>
                      </figure>
                    </div>
                    <div class="card-content">
                      <div class="media">
                        <div class="media-content">
                        <Router>
                            <a style={{ color: 'inherit', textDecoration: 'inherit'}} href={restaurant.url} >
                        <h1 class="title has-text-danger is-size-4 center">{restaurant.name}</h1>
                        </a>
                        </Router>
                        <p class="subtitle is-6">{restaurant.adress.street}, {restaurant.adress.city}, {restaurant.adress.zip}</p>
                        </div>
                      </div>

                      <div class="content">
                        {restaurant.avis}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })
        }
      </section>
        )
    }
}

export default Cards
