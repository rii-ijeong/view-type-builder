import React, { Component } from 'react';

import DetailView from './types/Detail';
import SummaryView from './types/Summary';

class ViewRenderer extends Component {
  constructor(props){
    super(props);

    this.state = {
      viewDefinitionName: '',
      viewType: 'detail',
      isSinglePage: true,
      data: {}
    };


    this.updateData = this.updateData.bind(this);
    this.changePropertyValue = this.changePropertyValue.bind(this);
  }

  componentDidMount(){
    // if prior information sent
  }

  changePropertyValue(propertyName, e){
    const state = {};
    state[propertyName] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    this.setState(state);
  }

  updateData(data){
    this.setState({
      data: data
    }, () => {
      this.props.onUpdate(this.state);
    });
  }

  render() {
    const { objectType } = this.props;
    const { viewDefinitionName, viewType, isSinglePage } = this.state;
    return (
      <div className="view-renderer">
        
        <div className="view-header">
          <div className="snippet"> View Definition of <strong>{ objectType.name }</strong> Type </div>
          <div className="editable">
            <div className="input-field">
              <label>View Definition Name</label>
              <input value={viewDefinitionName} onChange={(e) => { this.changePropertyValue('viewDefinitionName', e) }} />
            </div>

            <div className="input-field">
              <label>View Type</label>
              <select value={viewType} onChange={(e) => { this.changePropertyValue('viewType', e) }}>
                <option value="detail">Detail View</option>
                <option value="summary">Summary View</option>
              </select>
            </div>

            { viewType === 'detail' ? 
              <div className="input-field input-checkbox">
                <input type="checkbox" checked={isSinglePage} onChange={(e) => {this.changePropertyValue('isSinglePage', e)}} />
                <label>Single Page View</label>
              </div> : null
            }
          </div>
        </div>

        <div className="view-renderer-container">
          { viewType === 'detail' ? <DetailView singlePage={isSinglePage} objectType={objectType} onUpdate={this.updateData} /> : null }
          { viewType === 'summary' ? <SummaryView objectType={objectType} /> : null }
        </div>
      </div>
    );
  }
}

export default ViewRenderer;
