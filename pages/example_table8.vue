<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main>
     <h2>TABLE CANVAS X GRID ELEMENT</h2>
      <div class="xs-data-grid">
        <div id='containerCanvas'></div>
        <div
          :class="`xs-data-grid-overlayer`"
          :style="{ top: `${tableHeaderHeight +1 }px` }"
        >
          <div v-show="show" :class="`xs-data-grid-editor`" ref="editor" :style="editorSty">
            <div  class="popover-cell"
                 :style="popupSty"
                  v-if="dataType === 'text'"
            >
              <el-input placeholder="Please input" v-model="value" size="small"></el-input>
            </div>
            <div  class="table-cell"
                  v-if="dataType === 'group_table'"
            >
              <div class="items_row">
                <div v-for="column in cellTable" class="cell" :style="{width: `${column.width}px`}">
                   {{value}}
                </div>
              </div>
            </div>
            <el-date-picker
              v-if="dataType === 'date'"
              :class="`xs-data-grid-popup`"
              :style="popupSty"
              v-model="value"
              :editable="false"
              type="date"
              size="medium"
              placeholder="Date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </div>
      </div>

    </el-main>
  </el-container>
</template>
<script>
//import * as cGridAll from "vue-cheetah-grid";
import CanvasTable from "x-canvas-table";
import TestInput from "/components/test-input"
import Svg from "x-canvas-table/dist/component/Svg";
import Layer from "x-canvas-table/dist/component/Layer";
import {mapGetters} from "vuex";
import {VIEW_PORT_HEIGHT, VIEW_PORT_WIDTH} from "../store";

const COMPLEX_DATE_TYPES = ["text", "date", "datetime", "select"];

function generatePersons(val) {
  let obj = [];
  for (let i = 0; i < val; i++) {
    obj.push({
      name: 'John Brown',
      age: i + 1,
      street: 'Lake Park',
      building: '2021-01-01',
      number: 2035,
      companyAddress: 'Lake Street 42',
      companyName: 'SoftLake Co',
      gender: 'test 1 werewrwerwer weewr'
    })
  }
  return obj;
}
// 1000
// 1000000
const records = generatePersons(100); // 1 000 000
const columnStyle = {
  padding: 10,

 // border: `1px #000`
};
const cellStyle = {
  padding: 0,
  border: `1px #000`,
 // left: -0.5
};
const fildStyle = {
  padding: [0,5,0,10],
};
const icons = {
  'checkboxPlus': `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxyZWN0IHk9IjAuOTkyMTg4IiB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHJ4PSIyIiBmaWxsPSIjNDA5RUZGIi8+DQo8cGF0aCBkPSJNMyA3Ljk5MjE5SDExIiBzdHJva2U9IndoaXRlIi8+DQo8cGF0aCBkPSJNNyAxMS45OTIyTDcgMy45OTIxOSIgc3Ryb2tlPSJ3aGl0ZSIvPg0KPC9zdmc+DQo=`,
  'checkboxMinus': `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAuNzkxMDE2IDIuMjk1OUMwLjc5MTAxNiAxLjE5MTMzIDEuNjg2NDUgMC4yOTU4OTggMi43OTEwMiAwLjI5NTg5OEgxNC43OTFDMTUuODk1NiAwLjI5NTg5OCAxNi43OTEgMS4xOTEzMyAxNi43OTEgMi4yOTU5VjE0LjI5NTlDMTYuNzkxIDE1LjQwMDUgMTUuODk1NiAxNi4yOTU5IDE0Ljc5MSAxNi4yOTU5SDIuNzkxMDJDMS42ODY0NSAxNi4yOTU5IDAuNzkxMDE2IDE1LjQwMDUgMC43OTEwMTYgMTQuMjk1OVYyLjI5NTlaIiBmaWxsPSIjNDA5RUZGIi8+CjxwYXRoIGQ9Ik00Ljc5MTAyIDguMjk1OUgxMi43OTEiIHN0cm9rZT0id2hpdGUiLz4KPC9zdmc+Cg==`,
}

