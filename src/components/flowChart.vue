<!--
	流程图
		传值:
		flow  				所有流程(父组件查询)
		contextOther		列表页整体内容(只是为了显示标题)
		showOne				是否显示
		flowIndex			当前节点index(从0开始)
-->




<template>
	<van-popup v-model="showOne" position="right" :style="{ height: '100%',width:'100%' }">
		<van-nav-bar :title="contextOther.fsrcCompany +'/' + contextOther.factivityName" left-text="返回" left-arrow @click-left="onClickLeft" />
		<div style="margin: 10px 0px;">
			<van-tag style="color: #000000;" color='aquamarine' type="primary" size="large">已处理节点</van-tag>
			<van-tag style="color: #000000;" color='#E6A23C' type="primary" size="large">当前节点</van-tag>
			<van-tag style="color: #000000;" color='darkgray' type="primary" size="large">未处理节点</van-tag>
		</div>
		<van-steps direction="vertical" :active="flowIndex">
			<van-step v-for="(item,key) in flow" :key="key" :class="key > flowIndex ? 'aaa' : ''">
				<h3>{{item.name}}</h3>
				<p>{{item.participators}}</p>
				<p>{{item.fstatusDesc}}</p>
			</van-step>
		</van-steps>
	</van-popup>
</template>

<script>
	export default {
		props: {
			flow: Array,
			contextOther: Object,
			showOne: Boolean,
			flowIndex: Number
		},
		methods: {
			onClickLeft() {
				this.$parent.showOneClose()
			}
		},
	};
</script>

<style scoped="scoped">
	/deep/.van-step--finish {
		background: aquamarine!important;
		border-bottom: 1px solid black;
	}
	
	/deep/.van-step--process {
		background: #E6A23C!important;
		border-bottom: 1px solid black;
	}
	
	/deep/.van-step {
		color: #000000!important;
	}
	
	/deep/.van-step__title--active {
		color: #000000!important;
	}
	
	.aaa {
		background: darkgray;
		border-bottom: 1px solid black;
	}
</style>