//import { BAR_WIDTH } from 'x-canvas-table/src/core/Scroller'

export function ctScale(ct) {

  const {container, style} = ct.props;
  ct.styleCalc();
  ct.domInit();
  ct.ctxInit();

  ct.componentsInit();

  ct.sizeCalc();

  ct.dataHeight = ct.header.height + ct.source.length * ct.style.rowHeight;
  ct.dataWidth = ct.header.columns.reduce(((pre, col) => pre + col.width), 0);
  ct.height = Math.max(ct.style.height, ct.dataHeight);
  ct.width = Math.max(ct.style.width, ct.dataWidth);

  // ct.scroller && ct.scroller.update(ct.width, ct.height, ct.dataWidth, ct.dataHeight);

  if (ct.scroller) {
    ct.scroller.scrollWidth = ct.width;
    ct.scroller.scrollHeight = ct.height;
    ct.scroller.scrollEndRef.current.style.top = `${ ct.height - 200 - 4 }px`;// TODO BAR_WIDTH
    ct.scroller.scrollEndRef.current.style.left = `${ ct.width - 1 }px`;

    ct.scroller.shadowRender();
  }

  // ct.render();

  ct.ctx.clearRect(0, 0, ct.style.width, ct.style.height);
  ct.body.render();
  ct.header.render();

  if (ct.style.modalBd) {
    ct.ctx.fillStyle = ct.style.modalBd;
    ct.ctx.fillRect(0, 0, ct.width, ct.height);
  }


  ct.scroller && ct.scroller.scrollTo(ct.scrollPosition.scrollLeft, ct.scrollPosition.scrollTop)

}
