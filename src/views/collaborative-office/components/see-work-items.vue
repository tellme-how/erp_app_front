<template>
	<div style="height: 85vh; overflow-y:scroll">
		<formAndTable :files="context.files" dis="1" showAdd="2" ref="child" :form-data="conData"></formAndTable>
		<!--弹出框-->
		<!--<el-dialog title="工作事项模板主表" top="1vh" :destroy-on-close="true" v-if="dialogVisible" center :visible.sync="dialogVisible" width="80%">
			<selectMainTable show="1" status="3" :userId="UserId" :company="companyID" ref="childMain"></selectMainTable>
			<div slot="footer" class="dialog-footer">
				<el-button type="success"  icon="el-icon-check" size="small" @click="getDialogVisible">确定</el-button>
				<el-button type="warning"  icon="el-icon-close" size="small" @click="dialogVisible = false">取消</el-button>
			</div>
		</el-dialog>-->
	</div>
</template>
<script>
	//工作事项主表模板
	//	import selectMainTable from './select-main-table';
	//预览
	import formAndTable from './form-and-table';
	export default {
		components: {
			//			selectMainTable,
			formAndTable
		},
		props: {
			//值
			context: Object,
			showSeeOrUpd: String,
			todoFlag: Boolean
		},
		data() {
			return {
				UserId: "",
				companyID: {},
				//主表弹出框
				dialogVisible: false,
				company: "",
				//主表ID
				tempId: "",
				conData: {
					top: {},
					bottom: []
				},
				//主表tableName
				tableName: "",
				//主表ID
				tempId: "",
				//全部服务
				tServiceByParams: JSON.parse(localStorage.getItem('tServiceByParams')),
				//全部公司
				CompanyData: JSON.parse(localStorage.getItem('CompanyData')),
				//全部枚举
				selectList: "",
				//全部工作事项
				fieldBrowseList: JSON.parse(localStorage.getItem('fieldBrowseList')),
				//公司部门职位的合集
				allOrganizationInfo: JSON.parse(localStorage.getItem('allOrganizationInfo')),
			}
		},
		created() {
			//最上端公司选择
			this.CompanyData.forEach(item => {
				if(item.id == this.context.company) {
					this.company = item
				}
			})
			this.$api.collaborativeOffice.findList({}).then(data => {
				this.selectList = data.data.data
				this.getDialogVisible()
			})
			console.log(this.conData)
		},
		watch: {
			context: {         
				handler(newVal, oldVal) {
					this.getDialogVisible()        
				},
				         deep:  true    
			}
		},
		 
		methods: {
			//选择模板
			selectMainTable() {
				this.companyID = this.company;
				this.UserId = localStorage.getItem("ms_userId");
				this.dialogVisible = true;
			},
			//提交/暂存
			submitForm(status) {
				//校验所有必填字段
				if(this.$refs.child.onSubmit()) {
					//获取返回字段的合集
					var backData = {
						jsonStr: this.$refs.child.conData
					}
					/*
					 * 存入外层信息
					 * */
					//单据编号
					backData.voucherId = "";
					//标题
					backData.title = JSON.parse(JSON.stringify(backData.jsonStr.title))
					//经办人
					backData.gestor = JSON.parse(JSON.stringify(backData.jsonStr.gestor))
					//经办部门
					backData.gestorDept = JSON.parse(JSON.stringify(backData.jsonStr.gestorDept))
					//经办时间

					backData.voucherTime = JSON.parse(JSON.stringify(backData.jsonStr.voucherTime))
					//公司code

					backData.companyCode = this.company.code
					//登陆人
					backData.creator = localStorage.getItem('ms_userId')
					//暂存1 提交2
					backData.status = status
					//主表名称
					backData.tableName = this.tableName
					//主表字段-业务活动ID
					backData.activityId = this.activityId
					//主表Id
					backData.tempId = this.tempId
					backData.srcId = JSON.parse(JSON.stringify(this.$refs.child.conData.id))
					backData.oprStatus = 2

					/*
					 * 存入里层信息
					 * */
					//状态
					backData.jsonStr.status = status
					//公司ID
					backData.jsonStr.company = this.company.id
					/*
					 * 删除所有显示内容  _NameShow
					 * */
					//复制数据（保证删除后页面显示不删除）
					var con = JSON.parse(JSON.stringify(backData.jsonStr))
					for(var key in con) {
						//找到里层（子表）数据
						if(typeof(con[key]) == "object") {
							//循环删除里层的显示数据
							con[key].forEach(item => {
								//后台要的子表ID
								this.$set(item, "tempSubId", key)
								for(var keyItem in item) {
									if(keyItem.indexOf("_NameShow") != -1) {
										item[keyItem] = undefined
									}
									if(keyItem.indexOf("state") != -1) {
										item[keyItem] = undefined
									}
								}
							})
						}
						//删除外层（主表）的显示数据
						if(key.indexOf("_NameShow") != -1) {
							con[key] = undefined
						}
					}
					//后台需要json格式的数据 
					backData.jsonStr = JSON.stringify(con)
					this.$api.collaborativeOffice.updateWorkItem(backData).then(data => {
						if(this.dataBack(data, "修改成功")) {
							this.$refs.child.toUpload(this.context.id)
							this.$parent.toSelect()
						}
					})
				} else {
					this.goOut("请填写必填的数据")
				}
			},
			//选择模板
			getDialogVisible() {
				//获取模板详细数据
				this.$api.collaborativeOffice.findById({
					id: this.context.tempId
				}).then(data => {
					console.log(data)
					this.activityId = data.data.data.workItemTemp.activityId
					//整理传入子组件的数据top 主表  bottom 子表
					this.tempId = this.context.tempId
					this.tableName = data.data.data.workItemTemp.tableName
					this.conData.top = data.data.data.workItemTemp
					this.$set(this.conData.top, "wholeData", this.context)
					this.conData.bottom = data.data.data.workItemTempSub
					this.preview(this.conData.top.lines, "", 1)
					this.conData.bottom.forEach((val, index) => {
						this.$set(val, "wholeData", this.context)
						this.preview(val.lines, index, 2)
					})
					//子表模板排序
					this.conData.bottom.sort((a1, b1) => {
						//return a1.orderNum - b1.orderNum
						return Number(a1.orderNum) - Number(b1.orderNum)
					})
					//关闭弹出框
					this.dialogVisible = false
					//显示提交按钮
					this.showFig = true
				})
			},
			//数据整理
			preview(rowConList, rowIndex, state) {
				var cur = []
				let obj = {};
				//循环判断是否有添加服务的字段名
				rowConList.forEach((item, index1) => {
					this.tServiceByParams.forEach(val => {
						if(item.serviceId != null && item.serviceId == val.foid) {
							//服务显示名称
							this.$set(item, 'serviceCon', val.fname)
							//查询服务的参数：fid是根据条件查询的“条件” fcode是具体查询哪条服务的内容
							this.$set(item, 'serviceNow', {
								fid: "",
								fcode: val.fcode
							})
						}
					})
					item.parameterList = []
					//时间控件计算差值
					rowConList.forEach(itemChild => {
						//通过‘-’符号确定需要计算的两边
						if(item.serviceId == 5 && !this.noNull(item.parameter) && item.parameter.indexOf('-') != -1) {
							//left right 分别是需要计算的两个值的字段名称
							var index = item.parameter.indexOf('-')
							var left = item.parameter.substring(0, index)
							var right = item.parameter.substring(index + 1)
							//两个字段都要添加属性parameterList，里面存储需要计算的字段名和需要显示的字段名child
							if(left == itemChild.field || right == itemChild.field) {
								itemChild.parameterList = {}
								itemChild.parameterList.left = left
								itemChild.parameterList.right = right
								itemChild.parameterList.child = item.field
							}
						}
						//发现被添加服务的字段后，绑定双方
						if(itemChild.parameter == item.field) {
							item.parameterList.push(itemChild.field)
						}
					})
					//行序按照填写排序
					item.fieldTypeName = this.fieldTypeShow(item)
					if(obj[item.showNum]) {
						cur.forEach(val => {
							if(val.showNum == item.showNum) {
								val.colList.push(item)
							}
						})
					} else {
						obj[item.showNum] = true
						cur.push({
							showNum: item.showNum,
							colList: [item]
						});
					}
				})
				//列序按照填写排序
				var index = 0
				cur.sort((a, b) => {
					a.colList.sort((a1, b1) => {
						//return a1.orderNum - b1.orderNum
						return Number(a1.orderNum) - Number(b1.orderNum)
					})
					if(index == 0) {
						b.colList.sort((a1, b1) => {
							//return a1.orderNum - b1.orderNum
							return Number(a1.orderNum) - Number(b1.orderNum)
						})
						index++
					}
					//return a.showNum - b.showNum
					return Number(a.showNum) - Number(b.showNum)
				})
				//如果是主表，直接存入数据，如果是子表，输入全部存入conList里，并且排序
				if(state == 1) {
					this.$set(this.conData.top, "rowList", cur)
				} else {
					if(this.conData.bottom[rowIndex].type == 2) {
						this.$set(this.conData.bottom[rowIndex], "conList", [])
						cur.forEach(val1 => {
							val1.colList.forEach(val2 => {
								this.conData.bottom[rowIndex].conList.push(val2)
							})
						})
						this.conData.bottom[rowIndex].conList.sort((a1, b1) => {
							//return a1.orderNum - b1.orderNum
							return Number(a1.orderNum) - Number(b1.orderNum)
						})
					}
					this.conData.bottom[rowIndex].rowList = cur
				}
			},
			maketree(data, type) {
				let parent = [];
				for(var i = data[0].children.length - 1; i >= 0; i--) {
					if(type == "公司") {
						if(data[0].children[i].ftype == 1) {
							parent.push(data[0].children[i]);
						}
					} else {
						if(data[0].children[i].ftype == 1 || data[0].children[i].ftype == 2) {
							parent.push(data[0].children[i]);
						}
					}
				}
				children(parent, type);

				function children(parent, type) {
					if(parent) {
						for(var i = parent.length - 1; i >= 0; i--) {
							if(parent[i].children) {
								let obj = parent[i];
								obj.childrenList = [];
								for(var j = parent[i].children.length - 1; j >= 0; j--) {
									if(type == "公司") {
										if(parent[i].children[j].ftype == 1) {
											obj.childrenList.push(parent[i].children[j]);
										}
									} else {
										if(parent[i].children[j].ftype == 1 || parent[i].children[j].ftype == 2) {
											obj.childrenList.push(parent[i].children[j]);
										}
									}
								}
								obj.children = [];
								obj.children = obj.childrenList;
								delete obj.childrenList;
								parent[i] = obj;
								children(parent[i].children, type);
							} else {
								parent[i].children = [];
							}
						}
					}
				}
				let Fdata = data[0];
				Fdata.children = parent;
				let RetrunData = [];
				RetrunData.push(Fdata);
				return RetrunData;
			},
			//添加校验（显示的值的校验)
			fieldTypeShow(item) {
				if(item.fieldType == 9) {
					this.selectList.forEach(val => {
						if(item.fieldContent == val.id) {
							item.resList = val.resList
						}
					})
				}
				if(item.fieldType == 1) {
					this.fieldBrowseList.forEach(val => {
						if(item.fieldContent == val.id) {
							item.toSelect = val
						}
					})
				}
				//添加form动态表单的比对值fieldTypeName
				switch(item.fieldType) {
					//1浏览框、2字符型、3文本型、4整型、5浮点型、6富文本、7日期控件、8时间控件、9枚举项、10复选框
					//重组浏览框内的显示数据
					case "1":
						//浏览框 : 一共有7种，其中1：公司，2：部门，3：职位可以共同使用同一个接口
						var list = JSON.parse(JSON.stringify(this.allOrganizationInfo))
						//公司
						if(item.toSelect.id == 1) {
							//删除部门和职位信息
							/*for(var i = list[0].children.length - 1; i >= 0; i--) {
								if(list[0].children[i].ftype == 2) {
									list[0].children.splice(i, 1)
								} else {
									list[0].children[i].children = []
								}
							}
							item.browseBoxList = list[0].children
							*/
							let ComData = this.maketree(list, '公司');
							item.browseBoxList = ComData[0].children;
							//部门
						} else if(item.toSelect.id == 2) {
							//删除职位信息
							/*list[0].children.forEach(val => {
								if(typeof(val.children) != "undefined") {
									val.children.forEach(valChild => {
										valChild.children = []
									})
								}
							})
							item.browseBoxList = list[0].children
							*/
							let ZhiwuData = this.maketree(list, '职位');
							item.browseBoxList = ZhiwuData[0].children
							//职位（无需删除，保留原数据）
						} else if(item.toSelect.id == 3) {
							item.browseBoxList = list[0].children
						}
						return "browseBox"
						break;
					case "2":
						return "character"
						break;
					case "3":
						return "textType"
						break;
					case "4":
						return "integers"
						break;
					case "5":
						return "floatingPoint"
						break;
					case "6":
						return "richText"
						break;
					case "7":
						return "dateControl"
						break;
					case "8":
						return "timeControl"
						break;
					case "9":
						return "select"
						break;
					case "10":
						return "checkBox"
						break;
				}
			},
		}
	}
</script>
<style scoped="scoped">
	.el-icon-star-on:before {
		color: red;
		font-size: 20px;
	}
	
	>>>.el-card {
		margin-bottom: 10px;
	}
	
	>>>.el-card__body {
		padding: 10px;
	}
	
	>>>.el-input.is-disabled .el-input__inner {
		color: #000000 !important;
	}
	
	>>>.el-textarea.is-disabled .el-textarea__inner {
		color: #000000 !important;
	}
	
	>>>.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
		border-color: #000000!important;
	}
</style>