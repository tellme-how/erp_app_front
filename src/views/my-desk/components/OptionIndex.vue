<!--
	临时任务派发
-->
<template>
	<div>
		<erpVanCell v-for="(item,key) in list" :key="key" :formContext="formContext" :rowCell="item"></erpVanCell>
		<erpVanCellTitle title="参数">
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
					value: "gestorName",
					list: []
				}, {
					name: "经办日期",
					value: "voucherDate",
					list: []
				}, {
					name: "当月比例(%)",
					value: "monthRate",
					list: []
				}],
				linesList: [{
					name: "名称",
					value: "companyName",
					list: []
				}, {
					name: "比例(%)",
					value: "indexRatio",
					list: []
				}]
			};
		},
		created() {
			this.$api.myDesk.getEconomicIndicatorsDetail({
				id: this.context.fsrcoId
			}).then(data => {
				this.formContext = data.data.data
				var lines = data.data.data.optionIndexLine
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