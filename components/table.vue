<template>
  <div :class="CSS_PREFIX" v-clickoutside="handleclickoutside" @paste="doPaste">
    <div :class="`${CSS_PREFIX}-main`">
      <canvas
        :id="`${CSS_PREFIX}-target`"
        :class="`${CSS_PREFIX}-table`"
      ></canvas>

      <div
        :class="`${CSS_PREFIX}-overlayer`"
        :style="{ top: `${tableHeaderHeight +1 }px` }"
        v-loading="loading"
      >
        <div :class="`${CSS_PREFIX}-editor`" ref="editor" :style="editorSty">
          <div
            ref="text"
            contenteditable="true"
            v-show="isSimple"
            @input="inputHandler"
            @keydown.tab.prevent
            @keydown.enter="handleEnter"
            @keydown.esc.prevent
          ></div>
          <div class="popover"
               v-if="dataType === 'test'"
               :class="`${CSS_PREFIX}-popup`"
               :style="popupSty"
          >
            <pre>{{value}}</pre>
<!--            <div class="click"> Cell {{value}}</div>-->
          </div>
          <div class="children_table"
               v-if="dataType === 'children'"
               :class="`${CSS_PREFIX}-popup`"
               :style="popupSty"
          >
            {{value.field}}

          </div>
          <el-date-picker
            ref="month"
            v-if="dataType === 'month'"
            :class="`${CSS_PREFIX}-popup`"
            :style="popupSty"
            v-model="value"
            :editable="false"
            type="month"
            size="medium"
            placeholder="Month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            @change="selectChange"
          >
          </el-date-picker>
          <el-date-picker
            ref="date"
            v-else-if="dataType === 'date'"
            :class="`${CSS_PREFIX}-popup`"
            :style="popupSty"
            v-model="value"
            :editable="false"
            type="date"
            size="medium"
            placeholder="Date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="selectChange"
          >
          </el-date-picker>
          <el-date-picker
            ref="datetime"
            v-else-if="dataType === 'datetime'"
            :class="`${CSS_PREFIX}-popup`"
            :style="popupSty"
            v-model="value"
            :editable="false"
            type="datetime"
            size="medium"
            placeholder="Datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            @change="selectChange"
          >
          </el-date-picker>
          <el-select
            ref="select"
            v-else-if="dataType === 'select'"
            :class="`${CSS_PREFIX}-popup`"
            :style="popupSty"
            v-model="value"
            clearable
            filterable
            size="medium"
            :automatic-dropdown="true"
            @change="selectChange"
          >
            <el-option
              v-for="item in selectOptions"
              :value="item.value"
              :label="item.label"
              :key="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { CSS_PREFIX, HEADER_HEIGHT } from "../core/constants";
import { getMaxRow } from '../core/util'
import DataGrid from "../core/DataGrid";
import Clickoutside from '../utils/clickoutside'

const SIMPLE_DATE_TYPES = ["text", "number", "phone", "email"];
const COMPLEX_DATE_TYPES = ["month", "date", "datetime", "select", "test", "children"];

