<template>
	<div>
		<form action="/">
			<van-search @search="onSearch" input-align="center" v-model="searchValue" shape="round" background="#C0C0C0" placeholder="请输入搜索关键词" />
		</form>
		<van-cell @click="toUrl(item)" v-for="(item,key) in list" :key="key">
			<template #title>
				<van-row style="text-align: left;">
					<van-col span="24">{{item.fsubject}}</van-col>
				</van-row>
			</template>
			<template #label>
				<van-row style="text-align: left;">
					<van-col span="17">{{labelShow(item)}}</van-col>
					<van-col span="7">{{item.fpreReceiveTime}}</van-col>
				</van-row>
			</template>
		</van-cell>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				loading: false,
				finished: false,
				searchValue: ""
			};
		},
		created() {
			this.onLoad()
		},
		methods: {
			onSearch(val) {
				console.log(val)
			},
			labelShow(row) {
				return row.fstatus + " " + row.fsrcCompany + " " + row.factivityName
			},
			toUrl(row) {
				this.$router.push({
					name: "toDoListDetails",
					params: {
						row: row
					}
				})
			},
			onLoad() {
				this.$api.myDesk.getunhandledTask({
					userId: localStorage.getItem('ms_userId'),
					infosBeginNum: 1,
					infosEndNum: 100000
				}).then(data => {
					data.data.data.rows.forEach(item => {
						this.list.push(item)
					})
				})
			},
		},
	};
</script>

<style>

</style>