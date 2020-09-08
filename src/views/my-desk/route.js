const toDoList = () =>
	import('./toDoList.vue');
const toDoListDetails = () =>
	import('./toDoListDetails.vue');
const personnelSelection = () =>
	import('./personnelSelection.vue');

const InsideMail = [{
	path: 'toDoList',
	name: 'toDoList',
	component: toDoList,
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