import React, { Component } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import MaterialIcon from 'material-icons-react';

import Page from './../components/Page';

const DragHandle = SortableHandle( ({handleTitle}) => {
  return (
    <MaterialIcon icon="drag_indicator" />
  );
});

const SortableItem = SortableElement( ({activeTab, value, viewTabIndex, setActiveTab}) => {
  return (
    <div className={'tab ' + (activeTab === viewTabIndex ? 'active': '')} onClick={() => {setActiveTab(viewTabIndex)}}>
      <DragHandle/> <span>{ value.pageName }</span>
    </div>
  );
});

const SortableList = SortableContainer(({items, activeTab, setActiveTab}) => {
  return (
    <ul className="sortable-tab-list">
      { items.map((value, index) => (
        <SortableItem 
          key={`item-${index}`} 
          index={index} 
          value={value} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          viewTabIndex={index} />
      ))}
    </ul>
  )
});

class DetailView extends Component {

  constructor(props){
    super(props);

    this.state = {
      pages: [],
      activeTab: 0,
      isSinglePage: true
    }

    this.onSortEnd = this.onSortEnd.bind(this);
    this.addViewPage = this.addViewPage.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.getNextId = this.getNextId.bind(this);
  }

  componentDidMount(){
    let state = {};
    if(this.props.data){
      state = this.props.data;
    }

    if(this.props.singlePage){
      state.isSinglePage = this.props.singlePage;
    }
    this.setState(state, () => {
      if(!this.props.data){
        this.addViewPage();
      }
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      isSinglePage: nextProps.singlePage
    });
  }

  addViewPage(){
    const { pages } = this.state;
    const newView = {
      rows: [],
      pageName: '[Page Title]',
      readOnly: false,
      id: 'page_' + this.getNextId()
    }
    pages.push(newView);

    this.setState({
      pages: pages
    }, () => {
      this.props.onUpdate(this.state);
    });
  }

  getNextId(){
    const { pages } = this.state;
    let id = 0;
    pages.forEach((page) => {
      const idNum = page.id.split('_')[1];
      if(parseInt(idNum, 10) > id){
        id = parseInt(idNum, 10);
      }
    });

    return id + 1;
  }

  setActiveTab(index){
    this.setState({
      activeTab: index
    }, () => {
      this.props.onUpdate(this.state);
    });
  }

  onSortEnd(indexes, e){
    const { oldIndex, newIndex } = indexes;
    if(oldIndex === newIndex){
      return;
    }

    let { pages } = this.state;
    if (newIndex >= pages.length) {
        var k = newIndex - pages.length;
        while ((k--) + 1) {
            pages.push(undefined);
        }
    }
    pages.splice(newIndex, 0, pages.splice(oldIndex, 1)[0]);
    
    this.setState({
      pages: pages
    }, () => {
      this.props.onUpdate(this.state);
    });
  }

  updatePage(updatedPage){
    const {pages} = this.state;
    const pageIndex = pages.findIndex((page)=>{
      return updatedPage.id === page.id;
    });
    
    pages[pageIndex] = updatedPage;

    this.setState({
      pages: pages
    }, () => {
      this.props.onUpdate(this.state);
    });
  }

  render(){
    const { pages, activeTab, isSinglePage } = this.state;

    return (
      <div className="detail-view view">
        { !isSinglePage ? 
          <div className="tabs">
            <div className="add-tab" onClick={this.addViewPage} >
              <MaterialIcon icon="add" /> 
              <span>Add Tab</span>
            </div>

            <SortableList 
              items={pages} 
              activeTab={activeTab}
              setActiveTab={this.setActiveTab}
              onSortEnd={this.onSortEnd} 
              axis={'x'} 
              useDragHandle={true} />
          </div> : null
        }

        <div className="view-body">
          <Page objectType={this.props.objectType} active={true} updatePage={this.updatePage} body={pages[activeTab]} pageIndex={activeTab} />
        </div>
      </div>
    );
  }
}

export default DetailView;