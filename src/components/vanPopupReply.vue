<template>
	<van-popup :close-on-click-overlay="showClose" @click-overlay="closeVan" v-model:show="show" position="bottom" :style="{ height: '30%' }">
		<van-cell v-for="(item,key) in list" value-class="valueClass">
			<template v-if="item.freplyedPesronName == ''" #default>
				<span @click="toReply(item,1)" class="spanClss">{{item.freplyPesronName}} : </span>
				<span>{{item.freplyContent}}</span>
			</template>
			<template v-else #default>
				<span @click="toReply(item,1)" class="spanClss">{{item.freplyPesronName}}</span>
				<span> 回复 </span>
				<span @click="toReply(item,2)" class="spanClss">{{item.freplyedPesronName}} : </span>
				<span>{{item.freplyContent}}</span>
			</template>
		</van-cell>
		<van-row align="bottom">
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
			rowChild: Object
		},
		data() {
			return {
				showClose: false,
				checked: false,
				valueName: "",
				valueItem: {},
				list: [{
						freplyPesronName: "孟鹏飞",
						freplyContent: "我就是打酱油的",
						freplyedPesronName: "",
						type: 1
					},
					{
						freplyPesronName: "曲帅",
						freplyContent: "我就是打酱油的2",
						freplyedPesronName: "孟鹏飞",
						type: 2
					},
					{
						freplyPesronName: "其他",
						freplyContent: "大家别误会,其实我不是针对谁,我想说在座的各位都是打酱油的",
						freplyedPesronName: "",
						type: 1
					}, {
						freplyPesronName: "申广超",
						freplyContent: "我就是打酱油的3",
						freplyedPesronName: "",
						type: 1
					}
				]
			};
		},
		created() {
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
//						item.freplyedPesronName = ""
//						item.freplyedPesron = ""
//					}
//				})
//			})
		},
		methods: {
			closeVan() {
				this.$emit("showClose")
			},
			toReply(item, key) {
				if(key == 1) {
					item.name = item.freplyPesronName
					item.id = item.freplyPesron
				} else {
					item.name = item.freplyedPesronName
					item.id = item.freplyedPesron
				}
				this.valueItem = item
				this.valueName = "@" + item.name + ": "
			},
			reply() {
				var checke = false
				if(this.checked) {
					checke = true
				}
				var con = {
					//审核ID
					faudit: this.rowChild.foid,
					//是否公开
					fpublish: checke,
					//回复人
					freplyPesron: localStorage.getItem('ms_userId'),
					//用户ID
					userId: localStorage.getItem('ms_userId')
				}
				if(this.valueName.indexOf(":") == -1) {
					//回复信息
					con.freplyContent = this.valueName
					//被回复人
					con.freplyedPesron = this.rowChild.handlerId
				} else {
					//回复信息
					con.freplyContent = this.valueName.substring(this.valueName.indexOf(":"))
					//被回复人
					con.freplyedPesron = this.valueItem.id
				}
				this.$api.myDesk.saveAuditReplyInfo({
					jsonStr: JSON.stringify(con)
				}).then(data => {
					console.log(data)
					this.$emit("showClose")
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