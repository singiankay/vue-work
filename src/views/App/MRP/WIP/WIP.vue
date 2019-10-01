<template>
	<div>
		<alert></alert>
		<div class="row">
			<div class="col-md-12">
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title">Options</h3>
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
									<option :value="area.id" v-for="area in auth.areas">{{ area.area }}</option>
								</select>
							</div>
							<div class="col-md-1">
								<label for="monthyear">Month/Year</label>
							</div>
							<div class="col-md-2">
								<date-picker name="monthyear" v-model="form.monthyear" :bootstrapStyling="true" format="MMMM yyyy" input-class="not-readonly" :minimumView="'month'" :maximumView="'month'" :full-month-name="true" calendar-button-icon="fa fa-calendar" placeholder="Select Date"></date-picker>
							</div>
						</div>
						<h3 class="title">Import/Export</h3>
						<div class="row">
							<div class="col-md-3" v-if="(form.area || form.area === 0) && form.monthyear">
								<div class="form-group">
							      <label for="importInventoryUploads">Import XLSX File</label>
			                  <input type="file" id="importInventoryUploads" name="importInventoryUploads" @change="checkFile($event)" ref="importInventoryUploads">
			                </div>
							</div>
							<div class="col-md-2" v-if="form.file">
								<div class="form-group">
									<label for="">Import Options</label>
									<div>
										<input type="submit" value="Post" class="btn bg-maroon" @click="uploadExcel()" v-if="form.file && !errorList" :disabled="processing == true">
										<input type="submit" value="Clear" class="btn bg-purple" @click="clearExcel()" v-if="form.file">
									</div>
								</div>
							</div>
							<div class="col-md-2">
								<div class="form-group">
									<label for="">Export Template File</label>
									<input type="submit" value="Generate Excel Template" :disabled="!((form.area || form.area === 0) && form.monthyear)" class="btn btn-block btn-warning" :class="{ 'disabled' :!((form.area || form.area === 0) && form.monthyear) }" @click="generateExcel()">
								</div>
							</div>
						</div>
						<h4 v-if="importResult.length">Errors <span class="badge bg-red">{{ errorList }}</span></h4>
						<wip-import-table v-if="importResult.length" :tableData="importResult"></wip-import-table>
					</div>
				</div>
			</div>
			<transition name="documentWindow" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
				<div v-if="(form.area || form.area == 0) && form.monthyear">
					<div class="col-md-12">
						<div class="box box-primary">
							<div class="box-header with-border">
								<h3 class="box-title">Models</h3>
								<div class="box-tools pull-right">
									<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
								</div>
							</div>
							<div class="box-body">
								<wip-models-table :division="auth.user.current_division" :divisionName="currentDivisionCode" :area="form.area" :monthyear="form.monthyear"></wip-models-table>
							</div>
						</div>
					</div>
					<div class="col-md-9 col-md-offset-3">
						<transition name="documentOptions" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
							<wip-update v-if="client.table.id" :id="client.table.id" :division="auth.user.current_division" :divisionName="currentDivisionCode" :area="form.area" :monthyear="form.monthyear"></wip-update>
						</transition>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Alert from '../../../../components/layout/Alert.vue'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import DatePicker from 'vuejs-datepicker'
import WipModelsTable from './WipModelsTable.vue'
import WipUpdate from './WipUpdate.vue'
import WipImportTable from './WipImportTable.vue'

export default {
	components: {
		Alert,
		DatePicker,
		WipModelsTable,
		WipUpdate,
		WipImportTable
	},
	data() {
		return {
			form: {
				file: null,
				fileData: null,
				area: null,
				monthyear: null,
			},
			importResult: [],
			errorList: 0,
			processing: false,
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
	watch: {
		'auth.user.current_division'() {
			this.$store.dispatch('CLIENT_CLEAR')
		},
		'form.area'() {
			this.$store.dispatch('CLIENT_CLEAR')
			this.clearExcel()
		},
		'form.monthyear'() {
			this.$store.dispatch('CLIENT_CLEAR')
			this.clearExcel()
		},
		'form.fileData'(rows) {
			if(rows.length) {
				this.verifyExcel(rows)
			}
			else {
				this.importResult = []
			}
			
		},
		importResult(value) {
			let count = 0
			for(let [index, val] of value.entries()) {
				if(val.status === false) {
					count++
				}
			}
			this.errorList = count
		},
	},
	created() {
		
	},
	mounted() {
		this.$store.dispatch('SET_ACTIVE_DIVISION',this.auth.user.current_division)
	},
	methods: {
		uploadExcel() {
			this.processing = true
			axios.post('wip/uploadExcel?format=json', {
				data: this.form.fileData,
				division: this.auth.user.current_division,
				area: this.form.area,
				monthyear: this.form.monthyear,
				user_id: this.auth.user.user_id
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
				if(response.data.status == "success") {
					this.$store.dispatch('CLIENT_TABLE_REFRESH')
				}
				this.processing = false
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.processing = false
			})
		},
		verifyExcel(rows) {
			axios.post('wip/verifyUpload?format=json', {
				data: rows,
				division: this.auth.user.current_division,
				area: this.form.area,
				monthYear: this.form.monthyear
			})
			.then(response => {
				this.importResult = response.data
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		clearExcel() {
			this.form.fileData = []
			this.form.file = null
			if(this.$refs.importInventoryUploads) {
				let inputFile = this.$refs.importInventoryUploads
				inputFile.type = 'text'
				inputFile.type = 'file'
			}
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
				let data = XLSX.utils.sheet_to_json(ws)
				self.form.fileData = data
	      }
	      reader.readAsArrayBuffer(file)
		},
		generateExcel() {
			let data = [{
				'_ModelNo': '',
				'_ProcessNo': '',
				'_Qty': ''
			}]
			let ws = XLSX.utils.json_to_sheet(data)
			let wb = XLSX.utils.book_new()
			wb.Props = {
				Title: "WIP Inventory Upload Template",
				Author: "Kay Singian"
			}
			XLSX.utils.book_append_sheet(wb, ws, "Inventory")
			let wbout = XLSX.write(wb, {type:"array", bookType:"xlsx"})
			saveAs(
				new Blob([wbout],
				{type:"application/octet-stream"}
			), "wip_inventory_upload.xlsx")
		},

	},
	beforeDestroy() {
		this.$store.dispatch('CLIENT_CLEAR')
		this.$store.commit('CLEAR_ALERT')
	}
}
</script>

<style>
	input.not-readonly.form-control{
		background-color:#ffffff !important;
	}
</style>