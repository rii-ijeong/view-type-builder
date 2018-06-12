import React, { Component } from 'react';
import NavigationActionSelection from './../components/NavigationActionSelection';
import MultiStringInput from './../../common/MultiStringInput';
import { SortableContainer, SortableElement, arrayMove, SortableHandle } from 'react-sortable-hoc';
import MaterialIcon from 'material-icons-react';

const SortableSummaryFieldDragHandle = SortableHandle( () => {
  return (
    <MaterialIcon icon="drag_indicator" />
  );
});

const SortableSummaryFieldItem = SortableElement( ({value}) => {
  return (
    <div className="sortable-type-field"><SortableSummaryFieldDragHandle /> {value.name}</div>
  );
});

const SortableSummaryFieldList = SortableContainer(({items}) => {
  return (
    <ul className="sortable-summary-field-list">
      { items.map((value, index) => (
        <SortableSummaryFieldItem 
          key={`sortable-row-index-${index}`} 
          index={index} 
          value={value} />
      ))}
    </ul>
  );
});

class SummaryView extends Component {
  constructor(props){
    super(props);

    this.state = {
      fields: [],
      excluded: [],
      actions: [],
      moreActions: [],
      defaultPageSize: 250,
      pageOptions: ['10', '20', '50', '100'],
      hasLocation: false,
      hasDates: false,
      locationField: false,
      locationLabel: false,
      startDateField: false,
      endDateField: false,
      typeFields: [],
      moreOptions: false
    };

    this.updateActions = this.updateActions.bind(this);
    this.updateSizeList = this.updateSizeList.bind(this);
    this.onRowSortEnd = this.onRowSortEnd.bind(this);
    this.changePropertyValue = this.changePropertyValue.bind(this);
    this.toggleMoreOptions = this.toggleMoreOptions.bind(this);
  }

  componentDidMount(){
    if(this.props.objectType){
      this.setState({
        typeFields: JSON.parse(this.props.objectType.jsonDefinition)
      });
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.objectType){
      this.setState({
        typeFields: JSON.parse(nextProps.objectType.jsonDefinition)
      });
    }
  }

  updateActions(state){
    this.setState({
      actions: state.actions,
      moreActions: state.moreActions
    });
  }

  toggleMoreOptions(){
    this.setState({
      moreOptions: !this.state.moreOptions
    });
  }

  updateSizeList(list){
    this.setState({
      pageOptions: list
    });
  }

  onRowSortEnd({oldIndex, newIndex}){
    const state = this.state;
    let {typeFields} = this.state;
    state.typeFields = arrayMove(typeFields, oldIndex, newIndex);
    
    this.setState(state);
  }

  changePropertyValue(propertyName, e){
    const state = this.state;
    state[propertyName] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    this.setState(state);
  }

  render(){
    const { 
      fields, 
      excluded, 
      actions, 
      defaultPageSize, 
      pageOptions, 
      locationField, 
      locationLabel, 
      startDateField, 
      endDateField, 
      hasLocation, 
      hasDates,
      typeFields,
      moreOptions
    } = this.state;

    return (
      <div className="summary-view view">
        <div className="fields">

          <div className="input-field">
            <NavigationActionSelection onUpdate={this.updateActions} />
          </div>
          <div className="more-options">
            <div className="more-options-header" onClick={this.toggleMoreOptions}>
              More Options
              {  moreOptions ? 
                <MaterialIcon icon="expand_less" /> :
                <MaterialIcon icon="expand_more" />
              }
            </div>
            <div className={ 'more-options-content ' + (moreOptions ? 'visible' : '')}>
              <div className="input-field half">
                <label>Results Per Page</label>
                <input value={defaultPageSize} onChange={(e)=>{this.changePropertyValue('defaultPageSize', e)}} />
              </div>

              <div className="input-field half">
                <label>Additional Result Size Options</label>
                <MultiStringInput items={pageOptions} onUpdate={this.updateSizeList} />
              </div>

              <div className="input-field input-checkbox half">
                <input type="checkbox" checked={hasLocation} onChange={(e)=>{this.changePropertyValue('hasLocation', e)}} />
                <label>Has Location Field</label>
              </div>

              <div className="input-field input-checkbox half">
                <input type="checkbox" checked={hasDates} onChange={(e)=>{this.changePropertyValue('hasDates', e)}} />
                <label>Has Date Fields</label>
              </div>

              { hasLocation ? 
                <div className="input-field half">
                  <label>Location Field</label>
                  <select value={locationField} onChange={(e)=>{this.changePropertyValue('locationField', e)}}>
                    <option value="">Select Field</option>
                  </select>

                  <span className="whitespace"/>

                  <label>Location Override Label</label>
                  <input value={locationLabel} onChange={(e)=>{this.changePropertyValue('locationLabel', e)}} />
                </div> : <div className="input-field half" />
              }

              { hasDates ? 
                <div className="input-field half">
                  <label>Start Date Field</label>
                  <select value={startDateField} onChange={(e)=>{this.changePropertyValue('startDateField', e)}}>
                    <option value="">Select Start Date Field</option>
                  </select>

                  <span className="whitespace"/>

                  <label>End Date Field</label>
                  <select value={endDateField} onChange={(e)=>{this.changePropertyValue('endDateField', e)}}>
                    <option value="">Select End Date Field</option>
                  </select>
                </div> : <div className="input-field half" />
              }
            </div>
          </div>
        </div>

        <div className="type-fields">
          <h3>Fields To Display in Summary View</h3>

          <SortableSummaryFieldList 
            items={typeFields} 
            axis={'x'} 
            onSortEnd={this.onRowSortEnd} 
            useDragHandle={true} />
        </div>
      </div>
    );
  }
}

export default SummaryView;