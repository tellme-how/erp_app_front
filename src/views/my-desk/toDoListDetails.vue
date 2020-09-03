<template>
	<div class="flexMainre">
		<tabViews :context="context" :is="$route.params.row.classId"></tabViews>
		<div style="height: 7vh;width: 100%;"></div>
		<div class="nextBtn">
			<van-row>
				<van-col span="6">
					<van-field readonly clickable :value="value" label="" placeholder="审批" @click="showPicker = true" />
					<van-popup v-model="showPicker" position="bottom">
						<van-picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
					</van-popup>
				</van-col>
				<van-col span="17">
					<van-field v-model="value2" center clearable label="" placeholder="请输入审批意见">
						<template #button>
							<van-button icon="success" size="mini" type="primary">提交</van-button>
						</template>
					</van-field>
				</van-col>
				<van-col span="1">
					<span @click="showShare = true">1</span>
					<van-share-sheet v-model="showShare" :options="options" @select="onSelect" /></van-col>
			</van-row>
		</div>
	</div>
</template>

<script>
	import DepartmentYearPlan from '../../views/my-desk/components/DepartmentYearPlan';
	export default {
		components: {
			DepartmentYearPlan
		},
		data() {
			return {
				columns: [],
				value: "",
				value2: "",
				showPicker: false,
				context: this.$route.params.row,
				tabViews: "",
				showShare: false,
				options: [{
						name: '转发',
						icon: 'wechat'
					},
					{
						name: '委托',
						icon: 'weibo'
					},
					{
						name: '关注',
						icon: 'link'
					},
					{
						name: '加签',
						icon: 'poster'
					}
				],
			};
		},
		created() {
			this.columns = []
			this.$api.myDesk.getWfDecisionTypeConByCurNode({
				mailId: this.context.foid
			}).then(data => {
				for(var key in data.data.data) {
					this.columns.push(data.data.data[key])
				}
			})
		},
		methods: {
			onSelect(option) {
				this.showShare = false;
			},
			onConfirm(value) {
				this.value = value
				this.showPicker = false;
			},
			toUrl() {
				this.tabViews = ""
			},
		},
	};
</script>

<style>
	.flexMainre {
		position: relative;
	}
	
	.nextBtn {
		position: fixed;
		bottom: 0;
		height: 7vh;
		width: 99%;
		background-color: #fff;
		margin: 1px;
		border: 1px solid black;
	}
</style>
<style>
	input {
		background-color: whitesmoke!important;
	}
</style>