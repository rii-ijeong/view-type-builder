import React, { Component } from 'react';
import MaterialIcon from 'material-icons-react';
import Measure from 'react-measure';
import { Popover, OverlayTrigger } from 'react-bootstrap';

import TypeFieldSelector from './TypeFieldSelector';

import './../../../styles/view/Column.scss';

class Column extends Component {
  constructor(props){
    super(props);
    this.state = {
      columnTitle: '',
      fields: [],
      readOnly: false,
      collapsible: false,
      i: false,
      visible: false
    };

    this.resizeHeightTimer = false;
    this.updateColumnTimer = false;

    this.changePropertyValue = this.changePropertyValue.bind(this);
    this.onResizeHeightEnd = this.onResizeHeightEnd.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.updateFields = this.updateFields.bind(this);
  }

  toggleVisibility(e){
    if(e.target.classList.contains('material-icons')){
      return;
    }
    
    const state = this.state;
    state.visible = !state.visible;
    this.setState(state, ()=>{
      this.props.onColumnChange(state);
    });
  }

  onResizeHeightEnd(bounds){
    if(!this.state.i){
      return;
    }

    if(this.resizeHeightTimer){
      clearTimeout(this.resizeHeightTimer);
    }

    this.resizeHeightTimer = setTimeout(() => {
      this.props.onColumnHeightChange(bounds.height, this.state.i);
    }, 200);
  }

  updateFields(fields){
    const state = this.state;
    state.fields = fields;

    this.setState(state, ()=>{
      this.props.onColumnChange(state);
    });
  }

  changePropertyValue(propertyName, e){
    const state = this.state;
    state[propertyName] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    this.setState(state, ()=>{
      this.props.onColumnChange(state);
    });
  }

  componentWillReceiveProps(nextProps){
    let state = this.state;

    if(nextProps.body){
      state = Object.assign(state, nextProps.body);
    }

    state.readOnly = nextProps.readOnly || state.readOnly;

    this.setState(state);
  }

  render(){
    const { columnTitle, visible, i, readOnly, fields, collapsible } = this.state;
    const deletePopover = (
      <Popover className="confirm-delete-popover" id={ 'confirmDelete_' + i }>
        <p>Are you sure you want to delete this <strong>column</strong>?</p>
        <div className="actions">
          <button className="main" onClick={() => { this.props.onDeleteColumn(i); document.body.click(); }}>Delete</button>
          <button className="secondary" onClick={ () => { document.body.click() }}>Cancel</button>
        </div>
      </Popover>
    );

    return (
      <div className="view-column">
        <Measure
          bounds
          onResize={(contentRect) => {
            this.onResizeHeightEnd(contentRect.bounds);
          }}
        >
        {({measureRef}) => 
          <div ref={measureRef} className="view-column-container">
            <div className="column-header" onClick={this.toggleVisibility}>
              <MaterialIcon icon="drag_indicator" />
              <span>{ columnTitle }</span>
            </div>

            <div className="toggle-visibility-icon">
              {  visible ? 
                <MaterialIcon icon="expand_less" /> :
                <MaterialIcon icon="expand_more" />
              }
            </div>

            <OverlayTrigger rootClose={true} trigger="click" placement="bottom" overlay={deletePopover} containerPadding={20}>
              <div className="delete-row-icon">
                <MaterialIcon icon="delete_forever" />
              </div>
            </OverlayTrigger>

            <div className={'contents-container ' + (visible ? 'visible': '')}>
              <div className="contents" >
                <div className="fields">
                  <div className="input-field">
                    <label>Column Title</label>
                    <input value={columnTitle} onChange={(e) => { this.changePropertyValue('columnTitle', e)} } />
                  </div>

                  { !this.props.readOnly ? 
                    <div className="input-field input-checkbox">
                      <input type="checkbox" value={readOnly} 
                        onChange={(e) => {this.changePropertyValue('readOnly', e)}} /> 
                      <label>Read-only Fields</label>
                    </div> : null
                  }

                  <div className="input-field input-checkbox">
                    <input type="checkbox" value={collapsible}
                      onChange={(e) => {this.changePropertyValue('collapsible', e)}} />
                    <label>Collapsible</label>
                  </div>
                </div>

                <div className="column-fields">
                  <TypeFieldSelector readOnly={readOnly || this.props.readOnly} fields={fields} onFieldSelection={this.updateFields} objectType={this.props.objectType} />
                </div>
              </div>
            </div>
          </div>
        }
        </Measure>
      </div>
    );
  }
}

export default Column;