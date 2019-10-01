<template>
	<div>
		<form action="login" method="post" role="form" @submit.prevent="signInClient()">
			<h3 id="username-label" class="login-box-msg"><b>{{user.username}}</b></h3>
			<input type="hidden" name="username" id="hidden_username" :value="user.username">
			<div :class="{'form-group has-feedback ' : true, 'has-error' : errors.first('division')}">
				<select name="division" id="division" class="form-control" v-model="currentDivision" v-validate="'required'" ref="division">
					<option disabled value="">Please select division</option>
					<option v-for="division in allowedDivisions"  :value="division.id">{{ division.code }}</option>
				</select>
				<span v-show="errors.has('division')" class="help-block">{{ errors.first('division') }}</span>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<button type="button" class="btn btn-danger btn-block btn-flat" id="back" v-on:click="back">Back</button>
					<input type="submit" id="login" value="Sign In" class="btn btn-primary btn-block btn-flat" :disabled="errors.has('division')">
					<template v-if="auth.user.admin">
						<input type="button" id="login" value="Sign In as Admin" v-if="auth.user.admin.find(x => x == 'Master' )" class="btn btn-success btn-block btn-flat" @click="signInAdmin()">
					</template>
					
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	data() {
		return {
			divisions: [],
			currentDivision: ''
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
		user() {
			return this.auth.user
		},
		allowedDivisions() {
			let divisions = []
			if(this.auth.divisions) {
				for(let value of this.auth.divisions) {
					if(this.divisions.includes(value.id)) {
						divisions.push(value)
					}
				}
			}
			return divisions
		}
	},
	created() {
		this.$store.dispatch('SET_DIVISIONS')
		for (let value of this.auth.user.client) {
			if(!this.divisions.includes(value.DIVISION)) {
				this.divisions.push(parseInt(value.DIVISION))
			}
		}
	},
	mounted() {
	},
	methods : {
		back() {
			this.$store.commit('CLEAR_ALERT')
			this.$store.commit('CLEAR_LOGIN')
		},
		signInClient() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					if(this.currentDivision) {
						this.$store.commit('SET_CURRENT_DIVISION', this.currentDivision)
						this.$store.dispatch('SET_ACTIVE_DIVISION',this.currentDivision)
						.catch(error => {
						this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
					})
					this.$store.commit('SET_USERTYPE', 'Client')
					this.$store.commit('SET_ALERT',{type: 'success', message: ['Welcome '+this.user.firstname+'!'] })
					this.$router.push('/app')
					}
				}
			})
		},
		signInAdmin() {
			this.$store.commit('SET_USERTYPE', 'Admin')
			this.$store.commit('SET_ALERT',{type: 'success', message: ['Welcome '+this.user.firstname+'!'] })
			this.$router.push('/admin')
		}
	},
}
</script>