<template>
	<div class="loginHeaderA">
		<div class="loginA">
			账号密码登录
		</div>
		<div class="loginDataA">
			<van-form>
				<van-field size="200" v-model="param.username" left-icon="user-o" name="username" label="" placeholder="请输入用户名" :rules="[{ required: true, message: '' }]" />
				<van-field v-model="param.password" left-icon="bag-o" type="password" name="password" label="" placeholder="请输入密码" :rules="[{ required: true, message: '' }]" />
			</van-form>
		</div>
		<div class="loginButtonA">
			<van-button block type="info" @click="submit">
				提交
			</van-button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				param: {
					grant_type: 'password',
					username: '',
					password: ''
				},
			};
		},
		methods: {
			submit() {
				localStorage.clear()
				this.$api.myDesk.login(this.param).then(val => {
					this.$api.myDesk.getUserInfo().then(data => {
						console.log(data)
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
						this.$router.push("/erp")
						this.$api.publicUrl.getCompanyData().then(data => {
							localStorage.setItem('CompanyData', JSON.stringify(data.data.data.rows));
						})
					})
					localStorage.setItem('ms_tokenId', val.data.access_token);
				})
			},
		}

	};
</script>

<style scoped="scoped">
	/deep/.van-cell {
		line-height: 50px;
	}
	
	.loginButtonA {
		height: 10vh;
		line-height: 10vh;
		width: 50vw;
		margin: 0 auto;
	}
	
	.loginDataA {
		height: 30vh;
		line-height: 30vh;
		width: 70vw;
		margin: 0 auto;
	}
	
	.loginHeaderA {
		height: 100vh;
		width: 100vw;
		line-height: 100vh;
		font-size: 30px;
		color: #1989fa;
	}
	
	.loginA {
		height: 30vh;
		line-height: 30vh;
		width: 100vw;
	}
</style>