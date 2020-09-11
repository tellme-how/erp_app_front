<template>
	<div class="flexMainre">
		<tabViews :context="context" :is="context.classId"></tabViews>
		<approvalProcess></approvalProcess>
		<div style="height: 8vh;width: 100%;"></div>
		<div class="nextBtn">
			<van-row>
				<van-col span="6">
					<van-field readonly clickable :value="value" label="" placeholder="审批" @click="show = true" />
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
					<van-share-sheet cancel-text="关闭" v-model="showShare" :options="options" @select="onSelect" /></van-col>
			</van-row>
		</div>
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
			DepartmentMonthPlan
		},
		data() {
			return {
				columns: [],
				value: "",
				value2: "",
				show: false,
				context: {},
				tabViews: "",
				showShare: false,
				options: [{
						name: '转发',
						icon: this.$GLOBAL.htmlUrl + '1.png'
					},
					{
						name: '委托',
						icon: this.$GLOBAL.htmlUrl + '2.png'
					},
					{
						name: '关注',
						icon: this.$GLOBAL.htmlUrl + '3.png'
					},
					{
						name: '加签',
						icon: this.$GLOBAL.htmlUrl + '5.png'
					}
				],
			};
		},
		created() {
			this.$store.commit("tabbarShow", false)
			if(this.$route.params.row) {
				sessionStorage.setItem("deskRow", JSON.stringify(this.$route.params.row));
			}
			this.context = JSON.parse(sessionStorage.getItem("deskRow"))
			this.$store.commit("titleShow", this.context.fsubject)
			this.columns = []
			//			this.$api.myDesk.getWFBizMailInfoByUserId({
			//				mailId: this.context.foid,
			//				userId: localStorage.getItem('ms_userId')
			//			}).then(data => {
			//				console.log(data)
			//			})
			this.$api.myDesk.getWfDecisionTypeConByCurNode({
				mailId: this.context.foid
			}).then(data => {
				for(var key in data.data.data) {
					this.columns.push({
						name: data.data.data[key]
					})
				}
			})
		},
		methods: {
			toDo() {

			},
			onSelect(option) {
				if(option.name == "关注") {
					if(option.icon == this.$GLOBAL.htmlUrl + '4.png') {
						option.icon = this.$GLOBAL.htmlUrl + '3.png'
					} else {
						option.icon = this.$GLOBAL.htmlUrl + '4.png'
					}
				} else {
					this.$router.push({
						name: "personnelSelection"
					})
				}
			},
			onConfirm(value) {
				this.value = value.name
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
	
	input {
		background-color: whitesmoke!important;
	}
</style>
<style scoped="scoped">
	/deep/.van-share-sheet__name {
		height: 20px!important;
	}
	/deep/.van-share-sheet__options {
		line-height: 4vh!important;
	}
	/deep/.van-share-sheet__option {
		width: 25%;
	}
</style>