import * as types from '../mutation-types'

const state = {
	control: {
		id: null,
		type: "create",
		table: true,
	}
}

const getters = {

  AdminID: state => state.control.id,
  AdminType: state => state.control.type,
  AdminTable: state => state.control.table

}

const mutations = {

	[types.SET_CREATE_ID] (state, id) {
		state.control.id = id
		state.control.type = "create"
	},

	[types.SET_UPDATE_ID] (state, id) {
		state.control.id = id
		state.control.type = "update"
	},

	[types.CLEAR_TABLE_ID] (state, id) {
		state.control.id = null
		state.control.type = "create"
	},

	[types.RELOAD_TABLE] (state) {
		state.control.table = false
		setTimeout(() => {state.control.table = true} ,250)
	}

}

export default {

	state,
	getters,
	mutations
	
}