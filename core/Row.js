import RowHeader from "./RowHeader.js";
import Cell from "./Cell.js";
import Context from "./Context.js";
import {
  ROW_INDEX_WIDTH,
  SIZE_MAP
} from "./constants";
import {toLeaf} from "./util";

function getLeafCellWidth(arr) {
  const _arr = toLeaf(arr)
  const width = _arr.reduce((sum, item) => {
    return sum + SIZE_MAP[item.size || "mini"]
  }, 0)

  return width
}
class Row extends Context {
  constructor(grid, rowIndex, x, y, height, data) {
    super(grid, x, y, null, height);
    this.RowPaint(rowIndex, data, grid,x, y)
  }

  // Row;
  RowPaint(rowIndex, data,  grid, x, y) {

    this.data = data;
    this.rowIndex = rowIndex;
    this.checked = false;

    this.allCells = [];
    this.fixedCells = [];
    this.cells = [];
    const style = {
      color: this.grid.color,
      fillColor: this.grid.fillColor,
      borderColor: this.grid.borderColor,
      borderWidth: this.grid.borderWidth
    };


    this.rowHeader = new RowHeader(
      grid,
      rowIndex,
      x,
      y,
      ROW_INDEX_WIDTH,
      this.height,
      style
    );
    let columnIndex = 0
    const renderRow = (arr, parent, originX) => {
      let everyOffsetX = originX;
     //  debugger
      for (let i = 0; i < arr; i++) {
        const column = this.grid.columns[i];
        let width = SIZE_MAP[column.size || "mini"];
        let _y = y
        let height = this.height

        let fixed = "";
        if (i < this.grid.fixedLeft) {
          fixed = "left";
        } else if (i > arr - 1 - this.grid.fixedRight) {
          fixed = "right";
        }
        column.fixed = fixed

         console.log(data);

        const cell = new Cell(
          data[column.key],
          data[column.label],
          grid,
          i,
          rowIndex,
          everyOffsetX,
          _y,
          width,
          height,
          column,
          data,
          style
        );
      //  console.log('row: ' + rowIndex + ' cell: ' + i);
        this.allCells.push(cell);
        if (fixed) {
          this.fixedCells.push(cell);
        } else {
          this.cells.push(cell);
        }

        everyOffsetX += width;
      }

    }

    renderRow(this.grid.columnsLength, null, grid.originFixedWidth)

      // cells对象集合
    // let everyOffsetX = grid.originFixedWidth;
    //
    // for (let i = 0; i < this.grid.columnsLength; i++) {
    //   const column = this.grid.columns[i];
    //   const width = SIZE_MAP[column.size || "mini"];
    //   let fixed = "";
    //
    //   if (i < this.grid.fixedLeft) {
    //     fixed = "left";
    //   } else if (i > this.grid.columnsLength - 1 - this.grid.fixedRight) {
    //     fixed = "right";
    //   }
    //   column.fixed = fixed
    //
    //   const cell = new Cell(
    //     data[column.key],
    //     data[column.label],
    //     grid,
    //     i,
    //     rowIndex,
    //     everyOffsetX,
    //     y,
    //     width,
    //     this.height,
    //     column,
    //     data,
    //     style
    //   );
    //
    //   this.allCells.push(cell);
    //   if (fixed) {
    //     this.fixedCells.push(cell);
    //   } else {
    //     this.cells.push(cell);
    //   }
    //   everyOffsetX += width;
    // }
  }



