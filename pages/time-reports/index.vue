<template>
  <el-container class="wrap">
    <el-aside width="70px">
      <div class="logo"></div>
      <div class="bg"></div>
    </el-aside>
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-page-header class="header-top" title="" content="Отчеты по времени" @back="()=>$router.push('/')"></el-page-header>
        <div class="filters">
          <div class="icon-f">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.25 7.5H3.75" stroke="#373737" stroke-width="3" stroke-linecap="round"/>
              <path d="M26.25 15H3.75" stroke="#373737" stroke-width="3" stroke-linecap="round"/>
              <path d="M15 22.5H3.75" stroke="#373737" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <el-select class="select-filter" v-model="worksValue" @change="handleWorks" clearable placeholder="По виду работ" multiple>
            <el-option
              v-for="item in worksSelects"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-select class="select-filter" v-model="projectValue" @change="handleProject" clearable placeholder="По проекту" multiple>
            <el-option
              v-for="item in projectSelectsFilters"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-select class="select-filter" v-model="employeeValue" @change="handleEmployee" clearable placeholder="По сотруднику" multiple>
            <el-option
              v-for="item in employeeSelects"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <div class="filter_date">
            <date-picker-range-popover
              title="Выберите  за какие даты будет сформирован отчет по времени"
              :loading="loading"
              :date-range="dateRange"
              :visible-popover="visible"
              @on-visible="(e) => this.visible = e"
              @on-btn-save="handleBtnDateRangeSave"
            >
              <template slot="value-title">
                {{formatDateRange(dateRange,'start')}} - {{formatDateRange(dateRange,'end')}}
              </template>
            </date-picker-range-popover>
          </div>
          <div class="excel-pointer" @click="handleExcel">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 25.625L11.25 21.875M15 11.875V25.625V11.875ZM15 25.625L18.75 21.875L15 25.625Z" stroke="#2DA5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 6.25H20C21.2329 6.25 21.6311 6.25588 21.9344 6.30387C23.8064 6.60038 25.2746 8.06862 25.5711 9.94062C25.6192 10.244 25.625 10.6421 25.625 11.875C25.625 13.1079 25.6192 13.506 25.5711 13.8094C25.2746 15.6814 23.8064 17.1496 21.9344 17.4461C21.6311 17.4941 21.2329 17.5 20 17.5H19.6875C19.1697 17.5 18.75 17.9197 18.75 18.4375C18.75 18.9553 19.1697 19.375 19.6875 19.375H20C21.1613 19.375 21.7419 19.375 22.2277 19.2981C24.902 18.8745 26.9995 16.777 27.4231 14.1027C27.5 13.6169 27.5 13.0363 27.5 11.875C27.5 10.7137 27.5 10.1331 27.4231 9.64725C26.9995 6.973 24.9021 4.8755 22.2277 4.452C21.7419 4.375 21.1613 4.375 20 4.375H10C8.83875 4.375 8.25813 4.375 7.77225 4.452C5.098 4.8755 3.0005 6.973 2.577 9.64725C2.5 10.1331 2.5 10.7137 2.5 11.875C2.5 13.0363 2.5 13.6169 2.577 14.1027C3.0005 16.777 5.098 18.8745 7.77225 19.2981C8.25813 19.375 8.83875 19.375 10 19.375H10.3125C10.8302 19.375 11.25 18.9553 11.25 18.4375C11.25 17.9197 10.8302 17.5 10.3125 17.5H10C8.76712 17.5 8.369 17.4941 8.06562 17.4461C6.19362 17.1496 4.72538 15.6814 4.42887 13.8094C4.38087 13.506 4.375 13.1079 4.375 11.875C4.375 10.6421 4.38087 10.244 4.42887 9.94062C4.72538 8.06862 6.19362 6.60038 8.06562 6.30387C8.369 6.25588 8.76712 6.25 10 6.25Z" fill="#2DA5DB"/>
            </svg>
          </div>
        </div>
