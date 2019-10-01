<template>
	<div>
		<form @submit.prevent>
			<div class="box box-solid box-success">
				<div class="box-header with-border">
					<h3 class="box-title">Update</h3>
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
					<button type="submit" class="btn btn-primary" :disabled="errors.any()" @click="updateCustomerPN()">Update</button>
					<button type="submit" class="btn btn-danger" @click="deleteCustomerPN()">Delete</button>
					<button type="submit" class="btn btn-primary pull-right" @click="back()">Back</button>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Multiselect from 'vue-multiselect'
import _ from 'lodash'

export default {
	components: {
		Multiselect
	},
	props: ['id'],
	data() {
		return {
			form: {
				model: '',
				customer_pn: null,
			},
			multiselectOptions: [],
			isLoading: false,
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
	},
	watch: {
		id() {
			this.getCustomerPN()
		}
	},
	created() {
		this.getCustomerPN()
	},
	methods: {
		updateCustomerPN() {
			this.$Progress.start()
			axios.patch(`customerpn/${this.id}?format=json`, {
				form: this.form
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
				if(response.data.status == "success") {
					this.$store.dispatch('CLIENT_LINE_REFRESH')
				}
				this.$Progress.finish()
			})
			.catch(error=> {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		},
		deleteCustomerPN() {
			let choice = confirm("Are you sure you want to delete this line?")
			if (choice) {
				this.$Progress.starT()
				axios.delete(`customerpn/${this.id}?format=json`)
				.then(response => {
					this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
					if(response.data.status == "success") {
						this.$store.dispatch('CLIENT_LINE_REFRESH')
						this.back()
					}
					this.$Progress.finish()
				})
				.catch(error=> {
					this.$store.commit('SET_ALERT',{type:'error', message:[error]})
					console.log(error)
					this.$Progress.fail()
				})
			}
		},
		getCustomerPN() {
			this.$Progress.start()
			axios.get('customerpn/getCustomerPN?format=json', {
				params: {
					id: this.id
				}
			})
			.then(response => {
				this.form.model = response.data.model
				this.form.customer_pn = response.data.customer_pn
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
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
		back() {
			this.$store.dispatch('CLIENT_LINE_CREATE')
		},
	},
}
</script>