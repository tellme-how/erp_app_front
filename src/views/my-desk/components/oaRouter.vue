<!--
	工作事项
-->
<template>
	<div>
		<WorkItemPage ref="childOtherChild"  v-for="(item,key) in contextOther" :key="key" style="display: block;" :showChild="key == 0 ? '1' : '2'" :contextOther="item" :showSeeOrUpd="showSeeOrUpd1(item)" ></WorkItemPage>
	</div>
</template>

<script>
	import WorkItemPage from './workList.vue'; // 工作事项的详情

	export default {
		props: {
			showSeeOrUpd: String,
			context: Object,

		},
		components: {
			WorkItemPage
		},
		data() {
			return {
				contextOther : []
			};
		},
		created() {
			this.$api.myDesk.findIds({
				srcId: this.context.fsrcoId,
			}).then((res) => {
				this.getContext(res)
			})
		},
		methods: {
			showSeeOrUpd1(row){
				if((row.gestor == localStorage.getItem('ms_staffId') || typeof(row.gestor) == 'undefined') && this.showSeeOrUpd == 3){
					return '3'
				}else{
					return '1'
				}
			},
			async getContext(res) {
				for(var i = 0; i < res.data.data.length; i++) {
					await this.$api.collaborativeOffice.findDataBySrcId({
						srcId: res.data.data[i].idInProcess,
						tempId: res.data.data[i].tempId,
						tableName: res.data.data[i].tableName
					}).then(data => {
						return new Promise(resolve => {
							this.$api.collaborativeOffice.findlnfosList({
								voucherId: JSON.parse(data.data.data).id,
								userCode: localStorage.getItem('ms_userId'),
								menuCode: "workItem"
							}).then(val => {
								var a = JSON.parse(data.data.data)
								a.tempId = res.data.data[i].tempId;
								a.tableName = res.data.data[i].tableName;
								a.files = val.data.data;
								this.contextOther.push(a)
								resolve({})
							})
						});

					})
				}
			}
		},
	};
</script>

<style>

</style>