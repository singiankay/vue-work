<template>
	<div>
		<div class="col-md-6">
			<div class="box box-success">
				<div class="box-header with-border">
					<h3 class="box-title">Models - {{ code }}</h3>
					<div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					</div>
				</div>
				<div class="box-body">
					<v-client-table :data="tableData" :columns="columns" :options="options">
						<template slot="model_no" scope="props">
							<a @click="setUpdateID(props.row.id)">{{ props.row.model_no }}</a>
						</template>
						<template slot="h__model_name" scope="props">Model Name</template>
						<template slot="h__customer_pn" scope="props">Customer P/N</template>
					</v-client-table>
				</div>
			</div>
		</div>
		<div class="col-md-6">
			<transition name="lineWindow" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
				<customer-model-update v-if="client.line.id" :id="client.line.id"></customer-model-update>
				<form @submit.prevent v-else>
					<div class="box box-solid box-primary" >
						<div class="box-header with-border">
							<h3 class="box-title">Create</h3>
							<div class="box-tools pull-right">
								<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
							</div>
						</div>
						<div class="box-body">
							<div :class="{'form-group' : true, 'has-error' : errors.first('Model')}">
								<label for="Model">Model<span class="text-danger">*</span></label>
								<multiselect v-model="form.model" :options="multiselectOptions" label="text" track-by="id" @search-change="searchModel" placeholder="Type to search Model" :close-on-select="true" :show-labels="false" :loading="isLoading" :internal-search="false" :allow-empty="true" v-validate="'required'" data-vv-name="Model" data-vv-value-path="Model">
								</multiselect>
								<span v-show="errors.has('Model')" class="help-block">{{ errors.first('Model')}}</span>
							</div>
							<div class="form-group">
								<label for="customer_pn">Customer P/N</label>
								<input type="text" name="customer_pn" v-model="form.customer_pn" class="form-control">
							</div>
						</div>
						<div class="box-footer">
							<button type="submit" class="btn btn-primary" :disabled="errors.any()" @click="createCustomerPN()">Submit</button>
						</div>
					</div>
				</form>
			</transition>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Multiselect from 'vue-multiselect'
import CustomerModelUpdate from './CustomerModelUpdate'
import _ from 'lodash'

export default {
	components: {
		Multiselect,
		CustomerModelUpdate,
	},
	props: ['code'],
	data() {
		return {
			form: {
				model: [],
				customer_pn: null,
			},
			multiselectOptions: [],
			isLoading: false,
			tableData: [],
			columns: ['model_no', 'model_name', 'customer_pn'],
			options: {
				columnsClasses: {
					model_no: 'col-md-2 pointer',
					model_name: 'col-md-4',
					customer_pn: 'col-md-6'
				}
			}
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
	},
	watch: {
		code() {
			this.getModels()
		},
		'client.line.status'(bool) {
			if(bool == false) {
				this.getModels()
			}
		}
	},
	created() {
		this.getModels()
	},
	methods: {
		createCustomerPN() {
			this.$validator.validateAll().then((result) => {
				if(result) {
					this.$Progress.start()
					axios.post('customerpn/?format=json', {
						customer_pn: this.code,
						form: this.form
					})
					.then(response => {
						this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
						if(response.data.status == "success") {
							this.getModels()
							this.clearCreateData()
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
		setUpdateID(id) {
			this.$store.dispatch('CLIENT_LINE_UPDATE_ID', id)
		},
		clearCreateData() {
			this.form.model = []
			this.form.customer_pn = null
		},
		searchModel(query) {
			this.isLoading = true
			this.search(query)
		},
		search: _.debounce(function(query) {
			this.$Progress.start()
			axios.get('product/search?format=json', { 
				params: { 
					q:query,
					division: this.auth.user.current_division
				} 
			})
			.then(response => {
				let data = response.data.map(item => (
					{ text: `${item.id} ${item.name}`, id: item.id }
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
		getModels() {
			this.$Progress.start()
			axios.get(`customerpn/${this.code}?format=json`)
			.then(response => {
				this.tableData = response.data
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

<style>
td.pointer {
	cursor: pointer;
}
</style>