import Vue from 'vue';
import moment from 'moment';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import 'avue-plugin-transfer/packages' //引入avue-plugin-transfer插件
// import 'avue-plugin-ueditor/packages' //引入avue-plugin-ueditor插件(如果要兼容ie自行换掉富文本编辑器，此款插件不兼容ie)
import store from './store';
import { loadStyle } from './util/util'
import * as urls from '@/config/env';
import {
    iconfontUrl,
    iconfontVersion
} from '@/config/env';
import * as filters from './filters' // 全局filter
import './styles/common.scss';
// 引入avue的包
import '@smallwei/avue/lib/avue.min';
// import Avue from '@smallwei/avue';
// 引入avue的样式文件
import '@smallwei/avue/lib/index.css';

// //源文件包
// import './packages/index.js';
// import './packages/theme-chalk/src/index.scss';

import basicContainer from './components/basic-container/main'
import VueClipboard from 'vue-clipboard2'
// 插件 json 展示
import vueJsonTreeView from 'vue-json-tree-view'
import prototypeJs from '@/util/prototypeJs'
import JsonViewer from 'vue-json-viewer'
import CronParser from 'cron-parser'
import ECharts from 'vue-echarts'

import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/radar'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/graph'
import 'echarts/lib/chart/effectScatter'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/dataset'
import 'echarts/map/js/world'
import 'zrender/lib/svg/svg'

import 'echarts-liquidfill'

import SuperFlow from 'vue-super-flow'
import 'vue-super-flow/lib/index.css'

Vue.use(SuperFlow)

Vue.component('v-chart', ECharts)

Vue.use(prototypeJs)

Vue.use(router)

Vue.use(VueClipboard)

Vue.use(vueJsonTreeView)

Vue.use(JsonViewer)

Vue.use(CronParser)

Vue.use(VueAxios, axios)

Vue.filter('dateFmt', (data, _format = 'YYYY-MM-DD') => {
    return moment(data).format(_format);
});

//注册全局容器
Vue.component('basicContainer', basicContainer)
// 加载相关url地址
Object.keys(urls).forEach(key => {
    Vue.prototype[key] = urls[key];
})

// 加载过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
    loadStyle(iconfontUrl.replace('$key', ele));
})

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
