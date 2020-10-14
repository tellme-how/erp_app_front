<!--
	公司年度计划汇总
-->
<template>
	<div>
		<erpVanCell v-for="(item,key) in list" :key="key" :formContext="formContext" :rowCell="item"></erpVanCell>
		<erpVanCellTitle title="汇总部门明细">
			<van-button @click="showOne = !showOne" size="mini" plain type="primary">展开明细</van-button>
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
				showOne: false,
				widthTable: 100,
				formContext: {},
				list: [{
					name: "公司",
					value: "companyName",
					list: []
				}, {
					name: "年度",
					value: "planyear",
					list: []
				}, {
					name: "计划名称",
					value: "planname",
					list: []
				}, {
					name: "编制人",
					value: "editorName",
					list: []
				}, {
					name: "编制时间",
					value: "editdate",
					list: []
				}, {
					name: "汇总编号",
					value: "voucherId",
					list: []
				}, {
					name: "汇总部门",
					value: "departmentIdsName",
					list: []
				}, {
					name: "计划说明",
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
			this.$api.myDesk.findInfoById({
				id: this.context.fsrcoId
			}).then(data => {
				this.formContext = data.data.data
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