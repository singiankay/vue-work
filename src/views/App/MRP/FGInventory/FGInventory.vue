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
							<label for="area">Month/Year</label>
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
					<fginventory-import-table v-if="importResult.length" :tableData="importResult"></fginventory-import-table>
				</div>
			</div>
			<transition name="documentWindow" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
				<div class="row" v-if="(form.area || form.area == 0) && form.monthyear">
					<fg-inventory-table :area="form.area" :monthyear="form.monthyear" ref="fgInventoryTable"></fg-inventory-table>
				</div>
			</transition>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Alert from '../../../../components/layout/Alert.vue'
import DatePicker from 'vuejs-datepicker'
import FgInventoryTable from './FgInventoryTable.vue'
import FginventoryImportTable from './FginventoryImportTable.vue'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default {
	components: {
		Alert,
		DatePicker,
		FgInventoryTable,
		FginventoryImportTable
	},
	data() {
		return {
			form: {
				file: null,
				fileData: null,
				area: null,
				monthyear: null,
			},
			sheet: {
				jsondata:  []
			},
			importResult: [],
			errorList: 0,
			processing: false,
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
	},
	watch: {
		'auth.user.current_division'() {
			this.$store.dispatch('CLIENT_CLEAR')
		},
		'form.area'() {
			this.$store.dispatch('CLIENT_CLEAR')
			if(this.form.file) {
				this.clearExcel()
			}
		},
		'form.monthyear'() {
			this.$store.dispatch('CLIENT_CLEAR')
			if(this.form.file) {
				this.clearExcel()
			}
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
			axios.post('mrpfginventory/uploadExcel?format=json', {
				data: this.form.fileData,
				division: this.auth.user.current_division,
				area: this.form.area,
				month: this.form.monthyear,
				user_id: this.auth.user.user_id
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
				if(response.data.status == "success") {
					this.$refs.fgInventoryTable.getMonthlyFGInventory()
				}
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		verifyExcel(rows) {
			axios.post('mrpfginventory/verifyExcel?format=json', {
				data: rows,
				division: this.auth.user.current_division,
				area: this.form.area,
				month: this.form.monthyear
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
			let inputFile = this.$refs.importInventoryUploads
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
				let data = XLSX.utils.sheet_to_json(ws)
				self.form.fileData = data
	      }
	      reader.readAsArrayBuffer(file)
		},
		generateExcel() {
			axios.get('mrpfginventory/?format=json', {
				params: {
					division: this.auth.user.current_division,
					area: this.form.area,
					monthyear: this.form.monthyear
				}
			})
			.then(response => {
				let structArray = []
				for (let [index, value] of response.data.entries()) {
					structArray.push({
						ModelNumber: value.model_id, 
						ModelName: value.name,
						_Qty: value.qty
					})
				}
				this.sheet.jsondata = structArray
				let ws = XLSX.utils.json_to_sheet(this.sheet.jsondata)
				ws['!autofilter'] = { ref: `A1:L${response.data.length+1}` }
				let wb = XLSX.utils.book_new()
				wb.Props = {
					Title: "FG Inventory Template",
					Author: "Kay Singian"
				}
				XLSX.utils.book_append_sheet(wb, ws, "FG Inventory")
				let wbout = XLSX.write(wb, {type:"array", bookType:"xlsx"})
				saveAs(
					new Blob([wbout],
					{type:"application/octet-stream"}
				), "fg_inventory.xlsx")
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})

		}
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