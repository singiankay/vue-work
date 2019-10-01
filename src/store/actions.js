import * as types from './mutation-types'

export const setCreateID = ({commit}, admin) => {
	commit(types.SET_CREATE_ID, {
      id: admin.id
    })
}

export const setUpdateID = ({commit}, admin) => {
	commit(types.SET_UPDATE_ID, {
      id: admin.id
    })
}