<template>
	<div>
		<form action="login" method="post" role="form" @submit.prevent="validate()">
			<p class="login-box-msg">Sign in to start your session</p>
		   <div :class="{'form-group has-feedback ' : true, 'has-error' : errors.first('username')}">
		   	<input type="text" name="username" placeholder="Username" class="form-control" v-model="form.username" v-validate="'required'" tabindex="1" ref="username">
		   	<span class="glyphicon glyphicon-envelope form-control-feedback"></span>
		   	<span v-show="errors.has('username')" class="help-block">{{ errors.first('username') }}</span>
		   </div>
		   <div :class="{'form-group has-feedback ' : true, 'has-error' : errors.first('password')}">
		   	<input type="password" name="password" class="form-control" placeholder="Password" v-model="form.password" v-validate="'required'" tabindex="2">
		   	<span class="glyphicon glyphicon-lock form-control-feedback"></span>
		   	<span v-show="errors.has('password')" class="help-block">{{ errors.first('password') }}</span>
		   </div>
			<div class="row">
				<div class="col-xs-12">
					<input type="submit" class="btn btn-primary btn-block btn-flat" value="Next" :disabled="errors.any()" tabindex="3">
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
			form: {
				username: null,
				password: null
			}
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
	},
	mounted() {
		this.$refs.username.focus()
	},
	methods: {
		validate() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					this.$Progress.start()
					axios.post('login/validate?format=json', {
						form: this.form
					})
					.then(response => {
						this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
						if(response.data.status == 'success') {
							this.next()
						}
						this.$Progress.finish()
					})
					.catch(error => {
						this.$store.commit('SET_ALERT',{type:'error', message:[error]})
			      	console.log(error)
			      	this.$Progress.fail()
			      })
				}
			})
		},
		next() {
			this.$Progress.start()
			axios.get('login/'+this.form.username+'?format=json')
			.then(response => {
				this.$store.commit('SET_USER_INITIAL', {
					type: 'validation',
					username: this.form.username,
					user_id: response.data.user_id,
					firstname: response.data.firstname,
					lastname: response.data.lastname,
					position: response.data.position,
					date_hired: response.data.date_hired,
					image_path: response.data.image_path,
					admin: (response.data.admin != false ? JSON.parse(response.data.admin.applications) : null),
					client: (response.data.client != false ? response.data.client : null)
				})
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message: [error] })
		      console.log(error)
		      this.$Progress.fail()
			})
			
		}
	}
}
</script>