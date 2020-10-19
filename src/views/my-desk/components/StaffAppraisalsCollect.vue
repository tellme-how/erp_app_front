<!--
	员工考评表汇总
-->
<template>
	<div>
		<erpVanCell v-for="(item,key) in list" :key="key" :formContext="formContext" :rowCell="item"></erpVanCell>
		<erpVanCellTitle title="汇总部门明细行">
			<van-button @click="showOne = !showOne;showOne ? showName1 ='收起明细' : showName1 = '展开明细'" size="mini" plain type="primary">{{showName1}}</van-button>
		</erpVanCellTitle>
		<lineTable v-if="showOne" :linesList="linesList" :widthTable="widthTable"></lineTable>
		<enclosureFile :voucherId="voucherId"></enclosureFile>
	</div>
</template>

<script>
	export default {
		props: {
			context: Object
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
					name: "单据号",
					value: "voucherId",
					list: []
				}, {
					name: "年度",
					value: "year",
					list: []
				}, {
					name: "月份",
					value: "month",
					list: []
				}, {
					name: "经办人",
					value: "handler",
					list: []
				}, {
					name: "经办日期",
					value: "voucherDate",
					list: []
				}, {
					name: "汇总部门",
					value: "departmentIdsName",
					list: []
				}, {
					name: "不参与考评人员",
					value: "noJoinStaffName",
					list: []
				}, {
					name: "汇总说明",
					value: "remark",
					list: []
				}],
				linesList: [{
					name: "部门名称",
					value: "name",
					list: []
				}, {
					name: "部门编码",
					value: "code",
					list: []
				}, {
					name: "备注",
					value: "remark",
					list: []
				}]
			};
		},
		created() {
			this.voucherId = this.context.fsrcoId;
			this.$api.myDesk.getStaffAppraisalsSummaryVO({
				id: this.context.fsrcoId
			}).then(data => {
				console.log(data)
				this.formContext = data.data.data
				this.showName(this.formContext)
				var lines = data.data.data.deptList
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