<template>
	<van-popup :close-on-click-overlay="showClose" @click-overlay="closeVan" v-model:show="show" position="bottom" :style="{ height: '60%' }">
		<div style="min-height: 90%;">
			<van-cell v-for="(item,key) in replyList" :key="key" value-class="valueClass">
				<template #default>
					<span @click="toReply(item,1)" class="spanClss">{{item.staffName}}</span>
					<span> 回复 </span>
					<span @click="toReply(item,2)" class="spanClss">{{item.replyedName}} : </span>
					<span>{{item.replyContent}}</span>
				</template>
			</van-cell>
		</div>

		<van-row align="bottom" style="height: 10%;">
			<van-col span="7">
				<van-cell>
					<template #default>
						<van-checkbox v-model="checked">是否公开</van-checkbox>
					</template>
				</van-cell>
			</van-col>
			<van-col span="17">
				<van-field v-model="valueName" center clearable label="" placeholder="请输入回复">
					<template #button>
						<van-button @click="reply" icon="success" size="mini" type="primary">提交</van-button>
					</template>
				</van-field>
			</van-col>
		</van-row>
	</van-popup>
</template>
<script>
	export default {
		props: {
			show: Boolean,
			//			rowChild: Object
			context: Object
		},
		data() {
			return {
				showClose: false,
				checked: false,
				valueName: "",
				valueItem: {},
				replyList: []
			};
		},
		created() {
			if(!this.noNull(this.context.auditReplyMsg)) {
				this.context.auditReplyMsg.forEach(item => {
					this.getReply(item)
				})
			}
			//			for(var i = this.replyList.length - 1; i >= 0; i--) {
			//				console.log(this.replyList[i].fpublish)
			//			}
			//			this.$api.myDesk.selectAuditReplyInfo({
			//				faudit: this.rowChild.foid,
			//				userId: localStorage.getItem('ms_userId')
			//			}).then(data => {
			//				this.list = data.data
			//				//过滤数据,取出   登陆人等于被回复人  或者  公开的 数据
			//				this.list = data.data.filter(item => {
			//					return item.freplyedPesron == localStorage.getItem('ms_userId') || item.fpublish == 1
			//				})
			//				//如果回复人等于被回复人,那么只显示回复人 
			//				this.list.forEach(item => {
			//					if(item.freplyPesron == item.freplyedPesron) {
			//						item.replyedName = ""
			//						item.freplyedPesron = ""
			//					}
			//				})
			//			})
		},
		methods: {
			getReply(row) {
				this.replyList.push(row)
				if(!this.noNull(row.childReply)) {
					row.childReply.forEach(item => {
						this.getReply(item)
					})
				}
			},
			closeVan() {
				this.$emit("showClose")
			},
			toReply(item, key) {
				var con = {}
				if(key == 1) {
					con.name = item.staffName
					con.id = item.staffId
				} else {
					con.name = item.replyedName
					con.id = item.replyedStaff
				}
				this.valueItem = con
				this.valueName = "@" + con.name + ": "
			},
			reply() {
				var backCon = {}
				backCon.fpublish = this.checked == undefined || this.checked == false ? 0 : 1
				backCon.fcreator = localStorage.getItem('ms_userId')
				backCon.faudit = this.context.foid
				if(this.valueName.indexOf(":") == -1) {
					//回复信息
					backCon.freplycontent = this.valueName
					//被回复人
					backCon.freplyedpesron = this.context.staffId
				} else {
					//回复信息
					backCon.freplycontent = this.valueName.substring(this.valueName.indexOf(":"))
					//被回复人
					backCon.freplyedpesron = this.valueItem.id
				}
				this.$api.myDesk.addAuditReply(backCon).then(data => {
					this.$parent.getContext()
				})

			}
		},
	};
</script>

<style scoped>
	.spanClss {
		color: blue;
	}
	
	.valueClass {
		text-align: left;
		color: #000000;
	}
	
	/deep/.van-cell__title {
		max-width: 20%;
	}
	
	/deep/.van-cell {
		padding: 10px 10px;
	}
</style>