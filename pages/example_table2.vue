<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main>
     <h2>TABLE CANVAS Cheetah GRID https://github.com/future-architect/cheetah-grid</h2>


      <div class="table_canvas">
        <c-grid
          :data="records"
          :theme="userTheme"

          :default-row-height="30"
          ref="table"
        >
          <template slot="layout-header">
            <!-- header line1 -->
            <c-grid-layout-row>
              <c-grid-header width="100" rowspan="2">ID</c-grid-header>
              <c-grid-header
                min-width="150"
              >
                First Name
              </c-grid-header>
              <c-grid-header rowspan="2">Birthday</c-grid-header>
            </c-grid-layout-row>
            <!-- header line2 -->
            <c-grid-layout-row>
              <c-grid-header
                width="20%"
                min-width="150"
              >
                Last Name
              </c-grid-header>
            </c-grid-layout-row>
          </template>

          <template slot="layout-body">

            <!-- line1 -->
            <c-grid-layout-row >
              <c-grid-column field="id" rowspan="2"/>
              <c-grid-input-column
                field="fname"
              />

              <c-grid-column
                column-type="text"
                :column-style="{ bgColor: 'red' }"
                :field="getBirthday"
                rowspan="2"
                @click-cell="onClickCell($event, 'Last Name')"
              >
              </c-grid-column>
            </c-grid-layout-row>

            <!-- line2 -->
            <c-grid-layout-row>
              <c-grid-input-column
                field="lname"
              />
            </c-grid-layout-row>

          </template>

        </c-grid>

        <div class="popover" v-show="popover"
             :style="{'left': `${x}px`, 'top': `${y}px` }">
          popover
        </div>
        X+{{x}}+ Y+{{y}}++
      </div>

    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>
<script>
//import * as cGridAll from "vue-cheetah-grid";
import { mapGetters, mapActions } from 'vuex';
import {VIEW_PORT_HEIGHT, VIEW_PORT_WIDTH} from "../store";

function generatePersons(val) {
  var obj = [];
  for (var i = 0; i < val; i++) {
    obj.push({
      id: i,
      fname: 'Firstfname 1',
      lname: 'Last lname 2',
      email: 'Email',
      birthday: 'birthday',
      date: '2012-09-21',

    })
  }
  return obj;
}
const records = generatePersons(1000); // 1000000

export default {
  // components: {   ...cGridAll, },
  data() {
    return {
      records: records,
      x: 0,
      y: 0,
      popover: false,
      userTheme: {
        color: "#2c3e50",
        frozenRowsColor: "#2c3e50",
        frozenRowsBgColor: "#40b883",
        borderColor: "#35495e",
        frozenRowsBorderColor: "#35495e",
        checkbox: {
          checkBgColor: "#35495e",
          borderColor: "#35495e",
        },
        button: {
          color: "#FFF",
          bgColor: "#2c3e50",
        },
      },

      options: [{
        value: 'Option1',
        label: 'Option1'
      }, {
        value: 'Option2',
        label: 'Option2'
      }, {
        value: 'Option3',
        label: 'Option3'
      }, {
        value: 'Option4',
        label: 'Option4'
      }, {
        value: 'Option5',
        label: 'Option5'
      }],
      value: ''
    };
  },
  computed: {
    ...mapGetters({

      viewHeight: VIEW_PORT_HEIGHT,
      //competitor: GET_SETTINGS_COMPETITOR
      viewWidth: VIEW_PORT_WIDTH
    }),
  },
  methods: {
    getBirthday(rec) {
      //console.log(rec);
      return rec.birthday
    },
    onClickCell(row) {
       const e = row.event;
       this.popover = true;
       this.x = e.pageX
       this.y = e.pageY
       console.log('onClickCell',e);
    }
  },
  created() {

  },
  mounted() {
    setTimeout(()=>{
      const table = this.$refs.table
      console.log('table__',table);
    },500)

  }
}
</script>

<style lang="scss">
 .el-header, .el-main, .el-footer {
   border: 1px solid;
 }
 .el-main {
    min-height: 700px;
 }
 .table_canvas {
   height: calc(100vh - 100px);
   width: 100%;
   transition: opacity .1s;

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
 .popover {
   width: 200px;
   height: 200px;
   background: rebeccapurple;
   position: absolute;
 }
</style>
