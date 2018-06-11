import React, { Component } from 'react';
import MaterialIcon from 'material-icons-react';
import './../../styles/common/Navigation.scss';

class Navigation extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  toggleMenu(){
    this.setState({
      visible: !this.state.visible
    });
  }

  closeMenu(){
    this.setState({
      visible: false
    });
  }

  render () {
    const { visible } = this.state;
    return (
      <div className="navigation-container">
        <div className="navigation">
          <div className="menu-icon" onClick={this.toggleMenu}>
            <MaterialIcon icon="view_headline" />
          </div>
        </div>
        <ul onClick={this.closeMenu} className={ 'navigation-menu ' + (visible ? 'visible': '') }>
          <li>Go to View Definitions</li>
          <li>Go to Type Definitions</li>
          { this.props.children }
        </ul>
      </div>
    );
  }
}

export default Navigation;