import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './model/api/index';

import Vant from 'vant';
import 'vant/lib/index.css';

import views from 'components/index.js'
Vue.use(views)

Vue.use(Vant);
Vue.prototype.$api = api;
Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')