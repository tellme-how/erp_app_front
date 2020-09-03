import Vue from 'vue';
import Router from 'vue-router';
import myDesk from '../views/my-desk/route';

Vue.use(Router);

export const constantRouterMap = [{
		path: '/',
		name: 'login',
		component: () =>
			import('../components/login.vue')
	},
	{
		path: '/erp',
		component: () =>
			import('../components/home.vue'),
		redirect: '/erp/index',
		children: [
			...myDesk,
			{
				path: 'index',
				name: 'index',
				component: () =>
					import('../components/index.vue')
			},
		]
	},
]

export default new Router({
	routes: constantRouterMap,
	mode: 'history'
});