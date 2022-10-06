import { CELL_HEIGHT } from "./constants.js";
import Row from "./Row.js";

class Body {
  constructor(grid, data) {
    this.grid = grid;
    this.paint(data);
  }

  paint(data) {
    this.data = data;
    this.rows = [];
    const len = data.length;
    let everyOffsetY = this.grid.tableHeaderHeight;
    for (let i = 0; i < len; i++) {
      const rowData = data[i];

      this.rows.push(
        new Row(this.grid, i, 0, everyOffsetY, CELL_HEIGHT, rowData)
      );
      everyOffsetY += CELL_HEIGHT;
    }

    this.height = this.rows.reduce((sum, item) => {
      return sum + item.height;
    }, this.grid.tableHeaderHeight);
    data.length > 0 && this.grid.onLoad()


  }
  /**
   * CTRL+V для вставки
   * @param {Array} data Данные в монтажном столе
   */
  pasteData(data) {
    const { xIndex, yIndex } = this.grid.editor;
    const xArr = [xIndex, xIndex + data[0].length - 1]
    const yArr = [yIndex, yIndex + data.length - 1]
    const { value: oldData } = this.getSelectedData({ xArr, yArr })
    const after = {
      value: data,
      colIndex: xIndex,
      rowIndex: yIndex
    }
    // помещаем в стек истории
    this.grid.history.pushState({
      before: {
        value: oldData,
        colIndex: xIndex,
        rowIndex: yIndex
      },
      after,
      type: 'multiple'
    })
    // Ввод данных
    // Скопируйте и вставьте внутрь таблицы объект {value: '', label: ''} в качестве единицы измерения
    if (this.grid.clipboard.show) {
      const rowsData = this.getRangeData(this.grid.clipboard);
      this.batchSetData({
        value: rowsData,
        colIndex: xIndex,
        rowIndex: yIndex
      })
    } else {
      this.batchSetData(after)
    }

    // событие, отправленное после вставки
    const startY = yIndex
    const endY = startY + data.length - 1
    let rowDatas = []
    for (let i = startY; i <= endY; i++) {
      rowDatas.push(this.getRowData(i))
    }
    this.grid.afterPaste(rowDatas)
  }

  batchSetData({ colIndex, rowIndex, value }) {
    for (let ri = 0; ri <= value.length - 1; ri++) {
      const len = value[ri].length;
      for (let ci = 0; ci <= len - 1; ci++) {
        const cells = this.rows[ri + rowIndex].allCells;
        const cell = cells[ci + colIndex];
        cell.setData(value[ri][ci]);
      }
    }
  }
  /**
   * autofull自动填充
   */
  autofillData() {
    const value = this.getRangeData();
    const xStep = value[0].length;
    const yStep = value.length;
    const { xArr, yArr } = this.grid.autofill;
    const { yArr: syArr } = this.grid.selector

    if (yArr[1] < 0 || xArr[1] < 0) return;


    for (let ri = 0; ri <= yArr[1] - yArr[0]; ri++) {
      for (let ci = 0; ci <= xArr[1] - xArr[0]; ci++) {
        const colIndex = ci + xArr[0];
        const rowIndex = ri + yArr[0];
        const val = value[ri % yStep][ci % xStep];
        const cell = this.rows[rowIndex].allCells[colIndex];
        cell.setData(val);
      }
    }

    // 自动填充后事件派发
    let startY = syArr[0]
    let endY = syArr[1]
    let rowDatas = []
    if (yArr[0] !== syArr[0]) { // 纵方向向上
      startY = yArr[0]
    } else {
      startY = syArr[1] + 1
      endY = yArr[1]
    }
    for (let i = startY; i <= endY; i++) {
      rowDatas.push(this.getRowData(i))
    }
    this.grid.afterAutofill(rowDatas)

    this.grid.clearAuaofill();
  }

