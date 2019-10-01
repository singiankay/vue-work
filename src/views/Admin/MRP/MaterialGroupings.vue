<template>
	<div>
		<alert></alert>
		<div class="row">
			<transition name="table" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" appear>
				<div class="col-md-8">
					<div class="box box-solid">
						<div class="box-header with-border">
							<i class="fa fa-object-group"></i>
							<h3 class="box-title">Material Groupings</h3>
						</div>
						<div class="box-body">
							<transition name="show-user-table" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
								<groupings-table v-if="table"></groupings-table>
							</transition>
						</div>
					</div>
				</div>
			</transition>
			<div class="col-md-4">
				<transition name="access" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1500, leave: 1000 }" appear>
					<div class="box box-solid box-primary" v-if="type === 'create' && table" key="create">
						<div class="box-header with-border">
							<i class="fa fa-plus"></i>
							<h3 class="box-title">Add Material Groups</h3>
						</div>
						<div class="box-body">
							<div class="form-group has-success">
								<label class="control-label" for="search-groupings">Search</label>
								<multiselect v-model="value" :options="options" label="text" track-by="id" @search-change="searchMaterialGroups" placeholder="What are you looking for?" :close-on-select="true" :show-labels="false" :loading="isLoading" :internal-search="false" :allow-empty="true">
								</multiselect>
							</div>
							<transition name="show-create-option" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" appear>
								<groupings-create v-if="id" :id="id"></groupings-create>
							</transition>
						</div>
					</div>
					<div class="box box-solid box-primary" v-else-if="type === 'update'" key="update">
						<div class="box-header with-border">
							<i class="fa fa-edit"></i>
							<h3 class="box-title">Update Material Groups</h3>
						</div>
						<div class="box-body">
							<div class="form-group has-success">
								<groupings-update  v-if="id" :id="id"></groupings-update>
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
import Alert from '../../../components/layout/Alert.vue'
import GroupingsTable from './GroupingsTable.vue'
import GroupingsCreate from './GroupingsCreate.vue'
import GroupingsUpdate from './GroupingsUpdate.vue'
import Multiselect from 'vue-multiselect'
import _ from 'lodash'

export default {
	components: {
		Alert,
		Multiselect,
		GroupingsTable,
		GroupingsCreate,
		GroupingsUpdate
	},
	data() {
		return {
			table: true,
			isLoading: false,
			options: [],
			value: null
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
		id() { return this.$store.getters.AdminID },
		type() { return this.$store.getters.AdminType },
	},
	watch: {
		value() {
			if(this.value) this.$store.commit('SET_CREATE_ID', this.value.id)
		},
	},
	methods: {
		searchMaterialGroups(query) {
			this.isLoading = true 
			this.search(query)
		},
		search: _.debounce(function(query) {
			this.$Progress.start()
			axios.get('admin/mrpgroupings/getSAPMaterialGroups?format=json', { 
				params: { 
					q:query
				} 
			})
			.then(response => {
				let data = response.data.map(item => (
					{ text: `${item.id} : ${item.name}` , id: item.id }
				))
				this.isLoading = false
				this.options = data
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.isLoading = false
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		}, 250),
	},
	beforeDestroy() {
		this.$store.commit('CLEAR_ALERT')
		this.$store.commit('CLEAR_TABLE_ID')
		this.$store.commit('CLEAR_AUTH_DEFAULTS')
	}
}
</script>