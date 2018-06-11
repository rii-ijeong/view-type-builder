import React, { Component } from 'react';
import MaterialIcon from 'material-icons-react';

import './../../styles/common/Field.scss';

class Field extends Component {
  render () {
    const { name, value } = this.props.item;
    return (
      <div className="edit-field field">
        <MaterialIcon icon="edit" />
        <span><strong>{!name.length ? 'Undefined' : name}</strong>: { value }</span>
      </div>
    );
  }
}

export default Field;