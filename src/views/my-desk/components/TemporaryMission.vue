<!--
	临时任务派发
-->
<template>
	<div>
		<erpVanCell v-for="(item,key) in list" :key="key" :formContext="formContext" :rowCell="item"></erpVanCell>
		<erpVanCellTitle title="参数">
			<van-button @click="showOne = !showOne;showOne ? showName1 ='收起明细' : showName1 = '展开明细'" size="mini" plain type="primary">{{showName1}}</van-button>
		</erpVanCellTitle>
		<lineTable v-if="showOne" :linesList="linesList" :widthTable="widthTable"></lineTable>
		<!--<erpVanCellTitle title="附件">
			<van-button size="mini" plain type="primary">展开明细</van-button>
		</erpVanCellTitle>-->
	</div>
</template>

<script>
	export default {
		props: {
			context: Object
		},
		data() {
			return {
				showName1 :'展开明细',
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
					name: "部门",
					value: "departmentName",
					list: []
				}, {
					name: "责任部门",
					value: "cooperateTaskDepartmentName",
					list: []
				}, {
					name: "检查人",
					value: "examinerName",
					list: []
				}, {
					name: "交办人",
					value: "assignedPersonName",
					list: []
				}, {
					name: "任务状态",
					value: "taskState",
					list: []
				}, {
					name: "责任人",
					value: "personResponsibleName",
					list: []
				}, {
					name: "调整",
					value: "timechange",
					list: []
				}, {
					name: "协办人",
					value: "cooperateWithStaffName",
					list: []
				}, {
					name: "秘书",
					value: "secretaryName",
					list: []
				}, {
					name: "开始时间",
					value: "startTime",
					list: []
				}, {
					name: "结束时间",
					value: "fanishTime",
					list: []
				}, {
					name: "任务类型",
					value: "taskType",
					list: []
				}, {
					name: "任务等级",
					value: "taskLevel",
					list: []
				}, {
					name: "任务名称",
					value: "workeName",
					list: []
				}, {
					name: "经办人",
					value: "gestorName",
					list: []
				}, {
					name: "经办时间",
					value: "voucherDate",
					list: []
				}, {
					name: "重点级别",
					value: "focusLevelCheckList",
					list: []
				}, {
					name: "工作标准",
					value: "workStandard",
					list: []
				}, {
					name: "描述",
					value: "remark",
					list: []
				}],
				linesList: [{
					name: "序号",
					value: "key1",
					list: []
				}, {
					name: "参数名称",
					value: "key2",
					list: []
				}, {
					name: "期权数值",
					value: "optionValue",
					list: []
				}, {
					name: "计量单位",
					value: "unit",
					list: []
				}]
			};
		},
		created() {
			this.$api.myDesk.getTemporaryMissionVO({
				id: this.context.fsrcoId,
				userId: localStorage.getItem("ms_userId")
			}).then(data => {
				this.formContext = data.data.data
				this.showName(this.formContext)
				var lines = [{
					key1: '计划值',
					key2: 'Q 累计预计计划完成指标',
					optionValue: data.data.data.optionValue,
					unit: data.data.data.unit
				}]
				this.linesList.forEach(item => {
					item.list.push(item.name)
					lines.forEach(val => {
						item.list.push(val[item.value])
					})
				})
				this.widthTable = lines.length * 40 + 40
			})
		},
		methods: {
			showName(row) {
				switch(row.taskState) {
					case "1":
						row.taskState = '可执行';
						break;
					case "2":
						row.taskState = '已完成';
						break;
					case "3":
						row.taskState = '未完成';
						break;
					case "4":
						row.taskState = '延期';
						break;
					case '5':
						row.taskState = '作废';
						break;
					case '0':
						row.taskState = '未发生';
						break;
					case '10':
						row.taskState = '已报待批';
						break;
					default:
						break;
				}
				// debugger;
				switch(row.taskType) {
					case 1:
						row.taskType = '主任务';
						break;
					case 2:
						row.taskType = '临时任务';
						break;
					case 3:
						row.taskType = '配合任务';
						break;
					default:
						break;
				}
				switch(row.taskLevel) {
					case 1:
						row.taskLevel = '一级';
						break;
					case 2:
						row.taskLevel = '二级';
						break;
					case 3:
						row.taskLevel = '三级';
						break;
					case 4:
						row.taskLevel = '四级';
						break;
					case 5:
						row.taskLevel = '五级';
						break;
					case 6:
						row.taskLevel = '六级';
						break;
					case 7:
						row.taskLevel = '七级';
						break;
					case 8:
						row.taskLevel = '八级';
						break;
					case 9:
						row.taskLevel = '九级';
						break;
					case 10:
						row.taskLevel = '十级';
						break;
					default:
						break;
				}
				var list = []
				if(row.groupPoint) {
					list.push('集团重点') 
				} else if(row.companyPoint) {
					list.push('公司重点');
				} else if(row.departmentPoint) {
					list.push('部门重点')
				}
				if(list.length == 0){
					row.focusLevelCheckList = ""
				}else{
					list.forEach((item,key) =>{
						row.focusLevelCheckList = row.focusLevelCheckList + " item"
					})
				}
			}
		},
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