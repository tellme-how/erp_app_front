<template>
	<van-cell :title="title">
		<template #default>
			<slot></slot>
		</template>
	</van-cell>
</template>
<script>
	export default {
		props: {
			title: String
		}
	}
</script>

<style scoped>
	/deep/.van-cell__title {
		max-width: 30%;
	}
	
	/deep/.van-cell__value {
		text-align: center;
		color: #000000;
	}
</style>