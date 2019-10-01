<template>
	<div>
		<alert></alert>
		<div class="box box-info">
			<div class="box-header with-border">
				<h3 class="box-title">Options</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				<form @submit.prevent enctype="multipart/form-data">
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
									<option :value="area.id" v-for="area in auth.areas">{{ area.area }}</option>
								</select>
							</div>
						</div>
						<div class="col-md-2">
							<label for="month">Month</label>
							<date-picker v-model="form.month" :bootstrapStyling="true" format="MMMM yyyy" input-class="not-readonly" :minimumView="'month'" :maximumView="'month'" :full-month-name="true" calendar-button-icon="fa fa-calendar" placeholder="Select Date"></date-picker>
						</div>
					</div>
				</form>
				<h3 class="title">Import/Export</h3>
				<div class="row">
					<div class="col-md-3" v-if="(form.area || form.area === 0) && form.month">
						<div class="form-group">
					      <label for="exampleInputFile">Import XLSX File</label>
	                  <input type="file" id="importProductionSchedule" name="importProductionSchedule" @change="checkFile($event)" ref="importProductionSchedule">
	                </div>
					</div>
					<div class="col-md-2" v-if="form.file">
						<div class="form-group">
							<label for="">Import Options</label>
							<div>
								<input type="submit" value="Post" class="btn bg-maroon" @click="uploadExcel()" v-if="form.file && !errorList">
								<input type="submit" value="Clear" class="btn bg-purple" @click="clearExcel()" v-if="form.file">
							</div>
						</div>
					</div>
					<div class="col-md-2">
						<div class="form-group">
							<label for="">Export Template File</label>
							<input type="submit" value="Generate Excel Template" :disabled="!((form.area || form.area === 0) && form.month)" class="btn btn-block btn-warning" :class="{ 'disabled' :!((form.area || form.area === 0) && form.month) }" @click="generateExcel()">
						</div>
					</div>
				</div>
				<h4 v-if="importResult.length">Errors <span class="badge bg-red">{{ errorList }}</span></h4>
				<production-schedule-import-table v-if="importResult.length" :TableData="importResult"></production-schedule-import-table>
			</div>
		</div>
		<transition name="documentName" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
			<h3 class="title" v-if="(form.area || form.area === 0) && form.month">SO Lines</h3>
		</transition>
		<transition name="documentWindow" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
			<div class="row" v-if="(form.area || form.area === 0) && form.month">
				<div class="col-md-12">
					<div class="box box-default">
						<div class="box-header with-border">
							<h3 class="box-title">Table</h3>
							<div class="box-tools pull-right">
								<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
							</div>
						</div>
						<div class="box-body">
							<sales-order-table v-if="(form.area || form.area === 0) && form.month" :month="form.month" :area="form.area"></sales-order-table>
						</div>
					</div>
				</div>
				<transition name="tableOption" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
					<div v-if="client.table.id">
						<div class="col-md-12">
							<h3 class="title">Production Schedule</h3>
						</div>
						<div class="col-md-8">
							<production-schedule-table :id="client.table.id"></production-schedule-table>
						</div>
						<div class="col-md-4">
							<transition name="tableLineOption" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
								<production-schedule-update  v-if="client.line.id" :id="client.line.id"></production-schedule-update>
								<production-schedule-create v-else :id="client.table.id"></production-schedule-create>
							</transition>
						</div>
					</div>
				</transition>
			</div>
		</transition>
	</div>
</template>

<script>
import Alert from '../../../../components/layout/Alert.vue'
import { mapMutations, mapState } from 'vuex'
import DatePicker from 'vuejs-datepicker'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import ProductionScheduleImportTable from './ProductionScheduleImportTable.vue'
import ProductionScheduleTable from './ProductionScheduleTable.vue'
import SalesOrderTable from './SalesOrderTable.vue'
import ProductionScheduleUpdate from './ProductionScheduleUpdate.vue'
import ProductionScheduleCreate from './ProductionScheduleCreate.vue'


