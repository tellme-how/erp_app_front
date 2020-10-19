<template>
	<div>
		<lineTable2 :dis="dis" :linesList="linesList"></lineTable2>
		<van-popup v-model="showUp" position="right" :style="{ width: '100%' , height: '100%' }">
			<van-nav-bar title="新增" left-text="返回" right-text="提交" left-arrow @click-left="showUp = false" @click-right="toSave" />
			<formIcon v-if="showUp" ref="formDataChildren" dis="2" showAdd='1' show="4" :form-data="formData"></formIcon>
			<div style="margin-top: 10vh;">
			</div>
		</van-popup>
	</div>
</template>

<script>
	//所有弹出框
	import formIcon from '../../../../views/collaborative-office/components/encapsulation/form-dynamic';
	import formIconComponents from '../../../../views/collaborative-office/components/encapsulation/sub-components/form-icon-components';
	//	import workflowDialog from '../../../../views/collaborative-office/components/encapsulation/sub-components/workflow-dialog';
	//富文本
	import { quillEditor } from 'vue-quill-editor'; //调用编辑器
	import 'quill/dist/quill.snow.css';
	import * as Quill from 'quill';
	import { computed } from '../computed.js';
	export default {
		components: {
			quillEditor,
			formIconComponents,
			formIcon,
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
				showUp: false,
				linesList: [],
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
				stateType: 0,
				backList: [],
				listOther: []
			}
		},
		created() {
			var list = JSON.parse(JSON.stringify(this.formData.conList))
			if(this.dis != 1) {
				this.linesList = [{
					list: ["poiul1"]
				}]
			}
			list.forEach(item => {
				this.linesList.push({
					value: item.field,
					list: [item.fieldName],
					type: item.fieldType,
				})
			})
			if(typeof(this.formData.conList) != "undefined" && this.formData.conList.length != 0) {
				//查看1  新增2  修改3
				this.$api.collaborativeOffice.findWorkItemList({
					gestorOid: this.formData.wholeData.gestor
				}).then(data => {
					console.log(this.dis)
					if(this.dis == 3 || this.dis == 1) {
						this.get_NameShow(data.data.data)
						if(this.dis == 3) {
							this.ruleForm.lines.forEach(item => {
								this.linesList[0].list.push('poiul2' + "-" + item.id)
							})
						}
						this.ruleForm.lines.forEach((val, index) => {
							this.linesList.forEach((item, index2) => {
								for(var key in val) {
									if(key == item.value) {
										if(typeof(val[key + '_NameShow']) != 'undefined') {
											this.$set(item.list, index + 1, val[key + '_NameShow'])
										} else {
											this.$set(item.list, index + 1, val[key])
										}
									}
								}
							})
						})
					}
					this.backList = this.ruleForm.lines
				})
				this.formData.conList.forEach(item => {
					this.$set(this.rowNow, item.field, "")
				})
				this.$set(this.rowNow, "tableName", this.formData.tableName)
				this.$set(this.rowNow, "oprStatus", 1)
				this.getrulesList()

			}
		},
		//注释同form-dynamic 
		methods: {
			toAdd() {
				this.showUp = true
			},
			toDel(key, val) {
				this.backList.forEach(item => {
					if(val.substring(val.indexOf('-') + 1) == item.id) {
						item.oprStatus = 3
					}
				})
				this.linesList.forEach(item => {
					item.list.splice(key, 1)
				})
			},
			toSave() {
				this.$refs.formDataChildren.onSubmit().then(data => {
					if(data) {
						var list = this.$refs.formDataChildren.ruleForm
						this.backList.push(list)
						this.linesList[0].list.push('poiul2')
						this.linesList.forEach((item, index) => {
							var state = true
							if(index != 0) {
								for(var key in list) {
									if(item.value == key) {
										state = false
										if(typeof(list[key + '_NameShow']) == "undefined") {
											if(item.type == 10) {
												if(list[key] == 1) {
													item.list.push('已选中')
												} else {
													item.list.push('未选中')
												}
											} else {
												item.list.push(list[key])
											}
										} else {
											item.list.push(list[key + '_NameShow'])
										}
									}
								}
								if(state) {
									item.list.push("")
								}
							}
						})
						this.showUp = false
					}
				})
			},
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
										if(this.noNull(val[keyVal]) || isNaN(val[keyVal])) {
											val[keyVal] = ""
										} else {
											val[keyVal] = parseInt(val[keyVal])
										}
									}
									if(item.fieldType == 5 && item.field == keyVal) {
										if(this.noNull(val[keyVal]) || isNaN(val[keyVal])) {
											val[keyVal] = ""
										} else {
											val[keyVal] = parseFloat(val[keyVal])
										}
									}
									if(item.fieldType == 9 && item.field == keyVal) {
										item.resList.forEach(aaa => {
											if(aaa.id == val[keyVal]) {
												this.$set(val, keyVal + "_NameShow", aaa.name)
											}
										})
									}
									if(item.fieldType == 10 && item.field == keyVal) {
										if(!this.noNull(val[keyVal])) {
											if(val[keyVal] == 1) {
												this.$set(val, keyVal + "_NameShow", '是')
											} else {
												this.$set(val, keyVal + "_NameShow", '否')
											}
										}
									}
									if(item.fieldType == 6 && item.field == keyVal && !this.noNull(val[keyVal])) {
										this.$set(val, keyVal + "_NameShow", '请至PC端进行查看!')
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
											case "2":
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
														if(itemChild.foid == val) {
															if(indexVal == idList.length - 1) {
																nameList = nameList + itemChild.fname
															} else {
																nameList = nameList + itemChild.fname + ","
															}
														}
														if(typeof(itemChild.children) != "undefined") {
															itemChild.children.forEach(itemChild2 => {
																if(itemChild2.foid == val) {
																	if(indexVal == idList.length - 1) {
																		nameList = nameList + itemChild2.fname
																	} else {
																		nameList = nameList + itemChild2.fname + ","
																	}
																}
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
						switch(item.fieldType) {
							case "2":
								this.rules[item.field].push({
									pattern: /^.{0,1500}$/,
									message: '请输入正确的' + item.fieldName,
									trigger: 'change'
								})
								return "integers"
								break;
							case "3":
								this.rules[item.field].push({
									pattern: /^.{0,1500}$/,
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
									pattern: /^.{0,20}$/,
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
									pattern: /^.{0,20}$/,
									message: '请输入正确的' + item.fieldName,
									trigger: 'change'
								})
								return "floatingPoint"
								break;
						}
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

<style>
	.treeDivClass {
		overflow: auto;
	}
	
	>>>.el-dialog__body {
		border-bottom: 1px solid #dcdfe6;
		min-height: calc(100vh - 300px);
		overflow-y: auto;
	}
	
	.el-table .el-table__expanded-cell {
		background-color: transparent;
	}
	
	.el-table th .el-table tr {
		background-color: transparent;
	}
</style>