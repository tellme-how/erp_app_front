<template>
	<div>
		<van-row style="background: #C0C0C0;">
			<van-col span="6">
				<van-dropdown-menu>
					<van-dropdown-item v-model="optionValue" :options="option" @change="toChangeRight" />
				</van-dropdown-menu>
			</van-col>
			<van-col span="12">
				<van-search @search="onSearch" @clear="list=[];formListAll.page='1';getAll();" input-align="center" v-model="searchValue" background="#C0C0C0" shape="round" placeholder="请输入搜索关键词">
				</van-search>
			</van-col>
			<van-col span="6">
				<van-dropdown-menu>
					<van-dropdown-item @change="toChange" v-model="value" :options="contextListA" />
				</van-dropdown-menu>
			</van-col>
		</van-row>
		<van-pull-refresh v-model="isLoading" @refresh="onSearch(searchValue)">
			<van-list v-model="loading" :finished="finished" :finished-text="overList" @load="toMore">
				<div style="margin: 10px;" v-for="(item,key) in list" @click="toDo(item)">
					<van-row>
						<van-row class="noticetitle">
							<van-col span="22" style="overflow: auto;">
								<van-image v-if="item.fisread == 0" width="0.5rem" height="0.5rem" fit="contain" :src="$GLOBAL.htmlUrl + '未读.png'" /> {{item.fname}}
							</van-col>
							<van-col span="2" style="text-align: center;" v-if="item.fistop == 1">
								<van-image width="1rem" height="1rem" fit="contain" :src="$GLOBAL.htmlUrl + '置顶.png'" />
							</van-col>
						</van-row>
						<van-row style="margin-top: 5px;text-align: left;margin-left: 20px;font-size: 12px;color: DarkGray;">
							创建人 : {{item.fcreatorname}}
						</van-row>
						<van-row style="text-align: right;font-size: 12px;color: DarkGray;">
							{{item.fcreatetime}}
						</van-row>
					</van-row>
					<van-divider class="vanDividerClassA" />
				</div>
			</van-list>
		</van-pull-refresh>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				overList: "",
				isLoading: false,
				optionValue: "",
				option: [],
				show: false,
				value: -1,
				contextListA: [],
				formList: {
					page: 1,
					size: 20,
					fpid: "",
					fdocstatus: "3",
					from: "1",
					roleIdSet: localStorage.getItem('ms_roles').split(','),
					fuserid: localStorage.getItem('ms_userId')
				},
				formListAll: {
					page: 1,
					size: 20,
					fdocstatus: "3",
					from: "1",
					roleIdSet: localStorage.getItem('ms_roles').split(','),
					fuserid: localStorage.getItem('ms_userId')
				},
				list: [],
				loading: false,
				finished: false,
				searchValue: "",
				showState: false,
				showFig: true,
				rowNow: {}
			};
		},
		activated() {
			this.option = []
			this.list = []
			this.$api.myDesk.getDocumentCategoryOrgArchForPhone({
				fdocstatus: 3,
				from: 1,
				fuserid: localStorage.getItem('ms_userId'),
				page: 1,
				roleIdSet: localStorage.getItem('ms_roles').split(','),
				size: 5,
			}).then(data => {
				data.data.data.forEach((item, index) => {
					var a = {
						text: item.fname,
						value: item.foid,
						children: item.manageResVos,
						listChildren: item.categoryResVos
					}
					this.option.push(a)
					if(index == data.data.data.length - 1) {
						if(this.$route.params.id) {
							this.showFig = false
							this.optionValue = this.$route.params.id
							this.rowNow = this.$route.params.rowNow
						} else {
							this.showFig = true
							this.optionValue = this.option[0].value
						}
						this.$store.commit("tabbarShow", true)
						this.onLoad()
					}
				})
			})
			this.$store.commit("titleShow", '新闻资讯')
		},
		beforeRouteLeave(to,from,next){
			this.searchValue = '';
			next();
		},
		methods: {
			toDo(row) {
				this.$router.push({
					name: 'noticeSee',
					params: {
						foid: row.foid
					}
				})
			},
			toChangeRight(aaa) {
				this.formListAll = {
					page: 1,
					size: 20,
					fdocstatus: "3",
					from: "1",
					roleIdSet: localStorage.getItem('ms_roles').split(','),
					fuserid: localStorage.getItem('ms_userId')
				}
				this.list = []
				this.onLoad(1)
				this.value = -1
			},
			onLoad(state) {
				this.contextListA = []
				this.formListAll.fpid = this.optionValue
				this.contextListA.push({
					text: "全部",
					value: -1,
					fpid: this.optionValue
				})
				this.getAll()
				if(state == 1) {
					this.$api.myDesk.getDocumentCategoryOrgArch({
						isportalshow: 1
					}).then(data => {
						eval("(" + data.data.data + ")").forEach(item => {
							if(item.foid == this.optionValue) {
								if(typeof(item.children) != "undefined") {
									item.children.forEach((val, key) => {
										this.contextListA.push({
											text: val.fname,
											value: key,
											fpid: val.foid,
										})
									})
								}
							}
						})
					})
				} else {
					if(this.showFig) {
						if(typeof(this.option[0].listChildren) != "undefined") {
							this.option[0].listChildren.forEach((val, key) => {
								this.contextListA.push({
									text: val.fname,
									value: key,
									fpid: val.foid,
								})
							})
						}
					} else {
						if(typeof(this.rowNow.listChildren) != "undefined") {
							this.rowNow.listChildren.forEach((val, key) => {
								this.contextListA.push({
									text: val.fname,
									value: key,
									fpid: val.foid,
								})
							})
						}
					}
				}
			},
			getAll() {
				this.list = []
				if(!this.showState) {
					this.showState = true
					this.$api.myDesk.findDocumentManageByPage(this.formListAll).then(data => {
						data.data.data.rows.forEach(item => {
							item.fcreatetime = this.formateDate(item.fcreatetime)
							this.list.push(item)
						})
						this.loading = false
						if(data.data.data.rows.length < 20) {
							this.finished = true
							this.overList = "总共" + data.data.data.total + "条"
						}
						this.showState = false
						this.isLoading = false
					})
				}
			},
			toName() {

			},
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
			onSearch(val) {
				if(this.noNull(val)) {
					this.list = [];
					this.formListAll.page = 1;
					this.getAll();
				} else {
					this.list = this.list.filter(item => {
						return item.fname.indexOf(val) != -1
					})
					this.overList = "总共" + this.list.length + "条"
					this.showState = false
					this.isLoading = false
				}
			},
			toChange(val) {
				this.list = []
				this.finished = false
				this.formList.page = 1
				this.formListAll.page = 0
				if(this.value == -1) {
					this.formList.fpid = this.optionValue
					this.formListAll.fpid = this.optionValue
					this.getList()
				} else {
					this.formList.fpid = this.contextListA[this.value + 1].fpid
					this.formListAll.fpid = this.contextListA[this.value + 1].fpid
					this.getList()
				}
			},
			getList() {
				if(!this.showState) {
					this.showState = true
					this.$api.myDesk.findDocumentManageByPage(this.formList).then(data => {
						data.data.data.rows.forEach(item => {
							this.list.push(item)
						})
						this.loading = false
						if(data.data.data.rows.length < 20) {
							this.finished = true
							this.overList = "总共" + data.data.data.total + "条"
						}
						this.showState = false
					})
				}
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
			}
		},
	};
</script>

<style scoped="scoped">
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
	
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
	
	/deep/.van-search {
		padding: 7px 12px;
	}
	
	/deep/.van-dropdown-menu__bar {
		box-shadow: 0 0px 0px rgba(100, 101, 102, .12)!important;
	}
	
	/deep/.van-dropdown-menu__title::after {
		right: 3px!important
	}
</style>