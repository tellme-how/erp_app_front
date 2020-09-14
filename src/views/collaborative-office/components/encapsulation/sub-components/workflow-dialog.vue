<!--
	工作流弹出框 -- 孟鹏飞
	2020 - 08 - 06

-->

<template>
	<el-dialog :title="title?title:'工作事项模板主表'" top="1vh" :destroy-on-close="true" center :visible.sync="dialogVisible" width="80%">
		<selectWorkItems show="1" :status="status" ref="childMain"></selectWorkItems>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="getDialogVisible">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
//	import selectWorkItems from '../../select-work-items';
	export default {
		components: {
//			selectWorkItems
		},
		props: {
			status:String,
			title:String
		},
		data() {
			return {
				
				dialogVisible: false
			};
		},
		methods: {
			getDialogVisible() {
				this.$parent.getWorkDialig(this.$refs.childMain.rowClick)
			},
		}
	};
</script>

<style scoped>
	.treeDivClass {
		height: 600px;
		overflow: auto;
	}

</style>
