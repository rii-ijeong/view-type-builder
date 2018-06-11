import React, { Component } from 'react';
import './styles/App.scss';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Home from './core/home/Home';
import TypeDefinitionBuilder from './core/typeDefinition/TypeDefinitionBuilder';
import ViewDefinitionBuilder from './core/viewDefinition/ViewDefinitionBuilder';

class App extends Component {
  render() {
    var backgroundUrl = process.env.PUBLIC_URL + '/images/aerial-city-view.jpg';
    var backgroundStyle = {
      backgroundImage: `url(${backgroundUrl})`
    };

    return (
      <div className="App">
        <div className="container" style={ backgroundStyle }>
          <Router>
            <Switch>
              <Route path="/view-definition" component={ViewDefinitionBuilder} />
              <Route path="/type-definition" component={TypeDefinitionBuilder} />
              <Route component={Home} />
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
