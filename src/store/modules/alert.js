import * as types from '../mutation-types'


const state = {

	status: false,
	type: null,
	message: null

}


const getters = {

	AlertStatus: state => state.status,
	AlertType: state => state.type,
	AlertMessage: state => state.message

}


const mutations = {

	[types.SET_ALERT] (state, payload) {
		state.status = true
		state.type = payload.type
		state.message = payload.message
	},

	[types.CLEAR_ALERT] (state) {
		state.status = false
		state.type = null,
		state.message = null
	}
}


export default {

	state,
	getters,
	mutations
	
}