  // 鼠标枞坐标是否位于焦点单元格所在的autofill触点范围内
  isInVerticalAutofill(mouseX, mouseY) {
    return (
      this.grid.autofill.yIndex === this.rowIndex &&
      mouseY > this.y + this.grid.scrollY + this.height - 4 &&
      mouseY < this.y + this.height + this.grid.scrollY + 4
    );
  }
  handleCheck(checked) {
    this.checked = typeof checked === 'boolean' ? checked : !this.checked;
    this.rowHeader.handleCheck(this.checked);
  }
  // выделить одну ячейку
  // TODO: При клики раскрываем;
  mouseDown(x, y) {
    // Не выполнять выбор ячейки при автозаполнении контакта
    const cell = this.allCells[this.grid.autofill.xIndex];
    if (cell && (
      cell.isInHorizontalAutofill(x, y) ||
      cell.isInsideFixedHorizontalAutofill(x, y)
    )) {
      return
    }

    for (let i = 0; i < this.allCells.length; i++) {
      const cell = this.allCells[i];
      if (
        cell.dataType === 'select' && cell.isInsideAffixIcon(x, y) ||
        cell.dataType === 'children' && cell.isInsideBeforeAffixIcon(x, y))
      {
        this.grid.selectCell(cell);
        // Одновременное срабатывание выделения и редактирования приведет к исчезновению задержки выпадающего плавающего слоя при переключении выпадающих ячеек.
        setTimeout(() => {
          this.grid.startEdit();
        }, 0)
      } else if (
        cell.isInsideHorizontalBodyBoundary(x, y) ||
        cell.isInsideFixedHorizontalBodyBoundary(x, y)
      ) {
        this.grid.selectCell(cell);
      }
    }
  }
  // 批量选中单元格时移动批量选取
  mouseMove(mouseX, mouseY) {
    for (let i = 0; i < this.allCells.length; i++) {
      const cell = this.allCells[i];
      if (
        cell.isInsideHorizontalTableBoundary(mouseX, mouseY) ||
        cell.isInsideFixedHorizontalBodyBoundary(mouseX, mouseY)
      ) {
        // multiSelectCell
        const { colIndex, rowIndex, x, y, width, height, valid, message, fixed } = cell;
        this.grid.multiSelectCell(colIndex, rowIndex, mouseX, mouseY);

        // 显示单元格tooltip校验失败提示文案
        this.grid.tooltip.update({
          valid,
          message,
          x,
          y,
          colWidth: width,
          colHeight: height,
          fixed
        });

        if (cell.dataType === 'select' && cell.isInsideAffixIcon(mouseX, mouseY)) {
          this.grid.target.style.cursor = "pointer";
        }
        //TODO: cursor
        if (cell.dataType === 'children' && cell.isInsideBeforeAffixIcon(mouseX, mouseY)) {
          this.grid.target.style.cursor = "pointer";
          // this.grid.target.style.textAlign = "center"
        }

      }
    }
  }
  // 寻找autofill触点
  handleAutofill(x, y) {
    const cell = this.allCells[this.grid.autofill.xIndex];
    if (!cell) return;
    if (
      cell.isInHorizontalAutofill(x, y) ||
      cell.isInsideFixedHorizontalAutofill(x, y)
    ) {
      this.grid.target.style.cursor = "crosshair";
    }
  }
  // 单击autofill触点开始拖拽
  handleStartAutofill(x, y) {
    const cell = this.allCells[this.grid.autofill.xIndex];
    if (!cell) return;
    if (
      cell.isInHorizontalAutofill(x, y) ||
      cell.isInsideFixedHorizontalAutofill(x, y)
    ) {
      this.grid.startAutofill();
    }
  }
  click(x, y) {
    if (this.rowHeader.isInsideCheckboxBoundary(x, y)) {
      this.handleCheck();
      // body部分勾选状态发生变化，需要影响到表头的indeterminate状态
      this.grid.handleCheckHeader()
    } else if (this.rowHeader.isInsideIndexBoundary(x, y)) {
      this.grid.selectRows(this)
    }
  }
  dbClick(x, y) {
    for (let i = 0; i < this.allCells.length; i++) {
      const cell = this.allCells[i];
      // 仅当鼠标坐标位于body内的单元格之内时才会触发编辑模式
      if (
        cell.isInsideHorizontalBodyBoundary(x, y) ||
        cell.isInsideFixedHorizontalBodyBoundary(x, y)
      ) {
        this.grid.startEdit();
      }
    }
  }

  resizeColumn(colIndex, diffWidth) {
    const scrollDiffWidth =
      this.grid.width -
      this.grid.tableWidth -
      this.grid.verticalScrollerSize -
      this.grid.scrollX;

    const cell = this.allCells[colIndex];
    if (scrollDiffWidth <= diffWidth) {
      cell.width += diffWidth;

      // Избегайте работы слишком быстро, чтобы вызвать неисправности
      for (let i = colIndex + 1; i < this.grid.columnsLength; i++) {
        this.allCells[i].x += diffWidth;
      }
    }

    // Прокрутите вправо и обновите ширину целевого столбца и координаты по оси x следующего соседнего столбца только при уменьшении ширины столбца.
    if (scrollDiffWidth === 0 && diffWidth <= 0) {
      cell.width += diffWidth;
      this.allCells[colIndex + 1].width -= diffWidth;
      this.allCells[colIndex + 1].x += diffWidth;
    }
  }

  rePaint() {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      cell.height = this.height;
      cell.y = this.y;
    }
    for (let i = 0; i < this.fixedCells.length; i++) {
      const cell = this.fixedCells[i];
      cell.height = this.height;
      cell.y = this.y;
    }

    this.rowHeader.height = this.height;
    this.rowHeader.y = this.y;
  }
  // HРисует линие;
  draw() {
    // Рисуем основную часть тела.
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      if (cell.isHorizontalVisibleOnBody()) {
        cell.draw(); // Рисуем ячейка;
      }
    }
    // Исправлены тени столбцов
    if (this.grid.scrollX !== 0) {
      this.grid.painter.drawRect(
        this.x + this.grid.originFixedWidth,
        this.y + this.grid.scrollY,
        this.grid.fixedLeftWidth - this.grid.originFixedWidth,
        this.height,
        {
          fillColor: "#f9f9f9",
          shadowBlur: 4,
          shadowColor: "rgba(143, 140, 140, 0.22)",
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      );
    }

    if (
      this.grid.tableWidth +
        this.grid.verticalScrollerSize -
        this.grid.width +
        this.grid.scrollX > 0
    ) {
      this.grid.painter.drawRect(
        this.grid.width - this.grid.fixedRightWidth,
        this.y + this.grid.scrollY,
        this.grid.fixedRightWidth - this.grid.verticalScrollerSize,
        this.height,
        {
          fillColor: "#f9f9f9",
          shadowBlur: 4,
          shadowColor: "rgba(143, 140, 140, 0.22)",
          shadowOffsetX: -2,
          shadowOffsetY: 2
        }
      );
    }

    // Закрепить столбцы слева и справа
    for (let i = 0; i < this.fixedCells.length; i++) {
      const cell = this.fixedCells[i];
      cell.draw();
    }

    // нарисовать индекс каждой строки и флажок
    this.rowHeader.draw();
  }
}

export default Row;
