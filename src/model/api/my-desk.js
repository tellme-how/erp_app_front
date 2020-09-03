import httpReqest from '../../utils/https';
import QS from 'qs';

const myDesk = {
	getWfDecisionTypeConByCurNode(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/wfInterfaces/workFlow/getWfDecisionTypeConByCurNode' + valueS);
	},
	//登录
	login: (params) => {
		return httpReqest.post('/api/uaa/oauth/token', QS.stringify(params));
	},
	getUserInfo() {
		return httpReqest.get('/api/uaa/me');
	},
	//获取待办事项
	getunhandledTask(params) {
		return httpReqest.post('/api/wfInterfaces/workFlow/unhandledTask', params);
	},
	//api手动输入接口名称
	apiUrl(url, params) {
		return httpReqest.post('/api/interfaces/' + url, params);
	},
	// 获取待办事项的popForm表单数据(部门年度计划)
	getDepYearPlanDetail(params) {
		return httpReqest.post('/api/scha/departmentYearPlan/findInfoById', params);
	},

};

export default myDesk;