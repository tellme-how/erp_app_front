const toDoList = () =>
	import('./toDoList.vue');
const toDoListDetails = () =>
	import('./toDoListDetails.vue');
const personnelSelection = () =>
	import('./personnelSelection.vue');
const notice = () =>
	import('./notice.vue');

const InsideMail = [{
	path: 'toDoList',
	name: 'toDoList',
	component: toDoList,
},{
	path: 'notice',
	name: 'notice',
	component: notice,
}, {
	path: 'toDoListDetails',
	name: 'toDoListDetails',
	component: toDoListDetails,
}, {
	path: 'personnelSelection',
	name: 'personnelSelection',
	component: personnelSelection,
}];

export default InsideMail;