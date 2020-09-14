<template>
	<div>
		<van-search background="#C0C0C0" v-model="mainName" placeholder="请输入模板名称" />
		<van-cell-group>
			<van-cell @click="getMain(item)" title-class='titleClass' v-for="item in mainTable" :key="item.id" :title="item.name" />
		</van-cell-group>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				mainName: "",
				mainTable: []
			}
		},
		created() {
			this.$store.commit("tabbarShow", false)
			this.$store.commit("titleShow", "选择模板")
			this.$api.collaborativeOffice.findWorkItemTempPage({
				page: 1,
				size: 10000,
				status: 3,
				userId: localStorage.getItem('ms_userId'),
				company: localStorage.getItem('ms_companyId')
			}).then(data => {
				this.mainTable = data.data.data.rows
			})
		},
		methods: {
			getMain(item) {
				this.$parent.toAdd(item)
			}
		}
	}
</script>
<style scoped="scoped">
	.titleClass {
		text-align: left;
	}
</style>