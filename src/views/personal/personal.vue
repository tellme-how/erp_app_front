<template>
	<div>
		<van-row style="background: #FFFFFF;">
			<van-col span="10">
				<!--<van-image width="35vw" height="20vh" src="https://img.yzcdn.cn/vant/cat.jpeg" />-->
				<van-swipe style="border-radius:30px;margin:10px;height: 20vh;" class="my-swipe" :autoplay="3000" indicator-color="white">
					<van-swipe-item v-for="(item,index) in list" :key="index">
						<van-image width="35vw" height="20vh" fit="fill" :src="$GLOBAL.htmlUrl + item+'.jpg'" />
					</van-swipe-item>
				</van-swipe>
			</van-col>
			<van-col span="14">
				<van-row class="rowClassA">
					{{userName}}
				</van-row>
				<van-row class="rowClassB">
					{{company}}
				</van-row>
				<van-row class="rowClassB">
					{{department}}
				</van-row>
				<van-row class="rowClassB">
					{{ffirmpositionname}}
				</van-row>
			</van-col>
		</van-row>
		<van-row @click="clearUser" class="rowDown">
			注销
		</van-row>
	</div>
</template>

<script>
	import { Dialog } from 'vant';
	export default {
		data() {
			return {
				userName: localStorage.getItem('ms_username'),
				company: localStorage.getItem('ms_companyName'),
				department: localStorage.getItem('ms_userDepartName'),
				ffirmpositionname: localStorage.getItem('ms_ffirmpositionName'),
				list: ["龙", "颖", "健", "曲"]
			};
		},
		created() {
			this.$store.commit("titleShow", "个人设置")
			this.$store.commit("tabbarShow", true)
		},
		methods: {
			clearUser() {
				Dialog.confirm({
						title: '提示',
						message: '退出后需要重新登录',
					})
					.then(() => {
						localStorage.clear()
						this.$router.push("/")
					})
					.catch(() => {});
			}
		},
	};
</script>

<style scoped="scoped">
	.rowClassA {
		height: 5vh;
		line-height: 5vh;
		font-weight: 600;
		font-size: 20px;
	}
	
	.rowClassB {
		height: 5vh;
		line-height: 5vh;
		font-size: 14px;
		color: DarkGray;
	}
	
	.rowDown {
		height: 5vh;
		line-height: 5vh;
		width: 100%;
		background: #F56C6C;
		margin-top: 2vh;
	}
</style>