<template>
	<div>
		<form @submit.prevent>
			<div class="box box-solid box-success">
				<div class="box-header with-border">
					<h3 class="box-title">Update Line</h3>
					<div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					</div>
				</div>
				<div class="box-body">
					<div :class="{'form-group' : true, 'has-error' : errors.first('Customer')}">
						<label for="Customer">Customer Name<span class="text-danger">*</span></label>
						<multiselect v-model="form.customer" :options="customerOptions" label="text" track-by="id" @search-change="searchCustomer" placeholder="Type to search Customer" :close-on-select="true" :show-labels="false" :loading="isLoadingCustomer" :internal-search="false" :allow-empty="true" v-validate="'required'" data-vv-name="Customer" data-vv-value-path="Customer">
						</multiselect>
						<span v-show="errors.has('Customer')" class="help-block">{{ errors.first('Customer')}}</span>
					</div>
					<div :class="{'form-group' : true, 'has-error' : errors.first('Model')}">
						<label for="Model">Model<span class="text-danger">*</span></label>
						<multiselect v-model="form.model" :options="multiselectOptions" label="text" track-by="id" @search-change="searchModel" placeholder="Type to search Model" :close-on-select="true" :show-labels="false" :loading="isLoading" :internal-search="false" :allow-empty="true" v-validate="'required'" data-vv-name="Model" data-vv-value-path="Model">
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
							<option :value="area.id" v-for="area in auth.areas">{{ area.area }}</option>
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
						<textarea name="remarks"  rows="4" class="form-control" v-model="form.remarks"></textarea>
					</div>
				</div>
				<div class="box-footer">
					<input type="submit" :class="{ 'btn btn-success' : true }" :disabled="errors.any()" value="Update" @click="updateLine()">
					<input type="submit" :class="{ 'btn btn-danger' : true }" value="Delete" @click="deleteLine()">
					<input type="button" class="btn bg-purple pull-right" value="Back" @click="back()">
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
	props: ['id','salesOrderId', 'customerId'],
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
			old: {
				model: '',
				customer: ''
			},
			isLoading: false,
			isLoadingCustomer: false,
			multiselectOptions: [],
			customerOptions: []
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
	},
	watch: {
		id(value) {
			if(value) {
				this.getUpdateData(this.salesOrderId, this.id)
			}
		},
		salesOrderId(value) {
			if(value) {
				this.getUpdateData(this.salesOrderId, this.id)
			}
		},
		'form.model'(val) {
			if(typeof val === "object" && typeof this.form.customer == "object") {
				if(val.id != this.old.model.id) {
					this.getCustomerPN()
				}
			}
		},
		'form.customer'(val) {
			if(typeof val === "object" && typeof this.form.model == "object") {
				if(val.id != this.old.customer.id) {
					this.getCustomerPN()
				}
			}
		},
	},
	created() {
		this.getUpdateData(this.salesOrderId, this.id)
	},
	methods: {
		updateLine() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					this.$Progress.start()
					axios.patch(`salesorder/${this.salesOrderId}/salesorderline/${this.id}?format=json`,{
						form: this.form,
						old: this.old
					})
					.then(response => {
						this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
						if(response.data.status == "success") {
							this.$store.dispatch('CLIENT_LINE_REFRESH')
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
		deleteLine() {
			let choice = confirm("Are you sure you want to delete this line?")
			if (choice) {
				this.$Progress.start()
				axios.delete(`salesorder/${this.salesOrderId}/salesorderline/${this.id}?format=json`, {
					params: {
						form: this.old
					}
				})
				.then(response => {
					this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
					if(response.data.status == "success") {
						this.$store.dispatch('CLIENT_LINE_REFRESH')
						this.back()
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
		searchModel(query) {
			this.isLoading = true
			this.search(query)
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
		getUpdateData(so_id, id) {
			this.$Progress.start()
			axios.get(`salesorder/${so_id}/salesorderline/${id}?format=json`)
			.then(response => {
				this.form.model = response.data.model
				this.form.customer = response.data.customer
				this.form.area = (response.data.area == "" ? 0 : response.data.area)
				this.old.model = response.data.model
				this.old.customer = response.data.customer
				this.form.qty = response.data.qty
				this.form.customer_pn = response.data.customer_pn
				this.form.customer_po = response.data.customer_po
				this.form.requested_delivery_date = response.data.requested_delivery_date
				this.form.confirmed_date = response.data.confirmed_date
				this.form.remarks = response.data.remarks
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
	}
}
</script>

<style>
.input-group .form-control {
	z-index: 0 !important;
}
</style>