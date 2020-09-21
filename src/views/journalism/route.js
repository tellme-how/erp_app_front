const notice = () =>
	import('./notice.vue');
const noticeSee = () =>
	import('./noticeSee.vue');

const InsideMail = [{
	path: 'notice',
	name: 'notice',
	component: notice,
},{
	path: 'noticeSee',
	name: 'noticeSee',
	component: noticeSee,
}];

export default InsideMail;