<template>
	<div style="width:100%; overflow:scroll;">
		<table :style="{ width : widthTable + '%' }" class="mailTable" cellspacing="0" cellpadding="0">
			<tr v-for="(item,index) in linesList">
				<td id="classTd" :class="[key == 0 ?'classZero':'']" v-for="(val,key) in item.list">{{val | valShow(key)}}</td>
			</tr>
		</table>
	</div>
</template>

<script>
	export default {
		props: {
			linesList: Array,
			widthTable: Number
		},
		filters: {
			valShow(status, key) {
				if(typeof(status) == 'boolean') {
					if(status){
						return "是"
					}else{
						return '否'
					}
				} else {
					if(key == 0 && status.length > 6) {
						return status.slice(0, 6) + "..."
					} else {
						return status
					}
				}

			},
		}
	}
</script>

<style>
	.classZero {
		background-color: #d3e8fd;
		color: #2771ca;
		width: 120px
	}
	
	#classTd {
		border: solid 1px #a9c0df;
	}
</style>