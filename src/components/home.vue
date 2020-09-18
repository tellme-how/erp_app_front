<template>
	<div>
		<div class="titleClass">
			<van-row>
				<van-col v-if="$route.name != 'index'" @click="toBack()" span="2">
					<van-icon style="margin-top: 10px;" name="arrow-left" />
				</van-col>
				<van-col span="22">{{$store.state.title}}</van-col>
			</van-row>
		</div>
		<div class="s"></div>
		<router-view :class="{homeBottom :$store.state.tabbar}" style="margin-bottom: 20vh;">
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
					c: true,
					d: false,
					e: true,
					f: false,
				},
				active: 0,
			};
		},
		created() {},
		methods: {
			toName() {
				switch(this.active) {
					case "1-1":
						this.show = {
							a: false,
							b: true,
							c: true,
							d: false,
							e: true,
							f: false,
						}
						this.$router.push({
							name: 'toDoList',
						})
						break;
					case "2-1":
						this.show = {
							a: true,
							b: false,
							c: false,
							d: true,
							e: true,
							f: false,
						}
						this.$router.push({
							name: 'index',
						})
						break;
					case "3-1":
						this.show = {
							a: true,
							b: false,
							c: true,
							d: false,
							e: false,
							f: true,
						}
						this.$router.push({
							name: 'personal',
						})
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