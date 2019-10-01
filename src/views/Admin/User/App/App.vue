<template>
	<div>
		<alert></alert>
		<div class="row">
			<transition name="table" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" appear>
				<div class="col-md-8">
					<div class="box box-solid">
						<div class="box-header with-border">
							<i class="fa fa-key"></i>
							<h3 class="box-title">User Access</h3>
						</div>
						<div class="box-body">
							<h4>Options</h4>
							<p class="lead">Fill out the dropdowns below</p>
							<form class="form-horizontal">
								<div class="form-group">
									<div class="col-sm-3">
										<label for="table-division control-label">Category</label>
										<select class="form-control" name="table-role" v-model="selectedCategory">
											<option :value="category" v-for="category in categories">{{ category }}</option>
										</select>
									</div>
									<div class="col-sm-3">
										<label for="table-division control-label">Role</label>
										<select class="form-control" name="table-role" v-model="selectedRole">
											<option :value="role" v-for="role in roles">{{ role }}</option>
										</select>
									</div>
									<div class="col-sm-3">
										<label for="table-division control-label">Division</label>
										<select class="form-control" name="table-division" v-model.number="selectedDivision">
											<option :value="division.id" v-for="division in divisions">{{ division.code }}</option>
										</select>
									</div>
								</div>
							</form>
							<h4 v-if="showUserTable">User Table</h4>
							<transition name="show-user-table" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
								<user-table :category="selectedCategory" :role="selectedRole" :division="selectedDivision" v-if="showUserTable"></user-table>
							</transition>	
						</div>
					</div>
				</div>
			</transition>
			<div class="col-md-4">
				<transition name="access" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1500, leave: 1000 }" appear>
					<div class="box box-solid box-primary" v-if="showUserTable && client.table.type == 'create'">
						<div class="box-header with-border">
							<i class="fa fa-plus"></i>
							<h3 class="box-title">Create User</h3>
						</div>
						<div class="box-body">
							<div class="form-group has-success">
								<label class="control-label" for="search_user_admin">Search User</label>
								<multiselect v-model="value" :options="options" label="text" track-by="id" @search-change="searchAdminUsers" placeholder="Who are you looking for?" :close-on-select="true" :show-labels="false" :loading="isLoading" :internal-search="false" :allow-empty="true">
								</multiselect>
							</div>
							<transition name="show-create-option" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" appear>
								<app-user-create v-if="value" :id="value.id" :category="selectedCategory" :role="selectedRole" :division="selectedDivision"></app-user-create>
							</transition>
						</div>
					</div>
					<div class="box box-solid box-primary" v-else-if="client.table.type === 'update'" key="update">
						<div class="box-header with-border">
							<i class="fa fa-edit"></i>
							<h3 class="box-title">Update User</h3>
						</div>
						<div class="box-body">
							<div class="form-group has-success">
								<app-user-update  v-if="client.table.id" :id="client.table.id"></app-user-update>
							</div>
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Alert from '../../../../components/layout/Alert.vue'
import UserTable from './Usertable.vue'
import Multiselect from 'vue-multiselect'
import AppUserCreate from './Create.vue'
import AppUserUpdate from './Update.vue'
import _ from 'lodash'

export default {
	components: {
		Alert,
		UserTable,
		Multiselect,
		AppUserCreate,
		AppUserUpdate
	},
	data() {
		return {
			value: null,
			options: [],
			isLoading: false,
			roles: [],
			categories: [],
			selectedCategory: null,
			selectedRole: null,
			selectedDivision: null,
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
		showUserTable() {
			if(this.selectedCategory && this.selectedRole && this.selectedDivision) {
				return true
			}
			else {
				return false
			}
		},
		divisions() { return this.auth.divisions },
	},
	created() {
		this.getCategories()
		this.getDivisions()
	},
	mounted() {
		this.$store.dispatch('CLIENT_CREATE')
	},
	watch: {
		value() {
			if(this.value) this.$store.commit('SET_CREATE_ID', this.value.id)
		},
		selectedCategory(value) {
			if(value != null) {
				this.roles = []
				this.selectedRole = null
				this.getRoles()
			}
		},
	},
	methods: {
		getCategories() {
			this.$Progress.start()
			axios.get('admin/app/getCategories?format=json')
			.then(response => {
				this.categories = response.data
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		},
		getRoles() {
			this.$Progress.start()
			axios.get('admin/app/getRoles?format=json', {
				params: {
					category: this.selectedCategory
				}
			})
			.then(response => {
				this.roles = response.data
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		},
		getDivisions() {
			this.$store.dispatch('SET_DIVISIONS')
			.then(response => {

			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		searchAdminUsers(query) {
			this.isLoading = true 
			this.search(query)
		},
		search: _.debounce(function(query) {
			this.$Progress.start()
			axios.get('admin/app/getEmployees?format=json', { 
				params: { 
					q:query,
					role: this.selectedRole,
					category: this.selectedCategory,
					division: this.selectedDivision
				} 
			})
			.then(response => {
				let data = response.data.map(item => (
					{ text: `${item.FIRSTNAME} ${item.LASTNAME} - ${item.POSITION}`, id: item.ID }
				))
				this.isLoading = false
				this.options = data
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.isLoading = false
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		}, 250),
	},
	beforeDestroy() {
		this.$store.commit('CLEAR_ALERT')
		this.$store.dispatch('CLIENT_CLEAR')
		this.$store.commit('CLEAR_AUTH_DEFAULTS')
	}
}
</script>