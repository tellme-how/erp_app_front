<!--
	一人一表(自评)
-->
<template>
	<div>
		<erpVanCell v-for="(item,key) in list" :key="key" :formContext="formContext" :rowCell="item"></erpVanCell>
		<erpVanCellTitle title="参数">
			<van-button @click="showOne = !showOne;showOne ? showName1 ='收起明细' : showName1 = '展开明细'" size="mini" plain type="primary">{{showName1}}</van-button>
		</erpVanCellTitle>
		<lineTable v-if="showOne" :linesList="linesList" :widthTable="widthTable"></lineTable>
		<enclosureFile ref="child" :voucherId="voucherId"/>
		<!--<erpVanCellTitle title="附件">
			<van-button size="mini" plain type="primary">展开明细</van-button>
		</erpVanCellTitle>-->
	</div>
</template>

<script>
	import enclosureFile from './enclosure-file';
	export default {
		props: {
			context: Object
		},
		components:{
			enclosureFile
		},
		data() {
			return {
				voucherId:'',
				showName1 :'展开明细',
				showOne: false,
				widthTable: 100,
				formContext: {},
				list: [{
					name: "公司",
					value: "companyName",
					list: []
				}, {
					name: "项目",
					value: "project",
					list: []
				},{
					name: "部门",
					value: "departmentName",
					list: []
				}, {
					name: "任务状态",
					value: "taskStatus",
					list: []
				}, {
					name: "任务类型",
					value: "taskType",
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
					name: "年计划调整",
					value: "yearPlan",
					list: []
				}, {
					name: "重点级别",
					value: "focusLevelCheckList",
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
					name: "责任人",
					value: "responsibleName",
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
					name: "开始时间",
					value: "beginDate",
					list: []
				}, {
					name: "完成时间",
					value: "endDate",
					list: []
				}, {
					name: "秘书",
					value: "secretaryName",
					list: []
				}, {
					name: "完成情况(%)",
					value: "completion",
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
					name: "情况说明",
					value: "reasonInfo",
					list: []
				}, {
					name: "备注",
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
					value: "planFinish",
					list: []
				}, {
					name: "计量单位",
					value: "unit",
					list: []
				}]
			};
		},
		created() {
			this.$api.myDesk.findTaskEvaluateAndAdjustById({
				id: this.context.fsrcoId
			}).then(data => {
				console.log(data)
				this.formContext = data.data.data
				this.showName(this.formContext)
				var lines = [{
					key1: '计划值',
					key2: 'Q 累计预计计划完成指标',
					planFinish: data.data.data.planFinish,
					unit: data.data.data.unit
				},{
					key1: '实际填入值',
					key2: 'F 价差完成率',
					planFinish: data.data.data.fvalue,
					unit: data.data.data.funit
				},{
					key1: '实际填入值',
					key2: 'J 客户提出偏差数价差完成率',
					planFinish: data.data.data.jvalue,
					unit: data.data.data.junit
				},{
					key1: '实际填入值',
					key2: 'H 离职人数',
					planFinish: data.data.data.hvalue,
					unit: data.data.data.hunit
				},{
					key1: '实际填入值',
					key2: 'N 实际综合费率/问卷得分/期权平均完成率',
					planFinish: data.data.data.nvalue,
					unit: data.data.data.nunit
				},{
					key1: '实际填入值',
					key2: 'O 前月及本月末在编人数和',
					planFinish: data.data.data.ovalue,
					unit: data.data.data.ounit
				},{
					key1: '实际填入值',
					key2: 'P 实际完成值、巡检、检查、走访等每日或每天进行的工作次数、累计完成金额、实支物流费、实际价差、实际到货量、实际发货量、当月受载期内抵达装货港船舶数量',
					planFinish: data.data.data.pvalue,
					unit: data.data.data.punit
				},{
					key1: '实际填入值',
					key2: 'X 最终偏差数价差完成率',
					planFinish: data.data.data.xvalue,
					unit: data.data.data.xunit
				},{
					key1: '实际填入值',
					key2: 'Y 出错/失误次数/超期时数（小时或天）',
					planFinish: data.data.data.yvalue,
					unit: data.data.data.yunit
				}]
				this.linesList.forEach(item => {
					item.list.push(item.name)
					lines.forEach(val => {
						item.list.push(val[item.value])
					})
				})
				this.widthTable = lines.length * 40 + 40
				this.voucherId = this.context.fsrcoId;
			})
		},
		methods: {
			showName(row) {
				switch(row.periodicityTask) {
					case true:
						row.periodicityTask = '是';
						break;
					case false:
						row.periodicityTask = '否';
						break;
					default:
						break;	
				}
				switch(row.yearPlan) {
					case true:
						row.yearPlan = '是';
						break;
					case false:
						row.yearPlan = '否';
						break;
					default:
						break;	
				}
				switch(row.taskStatus) {
					case 1:
						row.taskStatus = '可执行';
						break;
					case 2:
						row.taskStatus = '已完成';
						break;
					case 3:
						row.taskStatus = '未完成';
						break;
					case 4:
						row.taskStatus = '延期';
						break;
					case 5:
						row.taskStatus = '作废';
						break;
					case 0:
						row.taskStatus = '未发生';
						break;
					case 10:
						row.taskStatus = '已报待批';
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
				if(list.length == 0) {
					row.focusLevelCheckList = ""
				} else {
					list.forEach((item, key) => {
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