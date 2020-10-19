import httpReqest from '../../utils/https';
import QS from 'qs';

const myDesk = {
	//流程图
	viewProcess(params) {
		return httpReqest.post('/api/wfInterfaces/workFlow/viewProcess', params);
	},
	// 获取会议申请列表
	getApplyList(params) {
		return httpReqest.post('/api/interfaces/confApply/findApplyList', params);
	},
	//操作已阅
	removeBizMail(params) {
		return httpReqest.post('/api/wfInterfaces/workFlow/removeBizMail', params);
	},
	//待办事项-提交
	addWfsubmit(params) {
		return httpReqest.post('/api/wfInterfaces/workFlow/wfsubmit', params);
	},
	//根据 userid 获取到职位[包括兼职]
	getStaffAllFirmpositionname(params) {
		return httpReqest.post('/api/interfaces/staffManage/getStaffAllFirmpositionname', params);
	},
	//待办事项- 查询当前节点的配置
	getProcessorByMaile(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/wfInterfaces/workFlow/getProcessorByMaile' + valueS);
	},
	findIds(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/interfaces/workItem/findIds' + valueS);
	},
	//公司部门人员树
	findCompanyDeptStaffInfoByOrgUnitIdFromRedis(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/wfInterfaces/workFlow/findCompanyDeptStaffInfoByOrgUnitIdFromRedis' + valueS);
	},
	// 用户-列表查询
	findUserBypage(params) {
		return httpReqest.post('/api/interfaces/userManage/findUserBypage', params);
	},
	getDocumentCategoryOrgArchForPhone(params) {
		return httpReqest.post('/api/interfaces/documentcategory/getDocumentCategoryOrgArchForPhone', params);
	},
	//加批
	addSign(params) {
		return httpReqest.post('/api/wfInterfaces/workFlow/addSign', params);
	},
	//委托
	transmit(params) {
		return httpReqest.post('/api/wfInterfaces/workFlow/transmit', params);
	},
	//加签
	SeTaddTag(params) {
		return httpReqest.post('/api/wfInterfaces/workFlow/addTag', params);
	},
	//待办事项-转发
	setencyclic(params) {
		return httpReqest.post('/api/wfInterfaces/workFlow/encyclic', params);
	},
	//新增审批回复信息
	addAuditReply(params) {
		return httpReqest.post('/api/wfInterfaces/workFlow/processMonitor/addAuditReply', params);
	},
	//获取审批信息及回复信息
	getAuditAndReplyMsg(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/wfInterfaces/workFlow/processMonitor/getAuditAndReplyMsg' + valueS);
	},
	//附件预览
	getHtmlPreviewAttachmentById(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/interfaces/attachment/getHtmlPreviewAttachmentById' + valueS);
	},
	//查询所有附件信息
	findInfosList(params) {
		return httpReqest.post('/api/interfaces/attachment/findInfosList', params);
	},
	//查询文件管理 by foid
	findDocumentManageById(params) {
		return httpReqest.post('/api/interfaces/documentmanage/findDocumentManageById', params);
	},
	//取消关注
	deleteAttention(params) {
		return httpReqest.post('/api/wfInterfaces/workFlow/deleteAttention', params);
	},
	//关注
	addAttention(params) {
		return httpReqest.post('/api/wfInterfaces/workFlow/addAttention', params);
	},
	// 根据ID查询工作事项模版主表分类
	getWorkItemTypeModel(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/interfaces/workItem/findBySrcId' + valueS);
	},
	//页面配置url
	postHttp(url, params) {
		return httpReqest.post('/api/wfInterfaces/' + url, params);
	},
	//查询文件管理:分页
	findDocumentManageByPage(params) {
		return httpReqest.post('/api/interfaces/documentmanage/findDocumentManageByPage', params);
	},
	//获取文件类别组织
	getDocumentCategoryOrgArch(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/interfaces/documentcategory/getDocumentCategoryOrgArch' + valueS);
	},
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
	//查询所有人员
	getStaffTree(params) {
		return httpReqest.post('/api/interfaces/staffManage/getStaffTree', params);
	},
	//审核回复信息保存
	saveAuditReplyInfo(params) {
		return httpReqest.post('/api/scha/workFlow/saveAuditReplyInfo', params);
	},
	//人员/用户/职务-列表查询
	findStaffByPage(params) {
		return httpReqest.post('/api/interfaces/staffManage/findStaffByPage', params);
	},
	// 获取待办事项的popForm表单数据(一人一表任务表)
	findTaskEvaluateAndAdjustById(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.post('/api/scha/taskEvaluate/findTaskEvaluateAndAdjustById' + valueS);
	},
	//是否审批
	getWFBizMailInfoByUserId(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/wfInterfaces/workFlow/getWFBizMailInfoByUserId' + valueS);
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