import erpVanCell from './erpVanCell.vue'
import lineTable from './lineTable.vue'
import lineTable2 from './lineTable2.vue'
import erpVanCellTitle from './erpVanCellTitle.vue'
import approvalProcess from './approvalProcess.vue'
import vanPopupReply from './vanPopupReply.vue'
import enclosureFile from '../views/my-desk/components/enclosure-file';
const components = {
	erpVanCell,
	vanPopupReply,
	approvalProcess,
	lineTable,
	lineTable2,
	enclosureFile,
	erpVanCellTitle
};
const install = function(Vue, opts = {}) {
	Object.keys(components).forEach((key) => {
		Vue.component(key, components[key]);
	});
};
export default install;