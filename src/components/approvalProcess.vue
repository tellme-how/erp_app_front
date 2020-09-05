<template>
	<div>
		<erpVanCellTitle title="审批详情">
			<van-button @click="showOne = !showOne" size="mini" plain type="primary">展开明细</van-button>
		</erpVanCellTitle>
		<div v-if="showOne" style="width:100%; overflow:scroll;">
			<table :style="{ width : widthTable + '%' }" class="mailTable" cellspacing="0" cellpadding="0">
				<tr v-for="(item,index) in linesList">
					<td id="classTd" :class="[key == 0 ?'classZero':'']" v-for="(val,key) in item.list">
						<van-button v-if="val == '展开'" @click="showPopup(item)" size="mini" plain type="primary">展开</van-button>
						<span v-else>{{val | valShow(key)}}</span>
					</td>
				</tr>
			</table>
		</div>
		<vanPopupReply @showClose='showClose' :rowChild="rowChild" :show="show"></vanPopupReply>
	</div>
</template>
<script>
	export default {
		props: {
			context: Object
		},
		filters: {
			valShow(status, key) {
				if(key == 0 && status.length > 6) {
					return status.slice(0, 6) + "..."
				} else {
					return status
				}
			},
		},
		data() {
			return {
				rowChild:{},
				show: false,
				showOne: false,
				widthTable: 100,
				linesList: [{
					name: "流程节点",
					value: "fname",
					list: []
				}, {
					name: "审批人",
					value: "handlerName",
					list: []
				}, {
					name: "审批结论",
					value: "fresult",
					list: []
				}, {
					name: "审批说明",
					value: "fopinion",
					list: []
				}, {
					name: "审批时间",
					value: "fcreateTime",
					list: []
				}, {
					name: "标准时间",
					value: "fmaxWorkTime",
					list: []
				}, {
					name: "耗时",
					value: "takeTime",
					list: []
				}, {
					name: "回复",
					value: "展开",
					list: []
				}]
			};
		},
		created() {
			this.linesList.forEach(item => {
				item.list.push(item.name)
				if(item.name == "回复") {
					item.list.push("展开")
				}
			})
			this.widthTable = 80
		},
		methods: {
			showClose(){
				this.show = false;
			},
			showPopup(row) {
				this.rowChild = row
				this.show = true;
			},
		},
	};
</script>

<style scoped>
	.valueClass {
		text-align: left;
	}
	
	/deep/.van-cell__title {
		max-width: 30%;
	}
	
	/deep/.van-cell__value {
		color: #000000;
	}
</style>