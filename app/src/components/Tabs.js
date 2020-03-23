import React, { Component } from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

var restaurants = require('../files/matchRestaurants.json')

class Tabs extends React.Component {
    constructor(props) {
        super(props);
    
        this.options = {
          defaultSortName: 'name',  // default sort column name
          defaultSortOrder: 'asc'  // default sort order
        };
      }
    render(){
        return (
            <section class="section">
                <div class="container center">
                    <BootstrapTable data={ restaurants } height="500" scrollTop={ 'Top' }>
                        <TableHeaderColumn dataField='name' isKey filter={ { type: 'TextFilter', delay: 1000 } }>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='avis'></TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </section>
        );
    }
}

export default Tabs
