import React, { Component } from 'react';
import './../../styles/home/Home.scss';
import axios from 'axios';

import SelectList from './../common/SelectList';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      viewDefinitions: [],
      typeDefinitions: []
    };

    this.goToTypePage = this.goToTypePage.bind(this);
    this.goToViewPage = this.goToViewPage.bind(this);
    this.handleTypeSelect = this.handleTypeSelect.bind(this);
    this.handleViewSelect = this.handleViewSelect.bind(this);
  }

  componentDidMount(){
    const controller = this;
    const TYPES_URL = 'http://localhost:3500/api/type/get-all';
    const VIEWS_URL = 'http://localhost:3500/api/view-definition/get-all';
    axios.all([
      axios.get(TYPES_URL),
      axios.get(VIEWS_URL)
    ])
      .then(axios.spread(function(types, viewDefinitions){
        controller.setState({
          typeDefinitions: types.data,
          viewDefinitions: viewDefinitions.data
        });
      }))
      .catch((error) => {
        controller.setState({
          typeDefinitions: [],
          viewDefinitions: []
        });
      });
  }

  goToTypePage(){
    this.props.history.push({
      pathname: '/type-definition'
    });
  }

  goToViewPage(){
    this.props.history.push({
      pathname: '/view-definition',
    });
  }

  handleTypeSelect(typeId){
    console.log('would go to this type: ' + typeId);
  }

  handleViewSelect(viewDefinitionId){
    console.log('would go to view definition: ' + viewDefinitionId);
  }

  render () {
    
    return (
      <div className="home" >
        <div className="type-definitions definition-block">
          <div>
            <div className="title">Type Definitions</div>

            <h3>Edit an Existing Type Definition</h3>
            { !!this.state.typeDefinitions.length ? <SelectList type={ 'typeDefinition' } items={this.state.typeDefinitions} onSelect={this.handleTypeSelect} /> : 
                    <span>Looks like you don't have any type definitions.</span>}

            <h3>Or</h3>

            <button onClick={this.goToTypePage}>Create a New Type Definition</button>
          </div>
        </div>

        <div className="view-definitions definition-block">
          <div>
            <div className="title">View Definitions</div>

            <h3>Edit an Existing View Definition</h3>
            { !!this.state.viewDefinitions.length ? <SelectList type={ 'viewDefinition' } items={this.state.viewDefinitions} onSelect={this.handleViewSelect} /> : 
                    <span>Looks like you don't have any view definitions.</span>}

            <h3>Or</h3>
  
            <button onClick={this.goToViewPage}>Create a New View Definition</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;