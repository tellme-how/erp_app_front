<template>
	<div>
		<div>
			<van-swipe style="border-radius:15px;margin:10px;height: 20vh;" class="my-swipe" :autoplay="3000" indicator-color="white">
				<van-swipe-item v-for="(item,index) in 3" :key="index">
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
						<el-divider direction="vertical"></el-divider>{{item.text | showName}}</van-col>
					<van-col @click="toMore(item)" style="text-align: right;font-weight: bold;" span="4">more ></van-col>
				</van-row>
				<van-divider />
				<van-row @click="toSee(val)" style="margin-top: 3px;" v-for="(val,index1) in item.children" :key="index1">
					<van-col :class="val.fisread == 1 ? 'aaa':'bbb'" span="14">{{val.fname | showName}}<span v-if="val.fisread == 0" class="li-after "></span></van-col>
					<van-col span="10" style="text-align: right;">{{flastupdtimeShow(val.flastupdtime)}}</van-col>
				</van-row>
			</van-cell>
		</el-card>
		<!--<van-row>
			没有更多了
		</van-row>-->
	</div>
</template>

<script>
	export default {
		filters: {
			showName(status) {
				if(status.length > 20) {
					return status.slice(0, 20) + "..."
				} else {
					return status
				}
			}
		},
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
			//			this.getMoreList()
			this.$store.commit("titleShow", "工作助理")
			this.$store.commit("tabbarShow", true)
			//获取工作事项相关参数
			this.getUser();
			this.getContext();
			this.getNotice()
		},
		methods: {
			getNotice() {
				this.moreList = []
				this.$api.myDesk.getDocumentCategoryOrgArchForPhone({
					fdocstatus: 3,
					from: 1,
					fuserid: localStorage.getItem('ms_userId'),
					page: 1,
					roleIdSet: localStorage.getItem('ms_roles').split(','),
					size: 5,
				}).then(data => {
					data.data.data.forEach(item => {
						var a = {
							text: item.fname,
							value: item.foid,
							children: item.manageResVos,
							listChildren: item.categoryResVos
						}
						this.moreList.push(a)
					})
					this.show = true
				})
			},
			toSee(row) {
				this.$router.push({
					name: 'noticeSee',
					params: {
						foid: row.foid
					}
				})
			},
			getUser() {
				this.$api.myDesk.getUserInfo().then(data => {
					//账户ID
					localStorage.setItem('ms_userId', data.data.principal.accountId);
					//人员ID
					localStorage.setItem('ms_staffId', data.data.principal.staffId);
					//用户名称
					localStorage.setItem('ms_username', data.data.principal.fullname);
					//用户code
					localStorage.setItem('ms_accountNo', data.data.principal.accountNo);
					//部门ID
					localStorage.setItem('ms_userDepartId', data.data.principal.deptmentId);
					//部门名称
					localStorage.setItem('ms_userDepartName', data.data.principal.deptmentName);
					//公司ID
					localStorage.setItem('ms_companyId', data.data.principal.companyId);
					//公司名称
					localStorage.setItem('ms_companyName', data.data.principal.companyName);
					//该用户所拥有角色
					localStorage.setItem('ms_roles', data.data.principal.roles);
					//公司ID
					localStorage.setItem('ms_companyId', data.data.principal.companyId);
					//职位
					localStorage.setItem('ms_ffirmpositionName', data.data.principal.ffirmpositionName);
				})
			},
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
						id: item.value,
						rowNow: item
					}
				})
			},
			flastupdtimeShow(val) {
				return this.conversionTime2(val)
			},
		}
	};
</script>
<style scoped="scoped">
	.li-after {
		display: inline-block;
		margin: 0 0 3px 4px;
		width: 4px;
		height: 4px;
		background-color: red;
		border-radius: 4px;
	}
	
	.aaa {
		padding-left: 10px;
	}
	
	.bbb {
		padding-left: 10px;
		color: red;
	}
	
	/deep/.van-grid-item__content--center {
		background: #F5F5F5FF;
		padding: 8px 8px;
	}
	
	/deep/.van-icon__image {
		width: 2em!important;
		height: 2em!important;
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