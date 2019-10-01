<template>
	<div>
		<form @submit.prevent="create()">
			<div class="box box-solid box-primary">
				<div class="box-header with-border">
					<h3 class="box-title">Create Line</h3>
					<div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					</div>
				</div>
				<div class="box-body">
					<div :class="{'form-group' : true, 'has-error' : errors.first('Customer')}">
						<label for="Customer">Customer Name<span class="text-danger">*</span></label>
						<multiselect v-model="form.customer" :options="customerOptions" label="text" track-by="id" @search-change="searchCustomer" placeholder="Type to search Customer" :close-on-select="true" :show-labels="false" :loading="isLoadingCustomer" :internal-search="false" :allow-empty="true" v-validate="'required'" data-vv-name="Model" data-vv-value-path="Customer">
						</multiselect>
						<span v-show="errors.has('Customer')" class="help-block">{{ errors.first('Customer')}}</span>
					</div>
					<div :class="{'form-group' : true, 'has-error' : errors.first('Model')}">
						<label for="Model">Model<span class="text-danger">*</span></label>
						<multiselect v-model="form.model" :options="multiselectOptions" label="text" track-by="id" @search-change="searchModel" placeholder="Type to search Model" :close-on-select="true" :show-labels="false" :loading="isLoading" :internal-search="false" :allow-empty="true" v-validate="'required'" data-vv-name="Model" data-vv-value-path="jo.model">
						</multiselect>
						<span v-show="errors.has('Model')" class="help-block">{{ errors.first('Model')}}</span>
					</div>
					<div class="form-group">
						<label for="customer_pn">Customer PN</label>
						<input type="text" name="customer_pn" class="form-control" v-model="form.customer_pn">
					</div>
					<div class="form-group">
						<label for="customer_po">Customer PO Number</label>
						<input type="text" name="customer_po" class="form-control" v-model="form.customer_po">
					</div>
					<div :class="{'form-group' : true, 'has-error' : errors.first('Area')}">
						<label for="Area">Area<span class="text-danger">*</span></label>
						<select name="Area" class="form-control" v-model="form.area" v-validate="'required'">
							<option :value="area.id" v-for="area in areas">{{ area.area }}</option>
						</select>
						<span v-show="errors.has('Area')" class="help-block">{{ errors.first('Area')}}</span>
					</div>
					<div :class="{'form-group' : true, 'has-error' : errors.first('Qty')}">
						<label for="Qty">Quantity<span class="text-danger">*</span></label>
						<input type="number" name="Qty" class="form-control" v-model.number="form.qty" v-validate="'required'">
						<span v-show="errors.has('Qty')" class="help-block">{{ errors.first('Qty')}}</span>
					</div>
					<div class="form-group">
						<label for="requested_delivery_date">Requested Delivery Date</label>
						<date-picker name="requested_delivery_date" format="MMM/dd/yyyy" v-model="form.requested_delivery_date" :bootstrapStyling="true" :clear-button="true" clear-button-icon="fa fa-times" input-class="not-readonly form-control" placeholder="Select Date"></date-picker>
					</div>
					<div class="form-group">
						<label for="confirmed_date">Confirmed Delivery Date</label>
						<date-picker name="confirmed_date" format="MMM/dd/yyyy" v-model="form.confirmed_date" :bootstrapStyling="true" :clear-button="true" clear-button-icon="fa fa-times" input-class="not-readonly form-control" placeholder="Select Date"></date-picker>
					</div>
					<div class="form-group">
						<label for="remarks">Remarks</label>
						<textarea name="remarks"  rows="3" class="form-control" v-model="form.remarks"></textarea>
					</div>
				</div>
				<div class="box-footer">
					<input type="submit" :class="{ 'btn btn-primary' : true }" :disabled="errors.any()" value="Create">
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import DatePicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import { mapMutations, mapState } from 'vuex'
import _ from 'lodash'

export default {
	components: {
		Multiselect,
		DatePicker
	},
	props: ['id', 'customerId'],
	data() {
		return {
			form: {
				model: '',
				customer: '',
				area: null,
				qty: '',
				customer_pn: '',
				customer_po: '',
				requested_delivery_date: '',
				confirmed_date: '',
				remarks: '',
			},
			isLoading: false,
			isLoadingCustomer: false,
			multiselectOptions: [],
			customerOptions: [],
			selectedArea: null,
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
		areas() { return this.auth.areas }
	},
	watch: {
		'form.model'(val) {
			if(typeof val === "object" && typeof this.form.customer == "object") {
				this.getCustomerPN()
			}
		},
		'form.customer'(val) {
			if(typeof val === "object" && typeof this.form.model == "object") {
				this.getCustomerPN()
			}
		},
		customerId() {
			this.getCustomer()
		}
	},
	mounted() {
		this.getCustomer()
	},
	methods: {
		create() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					this.$Progress.start()
					axios.post(`salesorder/${this.id}/salesorderline?format=json`,{
						form: this.form
					})
					.then(response => {
						this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
						if(response.data.status == "success") {
							this.$store.dispatch('CLIENT_LINE_REFRESH')
							this.clearCreateData()
						}
						this.$Progress.finish()
			      })
			       .catch(error => {
			      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
			      	console.log(error)
			      })
			       this.$Progress.fail()
				}
			})
			
		},
		getCustomer() {
			this.$Progress.start()
			axios.get('salesorderline/getCustomer', {
				params: {
					customer_id: this.customerId
				}
			})
			.then(response => {
				this.form.customer = {
					id: response.data.id,
					text: response.data.name
				}
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		},
		getCustomerPN() {
			this.$Progress.start()
			axios.get(`customerpn/getCustomerPNData?format=json`, {
				params: {
					model: this.form.model.id,
					customer_id: this.customerId
				}
			})
			.then(response => {
				if(response.data === false) {
					this.form.customer_pn = 'n/a'
				}
				else {
					this.form.customer_pn = response.data.customer_pn
				}
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		},
		searchCustomer(query) {
			this.isLoadingCustomer = true
			this.getCustomers(query)
		},
		getCustomers: _.debounce(function(query) {
			this.$Progress.start()
			axios.get('salesorder/getCustomers?format=json', { 
				params: { 
					q:query 
				} 
			})
			.then(response => {
				let data = response.data.map(item => (
					{ text: `${item.NAME}`, id: item.ID }
				))
				this.isLoading = false
				this.customerOptions = data
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.isLoading = false
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		}, 250),
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
		clearCreateData() {
			this.form.model = ''
			this.form.customer = ''
			this.form.area = null
			this.form.qty = ''
			this.form.customer_pn = ''
			this.form.customer_po = ''
			this.form.remarks = ''
			this.getCustomer()
		}
	}
}
</script>
<style>
.input-group .form-control {
	z-index: 0 !important;
}
</style>