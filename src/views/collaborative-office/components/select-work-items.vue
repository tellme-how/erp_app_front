<template>
	<div>
		<van-row>
			<van-col span="10" style="height: 7vh;background: #C0C0C0;">
				<van-dropdown-menu>
					<van-dropdown-item @change="toUpd" v-model="value" :options="option" />
				</van-dropdown-menu>
			</van-col>
			<van-col span="14">
				<van-search style="height: 7vh;" background="#C0C0C0" v-model="mainName" placeholder="请输入模板名称" />
			</van-col>
		</van-row>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getList">
			<van-cell @click="getMain(item)" title-class='titleClass' v-for="item in mainTable" :key="item.id" :title="item.name" />
		</van-list>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				mainName: "",
				mainTable: [],
				value: "",
				option: [],
				finished: false,
				loading: true,
				formData: {
					page: 1,
					size: 20,
					status: 3,
					userId: localStorage.getItem('ms_userId'),
				},
				status: true,
			}
		},
		created() {
			this.$store.commit("tabbarShow", false)
			this.$store.commit("titleShow", "选择模板")
			this.$api.collaborativeOffice.getCompanyData().then(data => {
				this.option = []
				data.data.data.rows.forEach(item => {
					if(item.id == "BFPID000000LQX00SR"){
						console.log(item)
					}
					this.option.push({
						text: item.name,
						value: item.id
					})
				})
				this.value = localStorage.getItem('ms_companyId')
				this.getList()
			})
		},
		methods: {
			getList() {
				if(this.status) {
					this.status = false
					this.formData.company = this.value
					this.$api.collaborativeOffice.findWorkItemTempPage(this.formData).then(data => {
						data.data.data.rows.forEach(item =>{
							this.mainTable.push(item)
						})
						if(data.data.data.rows.length < 20){
							this.finished = true
						}
						this.status = true
						this.formData.page++;
					})
				}
			},
			toUpd(value) {
				this.mainTable = []
				this.formData.page = 1
				this.getList()
			},
			getMain(item) {
				this.$parent.toAdd(item)
			},
		}
	}
</script>
<style scoped="scoped">
	.titleClass {
		text-align: left;
	}
	
	/deep/.van-dropdown-menu__bar {
		height: 7vh;
		background: #C0C0C0;
		box-shadow :none
	}
</style>