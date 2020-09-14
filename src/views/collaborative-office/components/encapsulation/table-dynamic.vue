<template>
	<div>
		<el-form :model="ruleForm" :disabled="dis == '1'" :rules="rules" ref="ruleFormTable">
			<el-table size="small" height="400" :data="ruleForm.lines.filter(v => v.oprStatus != 3)" border style="width: 100%">
				<el-table-column v-for="(item,index) in formData.conList" :key="index" prop="field" :label="item.fieldName" align="center">
					<template slot-scope="scope">
						<el-form-item v-if="item.fieldTypeName == 'browseBox' && item.show" :prop="'lines[' + scope.$index + '].' + item.field +'_NameShow'" :rules="rules[item.field + '_NameShow']">
							<!-- 浏览框 -->
							<a v-if="dis == '1' && item.toSelect.id == '7'" href="javascript:void(0)">{{scope.row[item.field + '_NameShow']}}</a>
							<el-input v-else style="width: 100%;" v-model="scope.row[item.field + '_NameShow']" disabled>
								<el-button @click=" findDialogVisible(item,scope.row)" slot="append" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
						<el-form-item v-else :prop="'lines[' + scope.$index + '].' + item.field" :rules="rules[item.field]">
							<!-- 字符型 / 文本框 / 整型 / 浮点型 -->
							<el-input @focus="fuwu(item,scope.row)" v-model="scope.row[item.field]" v-if="item.fieldTypeName=='character' || item.fieldTypeName=='textType' || item.fieldTypeName=='integers' || item.fieldTypeName=='floatingPoint' && item.show" style="width: 100%;" :disabled="!item.edit" />
							<!--富文本-->
							<quill-editor v-if="item.fieldTypeName=='richText' && item.show" style="width: 100%;" v-model="scope.row[item.field]" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)"></quill-editor>
							<!-- 日期选择器 -->
							<el-date-picker v-if="item.fieldTypeName=='dateControl' && item.show" @change="getDate(item)" style="width: 100%;" :disabled="!item.edit" v-model="scope.row[item.field]" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
							<!--时间控件-->
							<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期时间" type="datetime" v-if="item.fieldTypeName == 'timeControl' && item.show" style="width: 100%;" v-model="ruleForm[item.field]"></el-date-picker>
							<!-- 下拉框 -->
							<el-select v-if="item.fieldTypeName=='select' && item.show" style="width: 100%;" v-model="scope.row[item.field]" clearable :disabled="!item.edit" :placeholder="item.placeholder">
								<el-option v-for="itemSelect in item.resList" :key="itemSelect.id" :label="itemSelect.name" :value="itemSelect.id" />
							</el-select>
							<!--复选框-->
							<el-checkbox true-label='1' false-label='0' v-if="item.fieldTypeName == 'checkBox' && item.show" style="width: 100%;" v-model="scope.row[item.field]" :disabled="!item.edit"></el-checkbox>
						</el-form-item>
					</template>
				</el-table-column>
				<el-table-column v-if="dis != '1'" align="right" width="100">
					<template slot="header" slot-scope="scope">
						<el-button size="mini" @click="addRow()">新建</el-button>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="danger" @click="delRow(scope.$index,scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-form>
		<!--弹出框-->
		<div v-if="dialogVisible">
			<el-dialog :title="titleShow" top="1vh" destroy-on-close center :visible.sync="dialogVisible" width="80%">
				<formIconComponents ref="child" :showFig="showCon" :dataCon="dataCon"></formIconComponents>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="getDialogVisible">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<!--弹出框-工作流-->
		<!--<workflowDialog ref="childWork"></workflowDialog>-->
	</div>
</template>

<script>
	//所有弹出框
	import formIconComponents from '../../../../views/collaborative-office/components/encapsulation/sub-components/form-icon-components';
//	import workflowDialog from '../../../../views/collaborative-office/components/encapsulation/sub-components/workflow-dialog';
	//富文本
