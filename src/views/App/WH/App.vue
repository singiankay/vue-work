<template>
	<div>
		<alert></alert>
		<div class="row">
			<div class="col-md-6">
				<div class="box box-primary">
					<div class="box-header with-border">
						<h3 class="box-title">Materials that will not Undergo IQC Inspection after WH Label Verification</h3>
						<div class="box-tools pull-right">
							<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<v-client-table :data="tableData" :columns="columns" :options="options" v-if="tableData">
							<template slot="material_no" scope="props">
								<a @click="setUpdateID(props.row.id)">{{ props.row.material_no }}</a>
							</template>
							<template slot="is_active" scope="props">
								<span :class="{'fa' : true, 'fa-check' : props.row.is_active == 1, 'fa-cross' : props.row.is_active != 1 }"></span>
							</template>
							<template slot="h__material_no" scope="props">Material #</template>
							<template slot="h__material_name" scope="props">Name</template>
							<template slot="h__is_active" scope="props">is Active?</template>
						</v-client-table>
					</div>
				</div>
			</div>
			<div class="col-md-6">
				<transition name="documentWindow" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
					<update v-if="client.table.id" :id="client.table.id"></update>
					<form @submit.prevent v-else>
						<div class="box box-solid box-primary">
							<div class="box-header with-border">
								<h3 class="box-title">Add Materials</h3>
								<div class="box-tools pull-right">
									<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
								</div>
							</div>
							<div class="box-body">
								<div :class="{'form-group' : true, 'has-error' : errors.first('Material')}">
									<label for="Material">Material<span class="text-danger">*</span></label>
									<multiselect v-model="form.material" :options="multiselectOptions" label="text" track-by="id" @search-change="searchMaterial" placeholder="Type to search Material" :close-on-select="true" :show-labels="false" :loading="isLoading" :internal-search="false" :allow-empty="true" v-validate="'required'" data-vv-name="Material" data-vv-value-path="Material">
									</multiselect>
									<span v-show="errors.has('Material')" class="help-block">{{ errors.first('Material')}}</span>
								</div>
							</div>
							<div class="box-footer">
								<input type="submit" class="btn btn-primary pull-right" value="Create" @click="createSkipIQC()">
							</div>
						</div>
					</form>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Multiselect from 'vue-multiselect'
import Update from './Update.vue'
import Alert from '../../../components/layout/Alert.vue'

export default {
	components: {
		Alert,
		Multiselect,
		Update
	},
	data() {
		return {
			columns: ['material_no', 'material_name','is_active'],
			tableData: [],
			options: {
				columnsClasses: {
					material_no: 'pointer'
				},
			},
			form: {
				material: ''
			},
			isLoading: false,
			multiselectOptions: []
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
	},
	watch: {
		'client.table.status'(bool) {
			if(bool == false) {
				this.getSkipIQCInspectionMaterials()
			}
		}
	},
	created() {
		this.getSkipIQCInspectionMaterials()
	},
	methods: {
		createSkipIQC() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					this.$Progress.start()
					axios.post('skipiqcinspection/?format=json', {
						form: this.form.material,
						division: this.auth.user.current_division
					})
					.then(response => {
						this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
						if(response.data.status == "success") {
							this.$store.dispatch('CLIENT_TABLE_REFRESH')
							setTimeout(() =>{ 
								this.clearCreateData()
							}, 250)
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
		getSkipIQCInspectionMaterials() {
			this.$Progress.start()
			axios.get('skipiqcinspection/?format=json', {
				params: {
					division: this.auth.user.current_division,
				}
			})
			.then(response => {
				this.tableData = response.data
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		},
		searchMaterial(query) {
			this.isLoading = true	
			this.search(query)
		},
		search: _.debounce(function(query) {
			this.$Progress.start()
			axios.get('material/search?format=json', { 
					params: { 
						query:query,
						division: this.auth.user.current_division
					} 
			})
			.then(response => {
				let data = response.data.map(item => (
					{ text: `${item.ITEMCODE} ${item.ITEMNAME}`, id: item.ITEMCODE }
				))
				this.isLoading = false
				this.multiselectOptions = data
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.isLoading = false
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		}, 250),
		setUpdateID(id) {
			this.$store.dispatch('CLIENT_UPDATE_ID', id)
		},
		clearCreateData() {
			this.form.material = ''
		}
	}
}
</script>

<style>
	input.not-readonly.form-control{
		background-color:#ffffff !important;
	}
	td.pointer {
		cursor: pointer;
	}
</style>