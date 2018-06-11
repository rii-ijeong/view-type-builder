import React, { Component } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

import TypeField from './TypeField';
import './../../../styles/view/TypeFieldSelector.scss';

/**
 * readOnly={readOnly} 
              key={`select-field_${f}`} 
              field={field} 
              fieldIndex={f} 
              onFieldDelete={this.deleteField}
              onFieldUpdate={this.updateField}
 */

const SortableTypeFieldItem = SortableElement(
  ({value,readOnly, fieldIndex, onFieldDelete, onFieldUpdate}) => {
    return (
      <TypeField 
        readOnly={readOnly} 
        field={value} 
        fieldIndex={fieldIndex} 
        onFieldDelete={onFieldDelete}
        onFieldUpdate={onFieldUpdate} />
    );
  }
);

const SortableTypeFieldList = SortableContainer(
  ({items, readOnly, onFieldDelete, onFieldUpdate}) => {
    return (
      <ul className="sortable-typefield-list">
        { items.map((value, index) => (
          <SortableTypeFieldItem
            key={`sortable-typefield-index-${index}`}
            index={index}
            value={value}
            readOnly={readOnly}
            fieldIndex={index}
            onFieldDelete={onFieldDelete}
            onFieldUpdate={onFieldUpdate} />
        ))}
      </ul>
    );
  }
);

class TypeFieldSelector extends Component{
  constructor(props){
    super(props);
    this.state = {
      selectedField: false,
      objectTypeFields: [],
      fields: [],
      readOnly: false
    };

    this.addSelectedField = this.addSelectedField.bind(this);
    this.updateField = this.updateField.bind(this);
    this.deleteField = this.deleteField.bind(this);
    this.onRowSortEnd = this.onRowSortEnd.bind(this);
  }

  componentWillReceiveProps(nextProps){
    const state = this.state;

    if(nextProps.objectType){
      state.objectTypeFields = JSON.parse(nextProps.objectType.jsonDefinition);
    }

    if(nextProps.fields){
      state.fields = nextProps.fields
    }

    state.readOnly = nextProps.readOnly;

    this.setState(state);
  }

  onRowSortEnd({oldIndex, newIndex}){
    let {fields} = this.state;
    fields = arrayMove(fields, oldIndex, newIndex);
    
    this.setState({
      fields: fields }, () => {
      this.props.onFieldSelection(fields);
    });
  }

  updateField(field, fieldIndex){
    const { fields } = this.state;
    fields[fieldIndex] = field;

    this.setState({
      fields: fields
    }, () => {
      this.props.onFieldSelection(fields);
    });
  }

  deleteField(fieldIndex){
    const { fields } = this.state;
    fields.splice(fieldIndex, 1);

    this.setState({
      fields: fields
    }, () => {
      this.props.onFieldSelection(fields);
    });
  }

  addSelectedField(e){
    const { fields, objectTypeFields } = this.state;
    const fieldIndex = fields.findIndex((field) => {
      return field.name === e.target.value;
    });

    if(!e.target.value || !e.target.value.length || fieldIndex !== -1){
      return;
    }

    const field = objectTypeFields.filter((field) => {
      return field.name === e.target.value;
    })[0];

    fields.push({
      name: field.name,
      type: field.type
    });

    this.setState({
      fields: fields,
      selectedField: false
    }, () => {
      this.props.onFieldSelection(fields);
    });
  }

  render(){
    const {objectTypeFields, selectedField, fields, readOnly} = this.state;

    return (
      <div className="object-type-selector">
        <h4>Display Properties</h4>
        <div className="add-field">
          <select value={selectedField} onChange={this.addSelectedField}>
            <option value={ false }>Select A Property</option>
            {objectTypeFields.map((property, p) => {
              return (
                <option key={`field_${p}`} value={property.name}>{property.name}</option>
              );
            })}
          </select>
        </div>
        <div className="selected-fields">
        { fields.length ? 
          <SortableTypeFieldList 
            items={fields} 
            readOnly={readOnly} 
            onFieldDelete={this.deleteField} 
            onFieldUpdate={this.updateField}
            onSortEnd={this.onRowSortEnd}
            useDragHandle={true} /> : null
        }

        { !fields.length ? <div className="property-name">No properties added.</div> : null}
        </div>
      </div>
    );
  }
}

export default TypeFieldSelector;