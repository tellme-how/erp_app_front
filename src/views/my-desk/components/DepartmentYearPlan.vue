<!--
	部门年度计划
-->
<template>
	<div>
		<erpVanCell v-for="(item,key) in list" :formContext="formContext" :rowCell="item"></erpVanCell>
		<erpVanCellTitle title="年计划编制">
			<van-button @click="showOne = !showOne" size="mini" plain type="primary">展开明细</van-button>
		</erpVanCellTitle>
		<lineTable v-if="showOne" :linesList="linesList" :widthTable="widthTable"></lineTable>
		<erpVanCellTitle title="附件">
			<van-button size="mini" plain type="primary">展开明细</van-button>
		</erpVanCellTitle>
	</div>
</template>

<script>
	export default {
		props: {
			context: Object
		},
		data() {
			return {
				showOne: false,
				widthTable: 100,
				formContext: {},
				list: [{
					name: "公司",
					value: "companyName",
					list: []
				}, {
					name: "单据号",
					value: "voucherId",
					list: []
				}, {
					name: "版本",
					value: "editId",
					list: []
				}, {
					name: "年份",
					value: "year",
					list: []
				}, {
					name: "计划部门",
					value: "planDepName",
					list: []
				}, {
					name: "编制日期",
					value: "editDate",
					list: []
				}, {
					name: "经办人",
					value: "gestorName",
					list: []
				}, {
					name: "备注",
					value: "remark",
					list: []
				}],
				linesList: [{
					name: "公司",
					value: "companyName",
					list: []
				}, {
					name: "部门",
					value: "departmentName",
					list: []
				}, {
					name: "任务级别",
					value: "taskLevel",
					list: []
				}, {
					name: "周期性任务",
					value: "periodicityTask",
					list: []
				}, {
					name: "跨月任务",
					value: "periodicityMonth",
					list: []
				}, {
					name: "工作名称",
					value: "workName",
					list: []
				}, {
					name: "工作标准",
					value: "workStandard",
					list: []
				}, {
					name: "Q累计预计计划完成指标",
					value: "planFinish",
					list: []
				}, {
					name: "计量单位",
					value: "unit",
					list: []
				}, {
					name: "重点级别",
					value: "emphasisLevel",
					list: []
				}, {
					name: "开始时间",
					value: "beginDate",
					list: []
				}, {
					name: "结束时间",
					value: "endDate",
					list: []
				}, {
					name: "责任人",
					value: "glResponsibleName",
					list: []
				}, {
					name: "协办人",
					value: "responsibleName",
					list: []
				}, {
					name: "秘书",
					value: "secretaryName",
					list: []
				}, {
					name: "检查人",
					value: "examinerName",
					list: []
				}, {
					name: "交办人",
					value: "assignerName",
					list: []
				}, {
					name: "完成情况",
					value: "completion",
					list: []
				}, {
					name: "情况说明",
					value: "noFinishReason",
					list: []
				}, {
					name: "备注",
					value: "remark",
					list: []
				}]
			};
		},
		created() {
			this.$api.myDesk.getDepYearPlanDetail(JSON.stringify({
				id: this.context.fsrcoId
			})).then(data => {
				this.formContext = data.data
				var lines = data.data.line
				this.linesList.forEach(item => {
					item.list.push(item.name)
					lines.forEach(val => {
						item.list.push(val[item.value])
					})
				})
				this.widthTable = lines.length * 40 + 40
			})
		},
		methods: {},
	};
</script>

<style scoped>
	/deep/.van-cell__title {
		max-width: 30%;
	}
	
	/deep/.van-cell__value {
		text-align: center;
	}
</style>
<style>
	
	
	.van-cell__title {
		text-align: left;
	}
</style>