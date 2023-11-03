<template>
  <el-container class="wrap">
    <el-aside width="70px">
      <div class="logo">DEMO</div>
      <div class="bg"></div>
    </el-aside>
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-page-header class="header-top" title="" content="Общий план ресурсов ДЕМО CANVAS" @back="()=>$router.push('/')"></el-page-header>
        <div class="filters">
           <div class="icon-f">
             <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M26.25 7.5H3.75" stroke="#373737" stroke-width="3" stroke-linecap="round"/>
               <path d="M26.25 15H3.75" stroke="#373737" stroke-width="3" stroke-linecap="round"/>
               <path d="M15 22.5H3.75" stroke="#373737" stroke-width="3" stroke-linecap="round"/>
             </svg>
           </div>
          <el-select class="select-filter" v-model="worksValue" @change="handleWorks" clearable placeholder="По виду работ">
            <el-option
              v-for="item in worksSelects"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="select-filter" v-model="employeeValue" @change="handleEmployee" clearable placeholder="По сотруднику">
            <el-option
              v-for="item in employeeSelects"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="select-filter" v-model="projectValue" @change="handleProject" clearable placeholder="По проекту">
            <el-option
              v-for="item in projectSelectsFilters"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="filter_date"><i class="el-icon-arrow-left"></i> <div class="date">Сентябрь 2022</div> <i class="el-icon-arrow-right"></i></div>
        </div>
        <app-table-canvas
          class="plan-table"
          :loading="loading"
          :data-grid="tableResult"
          @on-employee-add="handleEmployeeAdd"
          @on-plan-add="handlePlanAdd"
          @on-cell-value="handleCellAdd"
          @on-multi-cell-value="handleMultiCellAdd"
          @on-add-plan="handleAddPlan"
          :date-current="dateT"
          :shortened-day="{
            days: [6],
            popTitle: 'Сокращенный день <br> 7 часов',
          }"
        ></app-table-canvas>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import AppTableCanvas from "../../components/table-canvas/app-table-canvas";
import {headerDays} from "../../core_table/utils";


