<template>
	<div>
		<form @submit.prevent="createAdmin">
			<h4>{{form.name}}</h4>
			<div :class="{'form-group' : true, 'has-error' : errors.first('Applications')}">
				<label for="applications" class="control-label ">Applications</label>
				<select multiple name="Applications" class="form-control" aria-describedby="applicationHelpBlock" v-model="form.applications" v-validate="'required'">
					<option v-for="app in ApplicationArray" v-bind:value="app">{{ app }}</option>
				</select>
				<span v-show="errors.has('Applications')" class="help-block">{{ errors.first('Applications') }}</span>
				<span>Hold Ctrl + Click to select multiple or to deselect hovered item.</span>
			</div>
			<div class="form-group">
				<div class="checkbox">
					<label><input type="checkbox" v-model="form.active">Active</label>
				</div>
			</div>
			<div class="form-group">
				<label for="search_user_admin">Description</label>
				<textarea name="description" class="form-control" v-model="form.description"></textarea>
			</div>
			<div class="box-footer">
				<input type="submit" :class="{ 'btn btn-primary' : true }" :disabled="errors.any()" value="Create">
			</div>
		</form>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	props: ['id'],
	data() {
		return {
			form: {
				name: null,
				applications: [],
				description: null,
				active: true
			},
			ApplicationArray: []
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
	},
	mounted() {
		this.$store.commit('CLEAR_ALERT')
	},
	created() {
		this.getApplications()
		if(this.id) this.getNameByID(this.id)
	},
	watch: {
		id(value) {
			if(value) {
				this.getNameByID(value)
			}
		}
	},
	methods: {
		getNameByID(id) {
			this.$Progress.start()
			axios.get('main/getNameByID?format=json',{
				params: {
					id:this.id,
				}
			})
			.then(response => {
				this.form.name = `${response.data.firstname} ${response.data.lastname} - ${response.data.position}`
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		},
		getApplications() {
			let self = this
			axios.get('admin/master/getApplications?format=json')
			.then(response => {
				response.data.forEach(function(val, index) {
					self.ApplicationArray.push(val)
				})
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		},
		createAdmin() {
			this.$Progress.start()
			axios.post('admin/master?format=json',{
				fk_id: this.id,
				form: this.form,
				created_by: this.auth.user.user_id
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
				if(response.data.status == "success") {
					this.$store.commit('RELOAD_TABLE')
					this.$store.commit('CLEAR_TABLE_ID')
				}
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		}
	}
}
</script>
