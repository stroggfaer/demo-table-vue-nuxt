<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main>
     <h2>TABLE CANVAS Cheetah GRID js https://github.com/future-architect/cheetah-grid</h2>
<!--      <div class="sample-layout table_canvas"></div>-->


      <VueCanvasTable :config="options" @click="onClcik" />



    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>
<script>
//import * as cGridAll from "vue-cheetah-grid";




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
import VueCanvasTable from 'vue-canvas-table'

export default {

  components:{
    VueCanvasTable
  },
  data() {
    return {
      options:{
        source: { // 数据源
          columns: ['234'],
          datas: [

          ]
        },
        width: 0, // canvas宽度
        height: 0, // canvas高度
        cellMaxWidth: 0, // 最大单元格宽度，默认屏幕1/3
        paddingLR: 22, // 左右内间距
        paddingTB: 22, // 上下内间距
        lineHeight: 8,    // 多行文字行高
        fontSize: 16, // 字体大小
        fontColor: '#333333', // 字体颜色
        fontFamily: 'Microsoft YaHei',    // 字体
        sliderColor: 'rgba(0, 0, 0,.3)',  // 滑块颜色
        lineColor: '#ededed', // 表格分割线颜色
        lockRows: 1, // 锁定1行
        lockColumns: 1, // 锁定1列
        to2DArr(source) { // 把source转换成二维数组
          let arr = []
          arr.push(source.columns)
          source.datas.forEach(row => {
            arr.push(row.columns)
          })
          return arr
        },
        index2Data(row, col) { // 行列索引转换成与source对应的数据
          if (row === 0) {
            return {
              row,
              col,
              rowData: this.source.columns,
              colData: this.source.columns[col]
            }
          } else {
            return {
              row,
              col,
              rowData: this.source.datas[row - 1],
              colData: this.source.datas[row - 1].columns[col]
            }
          }
        },
        setCellOpts(row, col, data) { // 设置单元格参数
          if (row === 0) {
            return {
              color: '#F8F8F8'
            }
          } else {
            if (data.rowData.clickAble === false) {
              return {
                color: '#F8F8F8'
              }
            } else {
              return {
                arrow: true,
                color: '#FFFFFF'
              }
            }
          }
        }
      }
    };
  },

  methods: {
    onClcik(data){

    },
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
  mounted() {}
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
