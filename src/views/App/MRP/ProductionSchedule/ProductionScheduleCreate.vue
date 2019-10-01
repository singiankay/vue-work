<template>
	<div>
		<form @submit.prevent>
			<div class="box box-solid box-success">
				<div class="box-header with-border">
					<h3 class="box-title">Create Production Schedule</h3>
					<div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					</div>
				</div>
				<div class="box-body">
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
						<label for="remarks">Remarks</label>
						<textarea name="remarks" v-model="form.remarks" rows="4" class="form-control"></textarea>
					</div>
				</div>
				<div class="box-footer">
            	<input type="submit"  :class="{ 'btn btn-success' : true }" :disabled="errors.any()" value="Create" @click="createProductionSchedule()" >
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
		DatePicker
	},
	props: ['id'],
	data() {
		return {
			form: {
				date: null,
				qty: 0,
				remarks: "",
			}
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
	},
	methods: {
		createProductionSchedule() {
			this.$validator.validateAll().then((result) => {
				if(result) {
					this.$Progress.start()
					axios.post('productionschedule', {
						so_line_id: this.id,
						form: this.form,
						user_id: this.auth.user.user_id
					})
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
			})
		},
		clearFields() {
			this.form.date = null
			this.form.qty = 0
			this.form.remarks = ""
		}
	}
}
</script>