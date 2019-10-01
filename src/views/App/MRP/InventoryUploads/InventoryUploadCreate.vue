<template>
	<div>
		<form @submit.prevent>
			<div class="box box-solid box-primary">
				<div class="box-header with-border">
					<h3 class="box-title">Create Record</h3>
					<div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					</div>
				</div>
				<div class="box-body">
					<div class="form-group">
						<label for="location">Location</label>
						<input type="text" :value="location" class="form-control disabled" disabled>
					</div>
					<div class="form-group">
						<label for="location">Month/Year</label>
						<date-picker name="monthyear" format="MMM yyyy" :value="monthyear" :bootstrapStyling="true" clear-button-icon="fa fa-times" input-class="form-control" :disabled-picker="true" :clear-button="false" placeholder="Select Date"></date-picker>
					</div>
					<div :class="{'form-group' : true, 'has-error' : errors.first('Material')}">
						<label for="location">Material</label>
						<multiselect v-model="form.material" :options="multiselectOptions" label="text" track-by="id" @search-change="searchMaterial" placeholder="Type to search Material" :close-on-select="true" :show-labels="false" :loading="isLoading" :internal-search="false" :allow-empty="true" v-validate="'required'" data-vv-name="Material" data-vv-value-path="Material">
							</multiselect>
						<span v-show="errors.has('Material')" class="help-block">{{ errors.first('Material')}}</span>
					</div>
					<div class="form-group">
						<label for="location">Quantity</label>
						<input type="number" v-model.number="form.qty" class="form-control">
					</div>
				</div>
				<div class="box-footer">
					<input type="submit" :class="{ 'btn btn-primary' : true }" :disabled="errors.any()" value="Create" @click="createInventory()">
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
		DatePicker,
		Multiselect
	},
	props: ['location', 'monthyear'],
	data() {
		return {
			form: {
				material: null,
				qty: 0
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
	methods: {
		searchMaterial(q) {
			this.isLoading = true
			this.search(q)
		},
		search: _.debounce(function(q) {
			axios.get('mrpinventoryupload/searchMaterials?format=json', {
				params: {
					q: q,
					division: this.auth.user.current_division
				}
			})
			.then(response => {
				let data = response.data.map(item => (
					{ text: `${item.ITEMCODE} ${item.ITEMNAME}`, id: item.ITEMCODE }
				))
				this.isLoading = false
				this.multiselectOptions = data
	      })
	      .catch(error => {
	      	this.isLoading = false
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      })
		}, 250),
		createInventory() {
			this.$validator.validateAll().then((result) => {
				axios.post('mrpinventoryupload/?format=json', {
					location: this.location,
					monthyear: this.monthyear,
					form: this.form,
					division: this.auth.user.current_division,
					user_id: this.auth.user.user_id
				})
				.then(response => {
					this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
					if(response.data.status == "success") {
						this.$store.dispatch('CLIENT_TABLE_REFRESH')
						this.clearCreateData()
					}
				})
				.catch(error => {
					this.$store.commit('SET_ALERT',{type:'error', message:[error]})
					console.log(error)
				})
			})
		},
		clearCreateData() {
			this.form.material = null,
			this.form.qty = null
		}
	}
}
</script>