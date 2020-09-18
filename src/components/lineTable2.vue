<template>
	<div style="width:100%; overflow:scroll;">
		<table :style="{ width : 60 * (linesList[0].list.length - 1) + '%' }" cellspacing="0" cellpadding="0">
			<tr v-for="(item,index) in linesList">
				<td id="classTd" :class="[key == 0 ?'classZero':'']" v-for="(val,key) in item.list">
					<van-button style="width: 100%;" size="mini" type="primary" v-if="val == 'poiul1'" @click="toAdd()">新增</van-button>
					<van-button style="width: 100%;" size="mini" type="danger" v-else-if="val == 'poiul2'" @click="toDel(key)">删除</van-button>
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
		methods: {
			toAdd() {
				this.$parent.toAdd()
			},
			toDel(key) {
				this.$parent.toDel(key)
			}
		}
	}
</script>

<style scoped>
	.classZero {
		background-color: #d3e8fd;
		color: #2771ca;
		width: 120px!important;
	}
	.classOther {
		width: 150px!important;
	}
	
	#classTd {
		border: solid 1px #a9c0df;
	}
</style>