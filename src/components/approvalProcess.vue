<template>
	<div>
		<erpVanCellTitle title="审批详情">
			<van-button @click="showOne = !showOne" size="mini" plain type="primary">展开明细</van-button>
		</erpVanCellTitle>
		<div v-if="showOne" style="width:100%; overflow:scroll;">
			<table :style="{ width : widthTable + '%' }" class="mailTable" cellspacing="0" cellpadding="0">
				<tr v-for="(item,index) in linesList">
					<td id="classTd" :class="[key == 0 ?'classZero':'']" v-for="(val,key) in item.list">
						<van-button v-if="val == '展开'" @click="showPopup(key)" size="mini" plain type="primary">展开</van-button>
						<span v-else>{{val | valShow(key)}}</span>
					</td>
				</tr>
			</table>
		</div>
		<vanPopupReply @showClose='showClose' :context="auditReplyMsg" v-if="show" :show="show"></vanPopupReply>
	</div>
</template>
<script>
	export default {
		props: {
			contextOther: Object
		},
		filters: {
			valShow(status, key) {
				if(key == 0 && status.length > 6) {
					return status.slice(0, 6) + "..."
				} else {
					return status
				}
			}
		},
		data() {
			return {
				auditReplyMsg: [],
				show: false,
				showOne: false,
				widthTable: 100,
				linesList: [],
				context: []
			};
		},
		created() {
			this.getContext()
		},
		methods: {
			getContext() {
				this.linesList = [{
					name: "流程节点",
					value: "nodName",
					list: []
				}, {
					name: "审批人",
					value: "staffName",
					list: []
				}, {
					name: "审批结论",
					value: "auditResult",
					list: []
				}, {
					name: "审批说明",
					value: "fopinion",
					list: []
				}, {
					name: "审批时间",
					value: "fcreatetime",
					list: []
				}, {
					name: "标准时间",
					value: "standardTime",
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
				this.$api.myDesk.getAuditAndReplyMsg({
					foid: this.contextOther.foid
				}).then(res => {
					this.context = res.data.data
					this.widthTable = 40 + 40 * this.context.length
					this.linesList.forEach(item => {
						item.list.push(item.name)
						if(!this.noNull(this.context)) {
							this.context.forEach(val => {
								for(var key in val) {
									if(key == item.value) {
										item.list.push(val[key])
									}
								}
							})
							if(item.name == "回复") {
								item.list.push("展开")
							}
						}
					})
				})
			},
			showClose() {
				this.show = false;
			},
			showPopup(key) {
				this.auditReplyMsg = this.context[key - 1]
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