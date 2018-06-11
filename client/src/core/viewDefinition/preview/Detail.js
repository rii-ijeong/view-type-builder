import React, { Component } from 'react';
import ReactJson from 'react-json-view';

import ViewFactory from './../../factories/ViewFactory';

class PreviewDetailJson extends Component{
  constructor(props){
    super(props);

    this.state = {
      json: ''
    };
  }

  componentDidMount(){
    this.setState({
      json: ViewFactory.exportStandard(this.props.data, this.props.dataId, this.props.type)
    });
  }

  render(){
    const { json } = this.state;
    return (
      <ReactJson displayDataTypes={false} src={json} />
    );
  }
}

export default PreviewDetailJson;