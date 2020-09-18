<template>
	<div>
		<div>
			<van-swipe style="border-radius:30px;margin:10px;height: 20vh;" class="my-swipe" :autoplay="3000" indicator-color="white">
				<van-swipe-item v-for="(item,index) in 20"  :key="index">
					<van-image width="100%" height="100%" fit="fill" :src="$GLOBAL.htmlUrl + '/壁纸/'+item+'.jpg'" />
				</van-swipe-item>
			</van-swipe>
		</div>
		<van-grid :column-num="3" :gutter="10">
			<van-grid-item @click="toName(value)" v-for="value in list" :key="value.id" :icon="value.icon" :text="value.name" />
		</van-grid>
		<el-card style="margin: 10px;">
			<van-cell v-for="(item,index) in moreList" :key="index">
				<van-row>
					<van-col style="font-weight: bold;" span="20">
						<el-divider direction="vertical"></el-divider>{{item.text}}</van-col>
					<van-col @click="toMore(item)" style="text-align: right;font-weight: bold;" span="4">more ></van-col>
				</van-row>
				<van-divider />
				<van-row style="margin-top: 3px;" v-for="val in item.children">
					<van-col style="padding-left: 10px;" span="14">{{val.fname}}</van-col>
					<van-col span="10" style="text-align: right;">{{flastupdtimeShow(val.flastupdtime)}}</van-col>
				</van-row>
			</van-cell>
		</el-card>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					id: 1,
					name: "我的办公桌",
					icon: this.$GLOBAL.htmlUrl + '我的办公桌.png',
					url: "toDoList"
				}, {
					id: 2,
					name: "工作事项",
					icon: this.$GLOBAL.htmlUrl + '工作事项.png',
					url: "workItems"
				}, {
					id: 3,
					name: "新闻资讯",
					icon: this.$GLOBAL.htmlUrl + '新闻资讯.png',
					url: "notice"
				}],
				moreList: [],
				moreListOther: [],
				show: false
			};
		},
		created() {
			this.getMoreList()
			this.$store.commit("titleShow", "工作助理")
			//获取工作事项相关参数
			this.getContext();
		},
		methods: {
			/*
			 * 孟鹏飞 2020-08-06
			 *
			 * 登陆时调用工作事项内的查询接口，并放置于本地缓存
			 *
			 * */
			getContext() {
				//全部枚举
				this.$api.collaborativeOffice.findList({}).then(data => {
					localStorage.setItem('selectList', JSON.stringify(data.data.data));
				})
				//最上端公司选择
				this.$api.collaborativeOffice.getCompanyData().then(data => {
					localStorage.setItem('CompanyData', JSON.stringify(data.data.data.rows));
				})
				//全部服务
				this.$api.collaborativeOffice.findTServiceByParams({}).then(data => {
					localStorage.setItem('tServiceByParams', JSON.stringify(data.data.data));
				})
				//工作事项
				this.$api.collaborativeOffice.getFieldBrowse().then(data => {
					localStorage.setItem('fieldBrowseList', JSON.stringify(data.data.data));
				})
				//公司 部门 职位
				this.$api.collaborativeOffice.selectAllOrganizationInfo().then(data => {
					localStorage.setItem('allOrganizationInfo', JSON.stringify(eval('(' + data.data.data + ')')));
				})
				//人员
				this.$api.collaborativeOffice.findConList("staffManage/findStaffByPage", {
					page: 1,
					size: 100000
				}).then(data => {
					localStorage.setItem('staffList', JSON.stringify(data.data.data.rows));
				})
				//用户
				this.$api.collaborativeOffice.findConList("userManage/findUserBypage", {
					page: 1,
					size: 100000
				}).then(data => {
					localStorage.setItem('userList', JSON.stringify(data.data.data.rows));
				})
				//职务
				this.$api.collaborativeOffice.findConList("positionmnt/findPositionList", {
					page: 1,
					size: 100000
				}).then(data => {
					localStorage.setItem('positionList', JSON.stringify(data.data.data.rows));
				})
			},
			toName(row) {
				if(this.show) {
					this.$router.push({
						name: row.url,
						params: {
							moreList: this.moreList
						}
					})
				}
			},
			toMore(item) {
				this.$router.push({
					name: "notice",
					params: {
						moreList: this.moreList,
						id: item.value,
						rowNow: item
					}
				})
			},
			flastupdtimeShow(val) {
				return this.conversionTime2(val)
			},
			getMoreList() {
				this.$api.myDesk.getDocumentCategoryOrgArch({
					isportalshow: 1
				}).then(data => {
					this.getMore(eval("(" + data.data.data + ")"))
				})
			},
			async getMore(list) {
				this.moreList = []
				var state = false
				for(var i = 0; i < list.length; i++) {
					var conNow = await this.$api.myDesk.findDocumentManageByPage({
						fpid: list[i].foid,
						page: 1,
						size: 5,
						fdocstatus: 3,
						fuserid : localStorage.getItem('ms_userId')
					}).then(data => {
						state = true
						var rows = []
						if(data.data.code == 0){
							rows = data.data.data.rows
						}
						return new Promise(resolve => {
							resolve({
								text: list[i].fname,
								value: list[i].foid,
								children: rows,
								listChildren: list[i].children
							})
						});
					})
					this.moreListOther.push(conNow)
					if(i == list.length - 1 && state) {
						this.show = true
						this.moreList = this.moreListOther
					}
				}

			}
		}
	};
</script>
<style scoped="scoped">
	/deep/.van-grid-item__content--center {
		background: #F5F5F5FF;
	}
	
	/deep/.van-icon__image {
		width: 3em;
		height: 3em;
	}
	
	/deep/.el-divider--vertical {
		width: 3px;
		background-color: rgba(81, 118, 171, 1);
	}
	
	/deep/.el-card__body {
		padding: 0px!important;
	}
	
	/deep/.van-cell::after {
		display: none;
	}
	
	/deep/.van-grid-item__text {
		color: #000000;
		font-size: 15px;
	}
	
	/deep/.van-divider {
		margin-top: 5px;
		margin-bottom: 10px;
	}
	
	/deep/ .van-grid-item__content--surround::after {
		border: 0px !important;
	}
</style>