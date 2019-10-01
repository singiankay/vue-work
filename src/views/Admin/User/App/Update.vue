<template>
	<div>
		<form @submit.prevent>
			<h4>{{ form.name }}</h4>
			<div class="form-group">
				<label for="role">Category</label>
				<input type="text" class="form-control" name="category" disabled v-model="form.category">
			</div>
			<div class="form-group">
				<label for="role">Role</label>
				<input type="text" class="form-control" name="role" disabled v-model="form.role">
			</div>
			<div class="form-group">
				<label for="division">Division</label>
				<input type="text" class="form-control" name="divisionName" disabled v-model="divisionName">
				<input type="hidden" name="division" v-model="form.division">
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
				<input type="submit" :class="{ 'btn btn-primary' : true }" :disabled="errors.any()" value="Update" @click="updateUser(id)">
				<input type="submit" class="btn btn-danger" value="Delete" @click="deleteUser(id)">
				<input type="button" class="btn bg-maroon" value="Reset" @click="getFormDataByID(id)">
				<input type="button" class="btn bg-navy pull-right" value="Back" @click="back()">
			</div>
		</form>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	props: ['id', 'category', 'role', 'division'],
	data() {
		return {
			form: {
				name: null,
				category: null,
				role: null,
				division: null,
				active: false,
				description: null,
			},
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
		divisionName() {
			for (let [index, value] of this.auth.divisions.entries()) {
				if(value.id == this.form.division) {
					return value.code
				}
			}
		}
	},
	watch: {
		id(value) {
			if(value) {
				this.getFormDataByID(value)
			}
		}
	},
	mounted() {
		this.$store.commit('CLEAR_ALERT')
	},
	created() {
		this.getFormDataByID(this.id)
	},
	methods: {
		getFormDataByID(id) {
			this.$Progress.start()
			axios.get(`admin/app/${id}?format=json`, {
			})
			.then(response => {
				this.form.name = response.data.name
				this.form.category = response.data.category
				this.form.role = response.data.role
				this.form.division = response.data.division
				this.form.active = response.data.is_active
				this.form.description = response.data.description

				if(response.data.is_active == 1) {
					this.form.active = true
				}
				else {
					this.form.active = false
				}
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		},
		updateUser() {
			this.$Progress.start()
			axios.patch('admin/app/'+this.id+'?format=json', {
				'form': this.form,
				'updated_by' : this.auth.user.user_id
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
				if(response.data.status == "success") {
					this.getFormDataByID(this.id)
					this.$store.commit('RELOAD_TABLE')
				}
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		},
		deleteUser(event) {
			let choice = confirm("Are you sure you want to delete this user?")
			if (choice) {
				this.$Progress.start()
				axios.delete('admin/app/'+this.id+'?format=json')
				.then(response => {
					this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
					if(response.data.status == "success") {
						this.$store.commit('RELOAD_TABLE')
						this.$store.dispatch('CLIENT_CREATE')
					}
					this.$Progress.finish()
				})
				.catch(error => {
					this.$store.commit('SET_ALERT',{type:'error', message:[error]})
					console.log(error)
					this.$Progress.fail()
				})
			}
		},
		back() {
			this.$store.dispatch('CLIENT_CREATE')
			this.$store.commit('CLEAR_ALERT')
		}
	}
}
</script>