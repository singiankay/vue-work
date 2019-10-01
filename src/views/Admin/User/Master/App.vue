<template>
	<div>
		<alert></alert>
		<div class="row">
			<transition name="table" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
				<div class="col-md-8">
					<div class="box box-solid">
						<div class="box-header with-border">
							<i class="fa fa-key"></i>
							<h3 class="box-title">Master Roles</h3>
						</div>
						<div class="box-body">
							<p>Click on a name below to update record</p>
							<user-table></user-table>
						</div>
					</div>
				</div>
			</transition>
			<div class="col-md-4">
				<transition name="access" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1500, leave: 1000 }" appear>
					<div class="box box-solid box-primary" v-if="type === 'create'" key="create">
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
								<admin-create v-if="id" :id="id"></admin-create>
							</transition>
						</div>
					</div>
					<div class="box box-solid box-primary" v-else-if="type === 'update'" key="update">
						<div class="box-header with-border">
							<i class="fa fa-edit"></i>
							<h3 class="box-title">Update User</h3>
						</div>
						<div class="box-body">
							<div class="form-group has-success">
								<admin-update  v-if="id" :id="id"></admin-update>
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
import AdminCreate from './AdminCreate.vue'
import AdminUpdate from './AdminUpdate.vue'
import _ from 'lodash'

export default {
	components: {
		Alert,
		UserTable,
		Multiselect,
		AdminCreate,
		AdminUpdate
	},
	data() {
		return {
			value: null,
			options: [],
			isLoading: false
		}
	},
	computed: {
		...mapState([
		  'admin',
		]),
		id() { return this.admin.control.id },
		type() { return this.admin.control.type }
	},
	watch: {
		value() {
			if(this.value) this.$store.commit('SET_CREATE_ID', this.value.id)
		}
	},
	methods: {
		searchAdminUsers: function(query) {
			this.isLoading = true	
			this.search(query)
		},
		search: _.debounce(function(query) {
			this.$Progress.start()
			axios.get('admin/master/getEmployees?format=json', { params: { q:query } })
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
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		}, 250)
	},
	beforeDestroy() {
		this.$store.commit('CLEAR_ALERT')
		this.$store.commit('CLEAR_TABLE_ID')
		this.$store.commit('CLEAR_AUTH_DEFAULTS')
	}
}
</script>