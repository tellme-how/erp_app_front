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
			if(con.length > 20){
				con = con.slice(0,20)+'...'
			}
			state.title = con
		},
		tabbarShow: function(state, con) {
			state.tabbar = con
		},
	},
	actions: {},
	modules: {}
})