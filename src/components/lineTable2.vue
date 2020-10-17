<template>
	<div style="width:100%; overflow:scroll;">
		<table :style="{ width : 200 * (linesList[0].list.length - 1)+ 100 + 'px' }" cellspacing="0" cellpadding="0">
			<tr v-for="(item,index) in linesList">
				<td id="classTd" :class="[key == 0 ?'classZero':'classZero1']" v-for="(val,key) in item.list" >
					<van-button style="width: 100%;" size="mini" type="primary" v-if="val == 'poiul1'" @click="toAdd()">新增</van-button>
					<van-button style="width: 100%;" size="mini" type="danger" v-else-if="indexShow(val)" @click="toDel(key,val)">删除</van-button>
					<span v-else>{{val | valShow(key)}}</span>
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
	export default {
		props: {
			linesList: Array,
		},
		filters: {
			valShow(status, key) {
				if(key == 0 && status.length > 6) {
					return status.slice(0, 6) + "..."
				} else {
					return status
				}
			},
		},
		created(){
		},
		watch: {
			"linesList": {
				handler(val, oldval) {
					var con = 0
					for(var i = 0; i < this.linesList.length; i++) {
						if(this.linesList[i].list.length > con) {
							con = this.linesList[i].list.length
						} else {
							continue
						}
					}
					for(var k = 0; k < this.linesList.length; k++) {
						if(this.linesList[k].list.length < con) {
							var conOther = con - this.linesList[k].list.length
							for(var i = 0; i < conOther; i++) {
								this.linesList[k].list.push('')
							}
						}
					}
				},
				deep: true
			},
		},
		methods: {
			indexShow(aaa){
				if(typeof(aaa) == "undefined"){
					return false
				}else{
					var val = aaa.toString()
					if(val.indexOf('poiul2') != -1){
						return true
					}else{
						return false
					}
				}
			},
			toAdd() {
				this.$parent.toAdd()
			},
			toDel(key,val) {
				this.$parent.toDel(key,val)
			}
		},
	}
</script>

<style scoped>
	.classZero {
		background-color: #d3e8fd;
		color: #2771ca;
		width: 100px!important;
	}
	.classZero1 {
		width: 200px!important;
	}
	
	.classOther {
		width: 150px!important;
	}
	
	#classTd {
		border: solid 1px #a9c0df;
	}
</style>