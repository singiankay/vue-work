import * as types from '../mutation-types'

const state = {
	table: {
		status: false,
		id: null,
		type: null
	},
	line: {
		status: false,
		id: null,
		type: null
	}
}

const getters = {
	CLIENTTABLEID: state => state.table.id,
	CLIENTTABLETYPE: state => state.table.type,
	CLIENTTABLESTATUS: state => state.table.status,
	CLIENTLINEID: state => state.line.id,
	CLIENTLINETYPE: state => state.line.type,
	CLIENTLINESTATUS: state => state.line.status,
}

const mutations = {
	[types.SET_CLIENT_TABLE_STATUS](state, status) {
		state.table.status = status
	},
	[types.SET_CLIENT_TABLE_ID] (state, id) {
		state.table.id = id
	},
	[types.CLEAR_CLIENT_TABLE_ID] (state) {
		state.table.id = null
	},
	[types.SET_CLIENT_TABLE_TYPE] (state, type) {
		state.table.type = type
	},
	[types.CLEAR_CLIENT_TABLE_TYPE] (state) {
		state.table.id = null
	},
	[types.SET_CLIENT_LINE_STATUS](state, status) {
		state.line.status = status
	},
	[types.SET_CLIENT_LINE_ID] (state, id) {
		state.line.id = id
	},
	[types.CLEAR_CLIENT_LINE_ID] (state) {
		state.line.id = null
	},
	[types.SET_CLIENT_LINE_TYPE] (state, type) {
		state.line.type = type
	},
	[types.CLEAR_CLIENT_LINE_TYPE] (state) {
		state.line.id = null
	},

}

const actions = {

	CLIENT_UPDATE_ID(context, id) {
		context.commit('SET_CLIENT_TABLE_ID', id)
		context.commit('SET_CLIENT_TABLE_TYPE', "update")
	},
	CLIENT_CREATE(context) {
		context.commit('SET_CLIENT_TABLE_ID', null)
		context.commit('SET_CLIENT_TABLE_TYPE', "create")
	},
	CLIENT_CLEAR(context) {
		context.commit('SET_CLIENT_TABLE_ID', null)
		context.commit('SET_CLIENT_TABLE_TYPE', null)
	},
	CLIENT_INIT_TABLE_ACTIVE(context) {
		context.commit('SET_CLIENT_TABLE_STATUS', 1)
	},
	CLIENT_TABLE_REFRESH(context) {
		context.commit('SET_CLIENT_TABLE_STATUS', false)
		setTimeout(() => {  
			context.commit('SET_CLIENT_TABLE_STATUS', true)
		}, 250)
	},
	CLIENT_LINE_UPDATE_ID(context, id) {
		context.commit('SET_CLIENT_LINE_ID', id)
		context.commit('SET_CLIENT_LINE_TYPE', "update")
	},
	CLIENT_LINE_CREATE(context) {
		context.commit('SET_CLIENT_LINE_ID', null)
		context.commit('SET_CLIENT_LINE_TYPE', "create")
	},
	CLIENT_LINE_CLEAR(context) {
		context.commit('SET_CLIENT_LINE_ID', null)
		context.commit('SET_CLIENT_LINE_TYPE', null)
	},
	CLIENT_INIT_LINE_ACTIVE(context) {
		context.commit('SET_CLIENT_LINE_STATUS', 1)
	},
	CLIENT_LINE_REFRESH(context) {
		context.commit('SET_CLIENT_LINE_STATUS', false)
		setTimeout(() => {  
			context.commit('SET_CLIENT_LINE_STATUS', true)
		}, 250)
	}

}

export default {
	state,
	getters,
	mutations,
	actions
}