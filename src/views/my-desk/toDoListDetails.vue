<template>
	<div class="flexMainre">
		<tabViews :context="context" :is="$route.params.row.classId"></tabViews>
		<div style="height: 7vh;width: 100%;"></div>
		<div class="nextBtn">
			<van-row>
				<van-col span="6">
					<van-field readonly clickable :value="value" label="" placeholder="审批" @click="showPicker = true" />
					<van-popup v-model="showPicker" position="bottom">
						<van-picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
					</van-popup>
				</van-col>
				<van-col span="17">
					<van-field v-model="value2" center clearable label="" placeholder="请输入审批意见">
						<template #button>
							<van-button icon="success" size="mini" type="primary">提交</van-button>
						</template>
					</van-field>
				</van-col>
				<van-col span="1">
					<span @click="showShare = true">1</span>
					<van-share-sheet v-model="showShare" :options="options" @select="onSelect" /></van-col>
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
				showPicker: false,
				context: this.$route.params.row,
				tabViews: "",
				showShare: false,
				options: [{
						name: '转发',
						icon: 'wechat'
					},
					{
						name: '委托',
						icon: 'weibo'
					},
					{
						name: '关注',
						icon: 'link'
					},
					{
						name: '加签',
						icon: 'poster'
					}
				],
			};
		},
		created() {
			console.log(this.$route.params.row.classId)
			this.columns = []
			this.$api.myDesk.getWfDecisionTypeConByCurNode({
				mailId: this.context.foid
			}).then(data => {
				for(var key in data.data.data) {
					this.columns.push(data.data.data[key])
				}
			})
		},
		methods: {
			onSelect(option) {
				this.showShare = false;
			},
			onConfirm(value) {
				this.value = value
				this.showPicker = false;
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
		width: 99%;
		background-color: #fff;
		margin: 1px;
		border: 1px solid black;
	}
</style>
<style>
	input {
		background-color: whitesmoke!important;
	}
</style>