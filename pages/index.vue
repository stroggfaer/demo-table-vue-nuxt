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
        <el-page-header class="header-top" title="" content="Общий план ресурсов"></el-page-header>
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
          <el-select class="select-filter" v-model="employeeValue" @change="handleEmployee" clearable placeholder="По сотруднику" multiple>
            <el-option
              v-for="item in employeeSelects"
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
          <div class="filter_date">
            <v-date-picker ref="datePicker" :value='dateValue' class="mount__com" @update:from-page="handleMonthNavigation"/>
          </div>
        </div>
        <app-table-canvas
          :key="dateValue"
          class="plan-table"
          :loading="loading"
          :data-grid="tableResult"
          @on-employee-add="handleEmployeeModal"
          @on-plan-add="handlePlanAdd"
          @on-cell-value="handleCellAdd"
          @on-multi-cell-value="handleMultiCellAdd"
          @on-add-plan="handleAddPlan"
          @on-delete-cell="handleDeleteCell"
          @on-delete-plan="handleDeletePlan"
          @on-delete-employee="handleDeleteEmployee"
          :date-current="dateValue"
          :header-columns-total="127"
          :shortened-day="{
            days: [6],
            popTitle: 'Сокращенный день <br> 7 часов',
          }"
        ></app-table-canvas>

        <!--Dialog-->
        <el-dialog
          :title="modal.title"
          :visible.sync="dialogVisible"
           width="400px"
          :before-close="handleClose">
          <div class="desc">{{modal.desc}}</div>
          <div v-if="modal.type === 'employee'">
            <el-select class="select-filter" v-model="employeeAddValue" clearable placeholder="Выберите сотрудник">
              <el-option
                v-for="item in employeeSelects"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div v-if="modal.type === 'plan'">
            <el-select class="select-filter" v-model="planAddValue" clearable placeholder="Выберите проект">
              <el-option
                v-for="item in projectSelectsFilters"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <span slot="footer" class="dialog-footer">
              <el-button @click="handleClose">Отмена</el-button>
              <el-button v-if="modal.type === 'employee'" type="primary" :loading="loadingBtn" :disabled="!employeeAddValue" @click="handleAddSubmit">Добавить</el-button>
              <el-button v-if="modal.type === 'plan'" type="primary" :loading="loadingBtn" :disabled="!planAddValue" @click="handleAddSubmit">Добавить</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import AppTableCanvas from "/components/table-canvas/app-table-canvas";
import {headerDays} from "/core_table/utils";
import moment from "moment";

