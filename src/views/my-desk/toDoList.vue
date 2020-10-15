<template>
	<div>
		<van-row style="background: #C0C0C0;">
			<van-col span="8">
				<van-dropdown-menu>
					<van-dropdown-item @change="toChange" v-model="value" :options="contextListA" />
				</van-dropdown-menu>
			</van-col>
			<van-col span="16">
				<van-search @search="onSearch" @clear="onSearchClear" input-align="center" v-model="searchValue" shape="round" background="#C0C0C0" placeholder="请输入搜索关键词" />
			</van-col>
		</van-row>
		<van-pull-refresh v-model="isLoading" @refresh="beginOnLoad();">
			<van-list :finished="finished" :finished-text="overList" @load="onLoad" style="min-height: 80vh;">
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
				overList: ""
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
				if(row.fstatus === "已完结") {
					return "bbb";
				} else if(row.timeOutStatus == '1') {
					return "ddd";
				} else if((row.fsubject.substring(0, 3) == '退回：' && row.fcreator == localStorage.getItem("ms_userId")) || row.fcode == 'manpower') {
					return 'ccc'
				}
				return "fff";
			},
			toChange(val) {
				this.searchValue = ""
				switch(val) {
					case 1:
						this.$store.commit("titleShow", "待办事项")
						break;
					case 2:
						this.$store.commit("titleShow", "关注事项")
						break;
					case 3:
						this.$store.commit("titleShow", "已办事项")
						break;
					case 4:
						this.$store.commit("titleShow", "已发事项")
						break;
				}
				this.formData = {
					userId: localStorage.getItem('ms_userId'),
					infosBeginNum: 1,
					infosEndNum: 20
				}
				this.list = []
				this.onLoad()
			},
			onSearch() {
				this.formData = {
					userId: localStorage.getItem('ms_userId'),
					subject: this.searchValue,
					infosBeginNum: 1,
					infosEndNum: 20
				}
				this.list = []
				this.onLoad()
			},
			onSearchClear() {
				this.formData = {
					userId: localStorage.getItem('ms_userId'),
					subject: "",
					infosBeginNum: 1,
					infosEndNum: 20
				}
				this.list = []
				this.onLoad()
			},
			labelShow(row) {
				return row.fstatus + " " + row.fsrcCompany + " " + row.factivityName
			},
			toUrl(row) {
				if(row.classId == 'StaffAppraisals') {
					this.goOut('页面不存在,请联系系统管理人员!')
					return
				}
				if(row.fsubject.indexOf('退回') != -1 && row.classId.indexOf('OA') == -1) {
					this.goOut("此类单据请至系统中进行编辑")
					return
				}
				//审批信息
				if(row.classId.indexOf('OA') != -1) {
					row.classId = 'oaRouter'
				}
				this.$router.push({
					name: "toDoListDetails",
					params: {
						row: row,
						valueState: this.value
					}
				})
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
						data.data.data.rows.forEach(item => {
							this.list.push(item)
						})
						if(data.data.data.rows.length < 20) {
							this.finished = true;
							this.overList = "总共" + data.data.data.total + "条"
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
		background: #fff4e5;
		border-left: 20px solid #ffcf91;
	}
	
	.fff {
		height: auto;
		padding: 1vh;
		background: #fff;
		border-left: 20px solid #fff;
	}
</style>