import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom"
import './App.css';
import Card from './components/Cards'
import Tab from './components/Tabs'

var bib = require('./files/bibRestaurants.json')
var maitre = require('./files/maitreRestaurants.json')
var restaurants = require('./files/matchRestaurants.json')

function App() {
  return (
    <body>
    <Router>
      <div class="hero is-info is-bold" >
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              Best Restaurants in France
            </h1>
            <h2 class="subtitle">
            these restaurants have all received the distinction "bib michelin" and "maitre restaurateur"
            </h2>
          </div>
        </div>
      </div>
      
      <br/>

      <div class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Maitre restaurants</p>
            <p class="title">{Object.keys(maitre).length}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Bib restaurants</p>
            <p class="title">{Object.keys(bib).length}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Maitre X Bib</p>
            <p class="title">{Object.keys(restaurants).length}</p>
          </div>
        </div>
      </div>
      <section class="container center">
        <div class="columns is-vcentered">
          <div class="column is-centered">
            <div class="notification is-info">
              <Router>
                  <a style={{ color: 'primary', textDecoration: 'inherit'}} href="/" >
              <h1 class="title is-size-6 center">Maitre X Bib with Cards</h1>
              </a>
              </Router>
            </div>
          </div>
          <div class="column">
            <div class="notification is-info">
              <Router>
                  <a style={{ color: 'primary', textDecoration: 'inherit'}} href="/table" >
              <h1 class="title is-size-6 center">Maitre X Bib with Table and filter with name</h1>
              </a>
              </Router>
            </div>
          </div>
        </div>
      </section>
      <div class="container">
        <Switch>
          <Route path="/table">
            <Tab/>
          </Route>
          <Route path="/">
            <Card />
          </Route>
        </Switch>
      </div>
    </Router>
    </body>
  );
}

export default App;
