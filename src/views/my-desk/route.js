const toDoList = () =>
	import('./toDoList.vue');
const toDoListDetails = () =>
	import('./toDoListDetails.vue');

const InsideMail = [{
	path: 'toDoList',
	name: 'toDoList',
	component: toDoList,
}, {
	path: 'toDoListDetails',
	name: 'toDoListDetails',
	component: toDoListDetails,
}];

export default InsideMail;