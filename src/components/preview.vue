<template>
	<div v-html="context"></div>
</template>

<script>
	export default {
		created() {
			this.$store.commit("titleShow", this.$route.params.titleShow)
			this.$store.commit("tabbarShow", false)
			this.context = this.$route.params.context
		},
	};
</script>
<style scoped="scoped">

</style>