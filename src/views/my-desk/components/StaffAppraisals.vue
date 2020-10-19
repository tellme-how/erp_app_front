<!--
	员工考评表
-->
<template>
	<div>
		<erpVanCell v-for="(item,key) in list" :key="key" :formContext="formContext" :rowCell="item"></erpVanCell>
		<erpVanCellTitle title="指标关联任务">
			<span>请在PC端进行详情查看</span>
		</erpVanCellTitle>
		<erpVanCellTitle title="期权详情">
			<van-button @click="showOne = !showOne;showOne ? showName1 ='收起明细' : showName1 = '展开明细'" size="mini" plain type="primary">{{showName1}}</van-button>
		</erpVanCellTitle>
		<lineTable v-if="showOne" :linesList="linesList" :widthTable="widthTable"></lineTable>
		<erpVanCellTitle title="公司指标">
			<van-button @click="showTow = !showTow;showTow ? showName2 ='收起明细' : showName2 = '展开明细'" size="mini" plain type="primary">{{showName2}}</van-button>
		</erpVanCellTitle>
		<lineTable v-if="showTow" :linesList="linesList2" :widthTable="widthTable2"></lineTable>
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
				showName2 :'展开明细',
				showOne: false,
				showTow: false,
				widthTable: 100,
				widthTable2: 100,
				widthTable3: 100,
				formContext: {},
				list: [{
					name: "公司",
					value: "companyName",
					list: []
				}, {
					name: "员工考评编号",
					value: "voucherId",
					list: []
				}, {
					name: "部门",
					value: "departmentName",
					list: []
				}, {
					name: "岗位",
					value: "positionName",
					list: []
				}, {
					name: "姓名",
					value: "name",
					list: []
				}, {
					name: "年份",
					value: "year",
					list: []
				}, {
					name: "月份",
					value: "month",
					list: []
				}, {
					name: "指标比例",
					value: "bili",
					list: []
				}, {
					name: "版本",
					value: "versionName",
					list: []
				}, {
					name: "总分",
					value: "score",
					list: []
				}, {
					name: "大学生",
					value: "collegeStudent",
					list: []
				}, {
					name: "试用期",
					value: "newRecruits",
					list: []
				}],
				linesList: [{
					name: "考评项(一级)",
					value: "kpx",
					list: []
				}, {
					name: "关键指标(二级)",
					value: "gjzb",
					list: []
				}, {
					name: "子指标(三级)",
					value: "zzb",
					list: []
				}, {
					name: "指标权重",
					value: "zbqz",
					list: []
				},{
					name: "指标得分",
					value: "zbdf",
					list: []
				}, {
					name: "扣减项名称",
					value: "nameOfDeductionItemName",
					list: []
				}, {
					name: "扣减项扣除",
					value: "deductions",
					list: []
				}, {
					name: "否决项名称",
					value: "fjxkjxName",
					list: []
				},{
					name: "否决项扣除",
					value: "fjkjbl",
					list: []
				}, {
					name: "最终得分",
					value: "zzdf",
					list: []
				}, {
					name: "期权扣除比例及原因",
					value: "qqkcbl",
					list: []
				}],
				linesList2: [{
					name: "公司",
					value: "companyName",
					list: []
				}, {
					name: "部门名称",
					value: "departmentName",
					list: []
				}, {
					name: "权重",
					value: "weight",
					list: []
				}, {
					name: "比例",
					value: "ratio",
					list: []
				},{
					name: "否决项名称",
					value: "fjxkjxName",
					list: []
				}, {
					name: "否决项扣除",
					value: "fjkjbl",
					list: []
				}, {
					name: "扣减项名称",
					value: "nameOfDeductionItemName",
					list: []
				}, {
					name: "扣减项扣除",
					value: "deductions",
					list: []
				}, {
					name: "得分",
					value: "score",
					list: []
				}, {
					name: "备注",
					value: "remark",
					list: []
				}],
			};
		},
		created() {
			this.voucherId = this.context.fsrcoId;
			this.$api.myDesk.staffAppraisalsFindInfoById({
				id: this.context.fsrcoId
			}).then(data => {
				console.log(data)
				this.formContext = data.data.data
				var lines = data.data.data.qqLine
				var lines2 = data.data.data.comLine
				this.linesList.forEach(item => {
					item.list.push(item.name)
					lines.forEach(val => {
						item.list.push(val[item.value])
					})
				})
				this.linesList2.forEach(item => {
					item.list.push(item.name)
					lines2.forEach(val => {
						item.list.push(val[item.value])
					})
				})
				this.widthTable = lines.length * 40 + 40
				this.widthTable2 = lines2.length * 40 + 40
			})
		},
		methods: {
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