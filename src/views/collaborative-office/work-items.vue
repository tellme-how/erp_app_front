<template>
	<div>
		<!--<tabViews :showSeeOrUpd="dis" :context="context" :is="tabViews" :todoFlag="todoFlag"></tabViews>-->
		<tabViews :context="context" :is="tabViews"></tabViews>
	</div>
</template>
<script>
	import selectWorkItems from '../../views/collaborative-office/components/select-work-items';
	import addWorkItem from '../../views/collaborative-office/components/add-work-items';
	export default {
		components: {
			selectWorkItems,
			addWorkItem
		},
		data() {
			return {
				todoFlag:false,
				tabViews: "selectWorkItems",
				//查看1  新增2   修改3
				dis:"1",
				//传值
				context :{}
			}
		},
		methods: {
			//新增
			toAdd(row) {
				this.tabViews = "addWorkItem"
				this.context = row
			},
			//查询
			toSelect() {
				this.tabViews = "selectWorkItems"
			},
			//查看/修改
			toSee(context,tempId,state,files){
				this.context = context
				this.dis = state
				this.context.tempId = tempId
				this.context.files = files
				this.tabViews = "seeWorkItem"
			}
		}
	}
</script>
<style scoped="scoped">

</style>