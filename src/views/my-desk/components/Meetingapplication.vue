<!--
	会议申请
-->
<template>
	<div>
		<erpVanCell v-for="(item,key) in list" :key="key" :formContext="formContext" :rowCell="item"></erpVanCell>
		<van-cell title="附件"></van-cell>
		<van-cell title-class='titleClassBlue' v-for="(item,index) in fileList" :key="index" :title="item.name">
			<template #default>
				<van-icon @click="delUpload(index)" name="cross" />
			</template>
		</van-cell>
	</div>
</template>

<script>
	export default {
		props: {
			context: Object
		},
		data() {
			return {
				formContext: {},
				list: [{
					name: "公司",
					value: "fcompanyname",
					list: []
				}, {
					name: "编码",
					value: "fcode",
					list: []
				}, {
					name: "名称",
					value: "fname",
					list: []
				}, {
					name: "召集人",
					value: "fconvenername",
					list: []
				}, {
					name: "召集人部门",
					value: "fconvenerdeptname",
					list: []
				}, {
					name: "联系人",
					value: "fcontactname",
					list: []
				}, {
					name: "联系人部门",
					value: "fcontactdeptname",
					list: []
				}, {
					name: "联系方式",
					value: "fphone",
					list: []
				}, {
					name: "参会人数",
					value: "fcpmcount",
					list: []
				}, {
					name: "起始时间",
					value: "fstartdate",
					list: []
				}, {
					name: "结束时间",
					value: "fenddate",
					list: []
				}, {
					name: "会议室",
					value: "fconfname",
					list: []
				}, {
					name: "是否公开",
					value: "fovert",
					list: []
				}, {
					name: "重要程度",
					value: "fimportanceValue",
					list: []
				}, {
					name: "是否对外",
					value: "fexternal",
					list: []
				}, {
					name: "内部参与人",
					value: "internalMansName",
					list: []
				}, {
					name: "外部参与人",
					value: "fexternalman",
					list: []
				}, {
					name: "会议内容",
					value: "fmeetcontent",
					list: []
				}],
			};
		},
		created() {
			this.$api.myDesk.getApplyList({
				foid: this.context.fsrcoId,
				page: 1,
				size: 999
			}).then(data => {
				console.log(data)
				this.formContext = data.data.data.rows[0]
				if(this.formContext.fimportance == 0) {
					this.formContext.fimportanceValue = "一般"
				} else {
					this.formContext.fimportanceValue = "重要"
				}
				if(this.formContext.fovert == 0) {
					this.formContext.fovert = "是"
				} else {
					this.formContext.fovert = "否"
				}
				if(this.formContext.fexternal == 0) {
					this.formContext.fexternal = "否"
				} else {
					this.formContext.fexternal = "是"
				}
			})
		},
		methods: {},
	};
</script>

<style scoped>
	/deep/.van-cell__title {
		max-width: 30%;
	}
	
	/deep/.van-cell__value {
		text-align: center;
	}
</style>
<style>
	.van-cell__title {
		text-align: left;
	}
</style>