  resizeColumn(colIndex, width) {
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].resizeColumn(colIndex, width);
    }
  }

  resizeAllColumn(width) {
    for (let row of this.rows) {
      let everyOffsetX = this.grid.originFixedWidth;
      for (let i = 0; i < row.allCells.length; i++) {
        const cell = row.allCells[i];
        cell.width += width;
        cell.x = everyOffsetX;
        everyOffsetX += cell.width;
      }
    }
  }

  resizeRow(rowIndex, height) {
    if (height < MIN_CELL_HEIGHT) return;

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].resizeRow(rowIndex, height);
    }
  }
  // 表头勾选发生改变，body勾选需要改变
  handleCheckRow(y) {
    if (typeof y === "number") {
      this.rows[y].handleCheck();
    } else {
      const isChecked = this.grid.header.checked
      for (let row of this.rows) {
        row.handleCheck(isChecked);
      }
    }
  }
  // body勾选发生改变，表头勾选需要改变
  handleCheckHeader() {
    const totalChecked = this.rows.reduce((sum, item) => {
      const num = +item.checked
      return sum + num
    }, 0)
    const checked = !!totalChecked
    const indeterminate = totalChecked && totalChecked < this.grid.data.length
    this.grid.header.handleCheck({ checked, indeterminate })
  }
  mouseMove(x, y) {
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].isInVerticalAutofill(x, y)) {
        this.rows[i].handleAutofill(x, y);
      } else if (this.rows[i].isInsideVerticaTableBoundary(x, y)) {
        this.rows[i].mouseMove(x, y);
      }
    }
  }
  mouseDown(x, y) {
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].isInVerticalAutofill(x, y)) {
        this.rows[i].handleStartAutofill(x, y);
      } else if (this.rows[i].isInsideVerticaBodyBoundary(x, y)) {
        this.rows[i].mouseDown(x, y);
      }
    }
  }
  click(x, y) {
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].isInsideVerticaBodyBoundary(x, y)) {
        this.rows[i].click(x, y);
      }
    }
  }
  dbClick(x, y) {
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].isInsideVerticaBodyBoundary(x, y)) {
        this.rows[i].dbClick(x, y);
      }
    }
  }

  rePaintRow(rowIndex) {
    // Вычислить максимальную высоту, необходимую для содержимого всех ячеек в строке
    //const rowData = this.data[rowIndex]
    const row = this.getRow(rowIndex);
    const len = row.cells.length;
    let textWrap = null;
    let rowHeight = CELL_HEIGHT;
    for (let i = 0; i < len; i++) {
      const { value, width } = row.cells[i];
      if (value || value === 0) {
        textWrap = this.grid.painter.getTextWrapping(value, width);
        let textWrapCount = 0;
        if (textWrap) {
          textWrapCount = textWrap.length;
        }
        if (textWrapCount > 1) {
          if (CELL_HEIGHT + (textWrapCount - 1) * 18 > rowHeight) {
            rowHeight = CELL_HEIGHT + (textWrapCount - 1) * 18;
          }
        }
      }
    }

    row.height = rowHeight;

    let everyOffsetY = this.grid.tableHeaderHeight;
    for (let j = 0; j < this.rows.length; j++) {
      const row = this.rows[j];
      row.y = everyOffsetY;
      everyOffsetY += row.height;
      row.rePaint();
    }
  }

  draw() {
    const len = this.data.length;
    for (let i = 0; i < len; i++) {
      const row = this.rows[i];
      if (row.isVerticalVisibleOnBody()) {
        row.draw();
      }
    }
  }
  // Получить объект ячейки по координатам
  getCell(x, y) {
    const row = this.rows[y];
    return row.allCells[x];
  }
  getRow(y) {
    return this.rows[y];
  }
  getRangeData({ xArr, yArr } = this.grid.selector) {
    const rowsData = [];
    for (let ri = 0; ri <= yArr[1] - yArr[0]; ri++) {
      const cellsData = [];
      for (let ci = 0; ci <= xArr[1] - xArr[0]; ci++) {
        const cell = this.rows[ri + yArr[0]].allCells[ci + xArr[0]]
        cellsData.push({
          label: cell.label,
          value: cell.value
        });
      }
      rowsData.push(cellsData);
    }
    return rowsData
  }
  getSelectedData({ xArr, yArr } = this.grid.selector) {
    const rowsData = [];
    let text = "";
    for (let ri = 0; ri <= yArr[1] - yArr[0]; ri++) {
      const cellsData = [];
      for (let ci = 0; ci <= xArr[1] - xArr[0]; ci++) {
        cellsData.push(this.rows[ri + yArr[0]].allCells[ci + xArr[0]].label);
      }
      text += cellsData.join("\t") + "\r";
      rowsData.push(cellsData);
    }
    text = text ? text.replace(/\r$/, "") : " "; // 去掉最后一个\n，否则会导致复制到excel里多一行空白
    if (!text) {
      text = " "; // 替换为' '，是为了防止复制空的内容导致document.execCommand命令无效
    }
    return {
      text,
      value: rowsData
    };
  }
  clearSelectedData() {
    const { xArr, yArr } = this.grid.selector;
    for (let ri = 0; ri <= yArr[1] - yArr[0]; ri++) {
      for (let ci = 0; ci <= xArr[1] - xArr[0]; ci++) {
        const cell = this.rows[ri + yArr[0]].allCells[ci + xArr[0]]
        cell.setData("")
      }
    }
    let rowDatas = []
    for (let i = yArr[0]; i <= yArr[1]; i++) {
      rowDatas.push(this.getRowData(i))
    }
    this.grid.afterClear(rowDatas)
  }
  getData() {
    return this.rows.map(row => {
      const cells = row.allCells;
      let _o = {};
      cells.forEach(cell => {
        _o[cell.key] = cell.value;
        if (cell.labelKey) {
          _o[cell.labelKey] = cell.label;
        }
      });
      _o = Object.assign({}, row.data, _o)
      return _o;
    });
  }
  getCheckedRows() {

    return this.rows
      .filter(item => item.checked)
      .map(row => {
        const cells = row.allCells;
        let _o = {};
        cells.forEach(cell => {
          _o[cell.key] = cell.value;
          if (cell.labelKey) {
            _o[cell.labelKey] = cell.label;
          }
        });
        _o = Object.assign({}, row.data, _o)
        return _o;
      });
  }
  getChangedRows() {
    let arr = new Set();
    let rows = [];
    Object.keys(this.grid.hashChange).forEach(key => {
      arr.add(Number(key.split("-")[1]));
    });
    Array.from(arr).sort().forEach(item => {
      rows.push(this.rows[item]);
    });
    return rows.map(row => {
      const cells = row.allCells;
      let _o = {};
      cells.forEach(cell => {
        _o[cell.key] = cell.value;
        if (cell.labelKey) {
          _o[cell.labelKey] = cell.label;
        }
      });
      _o = Object.assign({}, row.data, _o)
      return _o;
    });
  }
  validate(callback) {
    this.rows.forEach(row => {
      const cells = row.allCells;
      cells.forEach(cell => {
        const rowData = this.getRowData(cell.rowIndex)
        cell.validate(rowData)
      });
    })
    setTimeout(() => {
      const errors = this.getValidations()
      typeof callback === 'function' && callback(!errors.length)
    }, 0)
  }
  validateChanged(callback) {
    let arr = new Set();
    let rows = [];
    Object.keys(this.grid.hashChange).forEach(key => {
      arr.add(Number(key.split("-")[1]));
    });
    Array.from(arr).sort().forEach(item => {
      rows.push(this.rows[item]);
    });
    rows.map(row => {
      const cells = row.allCells;
      cells.forEach(cell => {
        const rowData = this.getRowData(cell.rowIndex)
        cell.validate(rowData)
      });
    });
    setTimeout(() => {
      const errors = this.getValidations()
      typeof callback === 'function' && callback(!errors.length)
    }, 0)
  }
  validateField(ci, ri) {
    if (typeof ri === 'number' && typeof ci === 'number') { // 校验指定某个数据单元格
      const cell = this.getCell(ci, ri)
      if (cell) {
        const rowData = this.getRowData(cell.rowIndex)
        cell.validate(rowData)
      }
    }
  }
  getValidations() {
    const validFaildRows = []
    this.rows.forEach(row => {
      const validFaildCells = []
      const cells = row.allCells;
      cells.forEach(cell => {
        !cell.valid && validFaildCells.push({
          title: cell.title,
          key: cell.key,
          value: cell.value,
          message: cell.message
        })
      });
      validFaildCells.length && validFaildRows.push(validFaildCells)
    })
    return validFaildRows
  }
  setValidations(errors) {
    if (errors && Array.isArray(errors)) {
      errors.forEach(item => {
        this.rows.forEach(row => {
          if (row.data[this.grid.rowKey] === item[this.grid.rowKey]) {
            const cells = row.allCells;
            cells.forEach(cell => {
              const valid = !item[cell.key]
              if (item.hasOwnProperty(cell.key)) {
                cell.resetValidate(valid, item[cell.key])
              }
            });
          }
        });
      })
    }
  }
  clearValidations() {
    this.rows.forEach(row => {
      const cells = row.allCells;
      cells.forEach(cell => {
        cell.resetValidate()
      });
    })
  }
  getRowData(y) {
    const row = this.getRow(y);
    let _o = {};
    row.allCells.forEach(cell => {
      _o[cell.key] = cell.value;
      if (cell.labelKey) {
        _o[cell.labelKey] = cell.label;
      }
    });
    return Object.assign({}, row.data, _o)
  }
  getCellData(x, y) {
    const cell = this.getCell(x, y)
    return {
      title: cell.title,
      key: cell.key,
      value: cell.value
    }
  }
  // 批量更新表格数据
  updateData(data) {
    if (data && Array.isArray(data)) {
      data.forEach(item => {
        this.rows.forEach(row => {
          if (row.data[this.grid.rowKey] === item[this.grid.rowKey]) {
            const cells = row.allCells;
            cells.forEach(cell => {
              if (item.hasOwnProperty(cell.key)) {
                cell.setData(item[cell.key], true)
              }
            });
          }
        });
      })
    }
  }
  updateCellData(colIndex) {}
}

export default Body;