export default {
  components: { CanvasTable, TestInput },
  data() {
    return {
      //
      x: 0,
      y: 0,
      focusCell: null,
      show: false,
      value: "",
      popWidth: "auto",
      dataType: "text",
      cellTable: [],
      editorSty: {
        borderColor: "rgb(82,146,247)"
      },
      isEditing: false,

      hover: false,

      columns: [
        {
          width: 310,
          title: 'Name',
          dataIndex: 'name',
          styleColumn: {
            ...columnStyle,
          },
          onCell: (record, rowIndex) => {},
          render: (data, record) => this.renderCell({data, record})
        },
        {
          title: 'Other',
          styleColumn: columnStyle,
          children: [
            {
              title: 'Age',
              dataIndex: 'age',
              styleColumn: columnStyle,

           //   width: 200,
              render: (data, record) => {
                return new CanvasTable.Layer({
                //  popTitle: 'click me',
                  style: {
                    //backgroundColor: this.hover ? '#FF7878' : '#fff',
                    color: '#FF7878',
                    ...cellStyle,
                  },
                  children: [
                    new CanvasTable.Text({
                      text: data,
                      // style: { color: 'gray'}
                    }),
                  ],
                  event: {
                    onClick(e) {
                      const w = window
                      w.onCellClick( e, name )
                    },
                    onContextMenu(e) {
                      console.log('onContextMenu',e)
                    },
                    onMouseEnter: (e) => {
                      const el = document.querySelector(".x-canvas-scroll");
                      el.style.cursor = 'pointer';
                    //  console.log('onMouseEnter',e);
                    },
                    onMouseLeave: (e) => {
                      //console.log('onMouseLeave',e);
                      const el = document.querySelector(".x-canvas-scroll");
                      el.style.cursor = 'default';
                    },
                  }
                })
              }
            },
            {
              title: 'Address',
              styleColumn: columnStyle,
              children: [
                {
                  styleColumn: columnStyle,
                  title: 'Street',
                  dataIndex: 'street',
                  render: (data, record) => {
                    return new CanvasTable.Layer({
                      style: {
                        backgroundColor: '#fff',
                        color: '#FF7878',
                        ...cellStyle
                      },
                      children: [
                        new CanvasTable.Text({
                          text: data,
                          // style: { color: 'gray'}
                        }),
                      ],
                      event: {
                        onClick: (e) => {
                          const w = window
                          w.onCellClick( e, name )
                        },
                        onMouseEnter: (e) => {
                          const w = window
                        },
                      },
                    })
                  }
               //   width: 200,
                },
                {
                  title: 'Block',
                  styleColumn: columnStyle,
                  children: [
                    {
                      title: 'Building',
                      dataIndex: 'building',
                      styleColumn: columnStyle,
                      render: (data, record) => {
                        return new CanvasTable.Layer({
                          style: {
                            backgroundColor: '#fff',
                            color: '#FF7878',
                            ...cellStyle
                          },
                          children: [
                            new CanvasTable.Text({
                              text: data,
                              // style: { color: 'gray'}
                            }),
                          ],
                          event: {
                            onClick: (e) => {
                              const w = window
                              w.onCellClick( e, name )
                            },
                            onMouseEnter: (e) => {
                              const w = window
                            },
                          },
                        })
                      }
                    //  width: 100,
                    },
                    {
                      title: 'Door No.',
                      dataIndex: 'number',
                      styleColumn: columnStyle,
                      render: (data, record) => {
                        return new CanvasTable.Layer({
                          style: {
                            backgroundColor: '#fff',
                            color: '#FF7878',
                            ...cellStyle
                          },
                          children: [
                            new CanvasTable.Text({
                              text: data
                              // style: { color: 'gray'}
                            }),
                          ],
                          event: {
                            onClick: (e) => {
                              const w = window
                              w.onCellClick( e, name )
                            },
                            onMouseEnter: (e) => {
                              const w = window
                            },
                          },
                        })
                      }
                    //  width: 100,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: 'Company',
          styleColumn: columnStyle,
          children: [
            {
              title: 'Company Address',
              dataIndex: 'companyAddress',
              width: 200,
              styleColumn: columnStyle,
              render: (data, record) => {
                return new CanvasTable.Layer({
                  style: {
                    backgroundColor: '#fff',
                    color: '#FF7878',
                    ...cellStyle
                  },
                  children: [
                    new CanvasTable.Text({
                      text: data,
                      // style: { color: 'gray'}
                    }),
                  ],
                  event: {
                    onClick: (e) => {
                      const w = window
                      w.onCellClick( e, name )
                    },
                    onMouseEnter: (e) => {
                      const w = window
                    },
                  },
                })
              }
            },
            {
              title: 'Company Name',
              dataIndex: 'companyName',
              styleColumn: columnStyle,
              render: (data, record) => {
                return new CanvasTable.Layer({
                  style: {
                    backgroundColor: '#fff',
                    color: '#FF7878',
                    ...cellStyle
                  },
                  children: [
                    new CanvasTable.Text({
                      text: data,
                      // style: { color: 'gray'}
                    }),
                  ],
                  event: {
                    onClick: (e) => {
                      const w = window
                      w.onCellClick( e, name )
                    },
                    onMouseEnter: (e) => {
                      const w = window
                    },
                  },
                })
              }
            },
          ],
        },
        {
          title: 'Gender',
          dataIndex: 'gender',
          styleColumn: columnStyle,
          render: (data, record) => {
            return new CanvasTable.Layer({
              style: {
                backgroundColor: '#fff',
                color: '#FF7878',
                ...cellStyle
              },
              children: [
                new CanvasTable.Text({
                  text: data
                  // style: { color: 'gray'}
                }),
              ],
              event: {
                onDoubleClick: (e) => {
                  const w = window
                  w.onCellClick( e, name )
                },
                onMouseEnter: (e) => {
                  const w = window
                },
              },
            })
          }
        },

      ],
      data: records,
      colors: {
        Primary: '#409EFF',
        White: '#FFFFFF',
        Black: '#0F0F0F',
        GreyPO: '#EFEFEF',
        DarkGray: '#606266',
        NeutralGray: '#C0C4CC',
        TableBlue: '#EEF6FF',
        TableYellow: '#FFF7EC',
        Green: '#67C23A',
        Yellow: '#FFE27A',
        Red: '#FF7878',
        Remove: '#969696',
        TableHeader: '#AAC9F2',
        TableHeaderText: '#2E2E30',
        TableHeaderMainGroupBorder: '#525256',
        // TableHeaderMainGroupBorder: 'red',
        TableBorder: '#909399',
        TableRed: '#FF7878',
        TableInfo: '#A6D2FF',
        Transparent: 'transparent',
      },
    };
  },
  computed: {
    tableHeaderHeight() {
      return 0;
    },
    ...mapGetters({

      viewHeight: VIEW_PORT_HEIGHT,
      //competitor: GET_SETTINGS_COMPETITOR
      viewWidth: VIEW_PORT_WIDTH
    }),
    popupSty() {
      return {
        width: this.popWidth,
        top: "-1px"
      };
    },
  },
  methods: {

    // глобальный доступ;
    onCellClick(e, name) {
      window.eventClickTable = e;
      console.log('__onCellClick',e);
      console.log('name',name);
      const row = e.path.find( (e) => e)
      const cell = e.path.find( (e) => e)
      // console.log('row', row);
      // console.log('cell', cell);
      //console.log('onCellClick',e);
      const target = e.target;
      console.log('__onCellClick target ',target.left);
      this.focusCell = target;
      this.showEditor();
      this.updateTable();

    },

    configTable(el) {
      return {
        container: el,
        columns: this.columns,
        style: {
          rowHeight: 40,
          height: '100%',
          width: '1000%',
          borderColor: '#000',
        //  columnWidth: this.viewWidth,
          padding: 0,
        //  headerBackColor: '',
        },
        onRow: (record, rowIndex) => {
          //console.log('onRow',rowIndex);
        },
        onScrollLoad: (record, rowIndex) => {
            console.log('onScrollLoad',record);
        },
        scrollLoadHeight: (record) => {
          console.log('scrollLoadHeight',record);
        }
      }
    },


    async load () {
      const w  = window;
      const el = document.getElementById('containerCanvas');

      el.innerHTML = ''

      const ct = new CanvasTable(this.configTable(el))
      ct.source = this.data
      w.ct = ct
      w.onCellClick = this.onCellClick
     // console.log('w____',w);
      console.log('___ct__',ct.ctx);
    },

    async updateTable (force = false) {
      const el = this.$el
      const w = window
      const ct = w.ct
      if ( !ct ) {
        return
      }
      ct.source = this.data;
      ct.props = this.configTable(el)

    },

    //
    renderCell({colSpan = 0,data, record}) {
      return new CanvasTable.Layer({
      //  gutter: 10,
        style: {
          color: '#FF7878',
          ...cellStyle,
        },
        children: [
          new CanvasTable.Layer({
            gutter: 5,
            style: {
              width: 150,
              padding: [0,5,0,0],
              backgroundColor: '#AAC9F2'
            },
            children: [
              new CanvasTable.Svg({
                path: icons['checkboxPlus'],
                style: {
                  left: 3,
                  width: 15,
                  height: 15,
                  color: '#1890ff',
                },
                event: {
                  onClick: (e,r) => {},
                  onMouseEnter: (e) => {
                    //x-canvas-scroll
                    const el = document.querySelector(".x-canvas-scroll");
                    const w = window
                    el.style.cursor = 'pointer';

                    ///  console.log('onMouseEnter',e);
                  },
                  onMouseLeave: (e) => {
                    const el = document.querySelector(".x-canvas-scroll");
                    el.style.cursor = 'default';
                    // console.log('onMouseLeave',e);
                  },
                  onDoubleClick: (event) => {
                    console.log('onDoubleClick',event);
                  }, // Double Click
                  onContextMenu: (event) => {
                    console.log('onContextMenu',event);
                  }
                }
              }),
              new CanvasTable.Text({
                text: data,
                style: {
                  padding: [0,0, 0, 10],
               //   backgroundColor: '#AAC9F2'
                },
              }),
            ]
          }),
          new CanvasTable.Layer({
            gutter: 5,
            style: {
              width: 'auto',
              padding: [0,0,0,5],
              backgroundColor: '#cdaaf2'
            },
            children: [
              new CanvasTable.Svg({
                path: icons['checkboxPlus'],
                style: {
                  left: 0,
                  width: 15,
                  height: 15,
                  color: '#1890ff',
                },
                event: {
                  onClick: (e) => {
                    window.onCellClick(e)
                  },
                  onMouseEnter: (e) => {
                    const el = document.querySelector(".x-canvas-scroll");
                    el.style.cursor = 'pointer';
                  },
                  onMouseLeave: (e) => {
                    const el = document.querySelector(".x-canvas-scroll");
                    el.style.cursor = 'default';
                  },
                  onDoubleClick: (event) => {
                    console.log('onDoubleClick',event);
                  }, // Double Click
                  onContextMenu: (event) => {
                    console.log('onContextMenu',event);
                  }
                }
              }),
              new CanvasTable.Text({
                text: data,
                style: {
                  padding: [0,0, 0,10],
                },
                event: {
                  onClick: (e) => {
                    alert('sd');
                  //  window.onCellClick(e)
                  },
                },
              }),
            ]
          }),
        ],
        event: {
          onClick: (e) => {},
        },
      })
    },


    showEditor() {
      if(!this.focusCell) return
      const {
        left,
        top,
        width,
        height
      } = this.focusCell
      this.show = true;
      this.isEditing = true

      // Черновой вариант;
      if (['month','date','datetime'].includes(this.dataType)) {
        if (isNaN(this.focusCell.text) && !isNaN(Date.parse(this.focusCell.text))) {
          this.value = this.focusCell.text;

        } else {
          this.value = "";
        }
      } else {
        this.value = this.focusCell.text;
      }

      this.$refs.editor.style.left = this.dataType === 'group_table' ? '0px' : `${left}px`    //`${x - 1}px`;
      this.$refs.editor.style.top = `${top}px`  //.`${y - 2 - this.tableHeaderHeight}px`;
      this.popWidth = `${width - 3}px`;

      this.cellTable = this.focusCell.table.header.columns;

      console.log('showEditor', this.focusCell.table);
    },

    hideEditor() {
      this.show = false;
      this.focusCell = null
      this.value = ''
      this.$refs.editor.style.left = "-10000px";
      this.$refs.editor.style.top = "-10000px";
      this.dataType = 'text';
    },
    handleScroll (event) {
      if([...event.target.classList].includes('x-canvas-scroll-inner')) {
        if (event.ctrlKey ) {
          return event.preventDefault()
        }
        this.show = false;
      }
    }

  },
  created() {

  },

  async mounted() {
    await this.load()
    document.addEventListener( 'wheel', this.handleScroll, { passive: true } )
  },
  unmounted () {
    window.removeEventListener( 'wheel', this.handleScroll )
  },
  beforeDestroy() {
    window.removeEventListener( 'wheel', this.handleScroll )
  }
}
</script>

<style lang="scss" scoped>
 .el-header, .el-main, .el-footer {
   border: 1px solid;
 }
 .el-main {
    min-height: 700px;
 }
 .table_canvas {
   width: 100%;
   height: 600px;
   box-sizing: border-box;
   border: 1px solid #ddd;

   .column-name {
     border: 1px solid red;
     background: red;
     color: red;
     height: 290px;
     width: 100px;
   }
 }
 .test-b {
   background: rebeccapurple;
   width: 100%;
   height: 300px;
   border: 1px solid red;
 }
 #containerCanvas {
   height: calc(100vh - 30px);
   width: 100%;
   transition: opacity .1s;
 }
 .pointer {
   width: 10px;
   height: 10px;
   background: red;
 }


 $css-prefix: xs-data-grid;
 .#{$css-prefix} {
   width: 100%;
   position: relative;
 }
 .#{$css-prefix}-main {
   width: 100%;
   position: relative;
   box-sizing: border-box;
   overflow: auto; // hidden
   border-right: 1px solid #e1e6eb;
   border-bottom: 1px solid #e1e6eb;
 }
 .#{$css-prefix}-table {
   text-rendering: auto;
   user-select: none;
   position: relative;
   left: 0px;
   top: 0px;
   cursor: default;
 }
 .#{$css-prefix}-overlayer {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   pointer-events: none;

 }
 .#{$css-prefix}-editor {

   position: absolute;
   top: -10000px;
   left: -10000px;
   text-align: left;
   line-height: 0;
   z-index: 100;
   overflow: hidden;
   background-color: #fff;
   border: 2px solid rgb(82,146,247);
   box-sizing: border-box;
   box-shadow: rgba(0, 0, 0, 0.2) 0px 6px 16px;
   pointer-events: auto;

   div[contenteditable="true"] {
     box-sizing: border-box;
     // border: 2px solid #4b89ff;
     // padding: 5px;
     padding: 8px;
     outline: none;
     // resize: none;
     // text-align: start;
     // overflow-y: hidden;
     font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
     font-weight: 400;
     font-size: 12px;
     color: inherit;
     white-space: pre-wrap;
     word-wrap: break-word;
     word-break: break-all;
     line-height: 18px;
     margin: 0;
     background: #fff;
     cursor: text;
   }
 }
 .#{$css-prefix}-popup {
   input[type="text"] {
     border: none;
     outline: none;
     border-radius: 0;
   }
 }
 .#{$css-prefix}-fullscreen {
   position: fixed;
   top: 0;
   left: 0;
   bottom: 0;
   right: 0;
   width: 100%;
   min-height: 100vh;
   background: #fff;
   z-index: 9999;
   overflow: hidden;
 }
 .#{$css-prefix}-loading {
   position: fixed;
   top: 0;
   left: 0;
   bottom: 0;
   right: 0;
   width: 100%;
   min-height: 100vh;
   background: #fff;
   z-index: 9998;
   overflow: hidden;
 }
 .#{$css-prefix}-loading-dot {
   display: block;
   margin: 0 auto;
   background: #0bb27a;
   border-radius: 50%;
   animation: spin-dot 1s ease-in-out infinite;
   width: 20px;
   height: 20px;
 }
 @keyframes spin-dot {
   0% {
     transform: scale(0);
     opacity: 1;
   }

   100% {
     transform: scale(1);
     opacity: 0;
   }
 }
 .popover-cell {
   background: #fff;
   padding: 4px;
   line-height: normal;
   position: relative;
 }
 .table-cell {
   background: #fff;
   line-height: normal;
   position: relative;
   .items_row {
     //border: 1px solid #000;
     display: flex;
     .cell {
       border-left: 1px solid #000;
       border-bottom: 1px solid #000;
       height: 40px;
     }
   }
 }
 .children_table {
   background: #fff;
   padding: 10px;
   line-height: normal;
   .content {
     position: absolute;
     border: 1px solid red;
   }
 }
</style>
