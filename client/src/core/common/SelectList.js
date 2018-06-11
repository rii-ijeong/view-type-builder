import React, { Component } from 'react';
import MaterialIcon from 'material-icons-react';
import './../../styles/common/SelectList.scss';

class SelectList extends Component {
  render () {
    return (
      <div className="select-list">
        { this.props.items.map((item, index)=> {
          return (
            <div key={ 'list-item_'+index } className="list-item" onClick={() => { this.props.onSelect(item.id) }}>
              <MaterialIcon icon="edit" /> <span>{ item.name && item.name.length ? item.name : '[No Title]' }</span>
            </div>  
          );
        })}
      </div>
    );
  }
}

export default SelectList;