<template>
	<div>
		<div class="box box-solid">
			<div class="box-header with-border">
				<h3 class="box-title">Upload / Export CSV/Excel Template</h3>
			</div>
			<div class="box-body">
				<h3 class="title">Export</h3>
				<form method="post">
					<div class="row">
						<div class="col-md-2">
							<div class="form-group">
								<label for="currentDivision">Division</label>
								<input type="text" name="currentDivision" v-model="currentDivisionCode" class="form-control" disabled>
							</div>
						</div>
						<div class="col-md-2">
							<div class="form-group">
								<label for="area">Area</label>
								<select name="area" class="form-control" v-model.number="form.area">
									<option value="" disabled>Select Area</option>
									<option :value="area.id" v-for="area in formAreas">{{ area.area }}</option>
								</select>
							</div>
						</div>
						<div class="col-md-2">
							<label for="month">Month</label>
							<date-picker :value="form.month" :bootstrapStyling="true" input-class="not-readonly" :minimumView="'month'" :maximumView="'month'" :full-month-name="true" calendar-button-icon="fa fa-calendar" placeholder="Select Date"></date-picker>
						</div>
						<div class="col-md-2">
							<div class="form-group">
								<label for="">Options</label>
								<input type="submit" value="Generate Excel Form" class="btn btn-primary form-control">
							</div>
						</div>
					</div>
				</form>
				<h3 class="title">Import</h3>
				<div id="mrp-excel">
					<mrp-excel></mrp-excel>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import authPerimeter from '../../../perimeters/authPerimeter'
import DatePicker from 'vuejs-datepicker'
import MrpExcel from './MrpExcel.vue'

export default {
	perimeters: [
		authPerimeter
	],
	components: {
		DatePicker,
		MrpExcel
	},
	data() {
		return {
			areas:[],
			form: {
				month: '',
				areas: [],
				area: '',
			}
		}
	},
	computed: {
		...mapState([
		  'auth',
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
				this.form.area = 0
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
	created() {
		this.$store.dispatch('SET_ACTIVE_DIVISION',this.auth.user.current_division)
		.catch(error => {
			this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
		})
	}
}
</script>

<style>
	input.not-readonly.form-control{
		background-color:#ffffff !important;
	}
</style>