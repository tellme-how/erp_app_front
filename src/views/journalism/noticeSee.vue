<template>
	<div>
		<van-cell-group>
			<van-row style="color: #C0C0C0;">
				<van-col span="8">
					创建人 : {{context.fcreatorname}}
				</van-col>
				<van-col span="10">
					创建部门 : {{context.fcDepartmentName}}
				</van-col>
				<van-col span="6">
					<van-icon name="eye" /> : ({{context.freadcount}})
				</van-col>
			</van-row>
		</van-cell-group>
		<van-cell-group>
			<editor v-if="showTest" :value="context.fcontent" @contentData="editorChange($event)"></editor>
		</van-cell-group>
		<van-cell-group v-for="(item,index) in fileList" :key="index">
			<van-row style="height: auto;line-height: auto;text-align:center;padding: 10px;" @click="aaa(item)">
				{{item.fileName}}
			</van-row>
		</van-cell-group>
	</div>
</template>

<script>
	import editor from './test'
	export default {
		components: {
			editor
		},
		data() {
			return {
				context: {},
				editorOption: this.$GLOBAL.editorOptionNull,
				fileList: [],
				showTest: false,
			};
		},
		created() {
			if(this.$route.params.foid) {
				sessionStorage.setItem("foid", JSON.stringify(this.$route.params.foid));
			}
			this.foid = JSON.parse(sessionStorage.getItem("foid"))
			this.$api.myDesk.findDocumentManageById({
				from: '2',
				foperate: '1', //只有文档浏览查看的时候，才改变阅读量
				fuserid: localStorage.getItem('ms_userId'),
				foid: this.foid,
				page: 1,
				size: 10
			}).then(data => {
				this.context = data.data.data
				this.$store.commit("titleShow", this.context.fname)
				this.showTest = true
			})
			let creator = localStorage.getItem('ms_userId');
			if(creator) {
				creator = creator;
			} else {
				creator = 'test';
			}
			this.$api.myDesk.findInfosList({
				userCode: creator,
				voucherId: this.foid,
				menuCode: 'document'
			}).then(data => {
				this.fileList = data.data.data
			})
		},
		methods: {
			aaa(row) {
				this.$api.myDesk.getHtmlPreviewAttachmentById({
					id: row.id
				}).then(data => {
					this.$router.push({
						name: "preview",
						params: {
							context: data.data.data,
							titleShow: row.fileName
						}
					})
				})
			},
			//编辑器的页面显示效果
			editorChange(aaa) {
				this.$nextTick(() => {
					if("<p>undefined</p>" == aaa) {
						this.context.fcontent = '';
					} else {
						this.context.fcontent = aaa;
					}
					this.$set(this.context, "fcontent", this.context.fcontent);
				});

			},
		},
	};
</script>
<style scoped="scoped">
	/deep/.ql-container.ql-snow {
		border: none;
		border-bottom: 1px solid black;
	}
	
	.noticeCol {
		text-align: left;
		font-size: 13px;
	}
</style>