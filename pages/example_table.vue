<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main>
     <h2>TABLE CANVAS GRID TEST https://github.com/jakever/canvas-spreadsheet/blob/master/src/App.vue</h2>

      <div style="padding: 12px 0;">
        <el-button size="small" @click="getData">Get data</el-button>
        <el-button size="small" @click="updateData">Update row data</el-button>
        <el-button size="small" @click="getCheckedRows">Get selected row data</el-button>
        <el-button size="small" @click="getChangedRows"
        >Get changed row data</el-button
        >
        <el-button size="small" @click="getValidations"
        >Get the verification result</el-button
        >
        <el-button size="small" @click="setValidations"
        >Set the verification result</el-button
        >
        <el-button size="small" @click="clearValidations"
        >Clear verification results</el-button
        >
        <el-button size="small" @click="setFullScreen">
          {{ !isFullscreen ? "fullscreen" : "exit fullscreen" }}
        </el-button>
      </div>

      <DataGrid
        ref="datagrid"
        :columns="columns"
        :data="gridData"
        @after-edit-cell="afterEditCell"
        @after-autofill="afterAutofill"
        @after-paste="afterPaste"
        @after-clear="afterClear"
      ></DataGrid>

    </el-main>
  </el-container>
</template>
<script>
import DataGrid from "../components/table.vue";
export default {
  components: { DataGrid },
  data() {
    return {
      isFullscreen: false,
      gridData: [],
      columns: []
    };
  },
  // https://github.com/jakever/canvas-spreadsheet/blob/master/src/App.vue
  methods: {
    setFullScreen() {
      let el = document.getElementById("__nuxt");

      if (!this.isFullscreen) {
        this.isFullscreen = true;
        el.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          min-height: 100vh;
          background: #fff;
          z-index: 2000;
          overflow: hidden;
        `;
      } else {
        this.isFullscreen = false;
        el.style.cssText = `
          position: relative;
        `;
      }
      this.$refs.datagrid.setFullScreen();
    },
    getData() {
      const data = this.$refs.datagrid.getData();
      console.log(data);
     // alert("获取成功，请查看控制台");
    },
    updateData() {
      const data = [
        {
          id: 1,
          'emp_name': '数据111',
          'emp_no': '数据222'
        },
        {
          id: 3,
          'job_name': '数据333',
          'emp_no': '数据444'
        }
      ]
      this.$refs.datagrid.updateData(data);
    },

    afterEditCell(data) {
      console.log(data)
    },
    afterAutofill(data) {
      console.log(data)
    },
    afterPaste(data) {
      console.log(data)
    },
    afterClear(data) {
      console.log(data)
    },
    getCheckedRows() {
      const data = this.$refs.datagrid.getCheckedRows();
      console.log(data);
      //alert("获取成功，请查看控制台");
    },
    getChangedRows() {
      const data = this.$refs.datagrid.getChangedRows();
      console.log(data);
      //alert("获取成功，请查看控制台");
    },
    getValidations() {
      const data = this.$refs.datagrid.getValidations();
      console.log(data);
     // alert("获取成功，请查看控制台");
    },
    setValidations() {
      const errors = [
        {
          id: 1,
          'emp_name': '错误111',
          'emp_no': '错误222'
        },
        {
          id: 3,
          'job_name': '错误333',
          'emp_no': '错误444'
        }
      ]
      this.$refs.datagrid.setValidations(errors);
    },
    clearValidations() {
      this.$refs.datagrid.clearValidations();
    }
  },
  created() {
    const columns = [
      {
        title: "Родитель",
        children: [
          {
            title: "Имя Строка",
            key: "dep_name",
          },
          {
            title: "Block",
            key: 'address',
            children: [
              {
                title: "Address",
                key: "address",
              },
              {
                title: "City",
                key: "city",
              },
              {
                title: "Region",
                key: "region",
              }
            ]
          }
        ]
      },
      // TODO: groups;
      {
        title: "Столбец",
        key: "emp_no",
        type: 'children'
      },
      {
        title: "Test",
        key: "dep_name",
        size: "small",
        align: "left",
        readonly: true,
      },
      {
        title: "Job name",
        key: "job_name",
        size: "small",
        align: "left",
        rule: {
          required: true,
          validator: function(value, row, callback) {
            if (value.length > 10) {
              callback('Jib,rf！')
            } else if (value.length < 1) {
              callback('callback！')
            } else {
              callback()
            }
          },
          immediate: false
        }
      },
      {
        title: "Номер",
        key: "phone",
        type: "phone",
        readonly: false
      },

    ]
    // this.$nextTick(() => {
    let el = document.getElementById("data-grid-demo");
    let data = [];
    for (let i = 0; i < 10; i += 1) {
      data.push({
        id: i,
        address: "Title 1",
        city: "Title 2",
        region: `region` + i,
        emp_no: {
          field: '123',
          rowSpan: 2,
          colSpan: 2,
          children: [
            {
              field: 'children 1'
            },
            {
              field: 'children 2'
            },
            {
              field: 'children 3'
            }
          ]
        },
        dep_name: i === 4 ? null : `dep name ${i}`,
        job_name: i === 5 ? "job name" : `job name number ${i}`,
        phone: 13159645561,
        hobby: "水果/苹果",
      });
    }
    this.columns = columns;
    // setTimeout(() => {
        this.gridData = data;
    //}, 2000)
    // const Grid = new DataGrid(el, {
    //   // width: 1264,
    //   // height: 400,
    //   fixedLeft: 1,
    //   fixedRight: 2,
    //   columns: this.columns,
    //   data
    // });
    // });
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
</style>
