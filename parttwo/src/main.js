import Vue from 'vue';
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import wrap from '@vue/web-component-wrapper';
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import VueWebComponent from './components/VueWebComponent';

Vue.use(VXETable)

Vue.component('chart', ECharts)

const CustomWebElement = wrap(Vue, VueWebComponent);
window.customElements.define('vue-web-component', CustomWebElement);