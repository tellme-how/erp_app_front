<!--
	全局loading --  孟鹏飞 2020-10-15
		开启 this.$store.commit('showLoading')
		关闭 this.$store.commit('hideLoading')
-->


<template>
	<div class="loading">
		<van-loading type="spinner" color="#1989fa" />
	</div>
</template>

<script>
	export default {
		name: 'LOADING',
		data() {
			return {}
		},
	}
</script>
<style scoped>
	.loading {
		position: fixed;
		z-index: 9999;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>