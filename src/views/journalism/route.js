const notice = () =>
	import('./notice.vue');
const noticeSee = () =>
	import('./noticeSee.vue');

const InsideMail = [{
	path: 'notice',
	name: 'notice',
	component: notice,
	meta: {
		keepAlive: true, 
		isBack: false
		}
},{
	path: 'noticeSee',
	name: 'noticeSee',
	component: noticeSee,
}];

export default InsideMail;