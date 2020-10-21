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
			<!-- <quill-editor style="width: 100%;height:400px" @contentData="editorChange($event)" disabled v-model="context.fcontent" ref="myQuillEditor" :options="editorOption" ></quill-editor> -->
			<editor :value="context.fcontent" @contentData="editorChange($event)" style="height: 400px"></editor>
			<!-- <editor :value="formdata.fcontent" @contentData="editorChange($event)" style="height: 400px"></editor> -->
			<!--<div style="width: 100%;" v-html="context.fcontent"></div>-->
		</van-cell-group>
		<van-cell-group v-for="(item,index) in fileList" :key="index">
			<van-row style="height: auto;line-height: auto;text-align:center;padding: 10px;" @click="aaa(item)">
				{{item.fileName}}
			</van-row>
		</van-cell-group>
	</div>
</template>

<script>
	import { quillEditor } from 'vue-quill-editor'; //调用编辑器
	import Quill from 'quill'
	import 'quill/dist/quill.snow.css'
	import editor from './test'
	export default {
		components: {
			quillEditor,
			editor
		},
		data() {
			return {
				context: {},
				editorOption: this.$GLOBAL.editorOptionNull,
				fileList: [],
				// ------------文本编辑器---BEGIN-------------------------------------------------------------------------
            // fcontent: '',
            editorOption: {
                placeholder: '请输入内容',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
                        ['blockquote', 'code-block'], //引用，代码块
                        [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
                        [{ list: 'ordered' }, { list: 'bullet' }], //列表
                        [{ script: 'sub' }, { script: 'super' }], // 上下标
                        [{ indent: '-1' }, { indent: '+1' }], // 缩进
                        [{ direction: 'rtl' }], // 文本方向
                        [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
                        [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
                        [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
                        [{ font: [] }], //字体
                        [{ align: [] }], //对齐方式
                        ['clean'], //清除字体样式
                        ['image'], //上传图片、上传视频
                    ]
                }
            },
            atctiveName: 'first',
            // ------------文本编辑器 ---END----------------------------------------------------------------------------
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
			},
			//编辑器的页面显示效果
			editorChange(aaa) {
				debugger
				this.$nextTick(() => {
				if("<p>undefined</p>" == aaa){
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