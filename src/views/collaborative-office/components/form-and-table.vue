<template>
	<div class="formWrapper">
		<formIcon :dis="dis" :showAdd="showAdd" :key="count" ref="mainTableChild" show="1" :form-data="formData.top"></formIcon>
		<van-collapse v-model="activeNames">
			<van-collapse-item :title="item.showName" :name="index" v-for="(item,index) in formData.bottom" :key="index">
				<div class="children">
					<formIcon :dis="dis" :showAdd="showAdd" :key="count" ref="refCon" show="2" v-if="item.type == 1" :form-data="item"></formIcon>
					<tableDynamic :dis="dis" :key="count" ref="refCon" v-else :form-data="item"></tableDynamic>
				</div>
			</van-collapse-item>
		</van-collapse>
		<van-cell title="附件">
			<template #default>
				<el-upload :disabled="dis == 1" :on-preview="downFiles" :auto-upload="false" :on-change="getFile" multiple :data="uploadData" ref="upload" class="upload-demo" action="" :file-list="fileList">
					<el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
			</template>
		</van-cell>
		<van-cell title-class='titleClassBlue' v-for="(item,index) in fileList" :key="index" :title="item.name">
			<template #default>
				<van-icon @click="delUpload(index)" name="cross" />
			</template>
		</van-cell>
	</div>
</template>

<script>
	//预览
	import formIcon from '../../../views/collaborative-office/components/encapsulation/form-dynamic';
	import tableDynamic from '../../../views/collaborative-office/components/encapsulation/table-dynamic';
	import axios from 'axios';
	export default {
		components: {
			formIcon,
			tableDynamic
		},
		props: {
			//传入的data值
			formData: {
				type: Object,
				required: true
			},
			showAdd: {
				type: String,
				required: true
			},
			dis: {
				type: String,
				required: true
			},
			files: {
				type: Array,
				required: true
			}
		},
		data() {
			return {
				activeNames: [],
				count: 0,
				conData: {},
				fileList: [],
				uploadData: {
					userCode: "user1",
					meauCode: "workItem",
					voucherId: ""
				},
				delFiles: []
			};
		},
		computed: {
			//区分组件
			activeName: {
				get() {
					this.count++
						if(typeof(this.formData.bottom) != "undefined") {
							if(typeof(this.formData.bottom[0]) != "undefined") {
								return this.formData.bottom[0].id
							} else {
								return "wobuxinnengchongfu"
							}
						} else {
							return "wobuxinnengchongfu"
						}
				},
				set() {}
			}
		},
		created() {
			this.formData.bottom.forEach(item => {
				if(item.type == 2) {
					item.rowList = item.conList
				}
			})
			//获取上传数据,显示出来
			if(this.files.length != 0) {
				this.files.forEach(item => {
					var a = {
						name: item.fileName,
						id: item.id
					}
					this.fileList.push(a)
				})
			}
		},
		methods: {
			//上传数据改变时
			getFile(file, fileList) {
				const isLt2M = file.size / 1024 / 1024 < 20;
				if(isLt2M) {
					this.fileList.push(file.raw)
				} else {
					this.$message.error('上传大小不能超过 20MB!');
					for(var i = 0; i < fileList.length; i++) {
						if(fileList[i].uid == file.uid) {
							fileList.splice(i, 1)
						}
					}
				}
			},
			//移除上传数据
			delUpload(index) {
				this.fileList.splice(index, 1)
			},
			//文件下载
			downFiles(file) {
				if(typeof(file.id) == "undefined") {
					return
				}
				this.popup('是否下载文件<' + file.name + '>?').then(res => {
					axios.interceptors.request.use(
						config => {
							if(localStorage.getItem('ms_tokenId')) {
								config.headers.Authorization = 'bearer ' + localStorage.getItem('ms_tokenId');
							}
							return config;
						},
						error => Promise.error(error)
					);
					axios({
						method: 'post',
						url: '/api/interfaces/attachment/downloadFile',
						params: {
							attachmentId: file.id
						},
						responseType: 'blob'
					}).then(response => {
						this.download(response, file.name);
					}).catch((error) => {

					})
				}).catch(() => {})
			},
			//下载文件
			download(data, fileName) {
				debugger;
				if(!data) {
					return
				}
				let url = window.URL.createObjectURL(new Blob([data.data]))
				let link = document.createElement('a')
				link.style.display = 'none'
				link.href = url
				link.setAttribute('download', fileName)
				document.body.appendChild(link)
				link.click()
			},
			//上传
			toUpload(id) {   
				this.fileList.forEach(item => {
					if(typeof(item.id) == "undefined") {
						var formData  = new  FormData();
						formData.append('userCode', localStorage.getItem('ms_userId'));
						formData.append('menuCode', "workItem");
						formData.append('voucherId', id);
						formData.append('file', item);
						this.$api.collaborativeOffice.uploadFile(formData).then(data => {})
					}
				})
				//删除之前上传过,现在被删除的文件
				//				this.delFiles.forEach(item => {
				//					this.$api.collaborativeOffice.deleteInfo({
				//						id: item
				//					}).then(data => {})
				//				})
			},
			//提交
			async onSubmit() {
				//form 和 table 校验
				var state = true
				await this.$refs.mainTableChild.onSubmit().then(data => {
					state = data
				})
				if(typeof(this.$refs.refCon) != "undefined") {
					this.$refs.refCon.forEach(item => {
						if(item.formData.type == 1) {
							if(!item.onSubmit()) {
								state = false
							}
						}
					})
				}
				if(state) {
					//整理主表返回数据
					this.conData = this.$refs.mainTableChild.ruleForm
					//整理子表返回数据
					if(typeof(this.$refs.refCon) != "undefined") {
						this.$refs.refCon.forEach(item => {
							//form表单样式的子表
							if(item.formData.type == 1) {
								//格式统一,用子表ID做为数组的名称,表单样式数组只有一条数据
								this.$set(this.conData, item.formData.id, [])
								this.conData[item.formData.id].push(item.ruleForm)
								//table样式的子表
							} else {
								this.$set(this.conData, item.formData.id, item.backList)
							}
						})
					}
					return true
				}
			}
		},

	}
</script>

<style>
	.titleClassBlue {
		color: blue;
	}
	
	.formWrapper {
		overflow-y: scroll;
		margin-bottom: 2vh;
	}
	
	.children .van-cell {
		background: #edf5ff;
	}
	
	.children .van-dropdown-menu__item {
		background: #edf5ff;
	}
	
	.children .van-cell::after {
		border-bottom: 1px solid #999999;
	}
</style>
<style scoped>
	>>>.el-upload--text {
		height: 30px!important;
		width: 80px!important;
	}
	
	/deep/.van-cell__title {
		text-align: left;
	}
	
	/deep/.el-upload-list {
		display: none;
	}
	
	/deep/.van-collapse-item__content {
		padding: 0px!important;
	}
	
	.upload-btn {
		display: inline-block;
	}
</style>