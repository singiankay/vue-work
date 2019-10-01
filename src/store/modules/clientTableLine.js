// Using vue-tables-2 Auto Generated States
import * as types from '../mutation-types'

const state = {
	ascending: null,
	columns: null,
	count: null,
	customQueries: null,
	data: null,
	limit: null,
	page: null,
	query: null,
	sortBy: null
}

const mutations = {

	[types.UPDATE_CLIENTTABLE] (state, data) {
		state.data = data
	},

	[types.CLEAR_CLIENTTABLE] (state) {
		state.data = []
	}
	
}

export default {
	state,
	mutations,
}