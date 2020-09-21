<template>
	<div>
		<van-row style="background: #C0C0C0;">
			<van-col span="8">
				<van-dropdown-menu>
					<van-dropdown-item @change="toChange" v-model="value" :options="contextListA" />
				</van-dropdown-menu>
			</van-col>
			<van-col span="16">
				<van-search @search="onSearch" input-align="center" v-model="searchValue" shape="round" background="#C0C0C0" placeholder="请输入搜索关键词" />
			</van-col>
		</van-row>
		<van-pull-refresh v-model="isLoading" @refresh="beginOnLoad();">
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" style="min-height: 80vh;">
				<div v-for="(item,key) in list" :key="key">
					<van-row>
						<van-col span="24">
							<van-cell :class="tableRowClassName(item)" @click="toUrl(item)">
								<van-row>
									<van-row>
										{{item.fsubject}}
									</van-row>
									<van-row style="color: #969799;font-size: 12px;">
										{{labelShow(item)}}
									</van-row>
									<van-row style="color: #969799;font-size: 12px;text-align: right;">
										{{item.fpreReceiveTime}}
									</van-row>
								</van-row>
							</van-cell>
							<van-divider class="vanDividerClassA" />
						</van-col>
					</van-row>
				</div>
			</van-list>
		</van-pull-refresh>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				finished: false,
				isLoading: false,
				value: 1,
				contextListA: [{
					text: "待办事项",
					value: 1
				}, {
					text: "关注事项",
					value: 2
				}, {
					text: "已办事项",
					value: 3
				}, {
					text: "已发事项",
					value: 4
				}],
				formData: {
					userId: localStorage.getItem('ms_userId'),
					infosBeginNum: 1,
					infosEndNum: 20
				},
				list: [],
				searchValue: "",
				showState: false,
			};
		},
		created() {
			this.$store.commit("titleShow", "待办事项")
			this.$store.commit("tabbarShow", true)
			this.onLoad()
		},
		methods: {
			//根据状态改背景色
			tableRowClassName(row) {
				if(row.fstatus === "暂停") {
					return "ccc";
				} else if(row.fstatus === "已作废") {
					return "eee";
				} else if(row.fstatus === "已完结") {
					return "bbb";
				} else if(row.timeOutStatus == '1') {
					return "ddd";
				}
				return "";
			},
			toChange(val) {
				this.formData = {
					userId: localStorage.getItem('ms_userId'),
					infosBeginNum: 1,
					infosEndNum: 20
				}
				this.list = []
				this.onLoad()
			},
			onSearch(val) {},
			labelShow(row) {
				return row.fstatus + " " + row.fsrcCompany + " " + row.factivityName
			},
			toUrl(row) {
				//审批信息

				if(row.classId.indexOf('OA') != -1) {
					row.classId = 'oaRouter'
					this.$api.myDesk.getWorkItemTypeModel({
						srcId: row.fsrcoId
					}).then(data => {
						this.$api.collaborativeOffice.findDataBySrcId({
							srcId: data.data.data.srcId,
							tempId: data.data.data.tempId,
							tableName: data.data.data.tableName
						}).then(val => {
							var conNow = JSON.parse(val.data.data)
							//附件
							this.$api.collaborativeOffice.findlnfosList({
								voucherId: conNow.id,
								userCode: localStorage.getItem('ms_userId'),
								menuCode: "workItem"
							}).then(con => {
								conNow.tempId = data.data.data.tempId
								conNow.files = con.data.data
								this.$router.push({
									name: "toDoListDetails",
									params: {
										row: row,
										contextOther: conNow,
										valueState: this.value
									}
								})
							})
						})
					})
				} else {
					this.$router.push({
						name: "toDoListDetails",
						params: {
							row: row
						}
					})
				}
			},
			beginOnLoad() {
				this.formData = {
					userId: localStorage.getItem('ms_userId'),
					infosBeginNum: 1,
					infosEndNum: 20
				}
				this.list = []
				this.onLoad()
			},
			onLoad() {
				//防止多次调用
				if(!this.showState) {
					this.finished = false
					this.showState = true
					var urlCon = ""
					switch(this.value) {
						case 1:
							urlCon = "workFlow/unhandledTask"
							break;
						case 2:
							urlCon = "workFlow/attentionTask"
							break;
						case 3:
							urlCon = "workFlow/handledTask"
							break;
						case 4:
							urlCon = "workFlow/sendedTask"
							break;
					}
					this.$api.myDesk.postHttp(urlCon, this.formData).then(data => {
						this.formData.infosBeginNum += 20;
						this.formData.infosEndNum += 20;
						this.isLoading = false
						this.loading = false
						data.data.data.rows.forEach(item => {
							this.list.push(item)
						})
						if(data.data.data.rows.length < 20) {
							this.finished = true;
						}
						this.showState = false
					})
				}
			},
		},
	};
</script>

<style scoped="scoped">
	/deep/.van-dropdown-menu__item {
		background: #C0C0C0!important;
	}
	
	/deep/.van-dropdown-menu__bar {
		box-shadow: 0 0px 0px rgba(100, 101, 102, .12)!important;
	}
	
	/deep/.van-search {
		padding: 7px 12px!important;
	}
	
	.vanDividerClassA {
		border: 0px solid whitesmoke;
		margin: 0px!important;
		width: 100vw
	}
	
	.bbb {
		height: auto;
		padding: 1vh;
		background: #f4fff9;
		border-left: 20px solid #b0f8cf;
	}
	
	.ccc {
		height: auto;
		padding: 1vh;
		background: #fffa7f;
		border-left: 20px solid #fffeed;
	}
	
	.ddd {
		height: auto;
		padding: 1vh;
		background: #ffcf91;
		border-left: 20px solid #fff4e5;
	}
	
	.eee {
		height: auto;
		padding: 1vh;
		background: brown;
		border-left: 20px solid #fff4e5;
	}
</style>