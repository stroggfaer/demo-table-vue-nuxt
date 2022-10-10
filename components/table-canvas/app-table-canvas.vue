<template>
  <div>
    <div class="xs-data-grid" >
      <div  id='containerCanvas' :style="{'max-width': `${widthColumns}px`, width: `${viewWidth - 70}px`, height: `${heightRow}px`}" v-loading="loading" ref="refCanvas"></div>
      <div v-if="!dataTable.length" class="empty" :style="{'max-width': `${widthColumns - 10}px`}">Нет данные</div>
      <div
        :class="`xs-data-grid-overlayer`"
        :style="{ top: `${tableHeaderHeight }px` }"
      >
        <div v-show="show" :class="`xs-data-grid-editor`" ref="editor">
          <div  class="popover-cell"
                v-if="dataType === 'text'"
                :style="{width: `${this.options.canvas_cell_w -1}px`, height: `${this.options.canvas_row_height -1}px`}"
          >
<!--            <el-input-->
<!--              @blur="handleHourBlur"-->
<!--              @keyup.enter.native="handleHourEnter"-->
<!--              ref="el_input"-->
<!--              placeholder=""-->
<!--              v-model="value"-->
<!--              size="small"-->
<!--              :maxlength="4"-->
<!--              :min="1"-->
<!--              class="input_edit"-->
<!--              :class="{error: isErrorInput}"-->
<!--            ></el-input>-->
            <vue-autonumeric
              ref="el_input"
              @blur="handleHourBlur"
              @keyup.enter.native="handleHourEnter"
              :class="{error: isErrorInput}"
              class="el-input__inner"
              v-model="value"
              :options="{
                 allowDecimalPadding: false,
                 digitGroupSeparator: '',
                 decimalCharacterAlternative: '.',
                 minimumValue: 0,
                 decimalPlaces: 2
             }"
            ></vue-autonumeric>
          </div>
          <div class="popover-cell" v-if="dataType === 'active'">
            <pre>{{focusCell}}</pre>
          </div>
          <div class="popover-cell contextmenu" v-if="dataType === 'contextmenu'">
               <div class="content_confirm">
                   <div class="title_m">{{confirmPop.title}}</div>
                   <div class="buttons">
                       <el-button size="mini" @click="closeConfirmPop();">Нет</el-button>
                       <el-button type="primary" size="mini" @click="handleDelete">Да</el-button>
                   </div>
               </div>
          </div>
          <div  class="popover-cell popContent"
                v-if="dataType === 'number'"
          >
            <el-input
              @blur="handleBlur"
              @keyup.enter.native="handleEnter"
              ref="el_input"
              placeholder=""
              v-model="valueCol"
              size="small"
              :maxlength="3"
              :min="1"
              class="input_edit"
              :class="{error: isErrorInputNumber}"
            ></el-input>
          </div>
        </div>
      </div>
      <!--Icons svg-->
      <svg id="circleIcons" width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="5.5" r="5" fill="#123123" stroke="black" stroke-opacity="0.5"/>
      </svg>
      <!--Icons svg-->
      <svg id="bgBox" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" rx="5" fill="#123123" fill-opacity="0.2"/>
      </svg>

    </div>
  </div>
</template>

<script>

import {
  icons,
  levelBg,
  levelBorder,
  levelBgRow,
  planBorder,
  headerLevelBorder,
  departmentBorder, headerLeft, colors
} from '../../core_table/Style';

// import CanvasTable from "x-canvas-table";
import CanvasTable from 'x-canvas-table/dist'
import {mapGetters} from "vuex";

import {VIEW_PORT_HEIGHT, VIEW_PORT_WIDTH} from "../../store";
import moment from "moment";

