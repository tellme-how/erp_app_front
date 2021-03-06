import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './model/api/index';

import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

//公共方法
import base from './utils/base.js';
Vue.use(base);

//全局组件注册
import views from 'components/index.js'
Vue.use(views)

//引入公共样式
import './assets/erpCss.css' 

//全局变量文件
import globalVariable from './utils/global_variable.js';
Vue.prototype.$GLOBAL = globalVariable;

// 路由拦截
import permission from './permission.js'

// 引入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//提示框
import { Notify } from 'vant';
Vue.use(Notify);

Vue.prototype.$api = api;
Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')