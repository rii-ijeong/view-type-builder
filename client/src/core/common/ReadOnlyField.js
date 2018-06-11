import React, { Component } from 'react';
import MaterialIcon from 'material-icons-react';

import './../../styles/common/Field.scss';

class ReadOnlyField extends Component {
  render () {
    return (
      <div className="read-only-field field">
        <MaterialIcon icon="priority_high" />
        <span><strong>{this.props.item.name}</strong>: { this.props.item.value }</span>
      </div>
    );
  }
}

export default ReadOnlyField;