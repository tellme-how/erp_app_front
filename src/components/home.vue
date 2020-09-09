<template>
	<div>
		<div class="titleClass">
			<van-row>
				<van-col @click="toBack()" span="2">
					<van-icon style="margin-top: 10px;" name="arrow-left" /></van-col>
				<van-col span="22">{{$store.state.title}}</van-col>
			</van-row>
		</div>
		<div class="s"></div>
		<router-view></router-view>
	</div>

</template>

<script>
	import { Toast } from 'vant';
	export default {
		data() {
			return {};
		},
		created() {},
		methods: {
			toBack() {
				window.history.back()
			}
		}
	};
</script>
<style scoped="scoped">
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
		background: blue;
	}
	
	.vanIconClass {
		color: white
	}
</style>