export default {
	components: {
		Alert,
		DatePicker,
		ProductionScheduleImportTable,
		SalesOrderTable,
		ProductionScheduleTable,
		ProductionScheduleUpdate,
		ProductionScheduleCreate
	},
	data() {
		return {
			form: {
				month: null,
				area: '',
				file: null,
				fileData: null
			},
			sheet: {
				jsondata:  []
			},
			importResult: [],
			errorList: 0,
			records: {

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
	},
	mounted() {
		this.$store.dispatch('SET_ACTIVE_DIVISION',this.auth.user.current_division)
		.catch(error => {
			this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
		})
	},
	watch: {
		'form.fileData'(rows) {
			if(rows.length) {
				this.verifyExcel(rows)
			}
			else {
				this.importResult = []
			}
			
		},
		'form.month'() {
			this.$store.dispatch('CLIENT_CLEAR')
		},
		'form.area'() {
			this.$store.dispatch('CLIENT_CLEAR')
		},
		importResult(value) {
				let count = 0
				for(let [index, val] of value.entries()) {
					if(val.status === false) {
						count++
					}
				}
				this.errorList = count
		}
	},
	methods: {
		generateExcel() {
			axios.get('productionscheduleimport/?format=json', {
				params: {
					division: this.auth.user.current_division,
					area: this.form.area,
					month: this.form.month
				}
			})
			.then(response => {
					let structArray = response.data.map(item => ({
						so_id: item.ID,
						so_no: item.SO_NO,
						so_date: (item.SO_DATE.trim().length ? moment(item.SO_DATE, 'MMMM, DD YYYY HH:mm:ss', true).format('M/D/YYYY'): ''),
						so_line_id: item.SO_LINE_ID,
						model_no: item.MODEL_ID,
						qty: item.QTY,
						requested_delivery_date: (item.REQUESTED_DELIVERY_DATE ? (item.REQUESTED_DELIVERY_DATE.trim().length ? moment(item.REQUESTED_DELIVERY_DATE, 'MMMM, DD YYYY HH:mm:ss', true).format('M/D/YYYY'): '') : ''),
						confirmed_date: (item.CONFIRMED_DATE ? (item.CONFIRMED_DATE.trim().length ? moment(item.CONFIRMED_DATE, 'MMMM, DD YYYY HH:mm:ss', true).format('M/D/YYYY'): '') : ''),
						_production_id: item.SCHEDULE_ID,
						_production_date: (item.SCHEDULE_DATE ? (item.SCHEDULE_DATE.trim().length ? moment(item.SCHEDULE_DATE, 'MMMM, DD YYYY HH:mm:ss', true).format('M/D/YYYY'): '') : ''),
						_production_qty: item.SCHEDULE_QTY,
						_remarks: item.REMARKS
					}))

					this.sheet.jsondata = structArray
					let ws = XLSX.utils.json_to_sheet(this.sheet.jsondata)
					ws['!autofilter'] = { ref: `A1:L${response.data.length+1}` }
					let wb = XLSX.utils.book_new()
					wb.Props = {
						Title: "MRP Production Schedule Template",
						Author: "Kay Singian"
					}
					XLSX.utils.book_append_sheet(wb, ws, "Schedule")
					let wbout = XLSX.write(wb, {type:"array", bookType:"xlsx"})
					saveAs(
						new Blob([wbout],
						{type:"application/octet-stream"}
					), "production_schedule.xlsx")
				})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		verifyExcel(rows) {
			axios.post('productionscheduleimport/verifyExcel?format=json', {
				data: rows,
				division: this.auth.user.current_division,
				area: this.form.area,
				month: this.form.month
			})
			.then(response => {
				this.importResult = response.data
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		uploadExcel() {
			axios.post('productionscheduleimport/?format=json', {
				data: this.form.fileData,
				division: this.auth.user.current_division,
				area: this.form.area,
				month: this.form.month,
				user_id: this.auth.user.user_id
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
				if(response.data.status == "success") {
					this.$store.dispatch('CLIENT_TABLE_REFRESH')
					this.$store.dispatch('CLIENT_LINE_REFRESH')
				}
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		clearExcel(){
			this.form.fileData = []
			this.form.file = null
			let inputFile = this.$refs.importProductionSchedule
			inputFile.type = 'text'
			inputFile.type = 'file'
		},
		checkFile(event) {
			this.form.file = event.target.files || event.dataTransfer.files
			if (!this.form.file.length) {
				return
			}
			this.parseFile(this.form.file[0])
		},
		parseFile(file) {
			let reader = new FileReader()
	      let self = this

	      reader.onload = (e) => {
				let filename = file.name
				let binary = ""
				let bytes = new Uint8Array(e.target.result)
				let length = bytes.byteLength
				for (let i = 0; i < length; i++) {
					binary += String.fromCharCode(bytes[i]);
				}
				let wb = XLSX.read(binary, {type: 'binary', cellDates:true, cellStyles:true})
				// let wb = XLSX.read(binary, {type: 'binary'})
				let wsname = wb.SheetNames[0]
				let ws = wb.Sheets[wsname]
				let data = XLSX.utils.sheet_to_json(ws, {defval:""})
				self.form.fileData = data
	      }
	      reader.readAsArrayBuffer(file)
		},
	},
	beforeDestroy() {
		this.$store.dispatch('CLIENT_CLEAR')
		this.$store.dispatch('CLIENT_LINE_CLEAR')
		this.$store.commit('CLEAR_ALERT')
	}
}
</script>

<style>
	input.not-readonly.form-control{
		background-color:#ffffff !important;
	}
</style>

