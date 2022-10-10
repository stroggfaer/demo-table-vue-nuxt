import Vue from 'vue';
import CGrid from "vue-cheetah-grid";
import VueVirtualScroller from 'vue-virtual-scroller'
import VCalendar from 'v-calendar';

import CanvasDatagrid  from 'canvas-datagrid';
Vue.config.ignoredElements = ['canvas-datagrid'];


Vue.use(CanvasDatagrid);
Vue.use(VueVirtualScroller)
Vue.use(CGrid);
Vue.use(VCalendar, {
  componentPrefix: 'v'
})
