import React, { Component } from 'react';
import axios from 'axios';
import MaterialIcon from 'material-icons-react';
import { Modal } from 'react-bootstrap';

import ViewRenderer from './ViewRenderer';
import Navigation from './../common/Navigation';
import './../../styles/view/ViewBuilder.scss';
import PreviewDetailJson from './preview/Detail';

const uniqid = require('uniqid');

class ViewDefinitionBuilder extends Component {
  constructor(props){
    super(props);

    this.state = {
      id: uniqid(),
      listOfTypes: [],
      selectedType: false,
      showTypeDrawer: true,
      definition: {},
      successMsg: false,
      errorMsg: false
    };

    this.toggleTypeDrawer = this.toggleTypeDrawer.bind(this);
    this.selectType = this.selectType.bind(this);
    this.updateData = this.updateData.bind(this);
    this.hideJson = this.hideJson.bind(this);
    this.saveDefinition = this.saveDefinition.bind(this);
  }

  componentDidMount(){
     // if this.props for if passing a saved type definition
    const controller = this;
    
    const TYPES_URL = 'http://localhost:3500/api/type/get-all';
    axios.get(TYPES_URL)
      .then(function(response){
        controller.setState({
          listOfTypes: response.data
        });
      })
      .catch((error) => {
        controller.setState({
          listOfTypes: []
        });
      });
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);
  }

  selectType(typeObject){
    this.setState({
      showTypeDrawer: false,
      selectedType: typeObject
    });
  }

  toggleTypeDrawer(){
    this.setState({
      showTypeDrawer: !this.state.showTypeDrawer
    });
  }

  updateData(data){
    this.setState({
      definition: data
    });
  }

  hideJson(){
    this.setState({
      showJson: false
    });
  }

  saveDefinition(){
    const { id, definition } = this.state;
    const payload = {
      id: id,
      jsonDefinition: JSON.stringify(definition),
      name: definition.viewDefinitionName
    };

    const SAVE_TYPE_URL = 'http://localhost:3500/api/view-definition/save';
    axios.post(SAVE_TYPE_URL, payload)
      .then((response) => {
        this.setState({ successMsg: '"' + definition.viewDefinitionName + '" View Definition has been successfully saved.' });
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

  render() {
    const { listOfTypes, selectedType, showTypeDrawer, definition, successMsg, errorMsg, id } = this.state;
    return (
      <div className="view-builder">

        { successMsg ? <div className="success-message message">{successMsg}</div> : null }
        { errorMsg ? <div className="error-message message">{errorMsg}</div> : null }

        <Navigation>
          <li onClick={() => {this.setState({ showJson: true }) }}>Preview JSON</li>
          <li>Preview View Definition</li>
          <li onClick={ this.saveDefinition }>Save</li>
        </Navigation>
        <div className="view-builder-container">
          <div className={ 'type-drawer ' + (showTypeDrawer ? 'visible' : '')}>
            <div className="drawer-handle" onClick={this.toggleTypeDrawer}>
              <MaterialIcon icon="drag_handle" />
            </div>
            <div className="type-list">
            { listOfTypes.map((typeObject, i) => {
              return (
                <div className="type-item" key={`type_item_${i}`}
                  onClick={ () => { this.selectType(typeObject) } } >
                  {typeObject.name}
                </div>
              );
            })}
            </div>
          </div>
          <div className={ 'view-drawer ' + (!showTypeDrawer ? 'full-length' : '') }>
            { selectedType ? <ViewRenderer objectType={selectedType} onUpdate={this.updateData} /> :
               <span className="message">To start creating a view definition, select an Object Type from the left drawer.</span>
            }
          </div>
        </div>

        <Modal show={this.state.showJson} onHide={this.hideJson}>
          <Modal.Header closeButton>
            <Modal.Title>View Definition JSON Preview</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <PreviewDetailJson data={definition} dataId={id} type={selectedType} />
          </Modal.Body>

          <Modal.Footer>
            <button onClick={this.hideJson}>Close</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ViewDefinitionBuilder;
