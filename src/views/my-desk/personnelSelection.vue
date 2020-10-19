<template>
	<div v-if="showUser">
		<van-popup v-model="showUser" position="right" style="height: 100%; width: 100%;">
			<div class="titleClass">
				{{showName}}
			</div>
			<div style="margin-top: 5vh;" v-if="showDiv && (showName == '同部门' || showName == '所有人'  || showName == '常用人')">
				<van-search v-if="showName == '所有人'" background="#C0C0C0" @clear="allName" v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch">
					<template #action>
						<van-button @click="onSearch" size="small" type="info">搜索</van-button>
					</template>
				</van-search>
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<van-checkbox-group v-model="result">
						<div style="margin: 5px;" v-for="(item,key) in list">
							<van-checkbox @click="getCon(item)" shape="square" :name="item.foid">
								<van-row>
									<!--<van-col span="4">
										<van-icon style="height: 100%;width: 100%;" name="manager-o" />
									</van-col>-->
									<!--<van-col span="20">-->
									<van-row>
										<van-col span="12">{{item.fname}}</van-col>
										<!-- todo -->
										<van-col style="font-size: 14px;color: DarkGray;" span="12">{{item.firmpositionName}}</van-col>
									</van-row>
									<van-row>
										<van-col style="font-size: 10px!important;color: DarkGray;" span="12">{{item.fcompanyname}}</van-col>
										<van-col style="font-size: 10px;color: DarkGray;" span="12">{{item.departmentname}}</van-col>
									</van-row>
									<!--</van-col>-->
								</van-row>
							</van-checkbox>
							<van-divider />
						</div>
					</van-checkbox-group>
				</van-list>
				<div class="sa"></div>
			</div>
			<div style="margin-top: 5vh;" v-else-if="showDiv && showName == '组织架构'">
				<el-tree @check="getTreeData" :data="dataTree" :default-checked-keys="result" show-checkbox node-key="userid" :props="defaultProps"></el-tree>
				<div class="sa"></div>
			</div>
			<div style="margin-top: 5vh;" v-if="!showDiv">
				<van-search background="#C0C0C0" @clear="toGet(1)" v-model="value2" show-action placeholder="请输入搜索关键词" @search="onSearch1">
					<template #action>
						<van-button @click="onSearch1" size="small" type="info">搜索</van-button>
					</template>
				</van-search>
				<van-list finished-text="没有更多了">
					<draggable v-model="showList" :options="{animation:500}">
						<transition-group>
							<div style="margin: 5px;" v-for="(item,val) in showList" :key="val">
								<van-row>
									<van-col @click="clearCheck(item)" style="height: 8vh;line-height: 8vh;" span="2">
										<van-icon size="1.2em" name="close" />
									</van-col>
									<van-col span="20">
										<van-row style="margin-top: 10px;">
											<van-col span="12">{{item.fname}}</van-col>
											<van-col style="font-size: 14px;color: DarkGray;" span="12">{{item.fcode}}</van-col>
										</van-row>
										<van-row style="margin-top: 10px;">
											<van-col style="font-size: 10px!important;color: DarkGray;" span="12">{{item.fcompanyname}}</van-col>
											<van-col style="font-size: 10px;color: DarkGray;" span="12">{{item.departmentname}}</van-col>
										</van-row>
									</van-col>
									<van-col style="height: 6vh;line-height: 6vh;color: #999999;" span="2">
										<van-icon name="wap-nav" />
									</van-col>
								</van-row>
								<van-divider />
							</div>
						</transition-group>
					</draggable>
				</van-list>
				<div class="sa"></div>
			</div>
		</van-popup>
		<div class="nextBtn" v-if="!showDiv">
			<van-button style="float: left;margin:1vh;width: 20vw;" @click="showDiv = true;showName=showNameOld" icon="arrow-left" size="small" type="info" plain hairline>
				返回
			</van-button>
			<van-button style="margin:1vh;width: 20vw;" @click="checkList = [];result=[];checkListShow=[];showList=[]" icon="delete" size="small" type="info" plain hairline>
				清空
			</van-button>
		</div>
		<div class="nextBtn" v-if="showDiv">
			<van-button style="width: 20vw;" size="small" @click="$parent.showUserClose()" icon="cross" plain hairline type="info">取消</van-button>
			<van-button style="margin-left: 10px;margin-right :10px;width: 20vw;" size="small" @click="toGet();showDiv = false" icon="friends-o" plain hairline type="info">已选({{listLength}})</van-button>
			<van-button @click="toSave" style="margin-right :10px;width: 20vw;" size="small" icon="edit" plain hairline type="info">确定</van-button>
			<van-image width="5rem" height="5rem" @click="showFig = !showFig" id="circle" :src="showImg" />
			<div v-if="showFig">
				<van-image id="circle1" @click="byDeptmentName();value = ''" round width="3rem" height="3rem" :src="$GLOBAL.htmlUrl + '部门.png'" />
				<van-image id="circle2" @click="allName();value = ''" round width="3rem" height="3rem" :src="$GLOBAL.htmlUrl + '所有人.png'" />
				<van-image id="circle3" @click="getresultId();value = ''" round width="3rem" height="3rem" :src="$GLOBAL.htmlUrl + '常用人.png'" />
				<van-image id="circle4" @click="toTreeData();value = ''" round width="3rem" height="3rem" :src="$GLOBAL.htmlUrl + '组织架构.png'" />
			</div>
		</div>
		<van-popup v-model="show1" :style="{ height: '30%',width:'100%' }">
			<van-row>
				<van-field name="checkbox" label="是否可见">
					<template #input>
						<van-checkbox v-model="formData.checkbox" shape="square" />
					</template>
				</van-field>
				<van-field v-model="formData.remark" rows="3" autosize label="加签附言" type="textarea" border='true' placeholder="请输入加签附言" />
			</van-row>
			<van-button type="primary" @click="toDo">提交</van-button>
		</van-popup>
		<van-popup v-model="show2" :style="{ height: '20%',width:'100%' }">
			<van-field v-model="formData2.remark" rows="3" autosize label="委托意见" type="textarea" border='true' placeholder="请输入委托意见" />
			<van-button type="primary" @click="toDo2">提交</van-button>
		</van-popup>
	</div>
