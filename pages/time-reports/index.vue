<template>
  <el-container class="wrap">
    <el-aside width="70px">
      <div class="logo">
        <svg width="49" height="34" viewBox="0 0 49 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="path-1-outside-1_197_13039" maskUnits="userSpaceOnUse" x="0" y="0" width="49" height="22" fill="black">
            <rect fill="white" width="49" height="22"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1 20.74L20.27 11.105L23.56 1L1 12.28V20.74ZM48 20.74L28.73 11.105L25.44 1L48 12.28V20.74Z"/>
          </mask>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M1 20.74L20.27 11.105L23.56 1L1 12.28V20.74ZM48 20.74L28.73 11.105L25.44 1L48 12.28V20.74Z" fill="url(#paint0_radial_197_13039)"/>
          <path d="M20.27 11.105L20.4936 11.5522L20.6807 11.4587L20.7454 11.2598L20.27 11.105ZM1 20.74H0.5V21.549L1.22361 21.1872L1 20.74ZM23.56 1L24.0354 1.15479L24.4055 0.0182459L23.3364 0.552786L23.56 1ZM1 12.28L0.776393 11.8328L0.5 11.971V12.28H1ZM28.73 11.105L28.2546 11.2598L28.3193 11.4587L28.5064 11.5522L28.73 11.105ZM48 20.74L47.7764 21.1872L48.5 21.549V20.74H48ZM25.44 1L25.6636 0.552788L24.5945 0.0182479L24.9646 1.1548L25.44 1ZM48 12.28H48.5V11.971L48.2236 11.8328L48 12.28ZM20.0464 10.6578L0.776393 20.2928L1.22361 21.1872L20.4936 11.5522L20.0464 10.6578ZM23.0846 0.845207L19.7946 10.9502L20.7454 11.2598L24.0354 1.15479L23.0846 0.845207ZM1.22361 12.7272L23.7836 1.44721L23.3364 0.552786L0.776393 11.8328L1.22361 12.7272ZM1.5 20.74V12.28H0.5V20.74H1.5ZM28.5064 11.5522L47.7764 21.1872L48.2236 20.2928L28.9536 10.6578L28.5064 11.5522ZM24.9646 1.1548L28.2546 11.2598L29.2054 10.9502L25.9154 0.845209L24.9646 1.1548ZM48.2236 11.8328L25.6636 0.552788L25.2164 1.44722L47.7764 12.7272L48.2236 11.8328ZM48.5 20.74V12.28H47.5V20.74H48.5Z" fill="white" mask="url(#path-1-outside-1_197_13039)"/>
          <path d="M20.5077 21.8379L20.4753 21.7384L20.3818 21.6917L1.1118 12.0567L0.75 11.8758V12.2803V20.7403V20.8948L0.888197 20.9639L23.4482 32.2439L23.9827 32.5112L23.7977 31.9429L20.5077 21.8379Z" fill="url(#paint1_linear_197_13039)" stroke="white" stroke-width="0.5"/>
          <path d="M28.4923 21.8379L28.5247 21.7384L28.6182 21.6917L47.8882 12.0567L48.25 11.8758L48.25 12.2803L48.25 20.7403L48.25 20.8948L48.1118 20.9639L25.5518 32.2439L25.0173 32.5112L25.2023 31.9429L28.4923 21.8379Z" fill="url(#paint2_linear_197_13039)" stroke="white" stroke-width="0.5"/>
          <defs>
            <radialGradient id="paint0_radial_197_13039" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(26.3159 -8.00637) rotate(110.726) scale(35.6162 88.3481)">
              <stop stop-color="#008DD2"/>
              <stop offset="1" stop-color="#044D8D"/>
            </radialGradient>
            <linearGradient id="paint1_linear_197_13039" x1="20.0704" y1="2.26074" x2="-3.2658" y2="6.08005" gradientUnits="userSpaceOnUse">
              <stop stop-color="#35ADE3"/>
              <stop offset="1" stop-color="#0076AB"/>
            </linearGradient>
            <linearGradient id="paint2_linear_197_13039" x1="28.9296" y1="2.26074" x2="52.2658" y2="6.08005" gradientUnits="userSpaceOnUse">
              <stop stop-color="#35ADE3"/>
              <stop offset="1" stop-color="#0076AB"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="bg"></div>
    </el-aside>
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-page-header class="header-top" title="" content="Отчеты по времени"></el-page-header>
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
         <pre>{{dateRange}}</pre>
        <app-table-canvas-reports
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
        this.$message.success('Вы успешно скачали! но Excel загружается с апи');
        //
      }).catch((e)=>{});
    },
    // Фильтры эмитация фильтр;
    filtersArr() {

      /*
      this.testDataMok.forEach((works)=>{
        works.forEach((employees)=>{
          employees.forEach((plan)=>{
           //
          })
        })
      })
       */
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
    }

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
.header-top {
  margin-bottom: 20px;
  :deep(.el-icon-back:before) {
    font-weight: bold;
    font-size: 20px;
  }
  :deep(.el-page-header__content) {
    font-weight: 700;
    font-size: 32px;
    line-height: 150%;
    position: relative;
    top: 2px;
  }
  :deep(.el-page-header__left) {
    margin-right: 5px;
    &::after{
      display: none;
    }
  }
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