export default {
  name: "DDataGrid",
  props: {
    rowKey: {
      type: String,
      default: 'id'
    },
    fixedLeft: {
      type: Number,
      default: 0
    },
    fixedRight: {
      type: Number,
      default: 0
    },
    width: Number,
    height: Number,
    showCheckbox: Boolean,
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  directives: {
    Clickoutside
  },
  data() {
    return {
      CSS_PREFIX,
      loading: false,
      show: false,
      dataType: "text",
      popWidth: "auto",
      isEditing: false,
      isPaste: false,
      value: "",
      editorSty: {
        borderColor: "rgb(82,146,247)"
      },
      focusCell: null,
      cascader_value: [],
      selectOptions: []
    };
  },
  watch: {
    columns(val) {
      this.grid.loadColumns(val)
      this.grid.loadData(this.data);
    },
    data(val) {
      this.grid.loadColumns(this.columns)
      this.grid.loadData(val);
      this.loading = false;
    }
  },
  computed: {
    tableHeaderHeight() {
      const maxHeaderRow = getMaxRow(this.columns)
      return HEADER_HEIGHT * maxHeaderRow
    },

    popupSty() {
      return {
        width: this.popWidth,
        top: "-1px"
      };
    },
    //TODO: mod;
    popupStyContent() {
      return {
        width: 'auto',
        top: "-1px"
      };
    },

    isSimple() {
      return SIMPLE_DATE_TYPES.includes(this.dataType);
    }
  },
  methods: {

    handleEnter(e) {
      // CTRL+ENTER换行
      if (e.metaKey || e.ctrlKey) {
        const createEl = (mark) => {
          return document.createElement(mark)
        }
        const el = this.$refs.text
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)
        const anchorNode = selection.anchorNode
        const anchorParentNode = anchorNode.parentNode
        //获取当前光标位置
        const startOffset = range.startOffset
        const endOffset = range.endOffset
        //div当前内容
        const content = el.innerText
        let find = false
        let beforeNodes = []
        let afterNodes = []
        let insertNode = createEl('div')
        el.childNodes.forEach(node => {
          // 文本节点
          if (node.nodeType === 3) {
            const startStr = node.textContent.slice(0, startOffset)
            const endStr = node.textContent.slice(endOffset)
            let befforeElBox = createEl('div')
            if (!startStr) {
              befforeElBox.appendChild(createEl('br'))
            } else {
              befforeElBox.appendChild(document.createTextNode(startStr))
            }
            beforeNodes.push(befforeElBox)
            if (!endStr) {
              insertNode.appendChild(createEl('br'))
            } else {
              insertNode.appendChild(document.createTextNode(endStr))
            }
          } else {
            if(!find) {
              if (node === anchorParentNode) {
                const startStr = node.textContent.slice(0, startOffset)
                const endStr = node.textContent.slice(endOffset)
                let befforeElBox = createEl('div')
                if (!startStr) {
                  befforeElBox.appendChild(createEl('br'))
                } else {
                  befforeElBox.appendChild(document.createTextNode(startStr))
                }
                beforeNodes.push(befforeElBox)
                if (!endStr) {
                  insertNode.appendChild(document.createElement('br'))
                } else {
                  insertNode.appendChild(document.createTextNode(endStr))
                }
                find = true
              } else {
                beforeNodes.push(node)
              }
            } else {
              afterNodes.push(node)
            }
          }
        })
        el.innerHTML = ''
        beforeNodes.forEach(item => {
          el.appendChild(item)
        })
        el.appendChild(insertNode)
        afterNodes.forEach(item => {
          el.appendChild(item)
        })
        const newRange = document.createRange()
        // 光标对象的范围界定为新建的节点
        // newRange.selectNodeContents(insertNode)
        newRange.setStartBefore(insertNode)
        // newRange.setEndAfter(insertNode)
        // 使光标开始和光标结束重叠
        newRange.collapse(true)
        selection.removeAllRanges()
        // 插入新的光标对象
        selection.addRange(newRange)

        this.grid.setTempData(el.innerText) // 手动换行不会触发input事件，需要手动处理
        return
      }
      e.preventDefault()
    },

    reload() {
      return this.grid.resize()
    },

    getData() {

      return this.grid.getData();
    },

    getCheckedRows() {
      return this.grid.getCheckedRows();
    },

    getChangedRows() {
      return this.grid.getChangedRows();
    },

    validate(callback) {
      return this.grid.validate(callback);
    },

    validateChanged(callback) {
      return this.grid.validateChanged(callback);
    },

    validateField(ci, ri) {
      return this.grid.validateField(ci, ri);
    },

    getValidations() {
      return this.grid.getValidations();
    },

    setValidations(errors) {
      return this.grid.setValidations(errors);
    },
    clearValidations() {
      return this.grid.clearValidations();
    },
    updateData(data) {
      return this.grid.updateData(data);
    },
    setFullScreen() {
      this.grid.resize();
    },

    editCell() {
      const {
        dataType,
        options,
        value
      } = this.focusCell
      this.show = true;
      this.dataType = dataType;
      if (![...SIMPLE_DATE_TYPES, ...COMPLEX_DATE_TYPES].includes(dataType)) {
        this.dataType = 'text';
      }
      this.selectOptions = options;
      this.$refs.text.innerHTML = value;
      this.grid.setTempData(value)


      if (['month','date','datetime'].includes(this.dataType)) {
        if (isNaN(value) && !isNaN(Date.parse(value))) {
          this.value = value;
        } else {
          this.value = "";
        }
      } else {
        this.value = value;
      }
      this.showEditor();
      this.$nextTick(() => {
        this.focus();
      });
    },

    selectCell(cell) {
      this.focusCell = cell
      this.clearEditor()
      this.hideEditor();
      this.$nextTick(() => {
        this.focus('text');
      });
    },

    showEditor() {
      const {
        x,
        y,
        width,
        height
      } = this.focusCell
      console.log('showEditor',this.focusCell);
      this.isEditing = true
      this.$refs.editor.style.left = `${x - 1}px`;
      this.$refs.editor.style.top = `${y - 2 - this.tableHeaderHeight}px`;
      this.$refs.text.style["min-width"] = `${width - 1}px`;
      this.$refs.text.style["min-height"] = `${height - 1}px`;
      this.popWidth = `${width - 1}px`;


      // if (COMPLEX_DATE_TYPES.includes(this.dataType)) {
      //   // Раскрывающийся список, высота элемента управления датой выше, чем поле ввода
      //   this.$refs.editor.style.height = "38px";
      // }

      console.log('showEditor', this.focusCell);
    },

    hideEditor() {
      this.isEditing = false
      this.$refs.editor.style.left = "-10000px";
      this.$refs.editor.style.top = "-10000px";
      this.show = false;
      this.dataType = "text";
    },

    clearEditor() {
      this.$refs.text.innerHTML = ''
    },

    focus(type) {
      console.log('type',type);
      let _type = type || this.dataType;
      if (this.isSimple) {
        _type = "text";
      }
      const el = this.$refs[_type];

      if (el && typeof el.focus === "function" ) {
        if (COMPLEX_DATE_TYPES.includes(_type)) {
          el.focus();
        } else {
          if (window.getSelection) {
            // ie11 10 9 ff safari
            el.focus(); // 解决ff不获取焦点无法定位问题
            if (!el.childNodes.length) return
            const selection = window.getSelection(); // 创建selection
            // selection.selectAllChildren(el); // 清除选区并选择指定节点的所有子节点
            // selection.collapseToEnd(); // 光标移至最后

            const newRange = document.createRange()
            // 光标对象的范围界定为新建的节点
            // newRange.selectNodeContents(el)
            newRange.setStart(el.childNodes[el.childNodes.length - 1], el.innerText.length)
            // newRange.setEndAfter(insertNode)
            // 使光标开始和光标结束重叠
            newRange.collapse(true)
            selection.removeAllRanges()
            // 插入新的光标对象
            selection.addRange(newRange)
          } else if (document.selection) {
            // ie10以下
            const range = document.selection.createRange();
            // var range = document.body.createTextRange();
            range.moveToElementText(el);
            range.collapse(false);
            range.select();
          }
        }
      }
    },

    doPaste() {
      // 粘贴事件标识
      this.isPaste = true
    },

    inputHandler(e) {
      /**
       * 复制粘贴的基本原理：直接监听可编辑元素（这里是contenteditable=true的div）的
       * input事件，按下CTRL+V会先触发paste事件，接着会触发input事件，在paste事件中
       * 定义一个标识，这样在input事件就可以区分内容是通过粘贴来的还是手动输入的
       */
      const val = e.target.innerText;
      if (!this.isPaste) {
        this.showEditor()
        this.grid.setTempData(val)
      } else if (!this.isEditing) {
        this.isPaste = false

        let textArr = [];
        let arr = val.split("\r");
        if (arr.length === 1) {
          let _arr = arr[0].split("\n");
          textArr = _arr.map(item => item.split("\t"));
        } else {
          textArr = arr.map(item => item.split("\t"));
        }

        this.grid.pasteData(textArr)
        this.clearEditor()
      } else {
        this.isPaste = false
        this.grid.setTempData(val)
      }
    },

    selectChange(val) {
      this.grid.setTempData(val)
    },

    handleclickoutside() {
      console.log('handleclickoutside')
      this.grid.doneEdit()
    }
  },

  created() {
    this.loading = this.data.length <= 0;
    this.$nextTick(() => {
      const self = this;
      let el = document.getElementById(`${CSS_PREFIX}-target`);

      this.grid = new DataGrid(el, {
        rowKey: this.rowKey,
        width: this.width,
        height: this.height,
        fixedLeft: this.fixedLeft,
        fixedRight: this.fixedRight,
        columns: this.columns,
        data: this.data,
        showCheckbox: this.showCheckbox,
        beforeSelectCell: () => {},
        afterSelectCell: (cell) => {
          self.selectCell(cell)
        },
        beforeMultiSelectCell: () => {},
        afterMultiSelectCell: () => {},
        beforeEditCell: () => {
          self.editCell();
        },
        afterEditCell: (data) => {
          self.$emit('after-edit-cell', data)
        },
        afterAutofill: (data) => {
          self.$emit('after-autofill', data)
        },
        afterPaste: (data) => {
          self.$emit('after-paste', data)
        },
        afterClear: (data) => {
          self.$emit('after-clear', data)
        },
        onLoad: () => {
          // 推入事件队列中延迟执行
          setTimeout(() => {
            self.$emit('on-load')
          }, 0)
        }
      });

    });
  },

  destroyed() {
    this.grid.events.destroy()
  }
};
</script>
<style lang="scss" scoped>
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
    .#{$css-prefix}-editor {
      position: absolute;
      top: -10000px;
      left: -10000px;
      text-align: left;
      line-height: 0;
      z-index: 100;
      overflow: hidden;
      background-color: #fff;
      border: 2px solid rgb(82,146,247);
      box-sizing: border-box;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 6px 16px;
      pointer-events: auto;

      div[contenteditable="true"] {
        box-sizing: border-box;
        // border: 2px solid #4b89ff;
        // padding: 5px;
        padding: 8px;
        outline: none;
        // resize: none;
        // text-align: start;
        // overflow-y: hidden;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: inherit;
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
        line-height: 18px;
        margin: 0;
        background: #fff;
        cursor: text;
      }
    }
    .#{$css-prefix}-popup {
      input[type="text"] {
        border: none;
        outline: none;
        border-radius: 0;
      }
    }
    .#{$css-prefix}-fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      min-height: 100vh;
      background: #fff;
      z-index: 9999;
      overflow: hidden;
    }
    .#{$css-prefix}-loading {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      min-height: 100vh;
      background: #fff;
      z-index: 9998;
      overflow: hidden;
    }
    .#{$css-prefix}-loading-dot {
      display: block;
      margin: 0 auto;
      background: #0bb27a;
      border-radius: 50%;
      animation: spin-dot 1s ease-in-out infinite;
      width: 20px;
      height: 20px;
    }
    @keyframes spin-dot {
      0% {
        transform: scale(0);
        opacity: 1;
      }

      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
  .popover {
    min-height: 100px;
    background: #fff;
    padding: 20px;
    line-height: normal;
  }
  .children_table {
    background: #fff;
    padding: 10px;
    line-height: normal;
    .content {
      position: absolute;
      border: 1px solid red;
    }
  }

</style>
