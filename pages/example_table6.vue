<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main>
     <h2>TABLE CANVAS Cheetah GRID js https://github.com/future-architect/cheetah-grid</h2>
      <div class="sample-layout table_canvas"></div>





    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>
<script>
//import * as cGridAll from "vue-cheetah-grid";


import {cheetahGrid} from "vue-cheetah-grid";

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
//  components: {   ...cGridAll, },
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

    const grid = new cheetahGrid.ListGrid({
      parentElement: document.querySelector(".sample-layout"),
      layout: {
        header: [
          // header line1
          [
            { caption: "ID", width: 100, rowSpan: 2 },
            { caption: "First Name", width: 200 },
            { caption: "Email", width: 250,},
            { caption: "Birthday", width: 200, rowSpan: 2 },
          ],
          // header line2
          [{ caption: "Last Name" }],
        ],
        body: [
          // line1
          [
            { field: "personid", rowSpan: 2 },
            { field: "fname" },
            { field: "email", rowSpan: 2 },
            { field: 234, rowSpan: 2 },
          ],
          // line2
          [{ field: "lname" }],
        ],
      },
      frozenColCount: 1,
    });
    grid.records = records;






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
