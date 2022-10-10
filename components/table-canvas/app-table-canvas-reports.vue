<template>
  <div>
    <div class="xs-data-grid" >
      <div  id='containerCanvas' :style="{width: `${viewWidth - 70}px`, height: `${heightRow}px`}" v-loading="loading" ref="refCanvas"></div>
      <div v-if="!dataTable.length" class="empty" :style="{'max-width': `${widthColumns - 10}px`}">Нет данные</div>
      <div
        :class="`xs-data-grid-overlayer`"
        :style="{ top: `${tableHeaderHeight }px` }"
      >
      </div>
      <!--Icons svg-->
      <svg id="circleIcons" width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="5.5" r="5" fill="#123123" stroke="black" stroke-opacity="0.5"/>
      </svg>

      <!--Icons svg-->
      <svg id="bgBox" width="55" height="28" viewBox="0 0 55 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="55" height="28" rx="5" fill="#123123" fill-opacity="0.5"/>
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
import CanvasTable from 'x-canvas-table/dist'
import {mapGetters} from "vuex";

import {VIEW_PORT_HEIGHT, VIEW_PORT_WIDTH} from "../../store";
import moment from "moment";

export default {
  props: {
    loading:  { type: Boolean, default: false },
    dataGrid:  { type: Array},
    headerColumnsTotal:  { type: Number, default: 0},
    currentDateRange:  { type: Array},
    shortenedDay:  { type: Object },
  },
  components: { CanvasTable },

  data() {
    return {
      // Запрос с бэка;
      dataResult: [],
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
        canvas_cell_w: 80, // Размер ячейки;
        canvas_columns_width: 300,
        canvas_header_height: 40,
        canvas_row_height: 40,
        wrapPadding: [0,0,0,20]
      },
    };
  },

  computed: {

    isErrorInput() {
      return true
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
             })
           }
         });
       }

       return obj;
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
            const totalSum = $this.totalPlanSum(record.row);
            const isMaks = false;
            titleContent = [
              new CanvasTable.Text({
                text: data.name,
                style: {
                  width: 135,
                  fontWeight:'bold',
                  fontSize: '16px',
                  color: colors.Black,
                  padding: this.options.wrapPadding
                },
                event: {
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
                text: totalSum.join('/'), //data, // $this.totalSum(record.row.result)
                style: {
                  color: isMaks ? colors.Red : colors.Black,
                  align: 'right',
                  width: 100,
                  height: 20,
                  fontWeight:'bold',
                  //border: '1px #9EA7C5',
                  padding: [0, 0, 0, 0],
                  //   backgroundColor: '#AAC9F2'
                },
              }),
            ]
            break;
          case 'plan':
           const totalPlanSum = $this.totalSum(record.row.result)
           const isMaksPlan = false;
           //TODO: mod;
           const circleIcon = this.svgIconsBase64('circleIcons',`${data.color}`);
            titleContent = [
              new CanvasTable.Layer({
                width: 200,
                style: {
                  padding: this.options.wrapPadding
                },
                children: [
                  new CanvasTable.Svg({
                    path: circleIcon,
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
                      width: 155,
                      padding: [0, 0, 0, 8]
                    },
                    text: data.name,
                    event: {
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
                    style: {
                      align: 'right',
                      width: 75,
                      height: 20,
                      color: isMaksPlan ? colors.Red : colors.Black,
                     //border: '1px #9EA7C5'
                    },
                    // Расчет всего часов план;
                    text: totalPlanSum.join('/')  // всего TODO: // $this.totalSum(record.row.result) // record.row.countHour
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
            color: '#00',
            padding: [0, 0, 0, 0],
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
    cellField (obj,bg,dataFormat) {
      if (!obj.row) return null
      let result = null
      const $this = this;
      const {day,date} = dataFormat;

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
          const cell = obj.row.result.find(item => item.dateFormat.date === date) || null;
          if(!cell) return null
          let layerValue = {}

          // Подсчет количество часов;
          const plan = obj.row.plan.filter(item => item.parentId === obj.row.id);
          const totalRow = this.totalRowSum(plan,day);
          // TODO подсчет макс и мин
          const isMaxMin = (totalRow > cell.value || (totalRow > 0 && totalRow < cell.value));


          if (cell.icon) {
            layerValue = new CanvasTable.Svg({
              path: isMaxMin ? icons[cell.icon + '_red'] : icons[cell.icon] , // sum // close // box
              style: {
                color: 'transparent',
                left: this.options.canvas_cell_w / 5,
                top: 1,
                width: 20,
                height: 20,
                align: 'center',
                // padding:[30,20,30,20]
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
              text: this.isValue(cell) ? `${cell.value.join('/')}` : '', //day.value
              style: {
                fontSize: '16px',
                fontWeight:'bold',
                align:'center',
                color: (isMaxMin? colors.Red : colors.BlackNormal),
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
          const cellPlan = obj.row.result.find(item => item.dateFormat.day === day && item.dateFormat.date === date) || null;
          let bgCell = []
          if(this.isValue(cellPlan)) {
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
                text: this.isValue(cellPlan) ? `${cellPlan.value.join('/')}` : '',
                style: {
                  align:'center',
                  zIndex: 10,
                  color: '#000',
                },
                children: bgCell
              })
            ],
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
      if(!arr.length) return [0,0];
      const dates = this.currentDateRange.map((it)=> it.date) || [];
      let value1 = 0
      let value2 = 0
      for (let i in arr) {
        if(dates.includes(arr[i].dateFormat.date)) {
          value1 += arr[i].value[0];
          value2 += arr[i].value[1];
        }
      }
      return [value1,value2]
    },

    // Расчет общего план проекта;
    totalPlanSum(arr = []) {
      if(!arr.plan) return [0,0];
      let total = [0,0]
      //const dates = this.currentDateRange.map()
      arr.plan.forEach((plan)=>{
          const totalPlans = this.totalSum(plan.result);
          total[0] += totalPlans[0]
          total[1] += totalPlans[1]
      })
      // total
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
    isValue(cellValue) {
      return Boolean(cellValue && cellValue.value && cellValue.value.length);
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
    isWeekEnd(cDay, date) {
      // 2022-10
      const week = moment(date,"YYYY-MM-DD").weekday();
      if([0,6].includes(week)) {
        return  cDay;
      }
      return null
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

    // Обновить массив;
    initData() {
      this.dataResult = this.dataGrid;
      this.columns = [
        {
          fixed: 'left', //'left' | 'right'
          width: this.options.canvas_columns_width,
          title: () => {
            return new CanvasTable.Layer({
              children: [
                new CanvasTable.Text({
                  style: {
                    width: 185,
                    fontWeight:'bold',
                    fontSize: '20px',
                    color: colors.Black,
                    padding: this.options.wrapPadding
                  },
                  text: `Сотрудник`,
                  // style: { color: 'gray'}
                }),
                new CanvasTable.Text({
                  style: {
                    width: 80,
                    align: 'right',
                    fontWeight:'bold',
                    fontSize: '16px',
                    color: colors.Black,
                    height: 20,
                    //  border: '1px #9EA7C5',
                    top: 1,
                  },
                  text: this.valueCol, //TODO количество норма часов mok
                  // style: { color: 'gray'}
                })
              ]
            })
          },
          dataIndex: 'row',
          styleColumn: {
            border: headerLeft
          },
          render: (data, record) => this.renderCell({data, record}),
        },
      ]
      this.currentDateRange.forEach((dateFormat,i)=>{
        const d = dateFormat.day;
        const shortenedDay  = this.isShortenedDay(dateFormat.day);
        const weekD = this.isWeekEnd(d, dateFormat.date);
        const backgroundColor = d === weekD ? '#E2E9FC' : (d === shortenedDay ? '#FFFBEF' :'#EFF2FE')
        this.columns.push(
          {
            align: 'center',
            width: this.options.canvas_cell_w,
            title: d, //d
            day: d,
            date: dateFormat.date,
            index: i,
            dataIndex: 'plan',
            popTitle: d === shortenedDay  ? this.shortenedDay && this.shortenedDay.popTitle && this.shortenedDay.popTitle : '',
            styleColumn: {
              fontSize: '14px',
              fontWeight: 'normal',
              color: 'rgba(115, 129, 163, 0.7)',
              backgroundColor: backgroundColor,
              border: '1px #ABB2C6'
              //border: `1px #9EA7C5`,
            },
            render: (data, record) => {
              let backgroundColorCell = levelBgRow(record.row.type);
              backgroundColorCell = d === weekD ? '#E2E9FC' : (d === shortenedDay ? '#FFFBEF' : levelBgRow(record.row.type));
              // TODO расчет выходыне дни подкрашиваем и сокращенные дни;
              return this.cellField(record, backgroundColorCell, dateFormat);
            }
          },
        )
      })
      this.dataTable = this.generatePersons(true);
      this.heightRowSize(this.dataTable.length);
      this.valueCol = this.headerColumnsTotal
    }

  },

  created() {
    this.initData();
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
        console.log('watch loading')
      }

    },
    //Обновить массив;
    dataGrid(value) {
      this.dataResult = value;
      this.updateTable();
      console.log('watch dataGrid')
     // this.canvasRender();
    },
    currentDateRange() {
      // this.initData();
      // this.canvasRender();
     // this.updateTable();
      console.log('watch currentDateRange')
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
  max-width: 100%;
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
  //height: 24px;
}
#circleIcons,#bgBox {
  display: none;
}

.empty {
  padding: 20px;
  background: #eaeaea;
  max-width: 100%;

}
</style>
