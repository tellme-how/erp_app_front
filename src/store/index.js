import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		title :"",
	},
	mutations: {
		titleShow: function(state, con) {
			state.title = con
		},
	},
	actions: {},
	modules: {}
})