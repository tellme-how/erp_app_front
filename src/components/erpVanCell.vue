<template>
	<van-cell style="text-align: left">
		<template #title>
			{{rowCell.name}}
		</template>
		<template #default>
			<span style="color: black;">{{formContext[rowCell.value]}}</span>
		</template>
	</van-cell>
</template>
<script>
	export default {
		
		props: {
			formContext: Object,
			rowCell: Object
		}
	}
</script>

<style>

</style>