<template>
	<div class="flexMainre">
		<tabViews ref="childOher" :context="context" :valueState="valueState" :is="context.classId" :showSeeOrUpd="showSeeOrUpd"></tabViews>
		<approvalProcess :contextOther="context"></approvalProcess>
		<div style="height: 8vh;width: 100%;"></div>
		<div class="nextBtn" v-if="valueStateShow && showSeeOrUpd == '1'">
			<van-row>
				<van-col span="6">
					<van-field readonly clickable :value="value1" label="" placeholder="决策类型" @click="show = true" />
					<van-action-sheet v-model="show" :actions="columns" @select="onConfirm" />
				</van-col>
				<van-col span="16">
					<van-field v-model="value2" center clearable label="" placeholder="请输入审批意见">
						<template #button>
							<van-button @click="toDo" icon="success" size="mini" type="primary">提交</van-button>
						</template>
					</van-field>
				</van-col>
				<van-col style="height: 8vh;line-height: 8vh;" span="2">
					<van-icon size="20" @click="showShare = true" name="bars" />
					<van-share-sheet cancel-text="关闭" v-model="showShare" :options="options" @select="onSelect" />
				</van-col>
			</van-row>
		</div>
		<div class="nextBtn" v-if="valueStateShow && showSeeOrUpd == '3'">
			<van-row>
				<van-button @click="toSave" icon="success" size="mini" type="primary">提交</van-button>
			</van-row>
		</div>
		<div class="nextBtn4" v-if="!valueStateShow">
			<van-icon size="20" @click="showShare = true" name="bars" />
			<van-share-sheet cancel-text="关闭" v-model="showShare" :options="options" @select="onSelect" />
		</div>
		<personnelSelection v-if="showUser" :showChild="showChild" :showUser="showUser" @dataBackMethod="getDataBack"></personnelSelection>
		<personnelSelection v-if="showUser2" :showChild="showChild2" :showUser="showUser2" @dataBackMethod="getDataBack2"></personnelSelection>
		<van-popup v-model="showOther" :style="{ height: '12%',width:'100%' }">
			<van-field v-model="remark" autosize label="加批意见" type="input" />
			<van-button type="primary" size='small' @click="toDoOher">提交</van-button>
		</van-popup>
		<van-action-sheet description="请选择岗位" v-model="showActions" :actions="actions" @select="onSelectActions" />
	</div>
</template>

