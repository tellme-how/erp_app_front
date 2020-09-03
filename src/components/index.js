import erpVanCell from './erpVanCell.vue'
import lineTable from './lineTable.vue'
import erpVanCellTitle from './erpVanCellTitle.vue'
const components = {
	erpVanCell,
	lineTable,
	erpVanCellTitle
};
const install = function(Vue, opts = {}) {
	Object.keys(components).forEach((key) => {
		Vue.component(key, components[key]);
	});
};
export default install;