const currentDate = moment().format('YYYY-MM')
console.log('currentDate',currentDate);
export default {
  components: { AppTableCanvas },

  data() {
    return {
      dateValue: currentDate,
      loading: false,
      loadingBtn: false,
      isMounted: false,
      testDataMok: [
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
              result:  headerDays().map((day) => {
                if([11,12,13].includes(day)) {
                    return {
                      day: day,
                      value:0,
                      color: null,
                      icon: 'close',
                      popTitle: 'Отгул'
                    }
                } else if([14,15,16].includes(day)) {
                  return {
                    day: day,
                    value:0,
                    color: null,
                    icon: 'box',
                    popTitle: 'Больничный'
                  }
                } else if([17,18,19,20,21,22,23,24,25].includes(day)) {
                  return {
                    day: day,
                    value: 0,
                    color: null,
                    icon: 'sum',
                    popTitle: 'Отпуск'
                  }
                }else if([6].includes(day)){
                  return {
                    day: day,
                    value: 7,
                    color: `#686B72`,
                    icon: null
                  }
                }else{
                  return {
                    day: day,
                    value: this.isWeek(day),
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
                      day: 2,
                      value: 8,
                      color: null,
                      icon: null
                    },
                    {
                      day: 3,
                      value: 8,
                      color: null,
                      icon: null
                    }
                  ]
                }
              ]
            },
            {
              name: 'Фамилия 1010',
              open: false,
              id: 1010,
              parentId: 1001,
              result:  headerDays().map((day,ind) => {
                if([6].includes(day)){
                  return {
                    day: day,
                    value: 7,
                    color: `#686B72`,
                    icon: null
                  }
                }else{
                  return {
                    day: day,
                    value: this.isWeek(day) ,
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
                  result: []
                },
              ]
            },
            {
              name: 'Фамилия 1011',
              open: true,
              id: 1011,
              parentId: 1001,
              result:  headerDays().map((day) => {
                if([6].includes(day)){
                  return {
                    day: day,
                    value: 7,
                    color: `#686B72`,
                    icon: null
                  }
                }else{
                  return {
                    day: day,
                    value: this.isWeek(day),
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
              open: false,
              result:  headerDays().map((day) => {
                if([6].includes(day)) {
                  return {
                    day: day,
                    value: 7,
                    color: `#EB5757`,
                    icon: null
                  }
                }else{
                  return {
                    day: day,
                    value: this.isWeek(day),
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
                      day: 10,
                      value: 8,
                      color: null,
                      icon: null
                    },
                    {
                      day: 11,
                      value: 8,
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
                      day: 10,
                      value: 8,
                      color: null,
                      icon: null
                    },
                    {
                      day: 11,
                      value: 8,
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
                      day: 10,
                      value: 8,
                      color: null,
                      icon: null
                    },
                    {
                      day: 11,
                      value: 8,
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
              result:  headerDays().map((day) => {
                if([6].includes(day)) {
                  return {
                    day: day,
                    value: 7,
                    color: `#EB5757`,
                    icon: null
                  }
                }else{
                  return {
                    day: day,
                    value: this.isWeek(day),
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
                  result: []
                }
              ]
            }
          ]
        },
      ],
      testDataMok1: [
        {
          name: 'Отдел 1',
          id: 1001,
          result: null,
          employee: []
        },
      ],
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
      //
      employeeAddValue: '',
      planAddValue: '',

      // Modal
      dialogVisible: false,
      modal: {
        title: 'Добавить сотрудник',
        desc: 'Описание...',
        type: null,
        data: null,
      },

    }
  },
  computed: {},
  methods: {
    // Dialog;
    handleClose() {
      this.dialogVisible = false
      this.modal.title = '';
      this.modal.desc = '';
      this.modal.type = null;
      this.employeeAddValue = '';
      this.planAddValue = '';
      this.modal.data = null;
    },
    // Update table;
    handleMonthNavigation(e) {
        const {month, year} = e;
        const m = moment(`${year}-${month}`,'YYYY-MM').format('YYYY-MM');
        this.loading = true;
        // Mok
        setTimeout(()=>{
          this.dateValue = m
          this.tableResult = m === '2022-10' ? this.tableResult = this.testDataMok : this.testDataMok1
          console.log('m',m);
          this.loading = false;
        },500)
    },

    // Удалить ячейка;
    handleDeleteCell(d) {
      const row = d;
      const addPlan = [];
      if (row.delete) {
        this.loading = true;
        setTimeout(()=>{
          this.testDataMok.forEach((item)=>{
            if(item.id === row.departmentId) {
              const employee = item.employee.find((its) => its.id === row.parentId);
              employee.plan.find((plan) => {
                if(plan.id === row.id) {
                  const editValue = plan.result.find((d)=> d.day === row.delete.day) || null;
                  // Если есть редактироуем;
                  if(editValue) {
                    //debugger
                    plan.result = plan.result.filter((cell)=> cell.day !== row.delete.day) || []
                  }
                  return plan;
                }
              });

            }
            addPlan.push(item)
          })
          this.tableResult = addPlan
          this.loading = false;
        },300)
      }
    },

    // Удалить план ;
    handleDeletePlan(d) {
        console.log('handleDeletePlan',d);
        const row = d;
        const addPlan = [];
        this.loading = true;
        setTimeout(()=>{
          this.testDataMok.forEach((item)=>{
            if(item.id === row.departmentId) {
              const employee = item.employee.find((its) => its.id === row.parentId);
              employee.plan = employee.plan.filter((plan)=> plan.id !== row.id) || []
            }
            addPlan.push(item)
          })
          this.tableResult = addPlan
          this.loading = false;
        },300)
    },

    // Удалить сотрдник;
    handleDeleteEmployee(d) {
      console.log('handleDeleteEmployee',d);
      const row = d;
      const addPlan = [];
      this.loading = true;
      setTimeout(()=>{
        this.testDataMok.forEach((item)=>{
          if(item.id === row.parentId) {
            item.employee =  item.employee.filter((employee)=> employee.id !== row.id) || []
          }
          addPlan.push(item)
        })
        this.tableResult = addPlan
        this.loading = false;
      },300)
    },

    // Добавить сотрудник;
    handleEmployeeModal(e) {
      this.dialogVisible = true
      this.modal.title = 'Добавить сотрудник';
      this.modal.desc = 'На другой день он проснулся поздно. Возобновляя впечатления прошедшего...';
      this.modal.type = 'employee';
      this.modal.data = e;
    },
    // Добавить сотрудник;
    handleAddSubmit() {

      switch (this.modal.type) {
        case 'employee':
          const employeeSelect = this.employeeSelects.find(it => it.value === this.employeeAddValue);
          if(!employeeSelect) return false
          this.loadingBtn = true;
          this.loading = true;
          //TODO: Mok
          setTimeout(()=>{
            if(this.dateValue === '2022-10') {
              const department  = this.testDataMok.find(it => it.id === employeeSelect.item.parentId) || null;
              if(department) {
                department.employee.unshift({
                  ...employeeSelect.item,
                  result:  headerDays().map((day) => {
                    if([6].includes(day)) {
                      return {
                        day: day,
                        value: 7,
                        color: `#EB5757`,
                        icon: null
                      }
                    }else{
                      return {
                        day: day,
                        value: this.isWeek(day),
                        color: `#686B72`,
                        icon: null
                      }
                    }

                  }),
                  plan: []
                },)
                // console.log('addPlan',emp.plan);
              }
            }else{
              this.tableResult[0].employee.unshift({
                ...employeeSelect.item,
                result:  headerDays().map((day) => {
                  if([6].includes(day)) {
                    return {
                      day: day,
                      value: 7,
                      color: `#EB5757`,
                      icon: null
                    }
                  }else{
                    return {
                      day: day,
                      value: this.isWeek(day),
                      color: `#686B72`,
                      icon: null
                    }
                  }

                }),
                plan: []
              },)
            }
            this.loadingBtn = false;
            this.loading = false;
            this.handleClose();
          },500)
          break
        case 'plan':
          console.log('plan',this.modal.data);
          //TODO: Mok
          const projectSelect = this.projectSelectsFilters.find(it => it.value === this.planAddValue);
          if(!projectSelect && !this.modal.data) return false
          this.loadingBtn = true;
          this.loading = true;
          if(this.dateValue === '2022-10') {
            setTimeout(()=>{
              console.log('testDataMok',this.modal.data.parentId);
              const department  = this.testDataMok.find(it => it.id === this.modal.data.parentId) || null;
              if(department) {

                const project = department.employee.find(it => it.id === this.modal.data.id);

                project.plan.unshift({
                  ...projectSelect.item,
                  parentId: this.modal.data.id,
                  result: []
                });
                // console.log('project',project);
              }
              this.loadingBtn = false;
              this.loading = false;

              this.handleClose();
            },500)
          }else{

            const project = this.tableResult[0].employee.find(it => it.id === this.modal.data.id);

            project.plan.unshift({
              ...projectSelect.item,
              parentId: this.modal.data.id,
              result: []
            });

            this.tableResult = this.testDataMok1;

            this.loadingBtn = false;
            this.loading = false;
            this.handleClose();
          }


          break
      }
    },

    handlePlanAdd(e) {
      this.dialogVisible = true
      this.modal.title = 'Добавить план';
      this.modal.desc = 'На другой день он проснулся поздно. Возобновляя впечатления прошедшего...';
      this.modal.type = 'plan';
      this.modal.data = e;
      console.log('handlePlanAdd',e);
      console.log('modal',this.modal);
    },

    handleAddPlan(data) {
      console.log(data);
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

          // const employeeSelect = this.employeeSelects.find(it => it.value === id);
          // this.testDataMok.forEach(item => {
          //   if(item.id === employeeSelect.item.parentId) {
          //     const it = item.employee.filter(it => it.id === id)
          //     employee.push({
          //       ...item,
          //       employee: it
          //     })
          //   }
          // })
          // this.tableResult = employee;



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


      // setTimeout(() => {
      //   if(id) {
      //     const projectSelect = this.projectSelects.filter(it => it.value === id).map(it => it.item.parentId);
      //     this.testDataMok.forEach((item,index) => {
      //       item.employee.forEach((it,ind) => {
      //         if(projectSelect.includes(it.id)) {
      //           project.push({
      //             ...item,
      //             employee: [
      //               {
      //                 ...it,
      //                 plan: it.plan.filter(its => its.id === id)
      //               }
      //             ]
      //           })
      //         }
      //       })
      //     })
      //     this.tableResult = project;
      //   }else{
      //     this.tableResult = this.testDataMok;
      //   }
      //   this.loading = false
      // },500)
    },

    // Добавить/редактировать часы;
    handleCellAdd(e) {
      const row = e.row;
      const addPlan = [];
      const v = e.value;


      if(this.isNumeric(v)) {

        this.testDataMok.forEach((item)=>{
          if(item.id === row.departmentId) {
            const employee = item.employee.find((its) => its.id === row.parentId);
            employee.plan.find((plan) => {
              if(plan.id === row.id) {
                const editValue = plan.result.find((d)=> d.day === e.day) || null;
                // Если есть редактироуем;
                if(editValue) {
                  //debugger
                  editValue.value = e.value;
                }else{
                  plan.result.push({
                    day: +e.day,
                    value: e.value,
                    color: null,
                    icon: null
                  })
                }
                return plan;
              }
            });

          }
          addPlan.push(item)
        })
        this.tableResult = addPlan
      }
    },

    isNumeric(value) {
      return value
     // return /^(0|[1-9]\d*)$/.test(value);
    },
    handleMultiCellAdd(e) {
      console.log('handleMultiCellAdd',e.row);
    },

    // TODO расчет выходной недели;
    isWeek(cDay) {
      const week = moment(this.dateValue || currentDate,"YYYY-MM").date(cDay).weekday();
      return [0,6].includes(week) ? 0 : 8;
    },

  },
  created() {
    //TODO текущие месяц;
   /// const currentDate = moment().format('YYYY-MM')
    this.dateValue = currentDate

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
  .el-icon-arrow-right:before {
    font-weight: bold;
    font-size: 1em;
    cursor: pointer;
  }
  .el-icon-arrow-left:before {
    font-weight: bold;
    font-size: 1em;
    cursor: pointer;
  }
}

/* календар  */
.mount__com {
  font-family: 'Gilroy';
  border: none;
  :deep(.vc-weeks) {
    display: none;
  }
  :deep(.vc-arrow) {
    &:hover {
      background: transparent;
    }
  }
  :deep(.vc-pane) {
    min-width: 200px;
  }
  :deep(.vc-arrows-container) {
    .vc-arrow {
      @include ease();
      opacity: 0.9;
      svg path {
        fill: #000;
      }
      &:hover {
        opacity: 0.4;
        background: transparent;
      }
    }

  }
  :deep(.vc-title) {
    text-transform: capitalize;
  }

}
</style>
