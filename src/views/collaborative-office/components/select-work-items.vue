<template>
	<div>
		<van-row>
			<van-col span="10" style="height: 7vh;background: #C0C0C0;">
				<van-dropdown-menu>
					<van-dropdown-item @change="toUpd" v-model="value" :options="option" />
				</van-dropdown-menu>
			</van-col>
			<van-col span="14">
				<van-search @search="onSearch" style="height: 7vh;" background="#C0C0C0" v-model="mainName" placeholder="请输入模板名称" />
			</van-col>
		</van-row>
		<van-list v-model="loading" :finished="finished" :finished-text="overList" @load="getList">
			<van-cell @click="getMain(item)" title-class='titleClass' v-for="item in mainTable" :key="item.id" :title="item.name" />
		</van-list>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				overList:"",
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
			this.$store.commit("tabbarShow", true)
			this.$store.commit("titleShow", "选择模板")
			this.$api.collaborativeOffice.getCompanyData().then(data => {
				this.option = []
				data.data.forEach(item => {
					this.option.push({
						text: item.name,
						value: item.id
					})
				})
				this.value = this.option[0].value
				this.getList()
			})
		},
		methods: {
			onSearch() {
				this.mainTable = []
				this.formData.page = 1
				this.getList()
			},
			getList() {
				if(this.status) {
					this.status = false
					this.formData.company = this.value
					this.formData.name = this.mainName
					this.$api.collaborativeOffice.findWorkItemTempPage(this.formData).then(data => {
						if(data.data.data.rows.length > 0) {
							data.data.data.rows.forEach(item => {
								this.mainTable.push(item)
							})
							if(data.data.data.rows.length < 20) {
								this.finished = true
								this.overList = "总共"+ data.data.data.total +"条"
							}
							this.formData.page++;
						} else {
							this.finished = true
							this.overList = "总共"+ data.data.data.total +"条"
						}
						this.status = true
					})
				}
			},
			toUpd(value) {
				this.mainTable = []
				this.formData.page = 1
				this.mainName = ''
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
		word-break: break-all;
	}
	
	/deep/.van-dropdown-menu__bar {
		height: 7vh;
		background: #C0C0C0;
		box-shadow: none
	}
</style>