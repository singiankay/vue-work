<template>
	<div>
		<form @submit.prevent>
			<div class="box box-solid box-info">
				<div class="box-header with-border">
					<h3 class="box-title">Edit Production Schedule</h3>
					<div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					</div>
				</div>
				<div class="box-body">
					<ul class="list-group list-group-unbordered">
                <li class="list-group-item">
                  <b>Production Schedule No:</b>
                  <span class="badge bg-purple pull-right">{{ form.id }}</span>
                </li>
                <li class="list-group-item">
                  <b>Last Updated by:</b>
                  <span class="badge bg-aqua pull-right">{{ form.updated_by }}</span>
                </li>
              </ul>
					<div :class="{'form-group' : true, 'has-error' : errors.first('date')}">
						<label for="date">Production Date<span class="text-danger">*</span></label>
						<date-picker name="date" format="MMM/dd/yyyy" v-model="form.date" v-validate="'required'" :bootstrapStyling="true" :clear-button="true" clear-button-icon="fa fa-times" input-class="not-readonly form-control" placeholder="Select Date"></date-picker>
						<span v-show="errors.has('date')" class="help-block">{{ errors.first('date')}}</span>
					</div>
					<div :class="{'form-group' : true, 'has-error' : errors.first('qty')}">
						<label for="qty">Qty<span class="text-danger">*</span></label>
						<input type="number" v-model="form.qty" v-validate="'required'" class="form-control" required>
						<span v-show="errors.has('qty')" class="help-block">{{ errors.first('qty')}}</span>
					</div>
					<div class="form-group">
						<label for="production_remarks">Remarks</label>
						<textarea name="production_remarks" v-model="form.remarks" rows="4" class="form-control"></textarea>
					</div>
				</div>
				<div class="box-footer">
            	<input type="submit" :class="{ 'btn btn-info' : true }" :disabled="errors.any()" value="Update" @click="updateProductionSchedule()">
            	<input type="submit" class="btn btn-danger" value="Delete" @click="deleteProductionSchedule()">
            	<input type="button" class="btn btn-default pull-right" value="Cancel" @click="clearFields()">
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import DatePicker from 'vuejs-datepicker'

export default {
	components: {
		DatePicker,
	},
	props: ['id'],
	data() {
		return {
			form: {
				id: null,
				so_line_id: null,
				date: null,
				qty: null,
				date_by: null,
				remarks: null,
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
		id(value) {
			if(value) {
				this.getProductionSchedule()
			}
			else {
				this.clearFields()
			}
			
		},
	},
	created() {
		this.getProductionSchedule()
	},
	methods: {
		getProductionSchedule() {
			axios.get(`productionschedule/${this.id}?format=json`)
			.then(response => {
				this.form.id = response.data.id,
				this.form.so_line_id = response.data.so_line_id,
				this.form.date = response.data.date
				this.form.qty = response.data.qty
				this.form.updated_by = response.data.updated_by
				this.form.remarks = response.data.remarks
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		updateProductionSchedule() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					this.$Progress.start()
					axios.patch(`productionschedule/${this.id}?format=json`, {
						form: this.form,
						user_id: this.auth.user.user_id
					})
					.then(response => {
						this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
						if(response.data.status == "success") {
							this.$store.dispatch('CLIENT_TABLE_REFRESH')
							this.$store.dispatch('CLIENT_LINE_REFRESH')
							this.$Progress.finish()
						}
					})
					.catch(error => {
						this.$store.commit('SET_ALERT',{type:'error', message:[error]})
						console.log(error)
						this.$Progress.fail()
					})
				}
			})
		},
		deleteProductionSchedule() {
			let choice = confirm("Are you sure you want to delete this user?")
			if (choice) {
				this.$Progress.start()
				axios.delete(`productionschedule/${this.id}?format=json`)
				.then(response => {
					this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
					if(response.data.status == "success") {
						this.$store.dispatch('CLIENT_TABLE_REFRESH')
						this.$store.dispatch('CLIENT_LINE_REFRESH')
						this.$Progress.finish()
						this.clearFields()
					}
				})
				.catch(error => {
					this.$store.commit('SET_ALERT',{type:'error', message:[error]})
					console.log(error)
					this.$Progress.fail()
				})
			}
		},
		clearFields() {
			this.form.id = null
			this.form.date = null
			this.form.qty = 0
			this.form.updated_by = null
			this.form.remarks = null
			this.form.so_line_id = null
			this.$store.commit('CLEAR_CLIENT_LINE_ID')
		}
	}
}
</script>