<template>
	<div>
		<form @submit.prevent>
			<h4>{{ form.name }}</h4>
			<div class="form-group">
				<label for="code">Code</label>
				<input type="text" class="form-control" :value="form.code" readonly>
			</div>
			<div :class="{'form-group' : true, 'has-error' : errors.first('division')}">
				<label for="division">Division</label>
				<select name="division" class="form-control" aria-describedby="divisionHelpBlock" v-model="form.division" v-validate="'required'" ref="division">
					<option value="" disabled>Select Division</option>
					<option v-for="division in divisions" :value="division.id">{{ division.code }}</option>
				</select>
				<span v-show="errors.has('division')" class="help-block">{{ errors.first('division') }}</span>
				<input type="hidden" name="division" v-model="form.division">
			</div>
			<div :class="{'form-group' : true, 'has-error' : errors.first('type')}">
				<label for="type">Group</label>
				<select name="type" class="form-control" aria-describedby="typeHelpBlock" v-model="form.type" v-validate="'required'" ref="type">
					<option value="" disabled>Select Group</option>
					<option v-for="type in types" :value="type">{{ type }}</option>
				</select>
				<span v-show="errors.has('type')" class="help-block">{{ errors.first('type') }}</span>
				<input type="hidden" name="division" v-model="form.type">
			</div>
			<div class="box-footer">
				<input type="submit" :class="{ 'btn btn-primary' : true }" :disabled="errors.any()" value="Update" @click="updateGroup(id)">
				<input type="submit" class="btn btn-danger" value="Delete" @click="deleteGroup(id)">
				<input type="button" class="btn bg-maroon" value="Reset" @click="getMaterialGroupByID(id)">
				<input type="button" class="btn bg-navy pull-right" value="Back" @click="back()">
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
				division: null,
				code: null,
				type: null
			},
			divisions: [],
			types: []
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
	},
	watch: {
		id(value) {
			if(value) {
				this.getMaterialGroupByID(this.id)
			}
		}
	},
	mounted() {
		this.$store.commit('CLEAR_ALERT')
	},
	created() {
		this.getMaterialGroupByID(this.id)
		this.getDivisions()
		this.getMaterialTypes()
	},
	methods: {
		getMaterialGroupByID(id) {
			this.$Progress.start()
			axios.get('admin/mrpgroupings/'+id+'?format=json')
			.then(response => {
				this.form.name = response.data.name
				this.form.code = response.data.code
				this.form.division = response.data.division
				this.form.type = response.data.type
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		},
		getDivisions() {
			this.$Progress.start()
			axios.get('admin/mrpgroupings/getDivisions?format=json')
			.then(response => {
				this.divisions = response.data
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		},
		getMaterialTypes() {
			this.$Progress.start()
			axios.get('admin/mrpgroupings/getMaterialTypes?format=json')
			.then(response => {
				this.types = response.data
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		},
		updateGroup(id) {
			this.$Progress.start()
			axios.patch('admin/mrpgroupings/'+id+'?format=json', {
				form: this.form
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
				if(response.data.status == "success") {
					this.getMaterialGroupByID(this.id)
					this.$store.commit('RELOAD_TABLE');
				}
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		},
		deleteGroup(id) {
			let choice = confirm("Are you sure you want to delete this user?")
			if (choice) {
				this.$Progress.start()
				axios.delete('admin/mrpgroupings/'+id+'?format=json', {
					params: {
						'name': this.form.name
					}
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
		},
		back() {
			this.$store.commit('CLEAR_TABLE_ID')
			this.$store.commit('CLEAR_ALERT')
		}
	}
}
</script>