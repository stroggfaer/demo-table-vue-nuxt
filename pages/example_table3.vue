<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main>
     <h2>TABLE CANVAS GRID ELEMENT</h2>
      <canvas-table
        :border="true"
        :data="data"
        :columns="columns"
        :max-height="600"
        :row-height="52"
        @query-change="queryChange"
        @row-click="rowClick"
        @cell-click="cellClick"
      >
<!--        <template slot="age_body" slot-scope="{ row, col, index }">-->
<!--          <test-input v-if="toggleIndex === index"-->
<!--                      :row=row-->
<!--                      :index=index-->
<!--                      :col="col"-->
<!--                      :value=row[col.key]-->
<!--                      :key=index-->
<!--                      @on-value="(v)=>row[col.key] = v"-->
<!--          ></test-input>-->
<!--          <span v-else >{{row[col.key]}}</span>-->
<!--&lt;!&ndash;          <el-select v-model="value" placeholder="Поиск">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-option&ndash;&gt;-->
<!--&lt;!&ndash;              v-for="item in options"&ndash;&gt;-->
<!--&lt;!&ndash;              :key="item.value"&ndash;&gt;-->
<!--&lt;!&ndash;              :label="item.label"&ndash;&gt;-->
<!--&lt;!&ndash;              :value="item.value">&ndash;&gt;-->
<!--&lt;!&ndash;            </el-option>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-select>&ndash;&gt;-->
<!--        </template>-->
      </canvas-table>

    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>
<script>
//import * as cGridAll from "vue-cheetah-grid";
import CanvasTable from "kt-canvas-table"
import TestInput from "/components/test-input"

function generatePersons(val) {
  let obj = [];
  for (let i = 0; i < val; i++) {
    obj.push({
      profit: `10${i}%`,
      volume: 100 + i,
      age: 32 + i,
      date: `2012-09-${i}}`
    })
  }
  return obj;
}
// 1000
// 1000000
const records = generatePersons(1000); // 1 000 000

const customComponent = {
  functional: true,
  props: ['row', 'col', 'index'],
  render (h, self) {
    const { row, col, index } = self.props
    return (
      // <el-input value={row[col.key]}></el-input>

      <test-input value={row[col.key]}></test-input>
    )
  }
}

export default {
  components: { CanvasTable, TestInput },
  data() {
    var $this = this;
    return {
      columns: [
        {
          label: "Столбец 1",
          key: "$$index",
          type: "index",
          fixed: "left",
          align: "center",
          colResize: true,
          width: 100,
        },

        {
          label: "Столбец 2",
          key: "profit",
          minWidth: 90,
          sortable: true,
        },
        {
          label: "Столбец 3",
          key: "volume",
          minWidth: 140,
        },
        {
          label: "Столбец 4",
          key: "age",
          minWidth: 140,
          // customRender: {
          //   functional: true,
          //   props: ['row', 'col', 'index'],
          //   render (h, self) {
          //     const { row, col, index } = self.props
          //     return $this.toggleIndex === index? <test-input row={row} col={col} index={index} value={row[col.key]} key={index}></test-input> : <span>{row[col.key]}</span>
          //   }
          // },
          // customRender: (h, { row, col, index }) => {
          //   return (
          //     $this.toggleIndex === index ?
          //       <test-input row={row} col={col} index={index} value={row[col.key]} key={index}></test-input>
          //       : <span>{row[col.key]}</span>
          //   )
          // }
          customRender: true
        },
      ],
      data: records,
      toggleIndex: null,
      // data: Array(1000).fill(
      //   {
      //     profit: "100%",
      //     volume: 100,
      //     age: 32,
      //   },
      // ),



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
    queryChange(key, val, queryValue) {
      console.log(key, val, queryValue)
    },
    rowClick(row, index) {
      console.log('rowClick',row, index)
    },
    cellClick(row) {
      if(row.col.key === 'age') {
        this.toggleIndex = row.index;
        console.log('cellClick',row.col)
      }else{
        this.toggleIndex = null
      }


    }
  },
  created() {

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
</style>
