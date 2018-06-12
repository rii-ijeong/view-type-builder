import React, { Component } from 'react';
import MaterialIcon from 'material-icons-react';
import './../../styles/common/MultiStringInput.scss';

class MultiStringInput extends Component {
  constructor(props){
    super(props);

    this.state = {
      list: [],
      newItem: ''
    };

    this.deleteItem = this.deleteItem.bind(this);
    this.setNewItemValue = this.setNewItemValue.bind(this);
    this.checkEnter = this.checkEnter.bind(this);
  }

  componentDidMount(){
    if(this.props.items){
      this.setState({
        list: this.props.items
      });
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.items){
      this.setState({
        list: nextProps.items
      });
    }
  }

  setNewItemValue(e){
    this.setState({
      newItem: e.target.value
    });
  }

  checkEnter(e){
    if(e.key === 'Enter'){
      const { newItem, list } = this.state;

      if(!newItem.length || list.indexOf(newItem) > -1) { return; }

      list.push(newItem);
      this.setState({
        newItem: '',
        list: list
      });
    }
  }

  deleteItem(index){
    const {list} = this.state;
    list.splice(index, 1);
    this.setState({
      list: list
    });
  }

  render () {
    const { list, newItem } = this.state;
    return (
      <div className="multi-string-input">
        <div className="ms-input">
          <input value={newItem} onChange={this.setNewItemValue} onKeyPress={this.checkEnter} />
          <div className="ms-add">
            <MaterialIcon icon="add" />
          </div>
        </div>
        <div className="ms-items">
        {list.map((item, i) => {
          return (
            <div key={`ms-item-${i}`} className="ms-item">
              <div className="ms-delete" onClick={()=>{ this.deleteItem(i) }}>
                <MaterialIcon icon="delete_forever" />
              </div>
              {item}
            </div>
          );
        })}
        </div>
      </div>
    );
  }
}

export default MultiStringInput;