</template>

<script>
	import draggable from 'vuedraggable'
	export default {
		components: {
			draggable
		},
		props: {
			showUser: Boolean,
			showChild: Number
		},
		data() {
			return {
				showNameOld: "",
				showList: [],
				formData: {
					checkbox: false,
					remark: ""
				},
				formData2: {
					remark: ""
				},
				show1: false,
				show2: false,
				showImg: this.$GLOBAL.htmlUrl + '常用人大.png',
				showDiv: true,
				showName: "常用人",
				value: "",
				value2: "",
				loading: false,
				finished: false,
				showFig: false,
				list: [],
				result: [],
				formList: {
					page: 1,
					size: 20
				},
				checkList: [],
				checkListShow: [],
				dataTree: [],
				defaultProps: {
					children: 'children',
					label: 'fname'
				},
				dataBack: []
			};
		},
		computed: {
			listLength() {
				return this.checkList.length + this.checkListShow.length
			}
		},
		created() {
			this.context = JSON.parse(sessionStorage.getItem("deskRow"))
			this.$api.myDesk.findCompanyDeptStaffInfoByOrgUnitIdFromRedis({
				queryType: ""
			}).then(data => {
				console.log(eval('(' + data.data.data + ')').JsonInfo)
				this.dataTree = eval('(' + data.data.data + ')').JsonInfo
				this.dataTreeShow(this.dataTree)
			})
			this.getresultId()
		},
		methods: {
			dataTreeShow(treeList) {
				treeList.forEach((item, index) => {
					if(typeof(item.children) == "undefined") {
						if(item.types == 2) {
							item.disabled = false
						} else {
							item.disabled = true
						}
					} else {
						item.disabled = true
						this.dataTreeShow(item.children)
					}
				})
			},
			toDo() {
				this.$parent.showUserClose()
				this.$emit('dataBackMethod', this.dataBack, 1, this.formData)
				this.show1 = false
				this.formData.checkbox = false
				this.formData.remark = ""
			},
			toDo2() {
				this.$parent.showUserClose()
				this.$emit('dataBackMethod', this.dataBack, 2, this.formData)
				this.show2 = false
				this.formData2.remark = ""
			},
			toSave() {
				var cur = []
				let obj = {};
				this.checkList.concat(this.checkListShow).forEach(item => {
					obj[item.foid] ? "" : obj[item.foid] = true && cur.push(item);
				})
				var curList = []
				if(!this.noNull(JSON.parse(localStorage.getItem("resultId")))) {
					curList = cur.concat(JSON.parse(localStorage.getItem("resultId")))
				} else {
					curList = cur
				}
				let obj2 = {}
				localStorage.setItem('resultId', JSON.stringify(curList.reduce((cur, next) => {
					obj2[next.foid] ? "" : obj2[next.foid] = true && cur.push(next);
					return cur;
				}, [])));
				this.dataBack = cur
				if(this.dataBack.length == 0) {
					this.goOut("请选择人员")
					return
				}
				if(this.showChild == 1) {
					this.show1 = true
				} else if(this.showChild == 2) {
					this.show2 = true
				} else if(this.showChild == 3) {
					if(cur.length > 1) {
						this.goOut("清单选")
					} else {
						this.$emit('dataBackMethod', cur)
					}
				} else {
					this.$parent.showUserClose()
					this.$emit('dataBackMethod', cur, 3)
				}
			},
			getTreeData(a, b) {
				this.checkListShow = []
				this.result = b.checkedKeys
				b.checkedNodes.forEach(item => {
					console.log(item)
					this.checkListShow.push({
						foid: item.userid,
						fname: item.fname,
						ffirmpositionname: item.firmpositiName,
						fcompanyName: item.fcompanyName,
						departmentname: item.fdepartmentName
					})
				})
			},
			getCon(item) {
				if(this.result.filter(val => {
						return val == item.foid
					}).length == 0) {
					this.checkList = this.checkList.filter(s => {
						var state = false
						this.result.forEach(d => {
							if(s.foid == d) {
								state = true
							}
						})
						if(state) {
							return s
						}
					})
				} else {
					this.checkList.push(item)
				}
				console.log(this.result)
			},
			onSearch1() {
				this.showList = this.checkList.filter(item => {
					return item.fname.indexOf(this.value2) != -1
				})
				if(this.showList.length == 0) {
					this.goOut("没有符合条件的数据")
				}
			},
			clearCheck(row) {
				this.showList.forEach((item, index) => {
					if(item.foid == row.foid) {
						this.showList.splice(index, 1);
					}
				})
				this.checkList.forEach((item, index) => {
					if(item.foid == row.foid) {
						this.checkList.splice(index, 1);
					}
				})
				this.result.forEach((item, index) => {
					if(item == row.foid) {
						this.result.splice(index, 1);
					}
				})
				this.checkListShow.forEach((item, index) => {
					if(item.foid == row.foid) {
						this.checkListShow.splice(index, 1);
					}
				})
			},
			toGet(a) {
				if(a != 1) {
					this.showNameOld = this.showName
					this.showName = "已选中"
				}
				this.showList = JSON.parse(JSON.stringify(this.checkList.concat(this.checkListShow)))
			},
			onSearch() {
				this.list = []
				this.finished = false
				this.formList = {
					page: 1,
					size: 20,
					fname: this.value,
					fstatus: 3,
				}
				this.getList()
			},
			getresultId() {
				this.showName = '常用人';
				this.showFig = false;
				this.showImg = this.$GLOBAL.htmlUrl + '常用人大.png';
				this.finished = true;
				this.showDiv = true
				this.list = JSON.parse(localStorage.getItem("resultId"))
			},
			allName() {
				this.showName = '所有人';
				this.showImg = this.$GLOBAL.htmlUrl + '所有人大.png';
				this.showDiv = true
				this.list = []
				this.finished = false
				this.formList = {
					page: 1,
					size: 20,
					//1111
					fstatus: 3,
				}
				this.getList()
			},
			byDeptmentName() {
				this.showName = '同部门';
				this.showImg = this.$GLOBAL.htmlUrl + '部门大.png';
				this.showDiv = true
				this.list = []
				this.finished = false
				this.formList = {
					page: 1,
					size: 20,
					//1111
					fstatus: 3,
					departmentname: localStorage.getItem("ms_userDepartName")
				}
				this.getList()
			},
			toTreeData() {
				this.titleShow = "组织架构"
				this.showName = '组织架构';
				this.showFig = false;
				this.showImg = this.$GLOBAL.htmlUrl + '组织架构大.png';
				this.showDiv = true
			},
			getList() {
				this.formList.fpositionstate = 1
				this.$api.myDesk.findUserBypage(this.formList).then(data => {
					console.log(data)
					data.data.data.rows.forEach(item => {
						this.list.push(item)
						this.loading = false
					})
					if(data.data.data.rows.length < 20) {
						this.finished = true
					}
				})
				this.showFig = false
			},
			onLoad() {
				this.formList.page++
					this.getList()
			}
		},
	};
