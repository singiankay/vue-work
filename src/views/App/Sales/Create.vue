<template>
	<div>
		<div class="box box-success">
			<form method="post" @submit.prevent>
				<div class="box-header with-border">
					<h3 class="box-title">Create</h3>
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
								<label for="date">Document Date<span class="text-danger">*</span></label>
								<date-picker name="Date" v-validate="'required'" format="MMM/dd/yyyy" v-model="form.date" :bootstrapStyling="true" :clear-button="true" clear-button-icon="fa fa-times" input-class="not-readonly form-control" placeholder="Select Date"></date-picker>
								<span v-show="errors.has('Date')" class="help-block">{{ errors.first('Date')}}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-9">
							<div :class="{'form-group' : true, 'has-error' : errors.first('Customer')}">
								<label for="Customer">Customer Name<span class="text-danger">*</span></label>
								<multiselect v-model="form.customer" :options="multiselectOptions" label="text" track-by="id" @search-change="searchCustomer" placeholder="Type to search Customer" :close-on-select="true" :show-labels="false" :loading="isLoading" :internal-search="false" :allow-empty="true" v-validate="'required'" data-vv-name="Customer" data-vv-value-path="Customer">
								</multiselect>
								<span v-show="errors.has('Customer')" class="help-block">{{ errors.first('Customer')}}</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<div class="form-group">
								<label for="shipment_status">Shipment Status</label>
								<select name="shipment_status" class="form-control" v-model="form.shipment_status">
									<option v-for="status in shipment_status" :value="status">{{ status }}</option>
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label for="remarks">Remarks</label>
								<textarea name="remarks" v-model="form.remarks" rows="4" class="form-control"></textarea>
							</div>
						</div>
					</div>
				</div>
				<div class="box-footer">
					<div class="col-md-3 col-md-offset-9">
						<div class="form-group">
							<input type="submit" name="prepare" :class="{ 'btn btn-success form-control' : true }" :disabled="errors.any()" value="Save" @click="createSalesOrder()">
						</div>
					</div>
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
	props: ['divisionID', 'divisionName'],
	data() {
		return {
			form: {
				so_no: null,
				date: '',
				customer: '',
				remarks: '',
				shipment_status: '',
				document_status: ''
			},
			isLoading: false,
			sales_order_type: '',
			multiselectOptions: [],
			shipment_status: []
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
	},
	watch: {
		divisionID() {
			this.clearCreateData()
		},
		// 'form.customer'(val) {
		// 	console.log(val.text)
		// 	console.log(val.id)
		// 	console.log("-------------")
		// } 
	},
	created() {
		this.getShipmentStatus()
	},
	methods: {
		getShipmentStatus() {
			this.$Progress.start()
			axios.get('salesorder/getShipmentStatus?format=json')
			.then(response => {
				this.shipment_status = response.data;
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		},
		searchCustomer: function(query) {
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
		clearCreateData() {
			this.id= null
			this.form.date= ''
			this.form.customer= ''
			this.form.remarks= ''
			this.isLoading= false
			this.sales_order_type= ''
			this.multiselectOptions= []
		},
		createSalesOrder() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					this.$Progress.start()
					axios.post('salesorder/?format=json',{
						form: this.form,
						created_by: this.auth.user.user_id,
						division: this.divisionID,
					})
					.then(response => {
						this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
						if(response.data.status == "success") {
							this.$store.dispatch('CLIENT_UPDATE_ID', response.data.id)
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
		createSalesOrderThenNew() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					this.$Progress.start()
					axios.post('salesorder/?format=json',{
						form: this.form,
						created_by: this.auth.user.user_id,
						division: this.divisionID,
						action: "repare"
					})
					.then(response => {
						this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
						if(response.data.status == "success") {
							this.$store.dispatch('CLIENT_TABLE_REFRESH')
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
		postSalesOrder() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					this.$Progress.start()
					axios.post('salesorder/?format=json',{
						form: this.form,
						created_by: this.auth.user.user_id,
						division: this.divisionID,
						action: "post"
					})
					.then(response => {
						this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
						if(response.data.status == "success") {
							alert("Document Successfully Created")
							this.$store.dispatch('CLIENT_UPDATE_ID', response.data.id)
							this.$store.dispatch('CLIENT_TABLE_REFRESH')
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
	},
	beforeDestroy() {

	}
}
</script>