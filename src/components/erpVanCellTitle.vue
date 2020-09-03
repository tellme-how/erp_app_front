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

<style>

</style>