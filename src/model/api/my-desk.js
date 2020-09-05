import httpReqest from '../../utils/https';
import QS from 'qs';

const myDesk = {
	//审核回复信息查询
	selectAuditReplyInfo(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.post('/api/scha/workFlow/selectAuditReplyInfo' + valueS);
	},
	//审核回复信息保存
	saveAuditReplyInfo(params) {
		return httpReqest.post('/api/scha/workFlow/saveAuditReplyInfo', params);
	},
	//一人一表
	findPersonalTableTaskById(params) {
		return httpReqest.post('/api/scha/personalTableTask/findPersonalTableTaskById', params);
	},
	//员工考评表汇总
	getStaffAppraisalsSummaryVO(params) {
		return httpReqest.post('/api/scha/staffAppraisalsSummary/getStaffAppraisalsSummaryVO', params);
	},
	//员工考评表
	staffAppraisalsFindInfoById(params) {
		return httpReqest.post('/api/scha/staffAppraisals/findInfoById', params);
	},
	//公司月度计划汇总
	planfindInfoById(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.post('/api/scha/plan/findInfoById' + valueS);
	},
	//公司年度计划汇总
	findInfoById(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.post('/api/scha/yearPlanSummary/findInfoById' + valueS);
	},
	// 获取待办事项的popForm表单数据(经济指标)
	getEconomicIndicatorsDetail(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.post('/api/scha/optionIndex/findById' + valueS);
	},
	// 获取待办事项的popForm表单数据(配合任务)
	getCoordinationTaskVO(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/scha/coordinationTask/getCoordinationTaskVO' + valueS);
	},
	// 获取待办事项的popForm表单数据(一岗一表)
	getFormPostVO(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/scha/formPost/getFormPostVO' + valueS);
	},
	// 获取待办事项的popForm表单数据(临时任务派发)
	getTemporaryMissionVO(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/scha/temporaryMission/getTemporaryMissionVO' + valueS);
	},
	//获取待办事项的popForm表单数据(部门月度计划)
	showDeptMonthPlanDetail(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/scha/departmentMonthPlan/showDeptMonthPlanDetail' + valueS);
	},
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