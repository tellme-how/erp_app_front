<template>
	<div>
		<van-form @submit="onSubmit">
			<van-field v-model="param.username" name="username" label="用户名" placeholder="请输入用户名" :rules="[{ required: true, message: '请填写用户名' }]" />
			<van-field v-model="param.password" type="password" name="password" label="密码" placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' }]" />
			<div style="margin: 16px;">
				<van-button round block type="info" native-type="submit">
					提交
				</van-button>
			</div>
		</van-form>
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
			onSubmit() {
				localStorage.clear()
				this.$api.myDesk.login(this.param).then(val => {
					this.$api.myDesk.getUserInfo().then(data => {
						console.log(data)
						//账户ID
						localStorage.setItem('ms_userId', data.data.principal.accountId);
						localStorage.setItem('userData', JSON.stringify(data.data.principal));
						this.$router.push("/erp")
					})
					localStorage.setItem('ms_tokenId', val.data.access_token);
				})
			},
		}

	};
</script>

<style scoped="scoped">

</style>