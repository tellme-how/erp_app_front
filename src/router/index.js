import Vue from 'vue';
import Router from 'vue-router';
import myDesk from '../views/my-desk/route';
import InsideMail from '../views/collaborative-office/route';
import personal from '../views/personal/route';
import journalism from '../views/journalism/route';

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
			...InsideMail,
			...personal,
			...journalism,
			{
				path: 'index',
				name: 'index',
				component: () =>
					import('../components/index.vue')
			},
			{
				path: 'preview',
				name: 'preview',
				component: () =>
					import('../components/preview.vue')
			},
		]
	},
]

export default new Router({
	routes: constantRouterMap,
	mode: 'history'
});