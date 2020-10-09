<!--
	预览页面弹出框显示内容 -- 孟鹏飞
	2020-07-31
	
	传入参数：
	showFig  展示内容（ 1. organization 公司，部门，职位树状图   2. personnel 人员table   3. user 用户table  4.职务table
	dataCon  展示数据
-->

<template>
	<div>
		<slot></slot>
		<slot name="title"></slot>
		<div v-if="showFig == 'organization' " class="treeDivClass">
			<el-tree :default-checked-keys="dataCon.echo" :default-expanded-keys="dataCon.echo" show-checkbox ref="treeDialogVisible" highlight-current :data="dataCon.context" :props="defaultProps" node-key="foid" accordion></el-tree>
		</div>
		<div v-if="showFig == 'personnel'" style="margin-bottom: 40px;">
			<van-search background="#C0C0C0" @clear="allName" v-model="value" placeholder="请输入搜索关键词" @search="onSearch">
				<!--<template #action>
					<slot></slot>
				</template>-->
			</van-search>
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
				<van-row type="flex" justify="end">
					<van-col span="7">人员编码</van-col>
					<van-col span="15">
						人员名称
					</van-col>
				</van-row>
				<van-divider />
				<van-checkbox-group v-model="result" style="margin-top: 6px;">
					<div style="margin: 5px;" v-for="(item,index) in dataCon.context">
						<van-checkbox v-if="dataCon.choice" @click="getCon(item)" shape="square" :name="item.toid">
							<van-row>
								<van-col span="8">{{item.tcode}}</van-col>
								<van-col span="16">
									{{item.tname}}
								</van-col>
							</van-row>
						</van-checkbox>
						<van-checkbox v-else @click="getCon(item)" :disabled="result.length != 0 && item.toid != result[0]" shape="square" :name="item.toid">
							<van-row>
								<van-col span="8">{{item.tcode}}</van-col>
								<van-col span="16">
									{{item.tname}}
								</van-col>
							</van-row>
						</van-checkbox>
						<van-divider />
					</div>
				</van-checkbox-group>
			</van-list>
		</div>
		<div v-if="showFig == 'user'" style="margin-bottom: 40px;">
			<van-search background="#C0C0C0" @clear="allName" v-model="value" placeholder="请输入搜索关键词" @search="onSearch">
				<!--<template #action>
					<slot></slot>
				</template>-->
			</van-search>
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
				<van-row type="flex" justify="end">
					<van-col span="7">用户编码</van-col>
					<van-col span="15">
						用户名称
					</van-col>
				</van-row>
				<van-divider />
				<van-checkbox-group v-model="result" style="margin-top: 6px;">
					<div style="margin: 5px;" v-for="(item,index) in dataCon.context">
						<van-checkbox v-if="dataCon.choice" @click="getCon2(item)" shape="square" :name="item.foid">
							<van-row>
								<van-col span="8">{{item.fcode}}</van-col>
								<van-col span="16">
									{{item.fname}}
								</van-col>
							</van-row>
						</van-checkbox>
						<van-checkbox v-else @click="getCon2(item)" :disabled="result.length != 0 && item.foid != result[0]" shape="square" :name="item.foid">
							<van-row>
								<van-col span="8">{{item.fcode}}</van-col>
								<van-col span="16">
									{{item.fname}}
								</van-col>
							</van-row>
						</van-checkbox>
						<van-divider />
					</div>
				</van-checkbox-group>
			</van-list>
		</div>
		<div v-if="showFig == 'jobSet'" style="margin-bottom: 40px;">
			<van-search background="#C0C0C0" @clear="allName" v-model="value" placeholder="请输入搜索关键词" @search="onSearch">
				<!--<template #action>
					<slot></slot>
				</template>-->
			</van-search>
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
				<van-row type="flex" justify="end">
					<van-col span="7">职务编码</van-col>
					<van-col span="15">
						职务名称
					</van-col>
				</van-row>
				<van-divider />
				<van-checkbox-group v-model="result" style="margin-top: 6px;">
					<div style="margin: 5px;" v-for="(item,index) in dataCon.context">
						<van-checkbox v-if="dataCon.choice" @click="getCon2(item)" shape="square" :name="item.foid">
							<van-row>
								<van-col span="8">{{item.fcode}}</van-col>
								<van-col span="16">
									{{item.fname}}
								</van-col>
							</van-row>
						</van-checkbox>
						<van-checkbox v-else @click="getCon2(item)" :disabled="result.length != 0 && item.foid != result[0]" shape="square" :name="item.foid">
							<van-row>
								<van-col span="8">{{item.fcode}}</van-col>
								<van-col span="16">
									{{item.fname}}
								</van-col>
							</van-row>
						</van-checkbox>
						<van-divider />
					</div>
				</van-checkbox-group>
			</van-list>
		</div>
		<div v-if="showFig == 'workItems'" style="margin-bottom: 40px;">
			<van-search background="#C0C0C0" @clear="allName" v-model="value" placeholder="请输入搜索关键词" @search="onSearch">
				<!--<template #action>
					<slot></slot>
				</template>-->
			</van-search>
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
				<van-row type="flex" justify="end">
					<van-col span="22">
						工作事项
					</van-col>
				</van-row>
				<van-divider />
				<van-checkbox-group v-model="result" style="margin-top: 6px;">
					<div style="margin: 5px;" v-for="(item,index) in dataCon.context">
						<van-checkbox @click="getCon3(item)" :disabled="result.length != 0 && item.srcId != result[0]" shape="square" :name="item.srcId">
							<van-row>
								<van-col span="24">
									{{item.title}}
								</van-col>
							</van-row>
						</van-checkbox>
						<van-divider />
					</div>
				</van-checkbox-group>
			</van-list>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			showFig: {
				type: String,
				required: true
			},
			dataCon: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				checkList: [],
				value: "",
				result: [],
				showBegin: true,
				finished: false,
				loading: false,
				//公司部门职位 tree 默认显示值
				defaultProps: {
					children: 'children',
					label: 'fname'
				},
				pageSize: {
					page: 1,
					size: 20
				}
			};
		},
		created() {
			console.log(this.dataCon)
			if(this.dataCon.echo.length != 0) {
				if(this.showFig == "personnel") {
					this.dataCon.echo.forEach(item => {
						this.result.push(item.toid)
						this.checkList.push(item)
					})
				} else if(this.showFig == "workItems") {
					this.dataCon.echo.forEach(item => {
						this.result.push(item.srcId)
						this.checkList.push(item)
					})
				} else {
					this.dataCon.echo.forEach(item => {
						this.result.push(item.foid)
						this.checkList.push(item)
					})
				}
			}
			this.showBegin = false
			this.loading = true
			if(this.showFig != 'organization') {
				this.dataCon.context = []
			}
			this.toSelect()
		},
		methods: {
			allName() {
				this.loading = true
				this.pageSize = {
					page: 1,
					size: 20
				}
				this.dataCon.context = []
				this.toSelect()
			},
			onSearch() {
				this.loading = true
				if(this.showFig == "personnel") {
					this.pageSize = {
						page: 1,
						size: 20,
						tname: this.value
					}
				} else {
					this.pageSize = {
						page: 1,
						size: 20,
						fname: this.value
					}
				}
				this.dataCon.context = []
				this.toSelect()
			},
			onLoad() {
				if(this.showBegin) {
					this.toSelect()
				}
			},
			//查询
			toSelect() {
				this.finished = false
				var url = ""
				switch(this.showFig) {
					//人员
					case "personnel":
						url = "staffManage/findStaffByPage"
						this.$api.collaborativeOffice.findConList(url, this.pageSize).then(data => {
							data.data.data.rows.forEach(item => {
								this.dataCon.context.push(item)
							})
							this.loading = false
							this.pageSize.page++;
							this.showBegin = true
							if(data.data.data.rows.length < 20) {
								this.finished = true
							}
						})
						break;
						//用户
					case "user":
						url = "userManage/findUserBypage"
						this.$api.collaborativeOffice.findConList(url, this.pageSize).then(data => {
							data.data.data.rows.forEach(item => {
								this.dataCon.context.push(item)
							})
							this.loading = false
							this.pageSize.page++;
							this.showBegin = true
							if(data.data.data.rows.length < 20) {
								this.finished = true
							}
						})
						break;
						//职务
					case "jobSet":
						url = "positionmnt/findPositionList"
						this.$api.collaborativeOffice.findConList(url, this.pageSize).then(data => {
							data.data.data.rows.forEach(item => {
								this.dataCon.context.push(item)
							})
							this.loading = false
							this.pageSize.page++;
							this.showBegin = true
							if(data.data.data.rows.length < 20) {
								this.finished = true
							}
						})
						break;
					case "workItems":
						url = "workItem/findPage"
						this.pageSize.creator = localStorage.getItem('ms_userId')
						this.$api.collaborativeOffice.findConList(url, this.pageSize).then(data => {
							console.log(data)
							data.data.data.rows.forEach(item => {
								this.dataCon.context.push(item)
							})
							this.loading = false
							this.pageSize.page++;
							this.showBegin = true
							if(data.data.data.rows.length < 20) {
								this.finished = true
							}
						})
						break;
				}
			},
			getCon(item) {
				if(this.result.filter(val => {
						return val == item.toid
					}).length == 0) {
					this.checkList = this.checkList.filter(s => {
						return s.toid != item.toid
					})
				} else {
					this.checkList.push(item)
				}
			},
			getCon2(item) {
				if(this.result.filter(val => {
						return val == item.foid
					}).length == 0) {
					this.checkList = this.checkList.filter(s => {
						return s.foid != item.foid
					})
				} else {
					this.checkList.push(item)
				}
			},
			getCon3(item) {
				if(this.result.filter(val => {
						return val == item.srcId
					}).length == 0) {
					this.checkList = this.checkList.filter(s => {
						return s.srcId != item.srcId
					})
				} else {
					this.checkList.push(item)
				}
			},
			getDataBack() {
				//公司/部门/职位
				if(this.showFig == 'organization') {
					return this.$refs.treeDialogVisible.getCheckedNodes().filter(item => {
						return typeof(item.children) == "undefined" || item.children.length == 0
					})
					//人员
				} else {
					return this.checkList
				}
			},
		}
	}
</script>

<style scoped>
	/deep/.van-checkbox__label {
		width: 100%;
	}
	
	/deep/.van-divider {
		margin: 6px 0;
	}
	
	.treeDivClass {
		overflow: auto;
	}
	
	>>>.el-dialog__body {
		border-bottom: 1px solid #dcdfe6;
		min-height: calc(100vh - 300px);
		overflow-y: auto;
	}
</style>