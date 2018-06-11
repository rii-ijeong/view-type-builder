import React, { Component } from 'react';
import MaterialIcon from 'material-icons-react';
import './../../../styles/view/Page.scss';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

import Row from './Row';

const SortableRowItem = SortableElement( ({value, rowIndex, objectType, deleteRow, handleRowChange, readOnly}) => {
  return (
    <Row 
      readOnly={readOnly}
      objectType={objectType} 
      body={value} 
      rowIndex={rowIndex} 
      onDeleteRow={deleteRow}
      onRowChange={handleRowChange} />
  );
});

const SortableRowList = SortableContainer(({items, objectType, handleRowChange, deleteRow, readOnly}) => {
  return (
    <ul className="sortable-row-list">
      { items.map((value, index) => (
        <SortableRowItem 
          key={`sortable-row-index-${index}`} 
          index={index} 
          value={value} 
          readOnly={readOnly}
          rowIndex={index} 
          handleRowChange={handleRowChange}
          deleteRow={deleteRow}
          objectType={objectType} />
      ))}
    </ul>
  );
});

class Page extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      pageName: '',
      readOnly: false,
      rows: [],
      id: false
    };

    this.onRowSortEnd = this.onRowSortEnd.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.addRow = this.addRow.bind(this);
    this.changePropertyValue = this.changePropertyValue.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.getNextId = this.getNextId.bind(this);
  }

  componentDidMount(){
    const newRow = {
      layouts: [],
      columns: [],
      id: 'row_1',
      readOnly: false,
      collapsible: false,
      rowTitle: '[Row Title]'
    }

    let state = this.props.body || { rows: [], pageName: '' };
    if(this.props.body && !this.props.body.rows.length){
      state.rows.push(newRow);
    }
    this.setState(state);
  }

  componentWillReceiveProps(nextProps){
    const newRow = {
      layouts: [],
      columns: [],
      id: 'row_1',
      readOnly: false,
      collapsible: false,
      rowTitle: '[Row Title]'
    }
    let state = {};
    if(nextProps.body){
      state = nextProps.body;

      if(!state.rows.length){
        state.rows.push(newRow);
      }
    }

    this.setState(state);
  }

  changePropertyValue(propertyName, e){
    const state = this.state;
    state[propertyName] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    this.setState(state, () => {
      this.props.updatePage(state);
    });
  }

  handleRowChange(updatedRow){
    const state = this.state;
    const rowIndex = state.rows.findIndex((row)=>{
      return row.id === updatedRow.id;
    });
    state.rows[rowIndex] = updatedRow;
    this.setState(state, () => {
      this.props.updatePage(state);
    });
  }

  addRow(){
    const newRow = {
      layouts: [],
      columns: [],
      readOnly: false,
      collapsible: false,
      id: 'row_' + this.getNextId(),
      rowTitle: '[Row Title]'
    }
    const state = this.state;
    state.rows.push(newRow);

    this.setState(state, () => {
      this.props.updatePage(state);
    });
  }

  getNextId(){
    const { rows } = this.state;
    let id = 0;
    rows.forEach((row) => {
      const idNum = row.id.split('_')[1];
      if(parseInt(idNum, 10) > id){
        id = parseInt(idNum, 10);
      }
    });

    return id + 1;
  }

  deleteRow(rowIndex){
    const state = this.state;
    const rows = state.rows.splice(0);
    rows.splice(rowIndex, 1);
    state.rows = rows;

    this.setState(state, () => {
      this.props.updatePage(state);
    });
  }

  onRowSortEnd({oldIndex, newIndex}){
    const state = this.state;
    let {rows} = this.state;
    state.rows = arrayMove(rows, oldIndex, newIndex);
    
    this.setState(state, () => {
      this.props.updatePage(state);
    });
  }

  render(){
    const { pageName, rows, readOnly } = this.state;

    return (
      <div className={ "view-page " + (this.props.active ? 'visible' : '')}>
        <div className="fields">
          <div className="input-field">
            <label>Page Name</label>
            <input value={pageName} 
              onChange={(e) => {this.changePropertyValue('pageName', e)}} />
          </div>

          <div className="input-field input-checkbox">
            <input type="checkbox" value={readOnly} 
              onChange={(e) => {this.changePropertyValue('readOnly', e)}} /> 
            <label>Read-only Fields</label>
          </div>
        </div>

        <div className="layout-builder">
          <div className="layout-actions">
            <button className="add-row text-and-icon" onClick={this.addRow}>
              <MaterialIcon icon="add"/> <span>Add Row</span>
            </button>
          </div>

          <div className="rows">
            <SortableRowList 
              items={rows} 
              readOnly={readOnly}
              objectType={this.props.objectType} 
              deleteRow={this.deleteRow}
              handleRowChange={this.handleRowChange}
              onSortEnd={this.onRowSortEnd} 
              useDragHandle={true} />
          </div>
        </div>
      </div>
    );
  }
}

export default Page;