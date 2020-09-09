<template>
	<div>
		<form action="/">
			<van-search @search="onSearch" input-align="center" v-model="searchValue" shape="round" background="#C0C0C0" placeholder="请输入搜索关键词" />
		</form>
		<div v-for="(item,key) in list" :key="key">
			<van-row>
				<van-col span="24">
					<van-cell :class="{ 'bbb': item.fstatus=='已完成' , 'ccc': item.fstatus=='编辑中', 'ddd': item.fstatus=='超市'}" @click="toUrl(item)">
						<van-row>
							<van-col span="18">
								<van-row>
									{{item.fsubject}}
								</van-row>
								<van-row style="color: #969799;font-size: 12px;">
									{{labelShow(item)}}
								</van-row>
							</van-col>
							<van-col span="6" style="color: #969799;font-size: 12px;">
								{{item.fpreReceiveTime}}
							</van-col>
						</van-row>
					</van-cell>
					<van-divider class="vanDividerClassA" />
				</van-col>
			</van-row>
		</div>
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
			this.$store.commit("titleShow", "待办事项")
			this.onLoad()
		},
		methods: {
			onSearch(val) {},
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
	.vanDividerClassA {
		border: 0px solid whitesmoke;
		margin: 0px!important;
		width: 100vw
	}
	
	.bbb {
		height: auto;
		padding: 1vh;
		background: #f4fff9;
		border-left: 20px solid #b0f8cf;
	}
	
	.ccc {
		height: auto;
		padding: 1vh;
		background: #fffa7f;
		border-left: 20px solid #fffeed;
	}
	
	.ddd {
		height: auto;
		padding: 1vh;
		background: #ffcf91;
		border-left: 20px solid #fff4e5;
	}
</style>