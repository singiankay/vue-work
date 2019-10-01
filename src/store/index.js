import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'

import admin from './modules/admin'
import alert from './modules/alert'
import auth from './modules/auth'
import client from './modules/client'
// import clientTableLine from './modules/clientTableLine'

Vue.use(Vuex)

export default new Vuex.Store({
	namespaced: true,
	actions,
	getters,
	mutations,
	modules: {
		alert,
		admin,
		auth,
		client,
	},
})