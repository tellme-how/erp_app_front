<template>
	<div>
		<form action="/">
			<van-row style="background: #C0C0C0;height: 7vh;">
				<van-col span="8">
					<van-dropdown-menu>
						<van-dropdown-item @change="toChange" v-model="value" :options="contextListA" />
					</van-dropdown-menu>
				</van-col>
				<van-col span="16">
					<van-search @search="onSearch" input-align="center" v-model="searchValue" background="#C0C0C0" shape="round" placeholder="请输入搜索关键词" />
				</van-col>
			</van-row>
		</form>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="toMore">
			<div style="margin: 10px;" v-for="(item,key) in list">
				<van-row>
					<van-row class="noticetitle">
						{{item.fname}}
					</van-row>
					<van-row style="margin-top: 5px;text-align: left;margin-left: 20px;font-size: 12px;color: DarkGray;">
						<van-col span="15">
							创建人 : {{item.fcreatorname}}
						</van-col>
						<van-col span="9	">
							{{item.fcreatetime}}
						</van-col>
					</van-row>
				</van-row>
				<van-divider class="vanDividerClassA" />
			</div>
		</van-list>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				value: -1,
				contextListA: [],
				formList: {
					page: 1,
					size: 20
				},
				formListAll: {
					page: 1,
					size: 20
				},
				list: [],
				loading: false,
				finished: false,
				searchValue: ""
			};
		},
		created() {
			this.$store.commit("titleShow", "通知公告")
			this.onLoad()
		},
		methods: {
			//格式化日期
			formateDate(date) {
				let datetime =  new  Date(date);
				return new  Date(Date.UTC(
						datetime.getFullYear(),
						datetime.getMonth(),
						datetime.getDate(),
						datetime.getHours(),
						datetime.getMinutes(),
						datetime.getSeconds()))
					.toISOString()
					.slice(0,  19).replace('T', ' ');
			},
			onSearch(val) {},
			toChange(val) {
				this.list = []
				this.finished = false
				this.formList.page = 1
				this.formListAll.page = 0
				if(this.value != -1) {
					this.formList.fpid = this.contextListA[this.value + 1].fpid
					this.getList()
				}
			},
			getList() {
				this.$api.myDesk.findDocumentManageByPage(this.formList).then(data => {
					data.data.data.rows.forEach(item => {
						this.list.push(item)
					})
					this.loading = false
					if(data.data.data.rows.length < 20) {
						this.finished = true
					}
				})
			},
			toMore() {
				if(typeof(this.formListAll.fpid) != "undefined") {
					if(this.value == -1) {
						this.formListAll.page++;
						this.getAll()
					} else {
						this.formList.page++;
						this.getList()
					}
				}
			},
			labelShow(row) {
				return row.fstatus + " " + row.fsrcCompany + " " + row.factivityName
			},
			toUrl(row) {
				this.$router.push({
					name: "toDoListDetails",
					params: {
						row: row
					}
				})
			},
			onLoad() {
				this.$api.myDesk.getDocumentCategoryOrgArch({
					isportalshow: 1
				}).then(data => {
					this.contextListA = []
					eval("(" + data.data.data + ")").forEach(item => {
						if(item.fname == "通知公告") {
							this.formListAll.fpid = item.foid
							this.contextListA.push({
								text: "全部",
								value: -1,
								fpid: item.foid
							})
							this.getAll()
							item.children.forEach((val, key) => {
								this.contextListA.push({
									text: val.fname,
									value: key,
									fpid: val.foid,
								})
							})
						}
					})
				})
			},
			getAll() {
				this.$api.myDesk.findDocumentManageByPage(this.formListAll).then(data => {
					data.data.data.rows.forEach(item => {
						item.fcreatetime = this.formateDate(item.fcreatetime)
						this.list.push(item)
					})
					this.loading = false
					if(data.data.data.rows.length < 20) {
						this.finished = true
					}
				})
			}
		},
	};
</script>

<style scoped="scoped">
	.noticetitle {
		text-align: left;
		margin-left: 20px;
	}
	
	/deep/.van-dropdown-menu__item {
		background: #C0C0C0!important;
	}
	
	/deep/.van-col--14 {
		text-align: left;
		margin-left: 20px;
	}
	
	/deep/.van-dropdown-menu__bar {
		box-shadow: 0 0px 0px rgba(100, 101, 102, .12)!important;
	}
	
	/deep/.van-search {
		padding: 7px 12px!important;
	}
	
	.vanDividerClassA {
		border: 0px solid whitesmoke;
		margin: 0px;
		margin-top: 10px;
		width: 100vw
	}
</style>