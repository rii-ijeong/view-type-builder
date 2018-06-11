import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import MaterialIcon from 'material-icons-react';
import axios from 'axios';

import './../../styles/common/EnumSelector.scss';

class EnumSelector extends Component {
  constructor(props){
    super(props); 

    this.state = {
      selected: 'none',
      items: [],
      showCreateDialog: false,
      newEnum: {
        values: []
      },
      newValue: '',
      errorMsg: false
    };

    this.showItems = this.showItems.bind(this);
    this.handleShowDialog = this.handleShowDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.enterNewValue = this.enterNewValue.bind(this);
    this.addNewValue = this.addNewValue.bind(this);
    this.changeNewValue = this.changeNewValue.bind(this);
    this.checkEnter = this.checkEnter.bind(this);
    this.handleSaveEnum = this.handleSaveEnum.bind(this);
    this.setNewName = this.setNewName.bind(this);
  }

  componentDidMount(){
    if(this.props.selected){
      this.setState({
        selected: this.props.selected.id
      });
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.selected){
      this.setState({
        selected: nextProps.selected.id
      });
    }
  }

  showItems(e){
    const selectedEnum = this.props.enums.filter((enumerable, index) => {
      return enumerable.id === e.target.value;
    })[0];

    this.setState({
      selected: e.target.value,
      items: selectedEnum.values
    });

    this.props.onSelect(selectedEnum);
  }

  handleShowDialog(){
    this.setState({ 
      newEnum: {
        values: []
      }, // reset
      newValue: '',
      errorMsg: false,
      showCreateDialog: true 
    });
  }

  handleCloseDialog(){
    this.setState({
      showCreateDialog: false
    });
  }

  handleSaveEnum(){
    const { newEnum } = this.state;
    newEnum.id = newEnum.name.split(' ').join('-').toLowerCase();

    const ENUMS_URL = 'http://localhost:3500/api/type/enum/save';
    axios.post(ENUMS_URL, newEnum)
      .then((response) => {
        this.setState({
          showCreateDialog: false,
          errorMsg: false, 
          newValue: ''
        });

        this.props.onEnumListUpdate(newEnum);
      })
      .catch((error) => {
        if(error.response && error.response.status === 409){
          this.setState({
            errorMsg: 'There is already a set called "' + newEnum.name + '". Please enter a new name.'
          });
        }
      });
  }

  checkEnter(e){
    if(e.key === 'Enter'){
      this.addNewValue(e.target.value);
    }
  }

  enterNewValue(e){
    this.addNewValue(this.state.newValue);
  }

  addNewValue(value){
    const {newEnum} = this.state;
    newEnum.values.push(value);

    this.setState({
      newEnum: newEnum,
      newValue: ''
    });
  }

  changeNewValue(e){
    this.setState({
      newValue: e.target.value
    });
  }

  setNewName(e){
    const {newEnum} = this.state;
    newEnum.name = e.target.value;
    this.setState({
      newEnum: newEnum
    });
  }

  render () {
    const { enums } = this.props;
    const { selected, items, newValue, newEnum, errorMsg} = this.state;
    return (
      <div className="enum-selector">
        <div className="options">
          <select value={selected} onChange={this.showItems}>
            <option value="none">Select A List of Values</option>
            {enums.map((enumerable, i) => {
              return (
                <option key={enumerable.id} value={enumerable.id}>{ enumerable.name }</option>
              );
            })}
          </select>
          <button onClick={this.handleShowDialog} className="main"><MaterialIcon icon="add" /></button>
        </div>

        <div className="list">
          { items.map((item, i) => {
            return (<div key={i} className="list-item">{item}</div>);
          })}
        </div>

        <Modal show={this.state.showCreateDialog} onHide={this.handleCloseDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Create a List Of Values</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { errorMsg ? <div className="error-message">{ errorMsg }</div> : null }
            <div className="input-field">
              <label>Name Of Value Set</label> <input onChange={this.setNewName} />
            </div>
            <div className="input-field include-btn">
              <label>Add Value</label> 
              <input value={newValue} onChange={this.changeNewValue} onKeyPress={this.checkEnter} /> 
              <button className="main" onClick={this.enterNewValue}><MaterialIcon icon="add" /></button>
            </div>
            <div className="list">
              { newEnum.values.map((item, i)=> {
                return (<div key={i} className="list-item">{item}</div>);
              })}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="main" onClick={this.handleSaveEnum}>Save</button>
            <button onClick={this.handleCloseDialog}>Cancel</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default EnumSelector;