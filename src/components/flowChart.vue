<template>
	<van-popup v-model="showOne" position="right" :style="{ height: '100%',width:'100%' }">
		<van-nav-bar :title="contextOther.fsrcCompany +'/' + contextOther.factivityName" left-text="返回" left-arrow @click-left="onClickLeft" />
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
		data() {
			return {};
		},
		created() {
			console.log(this.flowIndex)
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
	.aaa{
		background: darkgray;
		border-bottom: 1px solid black;
	}
</style>