export default {
  components: { AppTableCanvas },

  data() {
    return {
      loading: false,
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
              result:  headerDays().map((item,ind) => {
                if([5,8,10].includes(item)) {
                  return {
                    day: item,
                    value: 8,
                    color: `#EB5757`,
                    icon: null
                  }
                }else if([11,12,13].includes(item)) {
                  return {
                    day: item,
                    value:null,
                    color: null,
                    icon: 'close',
                    popTitle: 'Отгул'
                  }
                } else if([14,15,16].includes(item)) {
                  return {
                    day: item,
                    value:null,
                    color: null,
                    icon: 'box',
                    popTitle: 'Больничный'
                  }
                } else if([17,18,19,20,21,22,23,24,25].includes(item)) {
                  return {
                    day: item,
                    value:null,
                    color: null,
                    icon: 'sum',
                    popTitle: 'Отпуск'
                  }
                }else if([6].includes(item)){
                  return {
                    day: item,
                    value: 7,
                    color: `#686B72`,
                    icon: null
                  }
                }else{
                  return {
                    day: item,
                    value: 8,
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
                  result: [
                    {
                      day: 2,
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
              result:  headerDays().map((item,ind) => {
                if(item === 5) {
                  return {
                    day: item,
                    value: 6,
                    color: `#EB5757`,
                    icon: null
                  }
                }else if([6].includes(item)){
                  return {
                    day: item,
                    value: 7,
                    color: `#686B72`,
                    icon: null
                  }
                }else{
                  return {
                    day: item,
                    value: 8,
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
                  result: [

                  ]
                },
              ]
            },
            {
              name: 'Фамилия 1011',
              open: true,
              id: 1011,
              parentId: 1001,
              result:  headerDays().map((item,ind) => {
                if([4,5,6,7,8].includes(item)) {
                  return {
                    day: item,
                    value: 4,
                    color: `#EB5757`,
                    icon: null
                  }
                }else if([6].includes(item)){
                  return {
                    day: item,
                    value: 7,
                    color: `#686B72`,
                    icon: null
                  }
                }else{
                  return {
                    day: item,
                    value: 8,
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
              result:  headerDays().map((item,ind) => {
                if([4,5,6,7,8].includes(item)) {
                  return {
                    day: item,
                    value: 4,
                    color: `#EB5757`,
                    icon: null
                  }
                }else{
                  return {
                    day: item,
                    value: 8,
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
              result:  headerDays().map((item,ind) => {
                if([4,5,6,7,8].includes(item)) {
                  return {
                    day: item,
                    value: 0,
                    color: `#EB5757`,
                    icon: null
                  }
                }else{
                  return {
                    day: item,
                    value: 8,
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
                  result: []
                },
                {
                  id: 14,
                  name: 'Проект 3',
                  sort: 1,
                  parentId: 1007,
                  color: '#6523c9',
                  result: []
                },
                {
                  id: 15,
                  name: 'Проект 4',
                  sort: 1,
                  parentId: 1007,
                  color: '#c92395',
                  result: []
                },
                {
                  id: 16,
                  name: 'Проект 16 1',
                  sort: 1,
                  parentId: 1007,
                  color: '#c5da0f',
                  result: []
                }
              ]
            }
          ]
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

      worksValue: null,
      projectValue: null,
      employeeValue: null,

      dateT: '2023-11',
    }
  },
  computed: {},
  methods: {
    handleEmployeeAdd(e) {
      this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        //TODO: Mok
        setTimeout(()=>{
          const department  = this.testDataMok.find(it => it.id === 1001) || null;
          if(department) {
            department.employee.unshift({
              name: 'Иванов Сергей',
              open: true,
              id: 10045,
              parentId: 1001,
              result:  headerDays().map((item,ind) => {
                if([5,8,10].includes(item)) {
                  return {
                    day: item,
                    value: 0,
                    color: `#EB5757`,
                    icon: null
                  }
                }else if([11,12,13].includes(item)) {
                  return {
                    day: item,
                    value:null,
                    color: null,
                    icon: 'close'
                  }
                } else if([14,15,16].includes(item)) {
                  return {
                    day: item,
                    value:null,
                    color: null,
                    icon: 'box'
                  }
                } else if([17,18,19,20,21,22,23,24,25].includes(item)) {
                  return {
                    day: item,
                    value:null,
                    color: null,
                    icon: 'sum'
                  }
                }else{
                  return {
                    day: item,
                    value: 0,
                    color: `#686B72`,
                    icon: null
                  }
                }

              }),
              plan: []
            },)
            // console.log('addPlan',emp.plan);
          }
          this.loading = false;
        },500)
      }).catch(() => {});
    },

    handlePlanAdd(e) {
      this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {

        const department  = this.testDataMok.find(it => it.id === 1001) || null;
        if(department) {
          department.employee.unshift({
            name: 'Иванов Сергей',
            open: true,
            id: 10045,
            parentId: 1001,
            result:  headerDays().map((item,ind) => {
              if([5,8,10].includes(item)) {
                return {
                  day: item,
                  value: 0,
                  color: `#EB5757`,
                  icon: null
                }
              }else if([11,12,13].includes(item)) {
                return {
                  day: item,
                  value:null,
                  color: null,
                  icon: 'close'
                }
              } else if([14,15,16].includes(item)) {
                return {
                  day: item,
                  value:null,
                  color: null,
                  icon: 'box'
                }
              } else if([17,18,19,20,21,22,23,24,25].includes(item)) {
                return {
                  day: item,
                  value:null,
                  color: null,
                  icon: 'sum'
                }
              }else{
                return {
                  day: item,
                  value: 0,
                  color: `#686B72`,
                  icon: null
                }
              }

            }),
            plan: []
          },)
          // console.log('addPlan',emp.plan);
        }

      }).catch(() => {});
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
      this.worksValue = id ;

      setTimeout(()=>{
        if(id) {
          this.tableResult = this.testDataMok.filter(item => item.id === id);
        }else{
          this.tableResult = this.testDataMok;
        }
        this.employeeValue = null;
        this.projectValue = null;

        this.loading = false
      },500)
    },

    handleEmployee(id) {
      let employee = [];
      this.loading = true

      this.employeeValue = id;
      this.projectValue = null;
      this.worksValue = null;

      setTimeout(() => {
        if(id) {
          const employeeSelect = this.employeeSelects.find(it => it.value === id);
          this.testDataMok.forEach(item => {
            if(item.id === employeeSelect.item.parentId) {
              const it = item.employee.filter(it => it.id === id)
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
      this.employeeValue = null;
      this.worksValue = null;

      setTimeout(() => {
        if(id) {
          const projectSelect = this.projectSelects.filter(it => it.value === id).map(it => it.item.parentId);
          this.testDataMok.forEach((item,index) => {
            item.employee.forEach((it,ind) => {
              if(projectSelect.includes(it.id)) {
                project.push({
                  ...item,
                  employee: [
                    {
                      ...it,
                      plan: it.plan.filter(its => its.id === id)
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

    // Добавить/редактировать часы;
    handleCellAdd(e) {
      const row = e.row;
      const addPlan = [];
      const v = +e.value;


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
                    editValue.value = +e.value;
                  }else{
                    plan.result.push({
                      day: +e.day,
                      value: +e.value,
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
      return /^(0|[1-9]\d*)$/.test(value);
    },
    handleMultiCellAdd(e) {
      console.log('handleMultiCellAdd',e.row);
    }

  },
  created() {
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
    color: #fff;
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


</style>
