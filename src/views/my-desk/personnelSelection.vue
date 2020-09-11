<template>
	<div class="flexMainre">
		<div v-if="showDiv && (showName == '同部门' || showName == '所有人'  || showName == '常用人')">
			<van-search v-if="showName == '所有人'" background="#C0C0C0" @clear="allName" v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch">
				<template #action>
					<van-button @click="onSearch" size="small" type="info">搜索</van-button>
				</template>
			</van-search>
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
				<van-checkbox-group v-model="result">
					<div style="margin: 5px;" v-for="(item,key) in list">
						<van-checkbox @click="getCon(item)" shape="square" :name="item.toid">
							<van-row>
								<van-col span="4">img</van-col>
								<van-col span="20">
									<van-row>
										<van-col span="12">{{item.tname}}</van-col>
										<van-col style="font-size: 14px;color: DarkGray;" span="12">{{item.ffirmpositionname}}</van-col>
									</van-row>
									<van-row>
										<van-col style="font-size: 10px!important;color: DarkGray;" span="12">{{item.tcompanyname}}</van-col>
										<van-col style="font-size: 10px;color: DarkGray;" span="12">{{item.tdepartmentname}}</van-col>
									</van-row>
								</van-col>
							</van-row>
						</van-checkbox>
						<van-divider />
					</div>
				</van-checkbox-group>
			</van-list>
			<div class="sa"></div>
		</div>
		<div v-else-if="showDiv && showName == '组织架构'">
			<el-tree @check="getTreeData" :data="dataTree" :default-checked-keys="result" show-checkbox node-key="foid" :props="defaultProps">
			</el-tree>
			<div class="sa"></div>
		</div>
		<div v-if="!showDiv">
			<van-search background="#C0C0C0" @clear="toGet" v-model="value2" show-action placeholder="请输入搜索关键词" @search="onSearch">
				<template #action>
					<van-button @click="onSearch1" size="small" type="info">搜索</van-button>
				</template>
			</van-search>
			<van-list finished-text="没有更多了">
				<draggable v-model="checkListShow" :options="{animation:500}">
					<transition-group>
						<div style="margin: 5px;" v-for="(item,val) in checkListShow" :key="val">
							<van-row style="height: 8vh;">
								<van-col style="height: 8vh;line-height: 8vh;" span="2">
									<van-icon size="1.2em" name="close" @click="clearCheck(item)" />
								</van-col>
								<van-col span="20">
									<van-row>
										<van-col span="12">{{item.tname}}</van-col>
										<van-col style="font-size: 14px;color: DarkGray;" span="12">{{item.ffirmpositionname}}</van-col>
									</van-row>
									<van-row>
										<van-col style="font-size: 10px!important;color: DarkGray;" span="12">{{item.tcompanyname}}</van-col>
										<van-col style="font-size: 10px;color: DarkGray;" span="12">{{item.tdepartmentname}}</van-col>
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
			<div class="nextBtn">
				<van-button style="float: left;margin:1vh;width: 20vw;" @click="showDiv = true" icon="arrow-left" size="small" type="info" plain hairline>
					返回
				</van-button>
				<van-button style="margin:1vh;width: 20vw;" @click="checkList = [];result=[];checkListShow=[]" icon="delete" size="small" type="info" plain hairline>
					清空
				</van-button>
			</div>
		</div>
		<div class="nextBtn">
			<van-button style="width: 25vw;" size="small" @click="toGet();showDiv = false" icon="friends-o" plain hairline type="info">已选({{result.length}})</van-button>
			<van-button @click="toSave" style="margin-left: 10px;margin-right :10px;width: 25vw;" size="small" icon="edit" plain hairline type="info">确定</van-button>
			<van-image width="5rem" height="5rem" @click="showFig = !showFig" id="circle" :src="showImg" />
			<div v-if="showFig">
				<van-image id="circle1" @click="byDeptmentName()" round width="3rem" height="3rem" :src="$GLOBAL.htmlUrl + '部门.png'" />
				<van-image id="circle2" @click="allName()" round width="3rem" height="3rem" :src="$GLOBAL.htmlUrl + '所有人.png'" />
				<van-image id="circle3" @click="getresultId()" round width="3rem" height="3rem" :src="$GLOBAL.htmlUrl + '常用人.png'" />
				<van-image id="circle4" @click="toTreeData()" round width="3rem" height="3rem" :src="$GLOBAL.htmlUrl + '组织架构.png'" />
			</div>
		</div>
	</div>
