import React, { Component } from 'react';
import MaterialIcon from 'material-icons-react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { SortableHandle } from 'react-sortable-hoc';

class TypeField extends Component {
  constructor(props){
    super(props);

    this.state = {
      visible: false,
      name: '',
      type: 'string',
      displayLabel: '',
      readOnly: false,
      overrideDefaultWidget: ''
    };

    this.toggleMoreOptions = this.toggleMoreOptions.bind(this);
    this.changePropertyValue = this.changePropertyValue.bind(this);
  }

  componentWillReceiveProps(nextProps){
    let state = {};
    if(nextProps.field){
      state = nextProps.field;
    }

    state.readOnly = nextProps.readOnly;

    this.setState(state);
  }

  toggleMoreOptions(){
    const state = this.state;
    state.visible = !state.visible;
    this.setState(state, () => {
      this.props.onFieldUpdate(this.state, this.props.fieldIndex);
    });
  }

  changePropertyValue(propertyName, e){
    const state = this.state;
    state[propertyName] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    this.setState(state, () => {
      this.props.onFieldUpdate(this.state, this.props.fieldIndex);
    });
  }

  render(){
    const { visible, name, type, displayLabel, overrideDefaultWidget, readOnly } = this.state;
      
    const DragHandle = SortableHandle( () => {
      return (
        <div className="drag-fieldtype">
          <MaterialIcon icon="drag_indicator" />
        </div>
      );
    });

    const deletePopover = (
      <Popover className="confirm-delete-popover" id={ 'confirmDeleteField_' + this.props.fieldIndex }>
        <p>Are you sure you want to delete this <strong>field</strong>?</p>
        <div className="actions">
          <button className="main" onClick={() => { this.props.onFieldDelete(this.props.fieldIndex); document.body.click(); }}>Delete</button>
          <button className="secondary" onClick={ () => { document.body.click() }}>Cancel</button>
        </div>
      </Popover>
    );
    return (
      <div className="select-field">
        <div className="property-name">
  
          <DragHandle />

          <span><strong>{ name }</strong> [ {type} ]</span>

          { !this.props.readOnly ? 
            <div className="read-only">
              <input type="checkbox" value={readOnly} onChange={(e) => { this.changePropertyValue('readOnly', e)}} />
              <label>Read-only</label>
            </div> : null 
          }

          <span className="toggle-more-options" onClick={ this.toggleMoreOptions }>
            {  visible ? 
              <MaterialIcon icon="expand_less" /> :
              <MaterialIcon icon="expand_more" />
            }
          </span>
        </div>

        <div className={'overrideables ' + (visible ? 'visible' : '')}>
          <div className="input-field">
            <label>Display Label (Overrides Name)</label>
            <input value={displayLabel} onChange={(e) => { this.changePropertyValue('displayLabel', e)}} />
          </div>
          <div className="input-field">
            <label>Wigdet (Overrides Default Input Renderer)</label>
            <input value={overrideDefaultWidget} onChange={(e) => { this.changePropertyValue('overrideDefaultWidget', e)}} />
          </div>
        </div>

        <OverlayTrigger rootClose={true} trigger="click" placement="top" overlay={deletePopover} containerPadding={20}>
          <div className='delete-field-btn'>
            <MaterialIcon icon="delete_forever" />
          </div>
        </OverlayTrigger>
        
      </div>
    );
  }
}

export default TypeField;