export default {
  props: {
    loading:  { type: Boolean, default: false },
    dataGrid:  { type: Array},
    headerColumnsTotal:  { type: Number, default: 0},
    dateCurrent:  { type: String},
    shortenedDay:  { type: Object },
  },
  components: { CanvasTable },

  data() {
    return {
      // Запрос с бэка;
      dataResult: [],
      //   daysTotal: headerDays().map((item,ind) => ({ total:item, key:ind, value: `${item}` })),
      focusCell: null,
      show: false,
      value: "",
      valueCol: 0,
      popWidth: "auto",
      dataType: "text",
      cellOn: null,
      eventEditCell: null,
      hover: [],
      columns: [],
      dataTable: [],
      toggle: [],
      isDrawing: false,
      isDrawingMouseEnter: false,
      cord: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        day: 0,
        key: '',
        days: []
      },
      isCellHover: null,
      isEditCell: false,
      widthColumns: 1500, // Динамические вычечление
      heightRow: 0,
      key: 0,
      typeContextMenu: '',
      //Настройки таблицы;
      options: {
        canvas_cell_w: 40, // Размер ячейки;
        canvas_columns_width: 250,
        canvas_header_height: 40,
        canvas_row_height: 40
      },
      // Настройки конфирм;
      confirmPop: {
        title: 'Вы уверены, что хотите удалить?',
        type: 'cell'
      },
    };
  },

  computed: {

    isErrorInput() {
       //autonumeric
      // || this.isValidateValueCellMax()
      //return this.value !== '' && !this.isNumeric(this.value) || (this.value !== '' && !+this.value > 0)
      return this.value === '' || this.value === 0
    },
    //
    isErrorInputNumber() {
      return this.valueCol !== '' && !this.isNumeric(this.valueCol);
    },

    tableHeaderHeight() {
      return -1;
    },
    ...mapGetters({
      viewHeight: VIEW_PORT_HEIGHT,
      viewWidth: VIEW_PORT_WIDTH
    }),

  },

  methods: {
    handleBlur() {
      this.hideEditor()
      this.updateTable();
    },

    handleEnter() {
      this.hideEditor()
      this.updateTable();
    },

    handleInput(e) {

    },

    // Удалить ;
    handleDelete(e) {
      switch (this.confirmPop.type) {
        case 'cell':
          this.$emit('on-delete-cell', this.eventEditCell);
          break
        case 'plan':
           this.$emit('on-delete-plan', this.eventEditCell);
           break
        case 'employee':
           this.$emit('on-delete-employee', this.eventEditCell);
           break
      }
      this.hideEditor();
    },

    closeConfirmPop() {
      this.hideEditor();
      this.canvasRender();
    },

    // Валидировать максимально время;
    isValidateValueCellMax() {
      const departmentFind = this.employeeFind();
      if(departmentFind && this.value !== '') {
        return this.value > departmentFind.result.value || 0
      }
      return false;
    },
    //
    employeeFind(day = null) {
      let result = null;
      if(this.cellOn) {
        const parentId = this.cellOn.row.parentId;
        const department = this.dataTable.filter((item)=> item.row.type === 'employee').find((item)=>item.row.id === parentId);
        if(department) {
          if(day) {
            result = {...department.row, result: department.row.result.find((it) => it.day === day)}
          }else{
            result = {...department.row, result: department.row.result.find((it) => it.day === this.cellOn.day)}
          }
        }
      }
      return result;
    },

    // меняем цвет svg
    svgIconsBase64(idElement, colorEnd, colorStart ='#123123') {
      const element = document.querySelector(`#${idElement}`);
      let res = ''
      if (element) {
        const s = new XMLSerializer().serializeToString(element)
        const colorRep = s.replace(colorStart, colorEnd);
        const encodedData = window.btoa(colorRep);
        res = 'data:image/svg+xml;base64,' + encodedData;
      }
      return res;
    },

    //Календар колечество дней;
    headerDays(d = 1, slice = false,left = false) {
      const m = moment(this.dateCurrent, "YYYY-MM").daysInMonth();
      this.widthColumns = `${(this.options.canvas_columns_width + this.options.canvas_cell_w * m) + 10}`;
      const result  = []
      if(slice) {
        for (let i = 1; i <= m; ++i) {
          if(left) {
            if(i <= d) {
              result.push(i);
            }
          }else{
            if(i >= d) {
              result.push(i);
            }
          }

        }
      }else{
        for (let i = 1; i <= m; ++i) {
          result.push(i);
        }
      }
      return result;
    },

    //Вычесление размер общего клоичесво ячейки
    moveCell(dayCurrent, left = false) {
      if(!this.cellOn) return false;
      const day = this.cord.day;
      const res = this.headerDays(day,true,left);
      const temp = [];

      res.forEach((d,i)=>{
        if(left) {
          if(d >= dayCurrent) {
            temp.push(d)
          }
        }else{
          if(d <= dayCurrent) {
            temp.push(d)
          }
        }

      })
      return {
        widthCol: this.options.canvas_cell_w * temp.length,
        sliceDays: temp
      }
    },

    // Обработка массив;
    generatePersons(init = false) {
       let obj = [];
       if(this.dataResult && this.dataResult.length) {
         this.dataResult.forEach((department, index) => {
           if(department.employee.length > 0) {
             obj.push({
               row: {
                 name: department.name,
                 level: 1,
                 row: index,
                 type: 'department',
                 result: department.result
               },
             })
             department.employee.forEach((employee, idx) => {
               obj.push({
                 row: {
                   id: employee.id,
                   parentId: department.id,
                   name: employee.name,
                   open: employee.open,
                   totalCount: 0,
                   level: 2,
                   row: idx,
                   type: 'employee',
                   result: employee.result,
                   isPlan: Boolean(employee.plan.length),
                   plan: employee.plan
                 },
               })

               if(employee.open === true && init === true) this.toggle[employee.id] = employee.open

               if(this.toggle[employee.id] === true) {
                 employee.plan.forEach((plan, i) => {
                   obj.push({
                     row: {
                       index: i,
                       id: plan.id,
                       name: plan.name,
                       parentId: employee.id,
                       departmentId:  department.id,
                       level: 3,
                       row: idx,
                       type: 'plan',
                       key: `${index}_${idx}_${i}`,
                       sort: plan.sort,
                       result: plan.result,
                       ...plan
                     },
                   })
                 });
               }
               //Подсчет количество столбец


               // employee.row.totalCount = 10;

             })
           }
         });
       }

       return obj;
    },

    // глобальный доступ;
    onCellClick(e, name) {
      // window.eventClickTable = e;
    },

    onContextMenu(e) {
      switch (this.typeContextMenu) {
        case 'popHidden':
          this.typeContextMenu = '';
          return false
      }
    },

    configTable(el) {
      return {
        container: el,
        columns: this.columns,
        style: {
          rowHeight: this.options.canvas_row_height,
          height: '100%',
          width: '100%', //1510
          borderColor: 'rgba(255,255,255,0)',
          fontFamily: 'Gilroy',
          padding: 0,
          headerBackColor: 'rgba(249, 250, 251, 1)',  //'rgba(249, 250, 251, 1)',
          headerRowHeight: this.options.canvas_header_height
        },
        onRow: (record, rowIndex) => {},
        onScrollLoad: (record, rowIndex) => {
          console.log('onScrollLoad',record);
        },
        scrollLoadHeight: (record) => {
         // console.log('scrollLoadHeight',record);
        }
      }
    },

    heightRowSize(count) {
      return this.heightRow = `${(this.options.canvas_header_height + this.options.canvas_row_height * count) + 10}`;
    },

    async load () {

      const w  = window;
      const el = document.getElementById('containerCanvas');
      el.innerHTML = ''
      const ct = new CanvasTable(this.configTable(el));
      ct.source = this.dataTable
      w.ct = ct
      setTimeout(()=>{
        ct.render()
        console.log('___load___');
      },1000)
      w.onCellClick = this.onCellClick
      w.oncontextmenu = this.onContextMenu
    },

    // Обновить
    async updateTable (force = false) {
   //   const el = this.$el
      const w = window
      const ct = w.ct
      if ( !ct ) {
        return
      }

      this.dataTable = this.generatePersons();
      ct.source = this.dataTable;
      this.heightRowSize(this.dataTable.length)
     // ct.props = this.configTable(el)
      await this.$nextTick()
      ct.resize();
    },

    // Ячейки для вывода;
    renderCell({data, record}) {

      const $this = this;
      // название;
      let titleContent = []
      // Разбивка по строку;
      if(data) {
        switch (data.type) {
          case 'department':
            const el = document.getElementById('containerCanvas');
            const widthWindow  = el.offsetWidth / 4 || 200;
            titleContent = [
              new CanvasTable.Text({
                text: data.name,
                style: {
                  color: '#F9FAFB',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  left: widthWindow, //widthWindow
                  align: 'center'
                },
                event: {
                  onMouseEnter: (e) => {
                    this.clearLineDrawRect();
                  },
                  onContextMenu: (e) => {
                   // console.log('_onContextMenu_',e);
                  }
                },
              }),
            ]
            break;
          case 'employee':
            titleContent = [
              new CanvasTable.Svg({
                path: icons['plus'],
                style: {
                  top: 0.5,
                  left: 1,
                  width: 25,
                  height: 35,
                  color: 'transparent',
                  border:'transparent',
                },
                event: {
                  onClick: (e,r) => {
                    const w = window
                    const ct = w.ct
                    // Добавить отдел;
                    this.addPlan(data);
                    this.updateTable();
                  },
                  onMouseEnter: (e) => {
                    //x-canvas-scroll
                    const el = document.querySelector(".x-canvas-scroll");
                    const w = window
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
                text: data.name,
                style: {
                  width: 120,
                  fontWeight:'bold',
                  fontSize: '16px',
                  padding: [0, 0, 0, 0],
                  //   backgroundColor: '#AAC9F2'

                },
                event: {
                  onDoubleClick: (e) =>{
                    // Вызвать меню ячейки;
                    this.confirmPop.title = `Вы уверены, что хотите удалить сотрудник ${data.name}?`;
                    this.confirmPop.type = 'employee';
                    this.typeContextMenu = 'popHidden'
                    this.dataType = "contextmenu";
                    this.focusCell = e.target;
                    this.eventEditCell = data;
                   // ct.resize();
                   // this.canvasRender();
                    this.showEditor();
                  },
                  onMouseEnter: (e) => {
                    const el = document.querySelector(".x-canvas-scroll");
                    el.style.cursor = 'pointer';
                  },
                  onMouseLeave: (e) => {
                    const el = document.querySelector(".x-canvas-scroll");
                    el.style.cursor = 'default';
                  },
                }
              }),
              $this.iconArrow(data,record),
              new CanvasTable.Text({
                text: $this.totalPlanSum(record.row), //data, // $this.totalSum(record.row.result)
                style: {
                  align: 'right',
                  width: 45,
                  fontWeight:'bold',
                  padding: [0,0, 0, 0],
                  //   backgroundColor: '#AAC9F2'
                },
              }),
            ]
            break;
          case 'plan':
           // const w  = window;
           // w.ct = ct.ctx
           //TODO: mod;
           const circleIcon = this.svgIconsBase64('circleIcons',`${data.color}`);
            titleContent = [
              new CanvasTable.Layer({
                width: 200,
                style: {
                  padding: [0,0,0,8],
                },
                children: [
                  new CanvasTable.Svg({
                    path: circleIcon,
                    //  path: '/icons/ellipse.svg', //'/icons/ellipse.svg',
                    width: 2,
                    style: {
                      width: 15,
                      height: 14,
                      color: '',
                      padding: 0,
                    },
                  }),
                  new CanvasTable.Text({
                    style: {
                      width: 193,
                      padding: [0, 0, 0, 8]
                    },
                    text: data.name,
                    event: {
                      onDoubleClick: (e) =>{
                        // Вызвать меню ячейки;
                        this.confirmPop.title = `Вы уверены, что хотите удалить план ${data.name}?`;
                        this.confirmPop.type = 'plan';
                        this.typeContextMenu = 'popHidden'
                        this.dataType = "contextmenu";
                        this.focusCell = e.target;
                        this.eventEditCell = data;
                      //  ct.resize();
                       // this.canvasRender();
                        this.showEditor();
                      },
                      onMouseEnter: (e) => {
                        const el = document.querySelector(".x-canvas-scroll");
                         el.style.cursor = 'pointer';
                      },
                      onMouseLeave: (e) => {
                        const el = document.querySelector(".x-canvas-scroll");
                         el.style.cursor = 'default';
                      },
                      onContextMenu: (e) => {}
                    }
                  }),
                  new CanvasTable.Text({
                    // Расчет всего часов план;
                    text: $this.totalSum(record.row.result) || 0 // всего TODO: // $this.totalSum(record.row.result) // record.row.countHour
                  }),
                ],

              }),
            ]
            break;
        }
      }

      return new CanvasTable.Layer({
        // gutter: 10,
        style: {
          // border:'transparent',
          left: 0,
          border: levelBorder(data.type,data)
        },
        children: [
          new CanvasTable.Layer({
            gutter: 5,
            style: {
              border: 'transparent',
              padding: [0,5,0,0],
              backgroundColor: levelBg(data.type)
            },
            children: titleContent
          })
        ],
        event: {
          onClick: (e) => {}
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

      let leftDynamic = `${left - 4}px`;
      let topDynamic = `${top}px`

      this.show = true;
      this.isDrawing = false;
      // Черновой вариант;
      switch (this.dataType) {
        case 'text' :
          //
          const topPos = this.isEditCell ? `${top - 4}px` : `${top}px`
          topDynamic = topPos;
          this.value = this.focusCell.text;
          // Получаем;
          setTimeout(()=>{
          //  this.$refs.el_input.focus();
            this.$refs.el_input.$el.focus();
          },100)
          this.isDrawing = false;

          break
        case 'number' :
          topDynamic = `${top+ 3}px`;
          leftDynamic = `${left - 20}px`;
          this.valueCol = this.focusCell.text;
          // Получаем;
          setTimeout(()=>{
            this.$refs.el_input.focus();
          },100)
          break
        case 'contextmenu':
          console.log('contextmenu');
          leftDynamic = `${left + 35}px`;

          break
        case 'hover':
        case 'active':
          console.log('active');
          //
          this.value = this.focusCell.text;
          this.dataType = "active";
          break
        default:
          //
          break
      }
      this.$refs.editor.style.left = leftDynamic;
      this.$refs.editor.style.top = topDynamic;
      this.popWidth = `${width - 3}px`;

      this.isScrollHidden(true)
    },

    addPlan (data) {
      /*
       const department  = this.dataResult.find(it => it.id === data.parentId) || null;
       // черновой вариант;
       if(department) {
         const emp  = department.employee.find(it => it.id === data.id) || null;
         if(emp) {
           emp.plan.unshift({
             id: Math.trunc(Math.random() * (200) + 6,),
             name: 'Проект нов',
             sort: 1,
             color: '#281e25',
             parentId: emp.id,
             result: []
           })
         }
         // console.log('addPlan',emp.plan);
       }

       */
       this.$emit('on-plan-add',data);
    },

    hideEditor() {
      this.show = false;
      this.focusCell = null
      this.value = ''
      if(this.$refs.editor) {
        this.$refs.editor.style.left = "-10000px";
        this.$refs.editor.style.top = "-10000px";
      }
      this.dataType = 'text';
      this.isScrollHidden(false);
      this.eventEditCell = null;
     // const w  = window;
     // this.cellOn = null;
    },

    handleScroll (event) {
      if([...event.target.classList].includes('x-canvas-scroll-inner')) {
         if (event && event.ctrlKey ) {
        //  // return event.preventDefault()
            return false
         }
        this.hideEditor();
        this.show = false;
        this.isDrawing = false;
        this.isDrawingMouseEnter = false;
      }
    },

    //Иконки
    iconArrow(data,record) {
      let svgIcon = [];
      if(data && data.isPlan) {
        svgIcon = [new CanvasTable.Svg({
          //  icons['checkboxPlus'],
          path: this.toggle[data.id] ? icons['arrow_down'] : icons['arrow_left'],
          style: {
            left: 3,
            width: this.toggle[data.id] ? 15 : 9,
            height: this.toggle[data.id] ? 10 : 14,
            color: '#1890ff',
          },
          event: {
            onClick: (e,r) => {
              this.toggle[data.id] = !this.toggle[data.id];
              this.updateTable();
            },
            onMouseEnter: (e) => {
              //x-canvas-scroll
              const el = document.querySelector(".x-canvas-scroll");
              el.style.cursor = 'pointer';
            },
            onMouseLeave: (e) => {
              const el = document.querySelector(".x-canvas-scroll");
              el.style.cursor = 'default';
            },
          }
        })]
      }
      return new CanvasTable.Layer({
        style: {
          width: 20
        },
        children: svgIcon
      })
    },

    // Обработки ячейке таблицы
    cellField (obj,bg,day) {
      if (!obj.row) return null
      let result = null
      const $this = this;
      let countCell = 0;

      switch (obj.row.type) {
        case 'department':
            // Первый слой фон;
            result = new CanvasTable.Layer({
              style: {
                border: departmentBorder,//departmentBorder  //#9EA7C5
                backgroundColor: bg,
                zIndex: 221
              },
              children: [
                // Второй слой фон;
                new CanvasTable.Layer({
                  style: {
                    backgroundColor: 'rgba(115, 129, 163, 0.5)',
                    zIndex: 221
                  }

                })
              ]
            })
          break;
        case 'employee':
          const cell = obj.row.result.find(item => item.day === day) || null;
          if(!cell) return null
          let layerValue = {}
          this.totalRowSum();

          // Подсчет количество часов;
          const plan = obj.row.plan.filter(item => item.parentId === obj.row.id);
          const totalRow = this.totalRowSum(plan,day);

          const isMaxMin = (totalRow > cell.value || (totalRow > 0 && totalRow < cell.value));

          if (cell.icon) {
            //console.log('cell__',cell);
            layerValue = new CanvasTable.Svg({
              //  icons['checkboxPlus'],
              path: isMaxMin ? icons[cell.icon + '_red'] : icons[cell.icon] , // sum // close // box
              style: {
                color: 'transparent',
                left: 5,
                top: 1,
                width: 20,
                height: 20,
                align: 'center'
              },
              popTitle: cell.popTitle || '',
              event: {
                onMouseEnter: (e) => {
                  //x-canvas-scroll
                  const el = document.querySelector(".x-canvas-scroll");
                  const w = window
                  el.style.cursor = 'pointer';
                },
                onMouseLeave: (e) => {
                  const el = document.querySelector(".x-canvas-scroll");
                  el.style.cursor = 'default';
                },
              }
            })
          }else{

            // TODO: Сотрудник значение;
            // console.log('cell.value',cell.value, totalRow);
            layerValue = new CanvasTable.Text({
              text: `${cell.value}`, //day.value
              style: {
                fontSize: '16px',
                fontWeight:'bold',
                align:'center',
                color: (isMaxMin? '#EB5757' : 'rgba(44, 47, 53, 0.6)'),
                top: 1
                // border: [`1px transparent`, `1px transparent`,`1px #9EA7C5`,`1px #9EA7C5`]
              }
            });
          }

          // Первый слой фон;
          result = new CanvasTable.Layer({
            style: {
              border:`1px #9EA7C5`,
              backgroundColor: bg,
              zIndex: 0
            },
            children: [layerValue],
            event: {
              onMouseEnter: (e) => {
                this.clearLineDrawRect();
              }
            }
          })
          break;
        case 'plan':
          let circleIcon = ''
          const cellPlan = obj.row.result.find(item => item.day === day) || null;
          let bgCell = []
          if(cellPlan && $this.isNumeric(cellPlan.value)) {
            circleIcon = this.svgIconsBase64('bgBox',`${obj.row.color}`);
            bgCell = [
              new CanvasTable.Svg({
                  path: circleIcon,
                  style: {
                    width: this.options.canvas_cell_w - 8,
                    height: this.options.canvas_row_height - 8,
                    color: '',
                    padding: 0,
                    zIndex: 100,
                  },
              })
            ];
          }else if(this.hover[`${obj.row.key}_${day}`] === true) {
            circleIcon = this.svgIconsBase64('bgBox','#41A4FF');
            bgCell = [
              new CanvasTable.Svg({
                path: circleIcon,
                style: {
                  width: 32 ,
                  height: 30 ,
                  color: '',
                  padding: 0,
                  zIndex: 100,
                }
              })
            ]
          }else{
            bgCell = [];
          }
          // Первый слой;
          result = new CanvasTable.Layer({
            style: {
              border: planBorder,
              padding: [1,5,1,5],
              backgroundColor: bg,
              zIndex: 1,
            },
            children: [
              // Второй слой
              new CanvasTable.Text({
                cell: 'plan',
                width: 38,
                text: cellPlan && $this.isNumeric(cellPlan.value) ? cellPlan.value : '',
                style: {
                  align:'center',
                  zIndex: 10,
                  color: '#000',
                },
                children: bgCell
              })
            ],
            // TODO Ячейка клика;
            event: {
              // TODO onDoubleClick;
              onDoubleClick: (e) =>{
                const editValue = obj.row.result.find((d)=> d.day === day) || false;
                this.focusCell = e.target;
                this.isEditCell = Boolean(editValue);
                this.cellOn = {...obj, day, value: ''}
                this.showEditor();
                if(editValue) {
                  this.value = editValue.value;
                }
                this.clearLineDrawRect();
               // console.log('onDoubleClick',this.cellOn);
              },

              onClick: (e) => {

                // Перерисовка;
                const w = window
                const ct = w.ct
               //  ct.source = this.dataTable;
              //  ct.render()
                 const cell = obj.row.result.find(it => it.day === day) || null;
                 // if(!cell && this.value !== '' && $this.isNumeric(this.value) && this.cellOn) {
                 //   this.cellOn.value = this.value;
                 //   if(!this.isErrorInput) {
                 //     this.$emit('on-cell-value', this.cellOn);
                 //   }
                 //   this.hideEditor();
                 // }
                 this.setInputNumber();

                 // Выделить ячейки
                 if (cell && !this.show && this.isDrawingMouseEnter === false) {
                   this.focusCell = {...e.target};
                   this.cellOn = {...obj, day, value: cell.value}
                   this.isDrawing = true;
                   const x = e.target.left - 4;
                   const y = e.target.top - 4; //30, 30
                   this.cord.clientY = e.clientY
                   this.cord.x = x
                   this.cord.y = y
                   this.cord.w = this.options.canvas_cell_w - 2.5;
                   this.cord.h = this.options.canvas_row_height - 2.5;
                   this.cord.day = day
                   this.cord.key = obj.row.key
                   // Квадрат;
                   this.lineDrawRect(x, y, this.cord.w, this.cord.h);
                 }else{
                   this.hideEditor()
                 }

                // После выделение ячекйи подвреждает;
                if(this.isDrawingMouseEnter && this.cellOn) {
                    const {days,key} = this.cord;
                    const resultPlan = obj.row;
                    // Отправляем только по горизонтально значение;
                    if(key === resultPlan.key) {
                      days.forEach((itDay)=>{
                        const isCellResult = Boolean(obj.row.result.find(item => item.day === itDay))
                        // TODO Валидации убран;
                       // const re = this.employeeFind(itDay);
                        // && re.result.value >= this.cellOn.value
                        // Проверка на сущестование и макимально значение;
                        if(!isCellResult){
                          resultPlan.result.push({
                            color: null,
                            day: itDay,
                            icon: null,
                            value: this.cellOn.value
                          })
                        }
                      })
                      obj.row.result = resultPlan.result
                      this.clearLineDrawRect(true);
                      this.updateTable();
                      this.$emit('on-multi-cell-value', obj);
                    }
                }
              },

              onMouseEnter: (e) => {
                const el = document.querySelector(".x-canvas-scroll");
                el.style.cursor = 'pointer';
                if(this.isCellHover !== day) {
                  this.isCellHover = day;
                  // Верх / вниз
                  // if(obj.row.key !== this.cord.key) {
                  //  // this.clearLineDrawRect();
                  // }
                  // Выделения
                  if(this.isDrawing) {
                    const w = window
                    const ct = w.ct
                    let left = false

                    if(this.cellOn && obj.row.key === this.cord.key) {
                     // ct.source = this.dataTable;
                      // Левый и правый;
                      left = e.target.left < this.cord.x

                      const { widthCol, sliceDays } = this.moveCell(day, left);
                      const {x,y,h} = this.cord
                      this.cord.w = left ? -widthCol : widthCol;

                      //Рисуем
                      this.lineDrawRect(left ? x + (h + 1) : x, y, this.cord.w, this.cord.h);
                      this.cellOn.day = day;
                      this.cord.days = sliceDays;
                      this.isDrawingMouseEnter = true;
                    }
                    // console.log('onMouseEnter e', e.path);
                    // console.log('onMouseEnter obj', obj);
                    // console.log('onMouseEnter day', day);
                  }
                  //this.hover[day] = true
                  // if(!cellPlan) {
                  //   this.hover[`${obj.row.key}_${day}`] = true;
                  //   const w = window
                  //   const ct = w.ct
                  //   ct.source = this.dataTable;
                  // }
                  // ct.source = this.dataTable;
                  //ct.source = this.dataTable;
                }
              },

              onMouseLeave: (e) => {
                const el = document.querySelector(".x-canvas-scroll");
                el.style.cursor = 'default';
                if(this.isCellHover !== day) {
                  this.isCellHover = day;
                  // this.isCellHover = true
                  this.hover = [];
                  //this.hover[`${obj.row.key}_${day}`] = false;
                  if(!this.isDrawing) {
                    ct.source = this.dataTable;
                  }
                }
              },

              onContextMenu: (e) => {
                // отмена выделение;
                if(this.isDrawing) {
                  this.clearLineDrawRect()
                  this.typeContextMenu = 'popHidden'
                  return false;
                }

                // Вызвать меню ячейки;
                const editValue = obj.row.result.find((d)=> d.day === day) || false;
                if(editValue) {
                  this.confirmPop.title = 'Вы уверены, что хотите удалить часы?';
                  this.confirmPop.type = 'cell';
                  this.typeContextMenu = 'popHidden'
                  this.dataType = "contextmenu";
                  this.focusCell = e.target;
                  this.eventEditCell = {delete: editValue, ...obj.row}
                  this.showEditor();
                  return false;
                }
                this.hideEditor();
              }
            }
          })
          break;
      }
      return result
    },

    clearLineDrawRect(force = false) {
      if(!force) {
        const w = window
        const ct = w.ct
        ct.render();
      }
      this.isDrawing = false;
      this.isDrawingMouseEnter = false;
      // this.cellOn = null;
    },

    //Рисуем Квадрат;
    lineDrawRect(x, y, w, h) {
      const ct = window.ct
      ct.render();
      this.drawRect(x, y, w, h, {
        fillColor: 'rgba(82,146,247,0.2)',
        borderColor: 'rgb(82,146,247)',
        borderWidth: 1.3
      },ct);

    },

    // Суммировать отчет;
    totalSum(arr = []) {
      if(!arr.length) return 0;
      return arr.map(it => (it.value > 0 && it.value)).reduce((a, b) => a + b, 0) || 0
    },

    // Расчет общего план проекта;
    totalPlanSum(arr = []) {
      let total = 0
      if(!arr.plan) return 0;
      arr.plan.forEach((plan)=>{
          total += this.totalSum(plan.result);
      })
      return total;
    },

    // Количество часов в столбца;
    totalRowSum(arr = [],day = 0) {
      if(!arr.length) return 0;
      const r = arr.map((item) => item.result.find(i => i.day === day)?.value || 0)
      return r.reduce((a, b) => a + b, 0) || 0
    },

    // Проверка на Число;
    isNumeric(value) {
      return value;
      // return Number.isInteger(value);
    },

    safeResize() {
       this.hideEditor();
       this.isDrawing = false;
       this.isDrawingMouseEnter = false;
    },

    /*---Рамка канвас--*/
    drawRect(x, y, width, height, options,ct) {
      options = Object.assign(
        {
          borderWidth: 1,
          borderColor: undefined,
          fillColor: undefined,
          shadowOffsetX: undefined,
          shadowOffsetY: undefined,
          shadowBlur: 0,
          shadowColor: undefined,
          isBg: false,
          fillStyle: undefined
        },
        options
      );
      ct.ctx.save();
      ct.ctx.beginPath();

      if (options.shadowOffsetX) {
        ct.ctx.shadowOffsetX = options.shadowOffsetX;
      }
      if (options.shadowOffsetY) {
        ct.ctx.shadowOffsetY = options.shadowOffsetY;
      }
      if (options.shadowBlur) {
        ct.ctx.shadowBlur = options.shadowBlur;
      }
      if (options.shadowColor) {
        ct.ctx.shadowColor = options.shadowColor;
      }
      if (options.fillColor) {
        ct.ctx.fillStyle = options.fillColor;
      }
      if (options.borderColor) {
        ct.ctx.lineWidth = options.borderWidth;
        ct.ctx.strokeStyle = options.borderColor;
      }

      if(options.isBg) {
        ct.ctx.fillRect(x + 0.5, y + 0.5, width, height);
      }else{
        ct.ctx.rect(x + 0.5, y + 0.5, width, height);
      }
      if (options.fillColor) {
        ct.ctx.fill();
      }

      if (options.borderColor) {
        ct.ctx.stroke();
      }

      ct.ctx.restore();
    },

    canvasRender() {
      const w = window
      const ct = w.ct
      ct.source = this.dataTable;
      //this.updateTable();
     // ct.resize();
    },

    isScrollHidden(active = false) {
      const elInner = document.querySelector(".x-canvas-scroll-inner");
      if(elInner) {
        elInner.style.display = active ? 'none' : 'block';
      }
    },

    // TODO расчет выходной недели;
    isWeekEnd(cDay) {
      console.log(this.dateCurrent,cDay)
      const week = moment(this.dateCurrent,"YYYY-MM").date(cDay).weekday();
      if([0,6].includes(week)) {
        return  cDay;
      }
      return null
    },

    // TODO расчет текущие число;
    isCurrentDay() {
      const date = moment.parseZone().format('YYYY-MM-DDTHH:mm:ss');
      return Number(moment.utc(String(date)).format('D'));
    },
    // TODO расчет сокращенный день
    isShortenedDay(d) {
      const dayArr = (this.shortenedDay
        && this.shortenedDay.days
        && this.shortenedDay.days) || [];
      if (dayArr.includes(d)) {
        return d;
      }
      return null
    },

    // Выделить ячейки
    isSelectedCell(row) {
      if(!row) return false;
       let isSelected = false
      // Выделяем план;
      if(this.eventEditCell && this.eventEditCell.type === this.confirmPop.type) {
        if(this.eventEditCell.id === row.id && this.eventEditCell.parentId === row.parentId) {
          isSelected = true
        }
      }
      // Выделяем план и сотрудник;
      if(this.eventEditCell && this.eventEditCell.plan) {
        this.eventEditCell.plan.forEach((pl)=>{
          if(pl && pl.parentId === row.parentId) {
            isSelected = true
          }
        })
        if(this.eventEditCell.id === row.id) isSelected = true


      }
      return isSelected
    },

    setInputNumber () {
      const $this = this;
      if($this.cellOn) {
        if(!$this.isErrorInput) {
          $this.cellOn.value = $this.value
          $this.$emit('on-cell-value', $this.cellOn);
        }
        $this.hideEditor();
      }
    },
    //
    handleHourBlur() {
      this.setInputNumber();
      // const $this = this;
      // if($this.cellOn && $this.isNumeric($this.value)) {
      //   $this.cellOn.value = $this.value
      //   if(!$this.isErrorInput) {
      //     $this.$emit('on-cell-value', $this.cellOn);
      //   }
      //   $this.hideEditor();
      // }
    },
    //
    handleHourEnter() {
      this.setInputNumber();
    }
  },

  created() {
    const $this = this
    this.dataResult = this.dataGrid;
    const days = this.headerDays()
   // console.log('__data__',this.dataTable); //department
    this.columns = [
      {
        fixed: 'left', //'left' | 'right'
        width: this.options.canvas_columns_width,
        title: () => {
          return new CanvasTable.Layer({
            children: [
              new CanvasTable.Svg({
                path: icons['plus'],
                style: {
                  top:0.5,
                  left: 1,
                  width: 32,
                  height: 50,
                  color: 'transparent',
                  border:'transparent',
                },
                event: {
                  onClick: (e) => {
                    $this.$emit('on-employee-add');
                  },
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
                style: {
                  width: 185,
                  fontWeight:'bold',
                  fontSize: '20px'
                },
                text: `Сотрудник`,
                // style: { color: 'gray'}
              }),
              new CanvasTable.Text({
                style: {
                  width: 70,
                  fontWeight:'bold',
                  fontSize: '16px',
                  top: 1,
                },
                text: this.valueCol, //TODO количество норма часов mok
                event: {
                  onDoubleClick: (e) =>{
                    this.dataType = "number";
                    this.focusCell = e.target;
                    this.showEditor();
                  },
                  onMouseEnter: (e) => {
                    //x-canvas-scroll
                    const el = document.querySelector(".x-canvas-scroll");
                    const w = window
                    el.style.cursor = 'pointer';
                  },
                  onMouseLeave: (e) => {
                    const el = document.querySelector(".x-canvas-scroll");
                    el.style.cursor = 'default';
                  },
                }
                // style: { color: 'gray'}
              })
            ]
          })
        },
        dataIndex: 'row',
        styleColumn: {
          //  border: [`1px transparent`, `1px #ABB2C6`,`1px transparent`,`1px transparent`]
          border: headerLeft
        },
        // onCell: (record, rowIndex) => {
        //
        //   return {
        //     onClick(data) {
        //      console.log(data.target.ctx);
        //     }
        //   }
        // },
        render: (data, record) => this.renderCell({data, record}),
      },
    ]
    days.forEach((d,i)=>{
      const currentDay  = this.isCurrentDay();
      const shortenedDay  = this.isShortenedDay(d);
      const weekD = this.isWeekEnd(d);
      const backgroundColor = d === weekD ? '#E2E9FC' : (d === shortenedDay ? '#FFFBEF' :'#EFF2FE')
      this.columns.push(
        {
          align: 'center',
          width: this.options.canvas_cell_w,
          title: d, //d
          day: d,
          index: i,
          dataIndex: 'plan',
          popTitle: d === shortenedDay  ? this.shortenedDay && this.shortenedDay.popTitle && this.shortenedDay.popTitle : '',
          styleColumn: {
            fontSize: '14px',
            fontWeight: 'normal',
            color: 'rgba(115, 129, 163, 0.7)',
            backgroundColor: backgroundColor,
            border: headerLevelBorder(backgroundColor),
            //border: `1px #9EA7C5`,
          },
          render: (data, record) => {
            let backgroundColorCell = levelBgRow(record.row.type);
                backgroundColorCell = d === weekD ? '#E2E9FC' : (d === shortenedDay ? '#FFFBEF' : levelBgRow(record.row.type));

             const row = record.row;

             if(this.isSelectedCell(row)) {
               backgroundColorCell = colors.Primary;
             }

            // TODO расчет выходыне дни подкрашиваем и сокращенные дни;
            return this.cellField(record,backgroundColorCell,d);
          }
        },
      )
    })
    this.dataTable = this.generatePersons(true);
    this.heightRowSize(this.dataTable.length);
    this.valueCol = this.headerColumnsTotal
  },

  mounted() {
     const $this = this;
     this.$nextTick(async()=>{
       await this.load()
     })

     window.addEventListener( 'resize', this.safeResize );
     document.addEventListener( 'wheel', this.handleScroll, { passive: true } )
  },

  unmounted () {
    window.removeEventListener( 'wheel', this.handleScroll )
  },

  beforeDestroy() {
    window.removeEventListener( 'wheel', this.handleScroll )
  },

  watch: {
    loading(v) {
      if(!v) {
        this.updateTable();
        console.log('loading end')
      }

    },
    //Обновить массив;
    dataGrid(value) {
      this.dataResult = value;
      this.updateTable();
     // this.canvasRender();
    },

    eventEditCell(v) {
      this.canvasRender();
    }
  }

}
</script>

<style lang="scss" scoped>
:root {
  --ViewTable: 1;
}
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
  border: 1px solid #000;

  .column-name {
    border: 1px solid red;
    background: red;
    color: red;
    height: 290px;
    width: 100px;
  }
}

#containerCanvas {

//  height: 100vh;
  width: 100%;
  height: 100vh;
  max-height: 70vh;
 // height: 100%;
  //height:600px;
 // height: 600px; //calc(100vh - 160px);
  //width: 1500px;
  //border: 1px solid #000;
  //padding-bottom: 20px;
 // padding-right: 10px;
  //background: red;
  opacity: var(--ViewTable);
  transition: opacity .1s;
 // border-radius: 90px;
}
/deep/ .x-canvas-table > .x-canvas-scroll .x-canvas-scroll-inner {

}
/deep/.x-canvas-table > canvas {
  border-radius: 0px 10px 0px 0px;
  box-shadow: 6px -6px 15px rgba(56, 55, 57, 0.1);
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
 // background-color: #fff;
 // border: 2px solid rgb(82,146,247);
  box-sizing: border-box;

  pointer-events: auto;
}
.#{$css-prefix}-popup {
  input[type="text"] {
    border: none;
    outline: none;
    border-radius: 0;
  }
}

.popover-cell {
  width: 38px;
  height: 35px;
  background: #fff;
  padding: 2px;
  line-height: normal;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 6px 16px;
  &.contextmenu {
    width: 180px;
    height: auto;
    padding: 8px;
    border-radius: 3px;
    border: 1px solid $color-light-grey;
    box-shadow: none;
    font-size: 14px;
    background: #fff;
    text-align: center;
    .title_m {
       font-weight: bold;
       font-size: 12px;
       padding-bottom: 3px;
       padding-top: 3px;
    }
    .buttons {
      margin-top: 8px;
      margin-bottom: 8px;
      display: flex;
      justify-content: center;
      :deep(.el-button) {
        width: 50px;
        height: 25px;
        font-size: 11px;
        padding: 0px;
      }
    }
  }
  &.popContent {
    width: 50px;
    height: 33px;
    background: transparent;
    .input_edit {}
  }
}
/deep/.x-canvas-table .x-tooltip {
  //display: none !important;
  //opacity: 0;
 // background: #A8D3FF;
  font-family: 'Gilroy';
  background: rgba(168, 211, 255, 0.85);
  color: #373737;
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
  text-align: center;
  &:before {
    border-top: 4px solid rgba(168, 211, 255, 0.85);
  }
}
/deep/.x-canvas-table > .x-canvas-scroll .x-canvas-scroll-inner .x-canvas-scroll-end {
  height: 24px;
}
#circleIcons,#bgBox {
  display: none;
}

.hoverCell {
  width: 32px;
  height: 32px;
  background:#41A4FF;
  opacity: 0.5;
  border-radius: 5px;
  position: absolute;
  top: -10000px;
  left: -10000px;
  text-align: left;
  line-height: 0;
  z-index: 0;
  overflow: hidden;
}

:root {
  --ViewTable: 1;
}

:deep(.el-input__inner) {
  padding: 2px 5px;
  text-align: center;
  font-size: 14px; //16
  font-family: 'Gilroy';
  color: #000;
  border-color: #41A4FF;
  height: 100%;
}

.input_edit {
  &.error {
    :deep(.el-input__inner) {
      border-color: #EB5757;
    }
  }
}

.el-input--small {
  height: 100%;
}
.empty {
  padding: 20px;
  background: #eaeaea;

}
</style>
