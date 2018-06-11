import React, { Component } from 'react';
import ReactJson from 'react-json-view';

class PreviewType extends Component {
  render(){
    return (
      <ReactJson displayDataTypes={false} src={this.props.jsonString} />
    );
  }
}

export default PreviewType;