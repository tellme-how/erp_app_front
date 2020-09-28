<template>
	<div>
		<div class="titleClass">
			<van-icon v-if="$route.name != 'index' && $route.name != 'toDoList' && $route.name != 'personal'" @click="toBack()" style="margin-top: 10px;position: fixed;left: 0px;top: 0px;" name="arrow-left" /> {{$store.state.title}}
		</div>
		<div class="s"></div>
		<router-view :class="{homeBottom :$store.state.tabbar}" style="margin-bottom: 10vh;">
		</router-view>
		<van-tabbar v-if="$store.state.tabbar" v-model="active" @change="toName">
			<van-tabbar-item v-if="show.a" name="1-1" :icon="this.$GLOBAL.htmlUrl + '待办.png'">待办</van-tabbar-item>
			<van-tabbar-item v-if="show.b" name="1-2" :icon="this.$GLOBAL.htmlUrl + '待办-选中.png'">待办</van-tabbar-item>
			<van-tabbar-item v-if="show.c" name="2-1" :icon="this.$GLOBAL.htmlUrl + '首页.png'">首页</van-tabbar-item>
			<van-tabbar-item v-if="show.d" name="2-2" :icon="this.$GLOBAL.htmlUrl + '首页-选中.png'">首页</van-tabbar-item>
			<van-tabbar-item v-if="show.e" name="3-1" :icon="this.$GLOBAL.htmlUrl + '我的.png'">我的</van-tabbar-item>
			<van-tabbar-item v-if="show.f" name="3-2" :icon="this.$GLOBAL.htmlUrl + '我的-选中.png'">我的</van-tabbar-item>
		</van-tabbar>
	</div>

</template>

<script>
	import { Toast } from 'vant';
	export default {
		data() {
			return {
				show: {
					a: true,
					b: false,
					c: false,
					d: true,
					e: true,
					f: false,
				},
				active: '2-2'
			};
		},
		created() {},
		watch: {
			$route(to, from) {
				if(to.name == 'index') {
					this.show = {
						a: true,
						b: false,
						c: false,
						d: true,
						e: true,
						f: false,
					}
					this.active = '2-1'
				} else if(to.name == 'toDoList') {
					this.show = {
						a: false,
						b: true,
						c: true,
						d: false,
						e: true,
						f: false,
					}
					this.active = '1-1'
				} else if(to.name == 'personal') {
					this.show = {
						a: true,
						b: false,
						c: true,
						d: false,
						e: false,
						f: true,
					}
					this.active = '3-1'
				} else {
					this.show = {
						a: true,
						b: false,
						c: true,
						d: false,
						e: true,
						f: false,
					}
				}
				this.active = ''
			}
		},
		methods: {
			toName() {
				switch(this.active) {
					case "1-1":
						if(this.$route.name != "toDoList") {
							this.$router.push({
								name: 'toDoList',
							})
						}
						break;
					case "2-1":
						if(this.$route.name != "index") {
							this.$router.push({
								name: 'index',
							})
						}
						break;
					case "3-1":
						if(this.$route.name != "personal") {
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
								this.$router.push({
									name: 'personal',
								})
								this.$api.publicUrl.getCompanyData().then(data => {
									localStorage.setItem('CompanyData', JSON.stringify(data.data.data.rows));
								})
							})
						}
						break;
				}
			},
			toBack() {
				if(this.$route.name == "toDoList") {
					this.$router.push("index")
				} else {
					window.history.back()
				}
			}
		}
	};
</script>
<style scoped="scoped">
	.homeBottom {
		padding-bottom: 50px;
	}
	
	.titleClass {
		z-index: 999;
		position: fixed;
		top: 0;
		width: 100%;
		height: 5vh;
		line-height: 5vh;
		color: #000000;
		background-color: rgba(81, 118, 171, 1)
	}
	
	.s {
		height: 5vh;
		width: 100%;
	}
	
	.vanIconClass {
		color: white
	}
</style>