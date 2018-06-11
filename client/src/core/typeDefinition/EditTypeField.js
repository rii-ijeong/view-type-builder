import React, { Component } from 'react';
import EnumSelector from './../common/EnumSelector';

class EditTypeField extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: '',
      name: '',
      values: false,
      type: '',
      domainObjectType: false,
      minimumEntries: 0,
      maximumEntries: 1,
      isRequired: false,
      isArray: false, 
      index: 0
    }

    this.debounceTimer = false;
    this.updateValuesField = this.updateValuesField.bind(this);
  }

  componentDidMount(){
    if(this.props.field){
      this.setState(this.props.field);
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.field){
      this.setState(nextProps.field);
    }
  }

  componentWillUnmount(){
    clearTimeout(this.debounceTimer);
  }

  updateValuesField(enums){
    this.setState({ values: enums });
  }

  changePropertyValue(propertyName, e){
    if(this.debounceTimer){
      clearTimeout(this.debounceTimer);
    }

    const state = this.state;
    state[propertyName] = e.target.value;
    this.setState(state);

    this.debounceTimer = setTimeout(()=>{
      this.props.onChange(state);
    }, 350);
  }

  render () {
    const {name, values, type, minimumEntries, maximumEntries, isRequired, isArray, domainObjectType} = this.state;
    const { types } = this.props;
    return (
      <div className="edit-type-field-dialog">
        <div className="fields">
          <div className="input-field">
            <label>Property Name</label>
            <input value={name} onChange={ (e) => { this.changePropertyValue('name', e)} } />
          </div>

          <div className="input-field">
            <label>Property Type</label>
            <select value={type} onChange={  (e) => { this.changePropertyValue('type', e)} }>
              <option value="string">String</option>
              <option value="integer">Number</option>
              <option value="boolean">Boolean</option>
              <option value="enum">Enumeration</option>
              <option value="object">Object</option>
            </select>
          </div>

          <div className="input-field input-checkbox half">
            <input type="checkbox" value={isRequired} onChange={ (e) => { this.changePropertyValue('isRequired', e)} } />
            <label>Is Required</label>
          </div>

          <div className="input-field input-checkbox half">
            <input type="checkbox" value={isArray}  onChange={ (e) => { this.changePropertyValue('isArray', e)} } />
            <label>Multiple selection of [<i>Property Type</i>]</label>
          </div>

          { isArray ?
            <div className="input-field half">
              <label>Minimum Selections</label>
              <input type="number" value={minimumEntries} onChange={ (e) => { this.changePropertyValue('minimumEntries', e)} } />
            </div> : null
          }

          { isArray ? 
            <div className="input-field half">
              <label>Maximum Selections</label>
              <input type="number" value={maximumEntries} onChange={ (e) => { this.changePropertyValue('maximumEntries', e)} } />
            </div> : null
          }

          { type === 'enum' ? 
            <div className="input-field">
              <label>Values</label>
              <EnumSelector enums={this.props.enums} selected={values} onSelect={this.updateValuesField} onEnumListUpdate={this.props.onEnumListUpdate} />
            </div> : null 
          }

          { type === 'object' ? 
            <div className="input-field">
              <label>Reference Object Type</label>
              <select value={domainObjectType} onChange={ (e) => { this.changePropertyValue('domainObjectType', e)} }>
                <option value=''>Select an object type</option>
                { types.map((referenceType, index) => {
                  return (
                    <option key={ 'object_'+index } value={referenceType.id}>{referenceType.name}</option>
                  );
                })}
              </select>
            </div> : null
          }
        </div>
      </div>
    );
  }
}

export default EditTypeField;