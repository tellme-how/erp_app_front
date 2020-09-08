import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './model/api/index';

import Vant from 'vant';
import 'vant/lib/index.css';

import views from 'components/index.js'
Vue.use(views)

//全局变量文件
import globalVariable from './utils/global_variable.js';
Vue.prototype.$GLOBAL = globalVariable;

// css样式还是需要全部引入
import 'element-ui/lib/theme-chalk/index.css'
import element from './element/index'
Vue.use(element)
Vue.use(Vant);
Vue.prototype.$api = api;
Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')