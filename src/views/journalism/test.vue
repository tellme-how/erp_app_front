<template>
	<keep-alive>
		<div>
			<div class="editor"></div>
		</div>
	</keep-alive>
</template>

<script>
	import Quill from 'quill'
	import 'quill/dist/quill.snow.css'
	const titleConfig = {
		'ql-bold': '加粗',
		'ql-color': '颜色',
		'ql-font': '字体',
		'ql-code': '插入代码',
		'ql-italic': '斜体',
		'ql-link': '添加链接',
		'ql-background': '颜色',
		'ql-size': '字体大小',
		'ql-strike': '删除线',
		'ql-script': '上标/下标',
		'ql-underline': '下划线',
		'ql-blockquote': '引用',
		'ql-header': '标题',
		'ql-indent': '缩进',
		'ql-list': '列表',
		'ql-align': '文本对齐',
		'ql-direction': '文本方向',
		'ql-code-block': '代码块',
		'ql-formula': '公式',
		'ql-image': '图片',
		'ql-video': '视频',
		'ql-clean': '清除字体样式',
		'ql-upload': '文件',
		'ql-table': '插入表格',
		'ql-table-insert-row': '插入行',
		'ql-table-insert-column': '插入列',
		'ql-table-delete-row': '删除行',
		'ql-table-delete-column': '删除列'
	}
	export default {
		name: 'Editor',
		props: {
			value: String
		},
		data() {
			return {
				quill: null,
				options: {
					theme: 'snow',
					modules: {
						toolbar: {
							container: [
								['bold'], //加粗
								[{
									'color': []
								}],
								[{
									align: []
								}], //对齐方式
							],
						},
						table: true
					},
					placeholder: ''
				}
			}
		},
		methods: {
			addQuillTitle() {
				const oToolBar = document.querySelector('.ql-toolbar')
				const aButton = oToolBar.querySelectorAll('button')
				const aSelect = oToolBar.querySelectorAll('select')
				aButton.forEach(function(item) {
					if(item.className === 'ql-script') {
						item.value === 'sub' ? (item.title = '下标') : (item.title = '上标')
					} else if(item.className === 'ql-indent') {
						item.value === '+1' ? (item.title = '向右缩进') : (item.title = '向左缩进')
					} else {
						item.title = titleConfig[item.classList[0]]
					}
				})
				aSelect.forEach(function(item) {
					item.parentNode.title = titleConfig[item.classList[0]]
				})
			},
			getContentData() {
				return this.quill.getContents()
			}
		},
		mounted() {
			const dom = this.$el.querySelector('.editor')
			this.quill = new Quill(dom, this.options)
			if(typeof(this.value) == "undefined") {
				this.quill.root.innerHTML = ""
			} else {
				this.quill.root.innerHTML = this.value
			}
			this.quill.on('text-change', () => {
				this.$emit('contentData', this.quill.root.innerHTML)
			})
			this.addQuillTitle()
			this.quill.enable(false)

		},
		activated() {
			this.quill.setContents()
		}
	}
</script>
<style scoped="scoped">
	/deep/.ql-toolbar {
		display: none;
	}
	
</style>