import httpReqest from '../../utils/https';

const collaborativeOffice = {
	dataToDataWorkItem(params) {
		return httpReqest.post('/api/interfaces/workItem/dataToDataWorkItem', params);
	},
	// 获取树形结构数据
	selectAllOrganizationInfo() {
		return httpReqest.get('/api/interfaces/organization/selectAllOrganizationInfo');
	},
	// 分页查询工作事项模版主表分类
	findWorkItemTypePage(params) {
		return httpReqest.post('/api/interfaces/workItemType/findWorkItemTypePage', params);
	},
	// 修改状态主表分类，7禁用、3有效
	updateStatus(params) {
		return httpReqest.post('/api/interfaces/workItemType/updateStatus', params);
	},
	// 修改状态主表，7禁用、3有效
	updateStatusTemp(params) {
		return httpReqest.post('/api/interfaces/workItemTemp/updateStatus', params);
	},
	// 修改状态子表，7禁用、3有效
	updateStatusTempSub(params) {
		return httpReqest.post('/api/interfaces/workItemTempSub/updateStatus', params);
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
		return httpReqest.get('/api/interfaces/workItemType/getWorkItemTypeModel' + valueS);
	},
	// 根据ID查询工作事项模版子表分类
	getWorkItemTypeSubModel(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/interfaces/workItemTypeSub/getWorkItemTypeSubModel' + valueS);
	},
	// 获取工作事项字段类型长度
	getFieldLength(params) {
		return httpReqest.get('/api/interfaces/workItemField/getFieldLength');
	},
	// 获取工作事项浏览框内容
	getFieldBrowse(params) {
		return httpReqest.get('/api/interfaces/workItemField/getFieldBrowse');
	},
	// 枚举查询
	findList(params) {
		return httpReqest.post('/api/interfaces/enumContent/findList', {});
	},
	// 分页查询工作事项模版主表
	findWorkItemTempPage(params) {
		return httpReqest.post('/api/interfaces/workItemTemp/findWorkItemTempPage', params);
	},
	// 按条件获取服务
	findTServiceByParams(params) {
		return httpReqest.post('/api/interfaces/tservice/findTServiceByParams', params);
	},
	// 按ID获取服务
	findTServiceItemByParams(params) {
		return httpReqest.post('/api/interfaces/tservice/findTServiceItemByParams', params);
	},
	// 新增工作事项模版主表分类
	insertWorkItemTypeModel(params) {
		return httpReqest.post('/api/interfaces/workItemType/insertWorkItemTypeModel', params);
	},
	// 查询公司
	getCompanyData() {
		return httpReqest.get('/api/uaa/findRoleCompanyDataVoByMactivity?fmactivity=111712011447700301');
	},
	// 修改工作事项模版主表分类
	updateWorkItemTypeModel(params) {
		return httpReqest.post('/api/interfaces/workItemType/updateWorkItemTypeModel', params);
	},
	// 修改枚举
	modify(params) {
		return httpReqest.post('/api/interfaces/enumContent/modify', params);
	},
	// 新增（type:1:枚举类别；2：枚举内容 枚举内容需要设置PID，PID为对应枚举类别的ID）
	add(params) {
		return httpReqest.post('/api/interfaces/enumContent/add', params);
	},
	//人员/用户/职务-列表查询
	findConList(url, params) {
		return httpReqest.post('/api/interfaces/' + url, params);
	},
	// 新增（type:1:枚举类别；2：枚举内容 枚举内容需要设置PID，PID为对应枚举类别的ID）
	dynamicinterface(params, item) {
		if(item.requestMethod == "get") {
			var valueS = '?';
			for(var item in params) {
				valueS += item + "=" + params[item] + "&";
			}
			if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
				valueS = valueS.slice(0, valueS.length - 1);
			}
			return httpReqest.get('/api/interfaces/' + item.interfacePath + valueS);
		} else {
			return httpReqest.post('/api/interfaces/' + item.interfacePath, params);
		}
	},
	//新增工作事项模版主表
	insertWorkItemTempModel(params) {
		return httpReqest.post('/api/interfaces/workItemTemp/insertWorkItemTempModel', params);
	},
	//修改工作事项模版主表
	updateWorkItemTempModel(params) {
		return httpReqest.post('/api/interfaces/workItemTemp/updateWorkItemTempModel', params);
	},
	//修改工作事项模版子表
	updateWorkItemTempSubModel(params) {
		return httpReqest.post('/api/interfaces/workItemTempSub/updateWorkItemTempSubModel', params);
	},
	//分页查询工作事项，必填参数creator
	findPage(params) {
		return httpReqest.post('/api/interfaces/workItem/findPage', params);
	},
	//工作事项修改   必填字段：srcId、oprStatus（主表、明细行都需要）
	updateWorkItem(params) {
		return httpReqest.post('/api/interfaces/workItem/updateWorkItem', params);
	},
	//工作事项上传
	uploadFile(params) {        
		return  httpReqest.post('/api/interfaces/attachment/uploadFile', params);    
	},
	//查询附件
	findlnfosList(params) {        
		return  httpReqest.post('/api/interfaces/attachment/findInfosList', params);    
	},
	//根据ID查询工作事项模版主表
	getWorkItemTempModel(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/interfaces/workItemTemp/getWorkItemTempModel' + valueS);
	},
	//根据ID查询工作事项模版子表
	getWorkItemTempSubModel(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/interfaces/workItemTempSub/getWorkItemTempSubModel' + valueS);
	},
	//根据ID查询工作事项详情
	findDataBySrcId(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/interfaces/workItem/findDataBySrcId' + valueS);
	},
	//根据ID查询工作事项模版
	findById(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/interfaces/workItem/findById' + valueS);
	},
	//通过模版查询权限
	findRoleAuthByWorkItem(params) {
		return httpReqest.post('/api/interfaces/workItemAuth/findRoleAuthByWorkItem', params);
	},
	//通过角色查询模版
	findWorkItemByRoleId(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/interfaces/workItemAuth/findWorkItemByRoleId' + valueS);
	},
	//通过人员查询模版
	findWorkItemByUser(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/interfaces/workItemAuthUser/findWorkItemByUser' + valueS);
	},
	//通过模板查询人员
	findUserAuthByWorkItem(params) {
		return httpReqest.post('/api/interfaces/workItemAuthUser/findUserAuthByWorkItem', params);
	},
	//删除附件
	deleteInfo(params) {
		var valueS = '?';
		for(var item in params) {
			valueS += item + "=" + params[item] + "&";
		}
		if(valueS.slice(valueS.length - 1, valueS.length) === "&") {
			valueS = valueS.slice(0, valueS.length - 1);
		}
		return httpReqest.get('/api/interfaces/attachment/deleteInfo' + valueS);
	},
	//api手动输入接口名称
	apiUrl(url, params) {
		return httpReqest.post('/api/interfaces/' + url, params);
	},

};

export default collaborativeOffice;