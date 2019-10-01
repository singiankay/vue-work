<template>
	<div>
		<div class="box box-info">
			<form method="post" @submit.prevent>
				<div class="box-header with-border">
					<h3 class="box-title">Update</h3>
					<div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					</div>
				</div>
				<div class="box-body">
					<div class="row">
						<div class="col-md-4">
							<div class="form-group">
								<label for="so_no">Sales Order No</label>
								<input type="number" name="so_no" v-model="form.so_no" class="form-control">
							</div>
						</div>
						<div class="col-md-4">
							<div :class="{'form-group' : true, 'has-error' : errors.first('Date')}">
								<label for="Date">Date<span class="text-danger">*</span></label>
								<date-picker name="Date" v-validate="'required'" format="MMM/dd/yyyy" v-model="form.date" :bootstrapStyling="true" clear-button-icon="fa fa-times" input-class="form-control not-readonly" placeholder="Select Date"></date-picker>
								<span v-show="errors.has('Date')" class="help-block">{{ errors.first('Date')}}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-8">
							<div :class="{'form-group' : true, 'has-error' : errors.first('Customer')}">
								<label for="Customer">Customer Name<span class="text-danger">*</span></label>
								<!--  -->
								<multiselect v-model="form.customer" :options="multiselectOptions" label="text" track-by="id" @search-change="searchCustomer" :close-on-select="true" placeholder="Type to search Customer" :show-labels="false" :loading="isLoading" :internal-search="false" :allow-empty="true" v-validate="'required'" data-vv-name="Customer" data-vv-value-path="Customer">
								</multiselect>
								<span v-show="errors.has('Customer')" class="help-block">{{ errors.first('Customer')}}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-4">
							<div class="form-group">
								<label for="shipment_status">Shipment Status</label>
								<select name="shipment_status" class="form-control" v-model="form.shipment_status">
									<option v-for="status in shipment_status" :value="status">{{ status }}</option>
								</select>
							</div>
							<div class="form-group">
								<label for="document_status">Document Status</label>
								<input type="text" name="document_status" :value="form.document_status" class="form-control" readonly>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label for="remarks">Remarks</label>
								<textarea name="remarks" class="form-control" v-model="form.remarks" rows="4"></textarea>
							</div>
						</div>
					</div>
				</div>
				<div class="box-footer">
					<input type="submit" name="update" :class="{ 'btn btn-info' : true }" :disabled="errors.any()" value="Update Record" @click="updateSalesOrder('update')">
					<input type="submit" name="void" :class="{ 'btn btn-danger' : true }" :disabled="errors.any()" v-if="form.document_status == 'Posted'" value="Void Document" @click="updateSalesOrder('void')">
					<button class="btn bg-navy pull-right" @click="clearSOID()">Back</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import DatePicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import _ from 'lodash'
import { mapMutations, mapState } from 'vuex'

export default {
	components: {
		Multiselect,
		DatePicker
	},
	props: ['id'],
	data() {
		return {
			form: {
				so_no: null,
				date: '',
				customer: '',
				remarks: '',
				document_status: '',
				shipment_status: ''
			},
			shipment_status: [],
			isLoading: false,
			sales_order_type: '',
			multiselectOptions: [],
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
		boxClass() {
			switch(this.form.document_status) {
				case "Void":
					return "box-default"
				break
				case "Posted":
					return "box-success"
				break
			}
		}
	},
	created() {
		this.getShipmentStatus()
		this.getSalesOrder(this.id)
	},
	watch: {
		id(value) {
			this.getSalesOrder(value)
		}
	},
	methods: {
		updateSalesOrder(action) {
			switch(action) {
				case 'update':
					this.$Progress.start()
					axios.patch(`salesorder/${this.id}?format=json`,{
						form: this.form, 
						division: this.auth.user.current_division,
						document_action : 'update',
						updated_by: this.auth.user.user_id
					})
					.then(response => {
						this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
						this.getSalesOrder(this.id)
						if(response.data.status == "success") {
							this.$store.dispatch('CLIENT_TABLE_REFRESH')
						}
						this.$Progress.finish()
			      })
			      .catch(error => {
			      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
			      	console.log(error)
			      	this.$Progress.fail()
			      })
				break;
				case 'void':
					this.$Progress.start()
					axios.delete(`salesorder/${this.id}?format=json`, {
						params: {updated_by: this.auth.user.user_id}
					})
					.then(response => {
						this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
						this.getSalesOrder(this.id)
						if(response.data.status == "success") {
							this.$store.dispatch('CLIENT_TABLE_REFRESH')
						}
						this.$Progress.finish()
			      })
			      .catch(error => {
			      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
			      	console.log(error)
			      	this.$Progress.fail()
			      })
				break;
			}
		},
		clearUpdateData() {
			this.id= null
			this.form.date= ''
			this.form.customer.id = ''
			this.form.customer.text = ''
			this.form.remarks= ''
			this.isLoading= false
			this.sales_order_type= ''
			this.multiselectOptions= []
		},
		clearSOID() {
			this.$store.dispatch('CLIENT_CLEAR')
		},
		getShipmentStatus() {
			this.$Progress.start()
			axios.get('salesorder/getShipmentStatus?format=json')
			.then(response => {
				this.shipment_status = response.data
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		},
		getSalesOrder(id) {
			this.$Progress.start()
			axios.get('salesorder/'+id+'?format=json')
			.then(response => {
				this.form.so_no = response.data.so_number
				this.form.customer = {
					id: response.data.customer_id,
					text: response.data.customer_name
				}
				this.form.document_status = response.data.document_status
				this.form.shipment_status = response.data.shipment_status
				this.form.date = response.data.so_date
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		},
		searchCustomer(query) {
			this.isLoading = true	
			this.search(query)
		},
		search: _.debounce(function(query) {
			this.$Progress.start()
			axios.get('salesorder/getCustomers?format=json', { params: { q:query } })
			.then(response => {
				let data = response.data.map(item => (
					{ text: `${item.NAME}`, id: item.ID }
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
	}
}
</script>