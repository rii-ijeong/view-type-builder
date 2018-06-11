import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GridLayout from 'react-grid-layout';
import MaterialIcon from 'material-icons-react';
import { SortableHandle } from 'react-sortable-hoc';
import { Popover, OverlayTrigger } from 'react-bootstrap';

import './../../../styles/view/Row.scss';

import Column from './Column';

class Row extends Component {
  constructor(props){
    super(props);

    this.state = {
      layouts: [],
      columns: [],
      readOnly: false,
      rowTitle: '',
      id: false,
      visible: false,
      collapsible: false,
      width: 0
    }

    this.propertyTimerChange = false;

    this.saveLayout = this.saveLayout.bind(this);
    this.deleteColumn = this.deleteColumn.bind(this);
    this.addColumn = this.addColumn.bind(this);
    this.updateColumn = this.updateColumn.bind(this);
    this.adjustColumnHeight = this.adjustColumnHeight.bind(this);
    this.changePropertyValue = this.changePropertyValue.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  componentDidMount(){
    const {body} = this.props;
    const newLayout = { i: 'col_1', x: 0, y: 0, w: 12, h: 1};
    const newColumn = { i: 'col_1', fields: [], columnTitle: '[Column Title]', collapsible: false };

    const elWidth = ReactDOM.findDOMNode(this).getBoundingClientRect().width - 30;
    body.width = elWidth;

    if(body){
      if(!body.layouts.length){
        body.layouts = [ newLayout ];
        body.columns = [ newColumn ];
      }
      this.setState(this.props.body);
    }
  }

  componentWillReceiveProps(nextProps){
    let state = {};
    if(nextProps.body){
      state = nextProps.body;

      if(!nextProps.body.layouts.length){
        const newLayout = { i: 'col_1', x: 0, y: 0, w: 12, h: 1};
        const newColumn = { i: 'col_1', fields: [], columnTitle: '[Column Title]', collapsible: false };
        state.layouts = [ newLayout ];
        state.columns = [ newColumn ];
      }
    }

    state.readOnly = nextProps.readOnly || state.readOnly;
    this.setState(state);
  }

  changePropertyValue(propertyName, e){
    const state = this.state;
    state[propertyName] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    this.setState(state, ()=>{
      this.props.onRowChange(this.state);
    });
  }

  adjustColumnHeight(height, columnId){
    const { layouts } = this.state;
    let layoutIndex;
    const layout = layouts.filter((col, index) => {
      if( col.i === columnId ){
        layoutIndex = index;
      }
      return col.i === columnId;
    })[0];

    const newHeight = height / 34;
    layout.h = newHeight;
    layout.minH = newHeight;
    layouts[layoutIndex] = layout;

    this.setState({
      layouts: layouts.splice(0)
    }, () => {
      this.props.onRowChange(this.state);
    });
  }

  toggleVisibility(e){
    if(e.target.classList.contains('material-icons')){
      return;
    }

    this.setState({
      visible: !this.state.visible
    }, () => {
      this.props.onRowChange(this.state);
    });
  }

  saveLayout(layout){
    this.setState({
      layouts: layout
    }, () => {
      this.props.onRowChange(this.state);
    });
  }

  updateColumn(col){
    const { columns } = this.state;
    const columnIndex = columns.findIndex((column)=>{
      return column.i === col.i;
    }); 

    columns[columnIndex] = col;
    this.setState({
      columns: columns
    }, () => {
      this.props.onRowChange(this.state);
    });
  }

  deleteColumn(columnId){
    const { layouts, columns } = this.state;
    const layoutIndex = layouts.findIndex((layout)=>{
      return layout.i === columnId;
    });
    const columnIndex = columns.findIndex((column)=>{
      return column.i === columnId;
    });

    layouts.splice(layoutIndex, 1);
    columns.splice(columnIndex, 1);

    this.setState({
      columns: columns.splice(0),
      layouts: layouts.splice(0)
    }, () => {
      this.props.onRowChange(this.state);
    });
  }

  addColumn(){
    const {layouts, columns} = this.state;
    const latestIndex = columns.length + 1;

    const newLayout = { i: 'col_'+latestIndex.toString(), x: 0, y: 0, w: 12, h: 1};
    const newColumn = { i: 'col_'+latestIndex.toString(), fields: [], columnTitle: '[Column Title]', collapsible: false };

    let widthTotal = 0;
    layouts.forEach(function(column){
      if(column.x + column.w > widthTotal){
        widthTotal = column.x + column.w;
      }
    });

    let newWidth;
    if(widthTotal >= 12){
      newWidth = 12/(columns.length + 1);

      layouts.forEach(function(column, index){
        column.x = index * newWidth;
        column.w = newWidth;
      });

      newLayout.x = columns.length * newWidth;
      newLayout.w = newWidth;
    } else {
      newLayout.x = widthTotal;
      newLayout.w = 12 - widthTotal;
    }

    columns.push(newColumn);
    layouts.push(newLayout);

    this.setState({
      columns: columns.splice(0),
      layouts: layouts.splice(0)
    }, () => {
      this.props.onRowChange(this.state);
    });
  }

  render(){
    const { columns, layouts, rowTitle, width, visible, readOnly, collapsible } = this.state;
    const { rowIndex } = this.props;

    const DragHandle = SortableHandle( () => {
      return (
        <MaterialIcon icon="drag_indicator" />
      );
    });

    const deletePopover = (
      <Popover className="confirm-delete-popover" id={ 'confirmDelete_' + rowIndex }>
        <p>Are you sure you want to delete this <strong>row</strong>?</p>
        <div className="actions">
          <button className="main" onClick={() => { this.props.onDeleteRow(rowIndex); document.body.click(); }}>Delete</button>
          <button className="secondary" onClick={ () => { document.body.click() }}>Cancel</button>
        </div>
      </Popover>
    );

    return (
      <div className="view-row">
        <div className="row-header" onClick={this.toggleVisibility}>
          <DragHandle /> <span>{rowTitle}</span>
        </div>
        <div className="toggle-visibility-icon">
          {  visible ? 
            <MaterialIcon icon="expand_less" /> :
            <MaterialIcon icon="expand_more" />
          }
        </div>
        <OverlayTrigger rootClose={true} trigger="click" placement="bottom" overlay={deletePopover} containerPadding={20}>
          <div className="delete-row-icon">
            <MaterialIcon icon="delete_forever" />
          </div>
        </OverlayTrigger>

        <div className={ 'row-content ' + (visible ? 'visible' : '') }>
          <div className="row-fields">
            <div className="input-field">
              <label>Row Title</label>
              <input value={rowTitle} onChange={(e) => { this.changePropertyValue('rowTitle', e) }} />
            </div>

            { !this.props.readOnly ? 
              <div className="input-field input-checkbox">
                <input type="checkbox" value={readOnly} 
                  onChange={(e) => {this.changePropertyValue('readOnly', e)}} /> 
                <label>Read-only Fields</label>
              </div> : null 
            }

            <div className="input-field input-checkbox">
              <input type="checkbox" value={collapsible}
                onChange={(e) => {this.changePropertyValue('collapsible', e)}} />
              <label>Collapsible</label>
            </div>

            <button className="add-column text-and-icon" onClick={this.addColumn}>
              <MaterialIcon icon="add" /> <span>Add Column</span>
            </button>
          </div>  
          <div className="columns">
            <GridLayout className="grid-layout-row"
              layout={layouts}
              breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
              cols={12}
              width={width}
              margin={[0, 0]}
              containerPadding={[0, 0]}
              rowHeight={34}
              preventCollision={true}
              draggableHandle={ '.column-header' }
              onLayoutChange={this.saveLayout}
            >
              {columns.map((column, i) => {
                return (
                  <div key={column.i}> 
                    <Column 
                      objectType={this.props.objectType}
                      key={`column_${i}`}
                      body={column} 
                      readOnly={readOnly}
                      onDeleteColumn={this.deleteColumn}
                      onColumnChange={this.updateColumn}
                      onColumnHeightChange={this.adjustColumnHeight}
                      columnIndex={i} />
                  </div>
                );
              })}
            </GridLayout>
          </div>
        </div>
      </div>
    );
  }
}

export default Row;