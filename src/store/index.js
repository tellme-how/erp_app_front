import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		title: "",
		tabbar: true,
	},
	mutations: {
		titleShow: function(state, con) {
			state.title = con
		},
		tabbarShow: function(state, con) {
			state.tabbar = con
		},
	},
	actions: {},
	modules: {}
})