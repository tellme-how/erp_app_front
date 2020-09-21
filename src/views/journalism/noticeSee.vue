<template>
	<div>
		<van-cell-group>
			<van-row>
				<van-col span="6">
					<van-icon name="manager-o" size="80" />
				</van-col>
				<van-col span="18" class="noticeCol">
					<van-row style="font-size: 20px;font-weight:800;margin-bottom: 5px;">
						{{context.fcreatorname}}
					</van-row>
					<van-row style="margin-bottom: 5px;">
						最后修改 : {{conversionTime(context.flastupdtime)}} {{context.fcreatorname}}
					</van-row>
					<van-row>
						阅读量:{{context.freadcount}}
					</van-row>
				</van-col>
			</van-row>
		</van-cell-group>
		<van-cell-group>
			<quill-editor style="width: 100%;" disabled v-model="context.fcontent" ref="myQuillEditor" :options="editorOption"></quill-editor>
		</van-cell-group>
		<van-cell-group v-for="(item,index) in fileList" :key="index">
			<van-row style="height: 6vh;line-height: 6vh;" @click="aaa(item)">
				{{item.fileName}}
			</van-row>
		</van-cell-group>
		<div v-html="aaaa"></div>
	</div>
</template>

<script>
	import { quillEditor } from 'vue-quill-editor'; //调用编辑器
	import 'quill/dist/quill.snow.css';
	import * as Quill from 'quill';
	export default {
		components: {
			quillEditor,
		},
		data() {
			return {
				context: {},
				editorOption: this.$GLOBAL.editorOptionNull,
				fileList: [],
				aaaa: "",
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
					id:row.id
				}).then(data => {
					this.$router.push({
						name : "preview",
						params:{
							context : data.data.data,
							titleShow : row.fileName
						}
					})
				})
			}
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