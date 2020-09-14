const workItems = () =>
	import('./work-items.vue');

const InsideMail = [{
	path: 'workItems',
	name: 'workItems',
	component: workItems,
	meta: {
		title: '工作事项'
	}
}];

export default InsideMail;