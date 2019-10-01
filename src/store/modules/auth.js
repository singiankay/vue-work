import * as types from '../mutation-types'

const state = {

	user : {
		username: null,
		type: null,
		user_id: null,
		firstname: null,
		lastname: null,
		position: null,
		date_hired: null,
		image_path: null,
		admin: [],
		client: [],
		current_division: null,    // Session Division
		current_area: null
	},
	divisions: [],
	activeDivision: null,	// Dropdown Division
	areas: [],
	activeArea: null,

}

const getters = {

	UserType: state => state.user.type,
	AuthUsername: state => state.user.username,
	AuthEMP33: state => state.user.user_id,
	AuthDivisions: state => state.divisions

}

const mutations = {

	[types.CLEAR_LOGIN] (state) {
		state.user.username = null
		state.user.type = null
		state.user.user_id = null
		state.user.firstname = null
		state.user.lastname = null
		state.user.position = null
		state.user.date_hired = null
		state.user.image_path = null
		state.user.admin = []
		state.user.client = []
		state.user.current_division = null

		localStorage.setItem("erpx_user", JSON.stringify(state.user))
	},

	[types.SET_USER_INITIAL] (state, payload) {
		state.user = payload
		localStorage.setItem("erpx_user", JSON.stringify(payload))
	},

	[types.SET_USERTYPE] (state, type) {
		state.user.type = type
		localStorage.setItem("erpx_user", JSON.stringify(state.user))
	},

	[types.SET_DIVISIONS] (state, payload) {
		state.divisions = payload
	},
	
	[types.SET_AREAS] (state, payload) {
		if(payload.length) {
			state.areas = payload
		} 
		else {
			state.areas = []
			state.areas.push({
				area: 'n/a',
				id: 0
			})
		}
		
	},

	[types.SET_ACTIVE_DIVISION] (state, id) {
		state.activeDivision = id
	},

	[types.SET_ACTIVE_AREA] (state, id) {
		state.currentArea = id
	},

	[types.SET_CURRENT_DIVISION] (state, id) {
		state.user.current_division = id
		localStorage.setItem("erpx_user", JSON.stringify(state.user))
	},

	[types.SET_CURRENT_AREA] (state, id) {
		state.user.activeArea = id
		localStorage.setItem("erpx_user", JSON.stringify(state.user))
	},

	[types.CLEAR_AUTH_DEFAULTS] (state) {
		state.divisions = null
		state.activeDivision = null
		state.areas = null
		state.activeArea = null
	},

}

const actions = {

	SET_DIVISIONS(context) {

		axios.get('main/getDivisions?format=json')
		.then(response => {
			context.commit('SET_DIVISIONS', response.data)
		})

	},

	SET_ACTIVE_DIVISION(context, id) {

		context.commit('SET_ACTIVE_DIVISION', id)
		if(state.activeDivision) {
			return axios.get('admin/app/getAreas?format=json', {
				params: {
					division: state.activeDivision
				}
			})
			.then(response => {
				if(response.data.length != 0) {
					context.commit('SET_AREAS', response.data)
				}
				else {
					context.commit('SET_AREAS', [])
				}
			})
		}

	},

	SET_CURRENT_DIVISION(context, id) {

		context.commit('SET_CURRENT_DIVISION', id)
		
		if(state.user.current_division) {
			return axios.get('admin/app/getAreas?format=json', {
				params: {
					division: state.user.current_division
				}
			})
			.then(response => {
				if(response.data.length != 0) {
					context.commit('SET_AREAS', response.data)
				}
				else {
					context.commit('SET_AREAS', [])
				}
			})
		}
	},

	ASSIGN_LOCALSTORAGE_SESSION(context) {

		let ls = JSON.parse(localStorage.getItem("erpx_user"))
		
		if(ls) {
			context.commit('SET_USER_INITIAL', ls)
		}
		
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}