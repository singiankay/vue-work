<template>
	<div>
		<alert></alert>
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">Materials</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				<div class="row">
					<div class="col-md-1">
						<label for="currentDivision">Division</label>
					</div>
					<div class="col-md-2">
						<input type="text" name="currentDivision" v-model="currentDivisionCode" class="form-control" disabled>
					</div>
					<div class="col-md-1">
						<label for="area">Area</label>
					</div>
					<div class="col-md-2">
						<select name="area" class="form-control" v-model.number="form.area">
							<option value="" disabled selected="true">Select Area</option>
							<option :value="area.id" v-for="area in formAreas">{{ area.area }}</option>
						</select>
					</div>
					<div class="col-md-1">
						<label for="area">Month/Year</label>
					</div>
					<div class="col-md-2">
						<date-picker name="monthyear" v-model="form.monthyear" :bootstrapStyling="true" format="MMMM yyyy" input-class="not-readonly" :minimumView="'month'" :maximumView="'month'" :full-month-name="true" calendar-button-icon="fa fa-calendar" placeholder="Select Date"></date-picker>
					</div>
				</div>
			</div>
		</div>
		<rm-reports :division="auth.user.current_division" :area="form.area" :monthyear="form.monthyear" v-if="auth.user.current_division && (form.area || form.area == 0) && form.monthyear"></rm-reports>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Alert from '../../../../components/layout/Alert.vue'
import DatePicker from 'vuejs-datepicker'
import RmReports from './RmReports.vue'

export default {
	components: {
		Alert,
		DatePicker,
		RmReports
	},
	data() {
		return {
			form: {
				area: null,
				monthyear: null,
			}
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
		currentDivisionCode() {
			if(this.auth.divisions) {
				for(let [index, value] of this.auth.divisions.entries()) {
					if(value.id == this.auth.user.current_division) return value.code
				}
			}
		},
		formAreas() {
			if(this.auth.areas.length == 0) {
				return [{ 'id': 0, 'area': 'n/a' }]
			}
			else {
				if(this.auth.user.client) {
					let areas = []
					for(let [index, value] of this.auth.user.client.entries()) {
						if(value.ACCESS_TYPE == 'mrp' && value.DIVISION == this.auth.user.current_division && value.IS_ACTIVE === 1) {
							let checking = areas.findIndex(obj => {
								return obj.id == value.AREA
							})
							if(checking == -1) {
								for(let[areaIndex, areaValue] of this.auth.areas.entries()) {
									if(areaValue.id == value.AREA) {
										areas.push(areaValue)
									}
								}
							}
						}
					}
					return areas.sort((a,b)=> {
						return a.id - b.id
					})
				} 
			}
		}
	},
	mounted() {
		this.$store.dispatch('SET_ACTIVE_DIVISION',this.auth.user.current_division)
		this.$store.dispatch('CLIENT_CLEAR')
	},
	beforeDestroy() {
		this.$store.dispatch('CLIENT_CLEAR')
	}
}
</script>

<style>
	input.not-readonly.form-control{
		background-color:#ffffff !important;
	}
</style>