<!--
	一岗一表
-->
<template>
	<div>
		<erpVanCell v-for="(item,key) in list" :key="key" :formContext="formContext" :rowCell="item"></erpVanCell>
		<erpVanCellTitle title="一岗一表行">
			<van-button @click="showOne = !showOne;showOne ? showName1 ='收起明细' : showName1 = '展开明细'" size="mini" plain type="primary">{{showName1}}</van-button>
		</erpVanCellTitle>
		<lineTable v-if="showOne" :linesList="linesList" :widthTable="widthTable"></lineTable>
		<erpVanCellTitle title="公司指标">
			<van-button @click="showTow = !showTow;showTow ? showName2 ='收起明细' : showName2 = '展开明细'" size="mini" plain type="primary">{{showName2}}</van-button>
		</erpVanCellTitle>
		<lineTable v-if="showTow" :linesList="linesList2" :widthTable="widthTable2"></lineTable>
		<enclosureFile ref="child" :voucherId="voucherId"/>
		<!-- <erpVanCellTitle title="附件">
			<van-button @click="showThree = !showThree;showThree ? showName3 ='收起明细' : showName3 = '展开明细'" size="mini" plain type="primary">{{showName3}}</van-button>
		</erpVanCellTitle>
		<lineTable v-if="showThree" :linesList="linesList3" :widthTable="widthTable3"></lineTable> -->
	</div>
</template>

