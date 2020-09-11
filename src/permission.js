/*路由拦截*/

import router from './router'

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
	const token = localStorage.getItem('ms_tokenId');
	const userId = localStorage.getItem('ms_userId');
	if(token && userId) {
		next()
	} else {
		if(to.name == "login") {
			next();
		} else {
			next('/')
		}
	}
});