<script>
	//部门年度计划
	import DepartmentYearPlan from '../../views/my-desk/components/DepartmentYearPlan';
	//部门月度计划
	import DepartmentMonthPlan from '../../views/my-desk/components/DepartmentMonthPlan';
	//临时任务派发
	import TemporaryMission from '../../views/my-desk/components/TemporaryMission';
	//一岗一表 
	import FormPost from '../../views/my-desk/components/FormPost';
	//配合任务
	import CoordinationTask from '../../views/my-desk/components/CoordinationTask';
	//经济指标
	import OptionIndex from '../../views/my-desk/components/OptionIndex';
	//公司年度计划汇总
	import CompanyYearPlanCollect from '../../views/my-desk/components/CompanyYearPlanCollect';
	//员工考评表
	import StaffAppraisals from '../../views/my-desk/components/StaffAppraisals';
	//员工考评表汇总
	import StaffAppraisalsCollect from '../../views/my-desk/components/StaffAppraisalsCollect';
	//一人一表  (延期)
	import TaskDelayApply from '../../views/my-desk/components/TaskDelayApply';
	//一人一表  (作废)
	import TaskCancelApply from '../../views/my-desk/components/TaskCancelApply';
	//一人一表  (任务调整)
	import TaskAdjust from '../../views/my-desk/components/TaskAdjust';
	//一人一表  (人员变更)
	import AssignerChange from '../../views/my-desk/components/AssignerChange';
	//一人一表  (任务委托)
	import TaskEntrust from '../../views/my-desk/components/TaskEntrust';
	//一人一表  (报备)
	import TaskReport from '../../views/my-desk/components/TaskReport';
	//一人一表  (自评)
	import TaskSelfEvaluateApply from '../../views/my-desk/components/TaskSelfEvaluateApply';
	//会议申请
	import Meetingapplication from '../../views/my-desk/components/Meetingapplication';
	import oaRouter from '../../views/my-desk/components/oaRouter';
	import personnelSelection from './personnelSelection';
	import { Dialog } from 'vant';
	export default {
		components: {
			DepartmentYearPlan,
			TaskSelfEvaluateApply,
			TaskReport,
			TaskEntrust,
			AssignerChange,
			TaskAdjust,
			TaskCancelApply,
			TaskDelayApply,
			StaffAppraisalsCollect,
			StaffAppraisals,
			CompanyYearPlanCollect,
			OptionIndex,
			CoordinationTask,
			FormPost,
			TemporaryMission,
			oaRouter,
			personnelSelection,
			Meetingapplication,
			DepartmentMonthPlan
		},
		data() {
			return {
				showChild2 : 10,
				showUser2:false,
				actions: [],
				showActions: false,
				valueStateShow: false,
				remark: "",
				valueState: "",
				columns: [],
				value: "",
				value1: "",
				value2: "",
				show: false,
				showOther: false,
				context: {},
				tabViews: "",
				showShare: false,
				options: [],
				approvalProcess: [],
				dataBack: [],
				showUser: false,
				showChild: 3,
				showSeeOrUpd: "1",
				participator: ""
			};
		},
		created() {
			this.$store.commit("tabbarShow", false)
			if(this.$route.params.row) {
				sessionStorage.setItem("deskRow", JSON.stringify(this.$route.params.row));
			}
			if(this.$route.params.valueState) {
				sessionStorage.setItem("valueState", JSON.stringify(this.$route.params.valueState));
			}
			if(this.$route.params.dataBack) {
				sessionStorage.setItem("dataBack", JSON.stringify(this.$route.params.dataBack));
			}
			this.dataBack = JSON.parse(sessionStorage.getItem("dataBack"))
			this.context = JSON.parse(sessionStorage.getItem("deskRow"))
			this.valueState = JSON.parse(sessionStorage.getItem("valueState"))
			this.$store.commit("titleShow", this.context.fsubject)
			this.columns = []
			if((this.context.fsubject.substring(0, 3) == '退回：' && this.context.fcreator == localStorage.getItem("ms_userId")) || this.context.fcode == 'manpower') {
				this.showSeeOrUpd = "3";
			} else {
				this.showSeeOrUpd = "1";
			}
			this.$api.myDesk.getWfDecisionTypeConByCurNode({
				mailId: this.context.foid
			}).then(data => {
				for(var key in data.data.data) {
					this.columns.push({
						name: data.data.data[key],
						id: key
					})
				}
			})
			this.optionsShow()
		},
		methods: {
			getDataBack2(cur){
				this.submitMethod('手工指定', cur[0].foid);
				this.showUser2 = false
			},
			onSelectActions(val) {
				this.submitData(val.id)
			},
			toSave() {
				this.$refs.childOher.$refs.childOtherChild.forEach(item => {
					if((item.context.gestor == localStorage.getItem('ms_staffId') || typeof(item.context.gestor) == 'undefined') && this.showSeeOrUpd == 3) {
						item.submitForm(2)
					}
				})
			},
			getDataBack(dataBack, index, formData) {
				var participator = '';
				for(let j = 0; j < dataBack.length; j++) {
					participator += dataBack[j].foid + ',';
				}
				participator = participator.slice(0, participator.length - 1);
				//加签
				if(index == 1) {
					this.$api.myDesk.SeTaddTag({
						fmailOid: this.context.foid,
						fstaffOid: participator,
						fpublicity: formData.checkbox,
						fremark: formData.remark
					}).then(res => {
						this.goOk("加签成功");
						this.$router.go(-1);
					})
				} else if(index == 2) {
					//委托
					this.$api.myDesk.transmit({
						bizMailId: this.context.foid,
						currUserId: localStorage.getItem('ms_userId'),
						participator: participator,
						fremark: formData.remark
					}).then(res => {
						this.goOk("委托成功")
						this.$router.go(-1);
					})
				} else {
					//其他(转发等)
					this.$api.myDesk.setencyclic({
						currUserId: localStorage.getItem('ms_userId'),
						bizMailId: this.context.foid,
						participator: participator
					}).then(data => {
						if(data.data.data.msg == "success") {
							this.goOk("转发成功")
							this.$router.go(-1);
						}
					})
				}
				this.showShare = false
			},
			showUserClose() {
				this.showUser = false
				this.showUser2 = false
			},
			optionsShow() {
				if(this.valueState == 1) {
					if(this.context.fsubject.slice(0, 4).indexOf('转发') != -1 || this.context.fsubject.slice(0, 4).indexOf('抄送') != -1) {
						this.valueStateShow = false
						this.options = [{
							name: '转发',
							icon: this.$GLOBAL.htmlUrl + '转发.png'
						}, {
							name: '已阅',
							icon: this.$GLOBAL.htmlUrl + '已阅.png'
						}]
						if(this.context.fisAttention == 0) {
							this.options.push({
								name: '关注',
								icon: this.$GLOBAL.htmlUrl + '关注.png'
							})
						} else {
							this.options.push({
								name: '取消关注',
								icon: this.$GLOBAL.htmlUrl + '已关注.png'
							})
						}
					} else if(this.context.fsubject.slice(0, 4).indexOf('委托') != -1) {
						this.valueStateShow = true
						this.options = [{
							name: '转发',
							icon: this.$GLOBAL.htmlUrl + '转发.png'
						}, {
							name: '委托',
							icon: this.$GLOBAL.htmlUrl + '委托.png'
						}, {
							name: '加签',
							icon: this.$GLOBAL.htmlUrl + '加签.png'
						}]
						if(this.context.fisAttention == 0) {
							this.options.push({
								name: '关注',
								icon: this.$GLOBAL.htmlUrl + '关注.png'
							})
						} else {
							this.options.push({
								name: '取消关注',
								icon: this.$GLOBAL.htmlUrl + '已关注.png'
							})
						}
					} else if(this.context.fsubject.slice(0, 4).indexOf('正在加签') != -1) {
						this.valueStateShow = false
						this.options = [{
							name: '转发',
							icon: this.$GLOBAL.htmlUrl + '转发.png'
						}]
					} else if(this.context.fsubject.slice(0, 4).indexOf('加签') != -1) {
						this.valueStateShow = true
						this.options = [{
							name: '转发',
							icon: this.$GLOBAL.htmlUrl + '转发.png'
						}]
						if(this.context.fisAttention == 0) {
							this.options.push({
								name: '关注',
								icon: this.$GLOBAL.htmlUrl + '关注.png'
							})
						} else {
							this.options.push({
								name: '取消关注',
								icon: this.$GLOBAL.htmlUrl + '已关注.png'
							})
						}
					} else {
						this.valueStateShow = true
						this.options = [{
							name: '转发',
							icon: this.$GLOBAL.htmlUrl + '转发.png'
						}, {
							name: '委托',
							icon: this.$GLOBAL.htmlUrl + '委托.png'
						}, {
							name: '加签',
							icon: this.$GLOBAL.htmlUrl + '加签.png'
						}]
						if(this.context.fisAttention == 0) {
							this.options.push({
								name: '关注',
								icon: this.$GLOBAL.htmlUrl + '关注.png'
							})
						} else {
							this.options.push({
								name: '取消关注',
								icon: this.$GLOBAL.htmlUrl + '已关注.png'
							})
						}
					}
				} else if(this.valueState == 2) {
					this.valueStateShow = false
					this.options = [{
						name: '转发',
						icon: this.$GLOBAL.htmlUrl + '转发.png'
					}]
					if(this.context.fisAttention == 0) {
						this.options.push({
							name: '关注',
							icon: this.$GLOBAL.htmlUrl + '关注.png'
						})
					} else {
						this.options.push({
							name: '取消关注',
							icon: this.$GLOBAL.htmlUrl + '已关注.png'
						})
					}
				} else if(this.valueState == 3) {
					this.valueStateShow = false
					this.options = [{
						name: '转发',
						icon: this.$GLOBAL.htmlUrl + '转发.png'
					}, {
						name: '加批',
						icon: this.$GLOBAL.htmlUrl + '加批.png'
					}]
					if(this.context.fisAttention == 0) {
						this.options.push({
							name: '关注',
							icon: this.$GLOBAL.htmlUrl + '关注.png'
						})
					} else {
						this.options.push({
							name: '取消关注',
							icon: this.$GLOBAL.htmlUrl + '已关注.png'
						})
					}
				} else if(this.valueState == 4) {
					this.valueStateShow = false
					this.options = [{
						name: '转发',
						icon: this.$GLOBAL.htmlUrl + '转发.png'
					}]
					if(this.context.fisAttention == 0) {
						this.options.push({
							name: '关注',
							icon: this.$GLOBAL.htmlUrl + '关注.png'
						})
					} else {
						this.options.push({
							name: '取消关注',
							icon: this.$GLOBAL.htmlUrl + '已关注.png'
						})
					}
				}
			},
			toDo() {
				if(this.noNull(this.value)) {
					this.goOut("请选择决策类型")
				} else {
					if(this.value == 2) {
						if(this.noNull(this.value2)) {
							this.goOut('请填写审批意见')
						} else {
							if(this.context.fsubject.indexOf("正在加签") > -1) {
								this.goOut('加签未结束，请结束加签再提交!')
							} else {
								Dialog.confirm({
									message: '单据提交后将流转到下一个节点，确实要提交当前数据吗？'
								}).then(() => {
									this.doSome()
								}).catch(() => {
									this.goOut("已取消")
								});
							}
						}
					} else {
						if(this.context.fsubject.indexOf("正在加签") > -1) {
							this.goOut('加签未结束，请结束加签再提交!')
						} else {
							Dialog.confirm({
								message: '单据提交后将流转到下一个节点，确实要提交当前数据吗？'
							}).then(() => {
								this.doSome()
							}).catch(() => {
								this.goOut("已取消")
							});
						}
					}
				}
			},
			doSome() {
				this.$api.myDesk.getProcessorByMaile({
					foid: this.context.foid,
					fcreator: localStorage.getItem("ms_userId")
				}).then(res => {
					console.log(res)
					if(res.data.code == 0) {
						if(res.data.data) {
							//手工指定下一节点
							if(res.data.data.fmntnextjoin === 1) {
								if(this.value == 2) {
									this.submitMethod('', '');
								} else {
									this.showUser2 = true
								}
							} else {
								//正常提交
								this.submitMethod('', '');
							}
						} else {
							//正常提交
							this.submitMethod('', '');
						}
					} else {
						this.goOut('当前业务活动所在工作流流程已经禁用，请启用后再处理！')
					}
				});
			},
			submitMethod(name, val) {
				if(name === '手工指定') {
					this.participator = "3|" + val;
				}
				//获取人员岗位的接口
				this.$api.myDesk.getStaffAllFirmpositionname({
					foid: localStorage.getItem('ms_userId')
				}).then(res => {
					console.log(res)
					if(res.data) {
						if(res.data.code == 0) {
							if(res.data.data.length >= 2) {
								//当存在兼职的时候，弹出pop框
								this.actions = []
								this.showActions = true;
								res.data.data.forEach(item => {
									this.actions.push({
										name: item.firmpositioName,
										id: item.foid
									})
								})

							} else {
								this.submitData();
							}
						} else {
							this.$message.error(res.data.msg);
						}
					} else {
						this.$message.error("系统异常,请填联系管理员!");
					}
				})
			},
			//提交保存的接口
			submitData(Data) {
				let paramsData = {};
				let twfbizmailReqVoObj = {};
				let FoidS = '';
				let fsrcoId = '';
				paramsData["mactivityOid"] = this.context.factivity;
				paramsData["srcOid"] = this.context.fsrcoId;
				paramsData["subject"] = this.context.fsubject;
				twfbizmailReqVoObj["foid"] = this.context.foid;
				FoidS = this.context.foid;
				fsrcoId = this.context.fsrcoId;
				paramsData["currUserId"] = localStorage.getItem("ms_userId");
				paramsData["processCode"] = "schedule";
				paramsData["twfbizmailReqVo"] = twfbizmailReqVoObj;
				let twfauditObj = {};
				//加签的直接默认同意
				if(this.context.fsubject.substring(0, 2).indexOf("加签") > -1) {
					twfauditObj["fresult"] = 1;
				} else {
					twfauditObj["fresult"] = this.value;
				}
				twfauditObj["fopinion"] = this.value2;
				paramsData["twfaudit"] = twfauditObj;
				if(this.participator != '') {
					paramsData["participator"] = this.participator;
				}
				if(Data) {
					paramsData["position"] = Data;
				}
				this.$api.myDesk.addWfsubmit(paramsData).then(res => {
					if(res.data) {
						if(res.data.code == 0) {
							this.goOk('保存成功');
							this.$router.push({
								name: "toDoList"
							})
						} else {
							this.$message.error(res.data.msg);
						}
					} else {
						this.goOut('提交失败')
					}
				});
			},
			onSelect(option) {
				if(option.name == "关注" || option.name == "取消关注") {
					if(option.icon == this.$GLOBAL.htmlUrl + '已关注.png') {
						this.$api.myDesk.deleteAttention({
							fvoucherOid: this.context.fsrcoId,
							fattentionOid: localStorage.getItem("ms_userId")
						}).then(data => {
							option.name = "关注"
							option.icon = this.$GLOBAL.htmlUrl + '关注.png'
						});
					} else {
						this.$api.myDesk.addAttention({
							fvoucherOid: this.context.fsrcoId,
							fattentionOid: localStorage.getItem("ms_userId"),
							fwfBizMailOid: this.context.foid
						}).then(data => {
							option.name = "取消关注"
							option.icon = this.$GLOBAL.htmlUrl + '已关注.png'
						});
					}
				} else if(option.name == "加批") {
					Dialog.confirm({
						message: '确认要对选中的邮件进行附加批注么',
					}).then(() => {
						this.remark = ''
						this.showOther = true
					}).catch(() => {});
				} else if(option.name == "已阅") {
					this.$api.myDesk.removeBizMail({
						bizMailId: this.context.foid,
						currUserId: localStorage.getItem("ms_userId")
					}).then(response => {
						if(response.code != 999) {
							this.goOk('已阅成功!');
							this.$router.go(-1);
						} else {
							this.goOk('已阅失败!');
						}
						this.showShare = false
					})
				} else {
					if(option.name == "加签") {
						this.showChild = 1
					} else if(option.name == "委托") {
						this.showChild = 2
					} else {
						this.showChild = 3
					}
					this.showUser = true
				}
			},
			toDoOher() {
				if(this.noNull(this.remark)) {
					this.goOut('请输入加批意见')
					return
				}
				this.$api.myDesk.addSign({
					currUserId: localStorage.getItem('ms_userId'),
					bizMailId: this.context.fsrcoId,
					advice: this.remark
				}).then(response => {
					this.goOk('加批成功')
					this.showOther = false
				});
			},
			onConfirm(value) {
				this.value = value.id
				this.value1 = value.name
				this.show = false;
			},
			toUrl() {
				this.tabViews = ""
			},
		},
	};
</script>

<style>
	.flexMainre {
		position: relative;
	}
	
	.nextBtn {
		position: fixed;
		bottom: 0;
		height: 7vh;
		line-height: 7vh;
		width: 100%;
		background-color: #fff;
		margin: 1px;
		border-top: 1px solid black;
	}
	
	.nextBtn4 {
		position: fixed;
		bottom: 0;
		right: 0;
		width: 10%;
		background-color: red;
		margin: 1px;
	}
	
	input {
		background-color: whitesmoke!important;
	}
</style>
<style scoped="scoped">
	/deep/.van-share-sheet__name {
		height: 20px!important;
		font-size: 18px;
		color: white;
	}
	
	/deep/.van-share-sheet__options {
		line-height: 4vh!important;
	}
	
	/deep/.van-share-sheet__option {
		width: 25%;
	}
	
	/deep/.van-share-sheet__options {
		background: #6e98db;
	}
	
	/deep/.van-share-sheet__cancel {
		display: none!important;
	}
	
	/deep/.van-share-sheet__icon {
		width: 26px;
		height: 26px;
	}
	
	/deep/.van-popup--bottom.van-popup--round {
		border-radius: 0px;
	}
</style>