</script>

<style scoped="scss">
	.titleClass {
		z-index: 999;
		position: fixed;
		top: 0;
		width: 100%;
		height: 5vh;
		line-height: 5vh;
		color: #000000;
		background-color: rgba(81, 118, 171, 1)
	}
	
	/deep/ .is-leaf+.el-checkbox .el-checkbox__inner {
		display: inline-block;
	}
	
	/deep/ .el-checkbox .el-checkbox__inner {
		display: none;
	}
	
	.van-icon-close::before {
		color: red;
	}
	
	/deep/.van-cell__title {
		max-width: 50%;
	}
	
	/deep/.van-checkbox__label {
		width: 100%;
	}
	
	/deep/.van-divider {
		margin: 2px;
	}
	
	/deep/.van-cell {
		text-align: left!important;
		color: #000000;
	}
	
	.flexMainre {
		position: relative;
	}
	
	.nextBtn {
		text-align: right;
		position: fixed;
		bottom: 0;
		height: 7vh;
		line-height: 7vh;
		width: 100%;
		background-color: #fff;
		margin: 1px;
		border-top: 1px solid black;
		z-index: 9999;
	}
	
	.sa {
		height: 8vh;
		width: 100%
	}
	
	/deep/.van-grid-item__content--center {
		background: RoyalBlue;
		border-radius: 60px;
		color: white;
	}
	
	/deep/.van-grid-item__icon+.van-grid-item__text {
		margin-top: 0px;
		color: white
	}
	
	#circle {
		position: fixed;
		bottom: 0vh;
		left: 0vw;
		z-index: 999;
	}
	
	#circle1 {
		position: fixed;
		bottom: 16vh;
		left: 2vw;
		z-index: 999;
	}
	
	#circle2 {
		position: fixed;
		bottom: 14vh;
		left: 15vw;
		z-index: 999;
	}
	
	#circle3 {
		position: fixed;
		bottom: 9vh;
		left: 25vw;
		z-index: 999;
	}
	
	#circle4 {
		position: fixed;
		bottom: 1vh;
		left: 28vw;
		z-index: 999;
	}
</style>