//	import { quillEditor } from 'vue-quill-editor'; //调用编辑器
//	import 'quill/dist/quill.snow.css';
//	import * as Quill from 'quill';
	import { computed } from '../computed.js';
	export default {
		components: {
//			quillEditor,
			formIconComponents,
//			workflowDialog
		},
		props: {
			//传入的data值
			formData: {
				type: Object,
				required: true
			},
			dis: {
				type: String,
				required: true
			},
		},
		data() {
			return {
				rules: {}, //表单
				ruleForm: {
					lines: [],
				},
				//弹出框表头
				titleShow: " ",
				//传入类型
				showCon: " ",
				//传入值
				dataCon: {},
				//弹出框
				dialogVisible: false,
				//中间变量
				dialogVisibleCon: {},
				//scope.row中间变量
				tableRowCon: {},
				//富文本基础数据
				editorOption: this.$GLOBAL.editorOption,
				rowNow: {},
				//人员
				staffList: JSON.parse(localStorage.getItem('staffList')),
				//用户
				userList: JSON.parse(localStorage.getItem('userList')),
				//职务
				positionList: JSON.parse(localStorage.getItem('positionList')),
				stateType: 0
			}
		},
		created() {
			if(typeof(this.formData.conList) != "undefined" && this.formData.conList.length != 0) {
				//查看1  新增2  修改3
				this.$api.collaborativeOffice.findPage({
					size: 1000000,
					page: 1,
					creator: localStorage.getItem('ms_userId')
				}).then(data => {
					this.get_NameShow(data.data.data.rows)
				})
				this.formData.conList.forEach(item => {
					this.$set(this.rowNow, item.field, "")
				})
				this.$set(this.rowNow, "tableName", this.formData.tableName)
				this.$set(this.rowNow, "oprStatus", 1)
				if(this.dis == 2) {
					this.ruleForm.lines.push(JSON.parse(JSON.stringify(this.rowNow)))
				}
				this.getrulesList()
			}
		},
		//注释同form-dynamic 
		methods: {
			fuwu(row, rowTable) {
				if(row.serviceId == 11) {
					let result = computed(row.parameter, rowTable)
					if(result.successCon) {
						rowTable[row.field] = result.con
					} else {
						this.goOut("数据或者公式不正确, 请重新输入.")
					}
				}
			},
			//查看页面获取 _NameShow
			get_NameShow(dataList) {
				for(var key in this.formData.wholeData) {
					if(this.formData.id == key) {
						this.ruleForm.lines = this.formData.wholeData[key]
						this.formData.conList.forEach(item => {
							this.ruleForm.lines.forEach(val => {
								if(this.dis == 3) {
									this.$set(val, "oprStatus", 2)
									this.$set(val, "tableName", this.formData.tableName)
								}
								for(var keyVal in val) {
									if(item.fieldType == 4 && item.field == keyVal) {
										val[keyVal] = parseInt(val[keyVal])
									}
									if(item.fieldType == 5 && item.field == keyVal) {
										val[keyVal] = parseFloat(val[keyVal])
									}
									if(item.fieldType == 1 && item.field == keyVal) {
										switch(item.toSelect.id) {
											case "1":
												var nameList = ""
												var idList = val[keyVal].split(',')
												idList.forEach((val, indexVal) => {
													item.browseBoxList.forEach(itemChild => {
														if(itemChild.foid == val) {
															if(indexVal == idList.length - 1) {
																nameList = nameList + itemChild.fname
															} else {
																nameList = nameList + itemChild.fname + ","
															}
														}
													})
												})
												this.$set(val, keyVal + "_NameShow", nameList)
												break;
											case "2":
												var nameList = ""
												var idList = val[keyVal].split(',')
												idList.forEach((val, indexVal) => {
													item.browseBoxList.forEach(itemChild => {
														if(typeof(itemChild.children) != "undefined") {
															itemChild.children.forEach(itemChild2 => {
																if(itemChild2.foid == val) {
																	if(indexVal == idList.length - 1) {
																		nameList = nameList + itemChild2.fname
																	} else {
																		nameList = nameList + itemChild2.fname + ","
																	}
																}
															})
														}
													})
												})
												this.$set(val, keyVal + "_NameShow", nameList)
												break;
											case "3":
												var nameList = ""
												var idList = val[keyVal].split(',')
												idList.forEach((val, indexVal) => {
													item.browseBoxList.forEach(itemChild => {
														if(typeof(itemChild.children) != "undefined") {
															itemChild.children.forEach(itemChild2 => {
																if(typeof(itemChild2.children) != "undefined") {
																	itemChild2.children.forEach(itemChild3 => {
																		if(itemChild3.foid == val) {
																			if(indexVal == idList.length - 1) {
																				nameList = nameList + itemChild3.fname
																			} else {
																				nameList = nameList + itemChild3.fname + ","
																			}
																		}
																	})
																}
															})
														}
													})
												})
												this.$set(val, keyVal + "_NameShow", nameList)
												break;
											case "4":
												var nameList = ""
												var idList = val[keyVal].split(',')
												idList.forEach((val, indexVal) => {
													this.staffList.forEach(itemChild => {
														if(itemChild.toid == val) {
															if(indexVal == idList.length - 1) {
																nameList = nameList + itemChild.tname
															} else {
																nameList = nameList + itemChild.tname + ","
															}
														}
													})
												})
												this.$set(val, keyVal + "_NameShow", nameList)
												break;
											case "5":
												var nameList = ""
												var idList = val[keyVal].split(',')
												idList.forEach((val, indexVal) => {
													this.userList.forEach(itemChild => {
														if(itemChild.foid == val) {
															if(indexVal == idList.length - 1) {
																nameList = nameList + itemChild.fname
															} else {
																nameList = nameList + itemChild.fname + ","
															}
														}
													})
												})
												this.$set(val, keyVal + "_NameShow", nameList)
												break;
											case "6":
												var nameList = ""
												var idList = val[keyVal].split(',')
												idList.forEach((val, indexVal) => {
													this.positionList.forEach(itemChild => {
														if(itemChild.foid == val) {
															if(indexVal == idList.length - 1) {
																nameList = nameList + itemChild.fname
															} else {
																nameList = nameList + itemChild.fname + ","
															}
														}
													})
												})
												this.$set(val, keyVal + "_NameShow", nameList)
												break;
											case "7":
												dataList.forEach(itemChild => {
													if(itemChild.srcId == val[keyVal]) {
														this.$set(val, keyVal + "_NameShow", itemChild.title)
													}
												})
												break;
										}
									}
								}
							})
						})
					}
				}
			},
			getWorkDialig(row) {
				this.$set(this.tableRowCon, this.dialogVisibleCon.field + '_NameShow', row.title)
				this.$set(this.tableRowCon, this.dialogVisibleCon.field, row.srcId) //如果有联动查询的数据
				this.$refs.childWork.dialogVisible = false
			},
			delRow(rowIndex, row) {
				if(this.dis == 2) {
					this.ruleForm.lines.splice(rowIndex, 1)
				} else if(this.dis == 3) {
					if(row.oprStatus == 1) {
						for(var i = this.ruleForm.lines.length - 1; i >= 0; i--) {
							if(this.ruleForm.lines[i].state == row.state) {
								this.ruleForm.lines.splice(i, 1)
							}
						}
					} else {
						this.$set(row, "oprStatus", 3)
					}
				}
			},
			addRow() {
				if(this.dis == 3) {
					this.$set(this.rowNow, "state", this.stateType)
					this.ruleForm.lines.push(JSON.parse(JSON.stringify(this.rowNow)))
					this.stateType++
				} else {
					this.ruleForm.lines.push(JSON.parse(JSON.stringify(this.rowNow)))
				}

			},
			getrulesList() {
				this.formData.conList.forEach(item => {
					this.rules[item.field] = []
					this.rules[item.field + "_NameShow"] = []
					if(item.required) {
						if(item.fieldType == 1) {
							this.rules[item.field + "_NameShow"].push({
								required: true,
								message: "请填写" + item.fieldName,
								trigger: 'change'
							})
						} else if(item.fieldType == 9) {
							this.rules[item.field].push({
								required: true,
								message: "请填写" + item.fieldName,
								trigger: 'change'
							})
						} else {
							this.rules[item.field].push({
								required: true,
								message: "请填写" + item.fieldName,
								trigger: 'change'
							})
						}
					}
					switch(item.fieldType) {
						case "2":
							this.rules[item.field].push({
								max: 1500,
								message: '请输入正确的' + item.fieldName,
								trigger: 'change'
							})
							return "integers"
							break;
						case "3":
							this.rules[item.field].push({
								max: 1500,
								message: '请输入正确的' + item.fieldName,
								trigger: 'change'
							})
							return "integers"
							break;
						case "4":
							//添加整型校验
							this.rules[item.field].push({
								pattern: /^-?[1-9]\d*$/,
								message: '请输入正确的' + item.fieldName,
								trigger: 'change'
							})
							this.rules[item.field].push({
								max: 20,
								message: '请输入正确的' + item.fieldName,
								trigger: 'change'
							})
							return "integers"
							break;
						case "5":
							//添加浮点型校验
							this.rules[item.field].push({
								pattern: /^([1-9]\d{0,15}|0)(\.\d{1,4})?$/,
								message: '请输入最多4位小数',
								trigger: 'change'
							})
							this.rules[item.field].push({
								max: 20,
								message: '请输入正确的' + item.fieldName,
								trigger: 'change'
							})
							return "floatingPoint"
							break;
					}
				})
			},
			//计算时间差值
			getDate(row) {
				//change写在所有的时间控件中，首先判断当前点击控件是否需要计算差值，且双方必须都有值
				if(typeof(row.parameterList.child) != "undefined") {
					//同上（太长了，不想写一起，屏幕太小显示不下）noNull是非空的公共方法，详见base.js
					if(!this.noNull(this.ruleForm[row.parameterList.left]) && !this.noNull(this.ruleForm[row.parameterList.right])) {
						var state = false
						this.formData.conList.forEach((val, index2) => {
							//确认当前控件里面有绑定的child数据（就是要接收差值的字段）并且服务code为“计算差值”
							if(val.field == row.parameterList.child && val.serviceNow.fcode == "service05") {
								state = true
							}
							//循环到最后，判断state状态，如果是true，代表满足条件，那么就需要改变child的值
							if(index == this.formData.conList.length - 1) {
								if(state) {
									//DateDiff 方法在下面，计算日期差值方法
									this.$set(this.ruleForm, row.parameterList.child, this.DateDiff(this.ruleForm[row.parameterList.left], this.ruleForm[row.parameterList.right]))
								}
							}
						})
					}
				}
			},
			//计算日期差值
			DateDiff(sDate1, sDate2) {
				var aDate, oDate1, oDate2, iDays
				aDate = sDate1.split("-")
				oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
				aDate = sDate2.split("-")
				oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
				iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
				return iDays
			},
			//服务10 为“根据登录用户查询”，进入页面是就要查询出数据并赋值，不需要点击操作
			async getOther() {
				//循环遍历所有的值
				for(var i2 = 0; i2 < this.formData.conList.length; i2++) {
					//判断是否为服务10
					if(typeof(this.formData.conList[i2].serviceNow) != "undefined" && this.formData.conList[i2].serviceNow.fcode == "service10") {
						//获取当前登陆人，变成fid，用来查询服务
						this.formData.conList[i2].serviceNow.fid = localStorage.getItem('ms_userId')
						//根据id和code查询服务
						var conNow = await this.$api.collaborativeOffice.findTServiceItemByParams(this.formData.conList[i2].serviceNow).then(data => {
							//当循环和调用同时存在时，使用async，await来控制时间，只有满足当前接口调用完成后，才继续循环
							return new Promise(resolve => {
								//返回id和name 用于显示或者存储(服务10不出意外应该是input，无法显示和存储不同，暂时没法解决，只能显示id)
								resolve({
									id: data.data.data.toid,
									name: data.data.data.tname
								})
							});
						})
						//存入值
						this.$set(this.ruleForm, this.formData.conList[i2].field, conNow.id)
						//							this.$set(this.ruleForm, this.formData.conList[i2].field +"_NameShow", conNow.name)
					}
				}
			},
			//弹出框确定
			getDialogVisible() {
				var dataBack = this.$refs.child.getDataBack()
				var label = ""
				var value = ""
				if(!this.dialogVisibleCon.choice) {
					if(dataBack.length > 1) {
						this.goOut("请单选")
						return
					}
				}
				dataBack.forEach((item, index) => {
					if(index == dataBack.length - 1) {
						if(this.showCon == "personnel") {
							label = label + item.tname
							value = value + item.toid
						} else {
							label = label + item.fname
							value = value + item.foid
						}
					} else {
						if(this.showCon == "personnel") {
							label = label + item.tname + ","
							value = value + item.toid + ","
						} else {
							label = label + item.fname + ","
							value = value + item.foid + ","
						}
					}
				})
				//获取子组件返回的id和name
				this.$set(this.tableRowCon, this.dialogVisibleCon.field + '_NameShow', label)
				this.$set(this.tableRowCon, this.dialogVisibleCon.field, value)
				//如果有联动查询的数据
				if(typeof(this.dialogVisibleCon.parameterList) != "undefined" && this.dialogVisibleCon.parameterList.length != 0) {
					//调用toGetServiceNow（绑定的联动改变字段，获取的选中id）
					this.toGetServiceNow(this.dialogVisibleCon.parameterList, value)
				}
				this.dialogVisible = false
			},
			/*
			 父子联动查询
			 * 
			 * 这里是分批分次的查询，！！‘联动的值可能是多个’！！，同样只有查询到值并整理好赋值之后，才会进入下层循环
			 * 
			 * */
			async toGetServiceNow(row, id) {
				//通过传入的子查询字段，找到最终的传入值
				for(var i = 0; i < row.length; i++) {
					for(var i2 = 0; i2 < this.formData.conList.length; i2++) {
						if(this.formData.conList[i2].field == row[i]) {
							//给服务条件赋值，serviceNow.code在之前已经获取到了，只需要传入查询id
							this.formData.conList[i2].serviceNow.fid = id
							//循环查询
							var conNow = await this.$api.collaborativeOffice.findTServiceItemByParams(this.formData.conList[i2].serviceNow).then(data => {
								return new Promise(resolve => {
									//把根据‘不同的服务’获取到的返回值从新赋值，都是id和name的形式，方便调用
									switch(this.formData.conList[i2].serviceNow.fcode) {
										case "service09":
										case "service08":
										case "service04":
										case "service01":
											resolve({
												id: data.data.data.foid,
												name: data.data.data.fname
											})
											break;
										case "service07":
										case "service06":
											resolve({
												id: data.data.data.vicePresidentId,
												name: data.data.data.vicePresidentName
											})
											break;
										case "service05":
											resolve({
												id: " ",
												name: " "
											})
											break;
										case "service03":
										case "service02":
											resolve({
												id: data.data.data.departmentLeaderId,
												name: data.data.data.departmentLeaderName
											})
											break;
									}
								});
							})
							//改变需要联动的值的内容和显示内容
							this.$set(this.tableRowCon, this.formData.conList[i2].field, conNow.id)
							this.$set(this.tableRowCon, this.formData.conList[i2].field + "_NameShow", conNow.name)
						}
					}
				}
			},
			//弹出框打开
			findDialogVisible(row, tableRow) {
				//取到中间值
				this.dialogVisibleCon = row
				this.tableRowCon = tableRow
				if(row.toSelect.id == 7) {
					this.$refs.childWork.dialogVisible = true
				} else {
					this.dialogVisible = true
				}
				/*
				 * 判断浏览框内显示的内容，并放入数据（公司，部门，职位在上层已经查询出来，直接放里面就行，
				 * 其他数据需要接口查询后才能显示
				 */
				switch(row.toSelect.id) {
					case "1":
						this.showCon = "organization"
						this.titleShow = "公司"
						this.$set(this.dataCon, "context", row.browseBoxList)
						typeof(this.tableRowCon[row.field]) != "undefined" ? this.$set(this.dataCon, "echo", this.tableRowCon[row.field].split(',')): this.$set(this.dataCon, "echo", [])
						break;
					case "2":
						this.showCon = "organization"
						this.titleShow = "部门"
						this.$set(this.dataCon, "context", row.browseBoxList)
						typeof(this.tableRowCon[row.field]) != "undefined" ? this.$set(this.dataCon, "echo", this.tableRowCon[row.field].split(',')): this.$set(this.dataCon, "echo", [])
						break;
					case "3":
						this.showCon = "organization"
						this.titleShow = "职位"
						this.$set(this.dataCon, "context", row.browseBoxList)
						typeof(this.tableRowCon[row.field]) != "undefined" ? this.$set(this.dataCon, "echo", this.tableRowCon[row.field].split(',')): this.$set(this.dataCon, "echo", [])
						break;
					case "4":
						this.showCon = "personnel"
						this.titleShow = "人员"
						break;
					case "5":
						this.showCon = "user"
						this.titleShow = "用户"
						break;
					case "6":
						this.showCon = "jobSet"
						this.titleShow = "职务"
						break;
				}
			},
			//提交
			onSubmit(formName) {
				var returnData = false
				this.$refs.ruleFormTable.validate((valid) => {
					if(valid) {
						returnData = true
					}
				});
				return returnData
			},
			//富文本事件
			onEditorBlur() {}, // 失去焦点事件
			onEditorFocus(event) {
				if(this.formDisabled == true) {
					event.enable(false);
				} else {
					event.enable(true);
				}
			}, // 获得焦点事件
			onEditorChange() {}, // 内容改变事件
		}
	};
</script>

<style scoped>
	.treeDivClass {
		height: 300px;
		overflow: auto;
	}
	
	>>>.el-dialog__body {
		border-bottom: 1px solid #dcdfe6;
		min-height: calc(100vh - 300px);
		overflow-y: auto;
	}
</style>