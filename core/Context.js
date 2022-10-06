import { ROW_INDEX_WIDTH } from "./constants.js";

class Context {
  constructor(grid, x, y, width, height, fixed) {
    this.grid = grid;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fixed = fixed;
  }
  isHorizontalVisibleOnBody() {
    return !(
      this.x + this.width - this.grid.fixedLeftWidth + this.grid.scrollX <= 0 ||
      this.x + this.grid.scrollX >= this.grid.width - this.grid.fixedRightWidth
    );
  }
  isVerticalVisibleOnBody() {
    return !(
      this.y + this.height - this.grid.tableHeaderHeight + this.grid.scrollY <= 0 ||
      this.y + this.grid.scrollY >=
        this.grid.height - this.grid.horizontalScrollerSize
    );
  }
  // 鼠标坐标是否在body内
  isInsideHorizontalBodyBoundary(mouseX, mouseY) {
    return (
      mouseX > this.x + this.grid.scrollX &&
      mouseX < this.x + this.grid.scrollX + this.width &&
      mouseX > this.grid.fixedLeftWidth && // 避免冻结列点击穿透了
      mouseX < this.grid.width - this.grid.fixedRightWidth
    ); // 避免冻结列点击穿透了
  }
  isInsideHorizontalTableBoundary(mouseX, mouseY) {
    return (
      mouseX > this.x + this.grid.scrollX &&
      mouseX < this.x + this.grid.scrollX + this.width &&
      mouseX > this.grid.fixedLeftWidth
    );
  }
  isInsideFixedHorizontalBodyBoundary(mouseX, mouseY) {
    const x =
      this.grid.width -
      (this.grid.tableWidth - this.x - this.width) -
      this.width -
      this.grid.verticalScrollerSize;
    return (
      (mouseX >= x && mouseX < x + this.width && this.fixed === "right") ||
      (mouseX > this.x && mouseX < this.x + this.width && this.fixed === "left")
    );
  }
  // Ордината мыши находится в области тела окна (исключая горизонтальную полосу прокрутки)
  isInsideVerticaBodyBoundary(mouseX, mouseY) {
    return (
      mouseY > this.y + this.grid.scrollY &&
      mouseY < this.y + this.height + this.grid.scrollY &&
      mouseY > this.grid.tableHeaderHeight &&
      mouseY < this.grid.height - this.grid.horizontalScrollerSize
    );
  }
  // Ордината мыши находится в области тела окна
  isInsideVerticaTableBoundary(mouseX, mouseY) {
    return (
      mouseY > this.y + this.grid.scrollY &&
      mouseY < this.y + this.height + this.grid.scrollY &&
      mouseY > this.grid.tableHeaderHeight
    );
  }
  // Находятся ли координаты мыши в области значка суффикса ячейки
  isInsideAffixIcon(mouseX, mouseY) {
    return (
      mouseX > this.x + this.width + this.grid.scrollX - 25 &&
      mouseX < this.x + this.width + this.grid.scrollX &&
      mouseY > this.y + this.grid.scrollY + 10 &&
      mouseY < this.y + this.height + this.grid.scrollY - 10
    )
  }
  isInsideBeforeAffixIcon(mouseX, mouseY) {
    return (
      mouseX > this.x + this.width + this.grid.scrollX - 25 &&
      mouseX < this.x + this.width + this.grid.scrollX  &&
      mouseY > this.y + this.grid.scrollY + 10 &&
      mouseY < this.y + this.height + this.grid.scrollY - 10
    )
  }
  // Находятся ли координаты мыши в пределах диапазона заголовка
  isInsideHeader(mouseX, mouseY) {
    return mouseY > this.y && mouseY < this.y + this.grid.tableHeaderHeight;
  }
  // Находятся ли координаты мыши внутри раздела флажка
  isInsideCheckboxBoundary(mouseX, mouseY) {
    return (
      mouseX > this.x + ROW_INDEX_WIDTH &&
      mouseX < this.x + this.grid.originFixedWidth
    );
  }
  // 鼠标坐标位于勾选框区域内
  isInsideHeaderCheckboxBoundary(mouseX, mouseY) {
    return (
      this.isInsideHeader(mouseX, mouseY) &&
      this.isInsideCheckboxBoundary(mouseX, mouseY)
    );
  }
  // 鼠标坐标位于索引框区域内
  isInsideIndexBoundary(mouseX, mouseY) {
    return (
      mouseX > this.x &&
      mouseX < this.x + ROW_INDEX_WIDTH
    );
  }
}

export default Context;
