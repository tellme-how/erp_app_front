<template>
	<div>
		<erpVanCellTitle title="流程图">
			<van-button @click="getFlow" size="mini" plain type="primary">查看</van-button>
		</erpVanCellTitle>
		<van-collapse v-model="activeNames">
			<van-collapse-item title="审批详情" name="1">
				<div style="width:100%; overflow:scroll;">
					<table :style="{ width : widthTable + '%' }" class="mailTable" cellspacing="0" cellpadding="0">
						<tr v-for="(item,index) in linesList">
							<td id="classTd" :class="[key == 0 ?'classZero':'']" v-for="(val,key) in item.list">
								<van-button v-if="val == '展开'" @click="showPopup(key)" size="mini" plain type="primary">展开</van-button>
								<span v-else>{{val | valShow(key)}}</span>
							</td>
						</tr>
					</table>
				</div>
			</van-collapse-item>
		</van-collapse>
		<vanPopupReply @showClose='showClose' :context="auditReplyMsg" v-if="show" :show="show"></vanPopupReply>
		<flowChart :showOne="showOne" :flow="flow" :flowIndex="flowIndex" :contextOther="contextOther"></flowChart>
	</div>
</template>
<script>
	import flowChart from './flowChart';
	export default {
		props: {
			contextOther: Object
		},
		components: {
			flowChart
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
				activeNames: [],
				auditReplyMsg: [],
				show: false,
				showOne: false,
				widthTable: 100,
				linesList: [],
				context: [],
				flow: [],
				flowIndex : 0
			};
		},
		created() {
			this.getContext()
		},
		methods: {
			getFlow() {
				this.$api.myDesk.viewProcess({
					bizMailId: this.contextOther.foid,
					currUserId: localStorage.getItem("ms_userId")
				}).then(res => {
					console.log(res)
					this.flow = res.data.data
					this.flow.forEach((item, index) => {
						if(item.fstatus == 2) {
							this.flowIndex = index
						}
					})
					this.showOne = true
				})
			},
			showOneClose() {
				this.showOne = false
			},
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
					foid: this.contextOther.foid,
					loadUser: localStorage.getItem("ms_userId"),
					module: '1'
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
								this.context.forEach(a => {
									item.list.push("展开")
								})
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

</style>