<script>
	import enclosureFile from './enclosure-file';
	export default {
		props: {
			context: Object
		},
		components:{
			enclosureFile
		},
		data() {
			return {
				voucherId:'',
				// enclosureTableData: [],
				showName1 :'展开明细',
				showName2 :'展开明细',
				// showName3 :'展开明细',
				showOne: false,
				showTow: false,
				// showThree: false,
				widthTable: 100,
				widthTable2: 100,
				// widthTable3: 100,
				formContext: {},
				list: [{
					name: "公司",
					value: "companyName",
					list: []
				}, {
					name: "部门",
					value: "departmentName",
					list: []
				}, {
					name: "岗位",
					value: "positionName",
					list: []
				}, {
					name: "版本",
					value: "versionName",
					list: []
				}, {
					name: "经办人",
					value: "gestorName",
					list: []
				}, {
					name: "经办时间",
					value: "voucherDate",
					list: []
				}, {
					name: "版本号",
					value: "versionNumber",
					list: []
				}],
				linesList: [{
					name: "指标库",
					value: "indexLibraryName",
					list: []
				}, {
					name: "关键指标",
					value: "kpisName",
					list: []
				}, {
					name: "子指标",
					value: "sonKpisName",
					list: []
				}, {
					name: "指标定义",
					value: "definition",
					list: []
				}, {
					name: "指标权重",
					value: "weights",
					list: []
				}, {
					name: "考评方法",
					value: "evalueationMethed",
					list: []
				}, {
					name: "备注",
					value: "remark",
					list: []
				}],
				linesList2: [{
					name: "公司",
					value: "companyName",
					list: []
				}, {
					name: "部门",
					value: "departmentName",
					list: []
				}, {
					name: "权重",
					value: "weights",
					list: []
				}, {
					name: "备注",
					value: "remark",
					list: []
				}],
				// linesList3: [{
				// 	name: "附件",
				// 	value: "name",
				// 	list: []
				// },],
			};
		},
		created() {
			this.$api.myDesk.getFormPostVO({
				id: this.context.fsrcoId,
				userId: localStorage.getItem("ms_userId"),
				xiuding : false
			}).then(data => {
				console.log(data)
				this.formContext = data.data.data
				this.showName(this.formContext)
				var lines = data.data.data.lines
				var lines2 = data.data.data.companyLines
				// if(this.context.fsrcoId){
				// 	this.showFileData(this.context.fsrcoId)
				// }
				this.voucherId = this.context.fsrcoId;
				this.linesList.forEach(item => {
					item.list.push(item.name)
					lines.forEach(val => {
						item.list.push(val[item.value])
					})
				})
				this.linesList2.forEach(item => {
					item.list.push(item.name)
					lines2.forEach(val => {
						item.list.push(val[item.value])
					})
				})
				this.widthTable = lines.length * 40 + 40
				this.widthTable2 = lines2.length * 40 + 40
			});
			
		},
		methods: {
		// 	/**
        //  * 查看附件列表
        //  * @param data
        //  */
        // showFileData(data){
        //     let formDataA ={};
        //     let creator = localStorage.getItem('ms_staffId');
        //     formDataA.voucherId = data;
        //     this.$api.myDesk.findInfosList(formDataA).then(response => {
        //     	this.enclosureTableData = []
        //         if (response.data.data) {
        //             let values = response.data.data;
        //             let flag = true;
        //             for(var i= 0;i<values.length;i++){
        //                 let attachment = values[i];
        //                     let file = {
        //                         rowNum: this.rowNum,
        //                         name: attachment.fileName,
        //                         id: attachment.id,
        //                         fullPath:attachment.fullPath,
        //                         fileSize:attachment.fileSize,
        //                     };
		// 				console.log(attachment)
		// 					var fileArray = [];
		// 					fileArray.unshift(file);
		// 					for(var i=0;i<fileArray.length;i++) {
		// 						this.linesList3[0].list.push('附件');
		// 						this.linesList3[0].list.push(fileArray[i].name);
		// 					}
        //                     this.rowNum += 1;
		// 			}
		// 			var lines3 = this.linesList3[0].list.length;
		// 			this.widthTable3 = lines3.length * 40 + 40
        //         } else {
        //             this.$message.error(response.data.msg);
        //         }
        //     });
        // },
			showName(row) {
				switch(row.taskState) {
					case "1":
						row.taskState = '可执行';
						break;
					case "2":
						row.taskState = '已完成';
						break;
					case "3":
						row.taskState = '未完成';
						break;
					case "4":
						row.taskState = '延期';
						break;
					case '5':
						row.taskState = '作废';
						break;
					case '0':
						row.taskState = '未发生';
						break;
					case '10':
						row.taskState = '已报待批';
						break;
					default:
						break;
				}
				switch(row.taskType) {
					case 1:
						row.taskType = '主任务';
						break;
					case 2:
						row.taskType = '临时任务';
						break;
					case 3:
						row.taskType = '配合任务';
						break;
					default:
						break;
				}
				switch(row.taskLevel) {
					case 1:
						row.taskLevel = '一级';
						break;
					case 2:
						row.taskLevel = '二级';
						break;
					case 3:
						row.taskLevel = '三级';
						break;
					case 4:
						row.taskLevel = '四级';
						break;
					case 5:
						row.taskLevel = '五级';
						break;
					case 6:
						row.taskLevel = '六级';
						break;
					case 7:
						row.taskLevel = '七级';
						break;
					case 8:
						row.taskLevel = '八级';
						break;
					case 9:
						row.taskLevel = '九级';
						break;
					case 10:
						row.taskLevel = '十级';
						break;
					default:
						break;
				}
				var list = []
				if(row.groupPoint) {
					list.push('集团重点') 
				} else if(row.companyPoint) {
					list.push('公司重点');
				} else if(row.departmentPoint) {
					list.push('部门重点')
				}
				if(list.length == 0){
					row.focusLevelCheckList = ""
				}else{
					list.forEach((item,key) =>{
						row.focusLevelCheckList = row.focusLevelCheckList + " item"
					})
				}
			}
		},
	};
</script>

<style scoped>
	/deep/.van-cell__title {
		max-width: 30%;
	}
	
	/deep/.van-cell__value {
		text-align: center;
	}
	.van-cell__title {
		text-align: left;
	}
	.preview-cover {
		position: absolute;
		bottom: 0;
		box-sizing: border-box;
		width: 100%;
		padding: 4px;
		color: #fff;
		font-size: 12px;
		text-align: center;
		background: rgba(0, 0, 0, 0.3);
  }
</style>
<style>
	
</style>