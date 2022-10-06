import Context from "./Context.js";
import {
  SELECT_BORDER_COLOR,
  SELECT_BG_COLOR,
  ERROR_TIP_COLOR, SELECT_BORDER_COLOR_TEST
} from "./constants.js";
import de from "element-ui/src/locale/lang/de";

class ColumnHeader extends Context {
  constructor(grid, index, x, y, width, height, column) {
    super(grid, x, y, width, height);

    this.fixed = column.fixed;
    this.level = column.level
    this.text = column.title;
    this.colspan = column.colspan
    this.rowspan = column.rowspan
    this.required = column.rule ? column.rule.required : null
    this.index = index;
  }
  // 表头是否超过了右侧可视区的边界
  isVisibleOnScreen() {
    return !(
      this.x + this.width - this.grid.fixedLeftWidth + this.grid.scrollX <= 0 ||
      this.x + this.grid.scrollX >= this.grid.width - this.grid.fixedRightWidth
    );
  }
  draw() {
    // 绘制表头每个单元格框
    const {
      width,
      tableWidth,
      verticalScrollerSize,
      scrollX,
      editor,
      selector,
      painter,
      fillColor,
      borderColor,
      borderWidth
    } = this.grid
    const x =
      this.fixed === "right"
        ? width -
          (tableWidth - this.x - this.width) -
          this.width -
          verticalScrollerSize
        : this.fixed === "left"
        ? this.x
        : this.x + scrollX;
    painter.drawRect(x, this.y, this.width, this.height, {
      fillColor,
      borderColor,
      borderWidth
    });

    /**
     * Выделение фокуса, colspan>=2 означает составной заголовок, выделение не требуется
     */
    if ((selector.show || editor.show ) && this.colspan <= 1) {
      const minX = selector.xArr[0];
      const maxX = selector.xArr[1];

      // фон
      if (this.index >= minX && this.index <= maxX) {
        this.grid.painter.drawRect(x, this.y, this.width, this.height, {
          fillColor: SELECT_BG_COLOR
        });
      }

      // Бордер
      if (this.index >= minX && this.index <= maxX) {
        const points = [
          [x, this.y + this.height],
          [x + this.width, this.y + this.height]
        ];
        this.grid.painter.drawLine(points, {
          borderColor: SELECT_BORDER_COLOR,
          borderWidth: 2
        });
      }

      //  Решить проблему линейного покрытия соседних ячеек
      // if (this.index - 1 === maxX) {
      //   const points = [
      //     [x - 1, this.y + this.height],
      //     [x, this.y + this.height]
      //   ];
      //   this.grid.painter.drawLine(points, {
      //     borderColor: SELECT_BORDER_COLOR_TEST,
      //     borderWidth: 2
      //   });
      // }
    }
    // console.log(this.grid.painter);

    // required Обязательная звездочка
    if (this.required) {
      this.grid.painter.drawIcon(
        '*',
        this.text,
        x,
        this.y + this.height / 2,
        this.width,
        10,
        6,
        4,
        {
          font:
          'normal 20px "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif',
          color: ERROR_TIP_COLOR
        }
      );
    }

    // Нарисуйте текст заголовка для каждой ячейки
    this.grid.painter.drawCellText(
      this.text,
      x,
      this.y,
      this.width,
      this.height,
      10,
      {
        color: this.grid.color,
        align: 'center'
      }
    );
  }
}

export default ColumnHeader;
