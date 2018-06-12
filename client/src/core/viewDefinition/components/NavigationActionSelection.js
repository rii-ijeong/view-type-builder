import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MaterialIcon from 'material-icons-react';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

class NavigationActionSelection extends Component {
  constructor(props){
    super(props);
    this.state = {
      actions: this.getDefaultActions(),
      moreActions: [],
      visible: false
    };

    this.onDragEnd = this.onDragEnd.bind(this);
    this.deleteList = this.deleteList.bind(this);
    this.toggleVisible = this.toggleVisible.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.preState){
      this.setState(nextProps.preState);
    }
  }

  getDefaultActions(){
    //'Add', 'Delete', 'Copy', 'Search', 'Filter', 'MultiSort', 'Add To Collection', 'Import', 'Export'
    const default_Add = { id: 'addAction', content: 'Add'};
    const default_Delete = { id: 'deleteAction', content: 'Delete'};
    const default_Copy = { id: 'copyAction', content: 'Copy' };
    const default_Search = { id: 'searchAction', content: 'Search' };
    const default_Filter = { id: 'filterAction', content: 'Filter' };
    const default_MultiSort = { id: 'multiSortAction', content: 'Multi-Sort'};
    const default_Collection = { id: 'collectionAction', content: 'Add To Collection'};
    const default_Import = { id: 'importAction', content: 'Import' };
    const default_Export = { id: 'exportAction', content: 'Export' };

    return [default_Add, default_Delete, default_Copy, default_Search, default_Filter, default_MultiSort, default_Collection, default_Import, default_Export];
  }

  id2List = {
    droppable: 'actions',
    droppable2: 'moreActions'
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd(result){
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const state = this.state;
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      state[this.getList(source.droppableId)] = items;

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        actions: result.droppable,
        moreActions: result.droppable2
      });
    }
  }

  deleteList(listName, itemId){
    const state = this.state;
    const list = state[listName];
    const itemIndex = list.findIndex((item)=>{ return item.id === itemId; });
    list.splice(itemIndex, 1);
    state[listName] = list;

    this.setState(state);
  }

  toggleVisible(){
    this.setState({
      visible: !this.state.visible
    });
  }

  render(){
    const { visible } = this.state;
    return (
      <div className="navigation-action-selection">
        <label onClick={this.toggleVisible}>
          Navigation Actions 
          <div className="toggle-visibility-icon">
            {  visible ? 
              <MaterialIcon icon="expand_less" /> :
              <MaterialIcon icon="expand_more" />
            }
          </div>
        </label>
        <div className={'navigation-action-content ' + (visible ? 'visible': '')}>
        <DragDropContext onDragEnd={this.onDragEnd}>

          <div className="actions">
            <h3>Actions Directly Available in Navigation Bar</h3>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef} 
                  class={'nav-action-list ' + (snapshot.isDraggingOver ? 'drag-over': '')}>
                  {this.state.actions.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          className={'nav-item ' + (snapshot.isDragging ? 'dragging' : '')}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <span>
                            {item.content}
                          </span>
                          <div className="delete-nav-action" onClick={() => {this.deleteList('actions', item.id)}}>
                            <MaterialIcon icon="delete_forever" />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="more-actions">
            <h3>Actions Available in Context Menu</h3>
            <Droppable droppableId="droppable2">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} class={'nav-action-list ' + (snapshot.isDraggingOver ? 'drag-over': '')}>
                  {this.state.moreActions.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={'nav-item ' + (snapshot.isDragging ? 'dragging' : '')}>
                          <span>
                            {item.content}
                          </span>
                          <div className="delete-nav-action" onClick={() => {this.deleteList('actions', item.id)}}>
                            <MaterialIcon icon="delete_forever" />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
        </div>
      </div>
    );
  }
}

export default NavigationActionSelection;