<!--        <pre v-loading="loading">{{tableResult}}</pre>-->
<!--        <pre>{{currentDateRange}}</pre>-->
<!--         <pre>{{dateRange}}</pre>-->
        <app-table-canvas-reports
          @load-data-table="handleDataTable"
          :key="key"
          class="plan-table"
          :loading="loading"
          :data-grid="tableResult"
          :current-date-range="currentDateRange"
          :header-columns-total="178"
          :shortened-day="{
            days: [6],
            popTitle: 'Сокращенный день <br> 7 часов',
          }"
        >
        </app-table-canvas-reports>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import AppTableCanvas from "/components/table-canvas/app-table-canvas";
import {arrMounts, headerRangeDays, isMinMaxRangeDays} from "/core_table/utils";
import moment from "moment";
import AppTableCanvasReports from "../../components/table-canvas/app-table-canvas-reports";
import DatePickerRangePopover from "../../components/date-picker-range-popover";
import alasql from "alasql";

const range = ['2022-10-01', '2022-10-14']

//const currentDate = moment().format('YYYY-MM')
const currentDate = '2022-10-01'

const minRange = isMinMaxRangeDays(range[0],range[1]);
//moment.locale('ru');
console.log('minRange',minRange);

// console.log('currentDate',currentDate);
export default {
  components: {DatePickerRangePopover, AppTableCanvasReports, AppTableCanvas },

  data() {
    return {
      rangeModel: null,
      key: 0,
      dateValue: '',
      loading: false,
      visible: false,
      dateRange: {
        start: range[0],
        end: range[1]
      },

      testDataMok: [], // mok

      tableResult: [],

      // По виду работ
      worksSelects: [],
      // По проекту
      projectSelects: [],
      projectSelectsFilters: [],
      //По сотруднику
      employeeSelects: [],

      worksValue: [],
      projectValue: [],
      employeeValue: [],
      currentDateRange: [],
      // Обртаный вызов табличка;
      dataTable: []
    }
  },
  computed: {},
  methods: {

    // MOK;
    handleBtnDateRangeSave(value) {
      if(value.isRange) {
        this.dateRange = value.date;
        this.currentDateRange = headerRangeDays(this.dateRange.start, this.dateRange.end, 'days');
        this.loading = true;
        setTimeout(()=>{
          this.testDataMok = this.mokTest();
          this.tableResult = this.testDataMok;
          this.loading = false;
          this.visible = false;
          this.key = Math.random();
        },1000);
      }
    },

    formatDateRange(dateRange,type = '') {
       if(type === 'start' && dateRange.start) {
          const m = moment(dateRange.start,'YYYY-MM-DD');
          return `${m.format('DD')} ${arrMounts(m.format('M'))} ${m.format('YYYY')}`
       }
       if(type === 'end' && dateRange.end)  {
         const m = moment(dateRange.end,'YYYY-MM-DD');
         return `${m.format('DD')} ${arrMounts(m.format('M'))} ${m.format('YYYY')}`
       }
     },

    headerRangeDays,

    handleExcel() {
      this.$confirm('', 'Скачать таблицу \n' +'в формате Excel?', {
        cancelButtonText: 'Нет',
        confirmButtonText: 'Да',
        center: true,
        cancelButtonClass: 'default',
        customClass: 'confirm__modal center'
      }).then(async () => {
        //this.$message.success('Вы успешно скачали! но Excel загружается с апи');
        this.handleExcelDownload();
        //
      }).catch((e)=>{});
    },

    handleWorks(id) {
      this.loading = true
      //this.worksValue = id ;
      //this.worksValue
      setTimeout(()=>{
        if(this.worksValue.length) {
          this.tableResult = this.testDataMok.filter(item => this.worksValue.includes(item.id));   //  this.tableResult = this.testDataMok.filter(item => item.id === id);
        }else{
          this.tableResult = this.testDataMok;
        }
        this.employeeValue = [];
        this.projectValue = [];

        this.loading = false
      },500)
    },

    handleEmployee(id) {
      let employee = [];
      this.loading = true

      this.employeeValue = id;
      this.projectValue = [];
      this.worksValue = [];
      console.log(id);
      setTimeout(() => {
        if(id.length) {
          const employeeSelect = this.employeeSelects.filter(it => id.includes(it.value)).map(it => it.item.parentId);
          this.testDataMok.forEach(item => {
            if(employeeSelect.includes(item.id)) {
              const it = item.employee.filter(it => id.includes(it.id))
              employee.push({
                ...item,
                employee: it
              })
            }
          })
          this.tableResult = employee;
        }else{
          this.tableResult = this.testDataMok;
        }
        this.loading = false
      },500)
    },

    handleProject(id) {
      let project = [];
      this.loading = true

      this.projectValue = id;
      this.employeeValue = [];
      this.worksValue = [];

      setTimeout(() => {
        if(id.length) {
          const projectSelect = this.projectSelects.filter(it => id.includes(it.value)).map(it => it.item.parentId);
          this.testDataMok.forEach((item,index) => {
            item.employee.forEach((it,ind) => {
              if(projectSelect.includes(it.id)) {
                project.push({
                  ...item,
                  employee: [
                    {
                      ...it,
                      plan: it.plan.filter(its => id.includes(its.id))
                    }
                  ]
                })
              }
            })
          })
          this.tableResult = project;
        }else{
          this.tableResult = this.testDataMok;
        }
        this.loading = false
      },500)
    },

    // TODO расчет выходной недели;
    isWeek(date) {
      const week = moment(date,"YYYY-MM-DD").weekday();
      return [0,6].includes(week) ? [0,0] : [8,8];
    },

    mokTest() {
       return [
         {
           name: 'Отдел 1',
           id: 1001,
           result: null,
           employee: [
             {
               name: 'Фамилия Имя',
               open: true,
               id: 1000,
               parentId: 1001,
               result:  this.currentDateRange.map((date) => {
                 if([11,12,13].includes(date.day)) {
                   return {
                     dateFormat: date,
                     value: 0,
                     color: null,
                     icon: 'close',
                     popTitle: 'Отгул'
                   }
                 } else if([14,15,16].includes(date.day)) {
                   return {
                     dateFormat: date,
                     value:0,
                     color: null,
                     icon: 'box',
                     popTitle: 'Больничный'
                   }
                 } else if([17,18,19,20,21,22,23,24,25].includes(date.day)) {
                   return {
                     dateFormat: date,
                     value: 0,
                     color: null,
                     icon: 'sum',
                     popTitle: 'Отпуск'
                   }
                 }else if([6].includes(date.day)){
                   return {
                     dateFormat: date,
                     value: [7,7],
                     color: `#686B72`,
                     icon: null
                   }
                 }else{
                   return {
                     dateFormat: date,
                     value: this.isWeek(date.date),
                     color: `#686B72`,
                     icon: null
                   }
                 }

               }),
               plan: [
                 {
                   id: 16,
                   name: 'Проект 16 1',
                   sort: 1,
                   parentId: 1000,
                   color: '#3c9693',
                   countHour: 79,
                   result: [
                     {
                       dateFormat: {
                         day: 3,
                         date: '2022-10-03'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 4,
                         date: '2022-10-04'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 5,
                         date: '2022-10-05'
                       },
                       value: [3,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 6,
                         date: '2022-10-06'
                       },
                       value: [7,7],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 7,
                         date: '2022-10-07'
                       },
                       value: [7,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 10,
                         date: '2022-10-10'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                   ]
                 }
               ]
             },
             {
               name: 'Фамилия 1010',
               open: true,
               id: 1010,
               parentId: 1001,
               result:  this.currentDateRange.map((date) => {
                 if([6].includes(date.day)){
                   return {
                     dateFormat: date,
                     value: [7,7],
                     color: `#686B72`,
                     icon: null
                   }
                 }else{
                   return {
                     dateFormat: date,
                     value: this.isWeek(date.date),
                     color: `#686B72`,
                     icon: null
                   }
                 }

               }),
               plan: [
                 {
                   id: 17,
                   name: 'Проект 1',
                   sort: 1,
                   parentId: 1010,
                   color: '#243a93',
                   countHour: 167,
                   result: [
                     {
                       dateFormat: {
                         day: 3,
                         date: '2022-10-03'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 4,
                         date: '2022-10-04'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 5,
                         date: '2022-10-05'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 6,
                         date: '2022-10-06'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 7,
                         date: '2022-10-07'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },

                     {
                       dateFormat: {
                         day: 10,
                         date: '2022-10-10'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 11,
                         date: '2022-10-11'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 12,
                         date: '2022-10-12'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 13,
                         date: '2022-10-13'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 14,
                         date: '2022-10-14'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                   ]
                 },
               ]
             },
             {
               name: 'Фамилия 1011',
               open: true,
               id: 1011,
               parentId: 1001,
               result:  this.currentDateRange.map((date) => {
                 if([3,4,5,6,7,10,11,12,13,14].includes(date.day)) {
                   return {
                     dateFormat: date,
                     value:0,
                     color: null,
                     icon: 'box',
                     popTitle: 'Больничный'
                   }
                 } else{
                   return {
                     dateFormat: date,
                     value: this.isWeek(date.date),
                     color: `#686B72`,
                     icon: null
                   }
                 }

               }),
               plan: [
                 {
                   id: 18,
                   name: 'Проект 1011',
                   sort: 1,
                   parentId: 1011,
                   color: '#935224',
                   countHour: 167,
                   result: []
                 },
               ]
             }
           ]
         },

         {
           name: 'Отдел 2',
           id: 1002,
           result: null,
           employee: [
             {
               id: 1006,
               parentId: 1002,
               name: 'Фамилия Имя 2',
               open: true,
               result:  this.currentDateRange.map((date) => {
                 if([6].includes(date.day)) {
                   return {
                     dateFormat: date,
                     value: [7,7],
                     color: `#EB5757`,
                     icon: null
                   }
                 }else{
                   return {
                     dateFormat: date,
                     value: this.isWeek(date.date),
                     color: `#686B72`,
                     icon: null
                   }
                 }

               }),
               plan: [
                 {
                   id: 10,
                   name: 'Проект 2',
                   sort: 1,
                   parentId: 1006,
                   color: '#0c57fd',
                   countHour: 50,
                   result: [
                     {
                       dateFormat: {
                         day: 23,
                         date: '2022-10-23'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 1,
                         date: '2022-11-01'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     }
                   ]
                 },
                 {
                   id: 11,
                   name: 'Проект 5',
                   sort: 2,
                   parentId: 1006,
                   color: '#d1fd0c',
                   countHour: 50,
                   result: [
                     {
                       dateFormat: {
                         day: 10,
                         date: '2022-11-10'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 11,
                         date: '2022-10-11'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     }
                   ]
                 },
                 {
                   id: 12,
                   name: 'Проект 3',
                   sort: 3,
                   parentId: 1006,
                   color: '#800cfd',
                   countHour: 67,
                   result: [
                     {
                       dateFormat: {
                         day: 10,
                         date: '2022-10-10'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 11,
                         date: '2022-10-11'
                       },
                       value: [8,2],
                       color: null,
                       icon: null
                     }
                   ]
                 }
               ]
             }
           ]
         },
         {
           name: 'Отдел 3',
           id: 1003,
           result: null,
           employee: [
             {
               id: 1007,
               parentId: 1003,
               name: 'Фамилия Имя 3',
               open: true,
               result:  this.currentDateRange.map((date) => {
                 if([6].includes(date.day)) {
                   return {
                     dateFormat: date,
                     value: [7,7],
                     color: `#EB5757`,
                     icon: null
                   }
                 }else{
                   return {
                     dateFormat: date,
                     value: this.isWeek(date.date),
                     color: `#686B72`,
                     icon: null
                   }
                 }

               }),
               plan: [
                 {
                   id: 13,
                   name: 'Проект 2',
                   sort: 1,
                   parentId: 1007,
                   color: '#02dc3f',
                   countHour: 50,
                   result: []
                 },
                 {
                   id: 14,
                   name: 'Проект 3',
                   sort: 1,
                   parentId: 1007,
                   color: '#6523c9',
                   countHour: 50,
                   result: []
                 },
                 {
                   id: 15,
                   name: 'Проект 4',
                   sort: 1,
                   parentId: 1007,
                   color: '#c92395',
                   countHour: 50,
                   result: []
                 },
                 {
                   id: 16,
                   name: 'Проект 16 1',
                   sort: 1,
                   parentId: 1007,
                   color: '#c5da0f',
                   countHour: 7,
                   result: [
                     {
                       dateFormat: {
                         day: 3,
                         date: '2022-10-03'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 4,
                         date: '2022-10-04'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 5,
                         date: '2022-10-05'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     //2022-12-01
                     {
                       dateFormat: {
                         day: 1,
                         date: '2022-12-01'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 2,
                         date: '2022-12-02'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                     {
                       dateFormat: {
                         day: 5,
                         date: '2022-12-05'
                       },
                       value: [8,8],
                       color: null,
                       icon: null
                     },
                   ]
                 }
               ]
             }
           ]
         },
       ]
    },

    /*---------------Эксель------------------*/
    async handleExcelDownload() {
      let xslData = [];
      const days = this.dataTable.header.days;
      const thCell = Object.assign(...days.map((it)=> ({[`'${it.date}'`]: it.day} )))
      xslData.push({
        row :  this.dataTable.header.column.title,
        total: `${this.dataTable.header.column.total} ч`,
        ...thCell
      })
      //
      this.dataTable.body.forEach((item)=> {
        // Отдел
        if(item.row.type === 'department') {
          let assignD = {}
          const d = days.map((it)=> ({[`'${it.date}'`]: '' } ));
          if(d && d.length)  assignD = Object.assign(...d)
          xslData.push({row : item.row.name, total: '',...assignD})
        }
        // Сотрудник
        if(item.row.type === 'employee') {
          let assign = {}
          const cell = item.row.result.map((it)=> ({[`'${it.dateFormat.date}'`]: it.popTitle ? it.popTitle : `${it.value[0]}/${it.value[1]}`}));
          if(cell && cell.length) assign = Object.assign(...cell)
          xslData.push({ row : item.row.name, total: `${item.row.totalCount[0] || 0}/${item.row.totalCount[1] || 0}`, ...assign })
        }
        // Проект
        if(item.row.type === 'plan') {
           let assignPlan = {}
           const cellPlan = days.map((it) => {
              const valueDate = item.row.result.find((v) => v.dateFormat.date === it.date) || null;
              if(valueDate) {
                return {[`'${valueDate.dateFormat.date}'`]: `${valueDate.value[0] || 0}/${valueDate.value[1] || 0}`}
              }else{
                return {[`'${it.date}'`]: '0/0'}
              }
           })
           if(cellPlan && cellPlan.length) {
              assignPlan = Object.assign(...cellPlan)
           }
           xslData.push({ row : item.row.name, total: `${item.row.totalCount[0] || 0}/${item.row.totalCount[1] || 0}`, ...assignPlan })
        }
      })

      const start = moment(this.dateRange.start,'YYYY-MM-DD').format('DD.MM.YYYY');
      const end = moment(this.dateRange.end,'YYYY-MM-DD').format('DD.MM.YYYY');

      /*--РАБОЧАЯ ВЕРСИИ СО СТИЛЯМИ--*/
      const fileName = `report_${this.dateRange.start}_${this.dateRange.end}.xlsx`
      const XLSX = require('sheetjs-style');
      const excelColumnName = require('excel-column-name');

      const wbr = XLSX.utils.book_new();
      const wsq = XLSX.utils.json_to_sheet(xslData,{skipHeader: true} );

      // Размер колонки;
      const wscols = [
        {wch:20}
      ];
      wsq['!cols'] = wscols;
      xslData.forEach((item,ind)=>{
        // Шапка;
        if(ind === 0) {
          const column = Object.entries(item);
          column.forEach((it,i)=> {
           const c = excelColumnName.intToExcelCol(i + 1);
            // Крашим 1 клонка;
            wsq[`${c}1`].s = {
              font: {
                bold: true,
                color: {
                  rgb: "RTTTAA00",
                },
              },
              fill:  {
                fgColor:{ rgb: "FFFFAA00" },
                patternType: 'solid',
              },
            }
          })
        }
        if(['Отдел 1','Отдел 2','Отдел 3'].includes(item.row)) {
          const column = Object.entries(item);
          column.forEach((it,i)=> {
            const c = excelColumnName.intToExcelCol(i + 1);
            // Крашим 1 клонка;
            wsq[`${c}${ind + 1}`].s = {
              font: {
                bold: true,
                color: {
                  rgb: "RTTTAA00",
                },
              },
              fill:  {
                fgColor:{ rgb: "bcbcbc" },
                patternType: 'solid',
              },
            }
          })
        }
      });

     XLSX.utils.book_append_sheet(wbr, wsq, `c ${start} по ${end}`);
     XLSX.writeFile(wbr, `${fileName}.xlsx`);
      /*--./РАБОЧАЯ ВЕРСИЯ СО СТИЛЯМИ--*/

      const formatType = 10 // off

      /*---Логика---*/
      try {
        //
        const header = {
          sheetid: `c ${start} по ${end}`,
          headers: false,
          // column: {1: {style: {color:"#E1697B" }} },
          //rows: {1:{style:{Font:{color:"#FF0077"}}}},
          column: {1: {color:"#E1697B" }},
          rows: {1:{style:{fill:{fgColor:{ rgb: "FFFFAA00" }}}}},
          cells: {
            1:{
              color:"#E1697B",
              fill: {
                fgColor:{ rgb: "FFFFAA00" }
              }
            }
          },
        }
        // XLSX
        //ПОЛИГОН
        if(formatType === 1) {
          const fileName = `report_${this.dateRange.start}_${this.dateRange.end}.xlsx`
          //const XLSX = require("xlsx");
         // alasql.utils.global.XLSX = XLSX;
          alasql["private"].externalXlsxLib = XLSX;
          // alasql["private"].externalXlsxLib = require('xlsx');
          alasql(`SELECT * INTO XLSX("report_${fileName}",?) FROM ?`,[header, xslData]);

        }else if(formatType === 2) {
          alasql(`SELECT * INTO XLSXML("report_${this.dateRange.start}_${this.dateRange.end}.xls",?) FROM ?`,[header, xslData]);
        }
      }catch (e) {
        console.log('err',e);
      }
    },

    handleDataTable(data) {
        this.dataTable = data;
    },

  },
  created() {
     this.currentDateRange = headerRangeDays(range[0], range[1], 'days');

    //TODO MOK;
     this.testDataMok = this.mokTest();

    ////
    const worksSelects = []
    const projectSelects = [];
    const employeeSelects = [];
    this.testDataMok.forEach(item => {
      worksSelects.push({label: item.name, value: item.id})
      const select = item.employee.map(it => ({ label: it.name, value: it.id, item: it }))
      employeeSelects.push(...select)
      item.employee.forEach((employee)=>{
        projectSelects.push(...employee.plan.map(it => ({ label: it.name, value: it.id, item: it })))
      })
    });

    this.worksSelects = worksSelects
    this.projectSelects = projectSelects;
    this.projectSelectsFilters = projectSelects.filter((v,i,a)=>a.findIndex(t=>(t.value === v.value)) === i);
    this.employeeSelects = employeeSelects;

    this.tableResult = this.testDataMok;
  },
  mounted() {
    this.tableResult = this.testDataMok;
  },
  watch: {}
}
</script>

<style scoped lang="scss">
.logo {
  text-align: center;
  margin-top: 50px;
}
.plan-table {
  margin-left: -20px;
}

/*filters*/
.filters {
  max-width: 1500px;
  .icon-f {
    padding-right: 25px;
  }
  display: flex;
  align-items: center;
  .select-filter {
    padding-right: 25px;
  }
  padding-bottom: 30px;
  :deep(.el-input__inner) {
    // background: rgba(210, 221, 252, 1);
    background: #C7D3FA;
    color: $color-black-medium;
    border-color: #C7D3FA;
  }
  :deep(.el-select .el-input .el-select__caret) {
    color: $color-black-medium;
  }
  :deep(.el-tag.el-tag--info) {
    background-color: #fff;
    border-color: #fff;
    color: #000;
  }
  .el-select .el-tag__close.el-icon-close {
    background-color: #fff;
  }
}

.filter_date {
  display: flex;
  font-weight: bold;
  margin: 0 0 0 auto;
  padding-right: 20px;

}


.excel-pointer {
  position: relative;
  top:5px;
  cursor: pointer;
  opacity: 1;
  @include ease();
  &:hover {
    opacity: 0.6;
  }
}
</style>
