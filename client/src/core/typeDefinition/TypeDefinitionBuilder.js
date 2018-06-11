import React, { Component } from 'react';
import MaterialIcon from 'material-icons-react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

import './../../styles/type/TypeBuilder.scss';
import ReadOnlyField from './../common/ReadOnlyField';
import Field from './../common/Field';
import EditTypeField from './EditTypeField';
import PreviewType from './PreviewType';
import Navigation from './../common/Navigation';

import TypeFactory from './../factories/TypeFactory';

const uniqid = require('uniqid');

class TypeDefinitionBuilder extends Component {

  constructor(props){
    super(props);

    this.state = {
      id: false,
      fields: [],
      name: '',
      selectedField: false,
      listOfEnums: [],
      listOfTypes: [],
      successMsg: false,
      errorMsg: false,
      showPreview: false,
      previewJson: {}
    };

    this.editProperty = this.editProperty.bind(this);
    this.addProperty = this.addProperty.bind(this);
    this.updateProperty = this.updateProperty.bind(this);
    this.updateEnumList = this.updateEnumList.bind(this);
    this.saveType = this.saveType.bind(this);
    this.previewType = this.previewType.bind(this);
    this.hidePreview = this.hidePreview.bind(this);
  }

  componentDidMount(){
    // if this.props for if passing a saved type definition
    const controller = this;
    
    const ENUMS_URL = 'http://localhost:3500/api/type/enum/all';
    const TYPES_URL = 'http://localhost:3500/api/type/get-all';
    axios.all([
      axios.get(ENUMS_URL),
      axios.get(TYPES_URL)
    ])
      .then(axios.spread(function(enums, allTypes){
        controller.setState({
          id: {
            name: "Unique Type ID",
            value: uniqid()
          },
          listOfEnums: enums.data,
          listOfTypes: allTypes.data
        });
      }))
      .catch((error) => {
        controller.setState({
          id: {
            name: "Unique Type ID",
            value: uniqid()
          },
          listOfEnums: [],
          listOfTypes: []
        });
      });
  }

  editProperty(newField){
    this.setState({
      selectedField: newField
    });
  }

  updateProperty(newField){
    const { fields } = this.state;
    fields[newField.index] = newField;

    this.setState({
      fields: fields,
      selectedField: newField
    });
  }

  updateEnumList(newEnum){
    let { listOfEnums } = this.state;
    listOfEnums.push(newEnum);
    this.setState({
      listOfEnums: listOfEnums
    });
  }

  saveType(){
    const { id, name, fields } = this.state;
    const payload = {
      id: id.value,
      name: name,
      jsonDefinition: JSON.stringify(fields)
    };

    const SAVE_TYPE_URL = 'http://localhost:3500/api/type/save';
    axios.post(SAVE_TYPE_URL, payload)
      .then((response) => {
        this.setState({ successMsg: '"' + name + '" Type has been successfully saved.' });
      })
      .catch((error) => {
        this.setState({ errorMsg: 'Something wrong happened. Please try again later.' });
      })
      .finally(() => {
        setTimeout(() => {
          this.setState({
            errorMsg: false,
            successMsg: false
          });
        }, 2000);
      });
  }

  previewType(){
    const state = this.state;
    this.setState({
      showPreview: true,
      previewJson: TypeFactory.exportStandard(state)
    });
  }

  hidePreview(){
    this.setState({
      showPreview: false
    });
  }

  addProperty(){
    const { fields } = this.state;
    const newField = { 
      name: '', 
      values: '', 
      type: 'string', 
      id: '', minimumEntries: 0, 
      maximumEntries: 1, 
      isRequired: false, 
      isArray: false, 
      index: fields.length, 
      domainObjectType: false 
    };
    fields.push(newField);
    this.setState({ fields: fields, selectedField: newField });
  }

  render() {
    const { fields, id, selectedField, listOfEnums, listOfTypes, name, successMsg, errorMsg } = this.state;
    return (
      <div className="type-builder">

        <Navigation></Navigation>

        { successMsg ? <div className="success-message message">{successMsg}</div> : null }
        { errorMsg ? <div className="error-message message">{errorMsg}</div> : null }

        <div className="type-container properties">

          <Modal show={this.state.showPreview} onHide={this.hidePreview}>
            <Modal.Header closeButton>
              <Modal.Title>Type JSON Preview</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <PreviewType jsonString={this.state.previewJson} />
            </Modal.Body>
            <Modal.Footer>
              <button onClick={this.hidePreview}>Close</button>
            </Modal.Footer>
          </Modal>

          <button className="text-and-icon top" onClick={ this.addProperty }>
            <MaterialIcon icon="add" />
            <span>Add a property</span>
          </button>

          <div className="fields">
            <ReadOnlyField item={id} />
            <div className="field">
              <label>Type Name</label>
              <input value={name} onChange={(e)=> {this.setState({ name: e.target.value })}} />
            </div>
            { fields.map((field, i) => {
              const item = {
                name: 'Property',
                value: '[' + field.type + '] ' + (field.name.length ? field.name : '[undefined] ' + (field.isRequired ? '*' : ''))
              };
              return (
                <div  key={'field_' + i} onClick={() => {this.editProperty(field)}}>
                  <Field item={item}/>
                </div>
              );
            })}
          </div>
          
          <div className="actions">
             <button className="text-and-icon" onClick={ this.saveType }>
              <MaterialIcon icon="save_alt" />
              <span>Save</span>
            </button>
            <button className="text-and-icon" onClick={ this.previewType }>
              <MaterialIcon icon="pageview" />
              <span>Code</span>
            </button>
          </div>
         
        </div>

        <div className="type-container modify-property">
          <div className="edit">
            { selectedField ?  
              <EditTypeField 
                field={selectedField} 
                enums={listOfEnums} 
                types={listOfTypes}
                onChange={this.updateProperty}
                onEnumListUpdate={this.updateEnumList} /> : null }
          </div>
        </div>
      </div>
    );
  }
}

export default TypeDefinitionBuilder;
