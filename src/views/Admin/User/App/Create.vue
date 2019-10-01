<template>
	<div>
		<form @submit.prevent="create">
			<h4>{{form.name}}</h4>
			<div class="form-group">
				<label for="category">Category</label>
				<input type="text" class="form-control" name="category" disabled :value="category">
			</div>
			<div class="form-group">
				<label for="role">Role</label>
				<input type="text" class="form-control" name="role" disabled :value="role">
			</div>
			<div class="form-group">
				<label for="division">Division</label>
				<input type="text" class="form-control" name="divisionName" disabled :value="divisionName">
				<input type="hidden" name="division" :value="division" v-model="form.division">
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
	props: ['id','category','role','division'],
	data() {
		return {
			form: {
				name: null,
				description: null,
				active: true
			},
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
		divisionName() {
			for (let [index, value] of this.auth.divisions.entries()) {
				if(value.id == this.division) {
					return value.code
				}
			}
		}
	},
	mounted() {
		this.$store.commit('CLEAR_ALERT')
	},
	created() {
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
			axios.get('main/getNameByID?format=json',{params: {id:this.id}})
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
		create() {
			this.$Progress.start()
			axios.post('admin/app?format=json',{
				fk_id: this.id,
				form: this.form,
				created_by: this.auth.user.user_id,
				category: this.category,
				role: this.role,
				division: this.division
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
