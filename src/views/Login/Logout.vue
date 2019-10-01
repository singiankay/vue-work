<template>
	
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	computed: {
		...mapState([
			'auth',
		]),
		user() {
			return this.auth.user
		}
	},
	created() {
		this.CLEAR_LOGIN()
		this.$store.commit('SET_ALERT',{type: 'success', message: ['Successfully Logged Out!'] })
		this.$router.push('/login')
	},
	methods: {
		...mapMutations([
			'CLEAR_LOGIN',
		]),
	}
}
</script>