</template>

<script>
	import draggable from 'vuedraggable'
	export default {
		components: {
			draggable
		},
		data() {
			return {
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
				}
			};
		},
		created() {
			this.$store.commit("titleShow", "常用人")
			this.getList()
			this.$api.myDesk.getStaffTree({}).then(data => {
				this.dataTree = eval('(' + data.data.data + ')')
				this.dataTreeShow(this.dataTree)
			})
		},
		methods: {
			dataTreeShow(treeList) {
				treeList.forEach((item, index) => {
					if(typeof(item.children) == "undefined") {
						if(typeof(item.fstruid) == "undefined") {
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
			toSave() {
				var cur = []
				let obj = {};
				this.checkList.concat(this.checkListShow).forEach(item => {
					obj[item.toid] ? "" : obj[item.toid] = true && cur.push(item);
				})
				localStorage.setItem('resultId', JSON.stringify(cur));
			},
			getTreeData(a, b) {
				this.checkListShow = []
				this.result = b.checkedKeys
				b.checkedNodes.forEach(item => {
					this.checkListShow.push({
						toid: item.foid,
						tname: item.fname,
						ffirmpositionname: item.firmpositiName,
						tcompanyname: item.fcompanyName,
						tdepartmentname: item.fdepartmentName
					})
				})
			},
			getCon(item) {
				if(this.result.filter(val => {
						return val == item.toid
					}).length == 0) {
					this.checkList = this.checkList.filter(s => {
						var state = false
						this.result.forEach(d => {
							if(s.toid == d) {
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
			},
			onSearch1() {
				this.checkListShow = this.checkList.filter(item => {
					return item.tname.indexOf(this.value2) != -1
				})
			},
			clearCheck(row) {
				this.checkList.forEach((item, index) => {
					if(item.toid == row.toid) {
						this.checkList.splice(index, 1);
					}
				})
				this.result.forEach((item, index) => {
					if(item == row.toid) {
						this.result.splice(index, 1);
					}
				})
				this.checkListShow.forEach((item, index) => {
					if(item.toid == row.toid) {
						this.checkListShow.splice(index, 1);
					}
				})
			},
			toGet() {
				this.checkListShow = JSON.parse(JSON.stringify(this.checkList))
			},
			onSearch() {
				this.list = []
				this.finished = false
				this.formList = {
					page: 1,
					size: 20,
					tname: this.value
				}
				this.getList()
			},
			getresultId() {
				this.$store.commit("titleShow", "常用人")
				this.showName = '常用人';
				this.showFig = false;
				this.showImg = this.$GLOBAL.htmlUrl + '常用人大.png';
				this.finished = true;
				this.showDiv = true
				this.list = JSON.parse(localStorage.getItem("resultId"))
			},
			allName() {
				this.$store.commit("titleShow", "所有人")
				this.showName = '所有人';
				this.showImg = this.$GLOBAL.htmlUrl + '所有人大.png';
				this.showDiv = true
				this.list = []
				this.finished = false
				this.formList = {
					page: 1,
					size: 20,
				}
				this.getList()
			},
			byDeptmentName() {
				this.$store.commit("titleShow", "同部门")
				this.showName = '同部门';
				this.showImg = this.$GLOBAL.htmlUrl + '部门大.png';
				this.showDiv = true
				this.list = []
				this.finished = false
				this.formList = {
					page: 1,
					size: 20,
					tdepartmentname: JSON.parse(localStorage.getItem("userData")).deptmentName
				}
				this.getList()
			},
			toTreeData() {
				this.$store.commit("titleShow", "组织架构")
				this.showName = '组织架构';
				this.showFig = false;
				this.showImg = this.$GLOBAL.htmlUrl + '组织架构大.png';
				this.showDiv = true
			},
			getList() {
				this.formList.fpositionstate = 1
				this.$api.myDesk.findStaffByPage(this.formList).then(data => {
					data.data.data.rows.forEach(item => {
						this.list.push(item)
						this.loading = false
						if(data.data.data.rows.length < 20) {
							this.finished = true
						}
					})
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