<template>
	<div>
		<alert></alert>
		<div class="row">
			<div class="col-md-12">
				<div class="box box-solid">
					<div class="box-header with-border">
						<h3 class="box-title">Dashboard</h3>
						<div class="box-tools pull-right">
							<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<h3 class="title">Generate MRP Report</h3>
						<form method="post" @submit.prevent="generateExcel()">
							<div class="row">
								<div class="col-md-2">
									<div class="form-group">
										<label for="type">Type</label>
										<select name="area" class="form-control" v-model="form.type">
											<option value="" disabled>Select Type</option>
											<option :value="type" v-for="type in types">{{ type }}</option>
										</select>
									</div>
								</div>
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
									<div class="form-group">
										<label for="month">Month</label>
										<date-picker v-model="form.month" :bootstrapStyling="true" input-class="not-readonly" :minimumView="'month'" :maximumView="'month'" :full-month-name="true" calendar-button-icon="fa fa-calendar" placeholder="Select Date"></date-picker>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
									<div class="row">
										<div class="col-md-2">
											<div class="form-group">
												<label for="">Options</label>
												<input type="submit" value="Generate Report" class="btn btn-primary form-control" v-if="allowedGenerateReport" @click="generateReport()">
											</div>
										</div>
										<div class="col-md-2">
											<div class="form-group">
												<label for="">&nbsp;</label>
												<input type="submit" value="Download Excel" class="btn btn-success form-control" v-if="allowedGenerateReport">
											</div>
										</div>
									</div>
								</div>
							</div>							
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="box box-primary" v-if="allowedGenerateReport">
			<div class="box-header with-border">
				<h3 class="box-title">Report</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				<div id="mrp-excel">
					<mrp-excel :type="form.type" v-bind:division="auth.user.current_division" v-bind:area="form.area" :month="form.month" v-if="table"></mrp-excel>
				</div>
			</div>				
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Alert from '../../../components/layout/Alert.vue'
import DatePicker from 'vuejs-datepicker'
import MrpExcel from './MrpExcel.vue'

export default {
	components: {
		Alert,
		DatePicker,
		MrpExcel
	},
	data() {
		return {
			areas: [],
			types: [],
			form: {
				month: null,
				areas: [],
				area: '',
				type: ''
			},
			table: false
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
		},
		allowedGenerateReport() {
			if(this.form.type != "" && this.form.area !== "" && this.form.month != null) {
				return true
			}
			else {
				return false
			}
		}
	},
	watch: {
		formAreas(areas) {
			if(areas.find((obj) => { return obj.id === 0 })) {
				this.form.area = 0
			}
			else {
				this.form.area = ''
			}
		}
	},
	mounted() {
		this.form.type = ""
	},
	created() {
		this.$store.dispatch('SET_ACTIVE_DIVISION',this.auth.user.current_division)
		.catch(error => {
			this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
		})

		axios.get('admin/mrpgroupings/getMaterialTypes?format=json')
		.then(response => {
				this.types = response.data
			})
		.catch(error => {
			this.$store.commit('SET_ALERT',{type:'error', message:[error]})
			console.log(error)
		})

	},
	methods: {
		generateExcel() {

		},
		generateReport() {
			this.table = false
			
			setTimeout(() => {
				this.table = true
         }, 1)
		}
	}
}
</script>

<style>
	input.not-readonly.form-control{
		background-color:#ffffff !important;
	}
</style>