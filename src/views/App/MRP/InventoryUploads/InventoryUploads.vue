<template>
	<div>
		<alert></alert>
		<div class="box box-default">
			<div class="box-header with-border">
				<h3 class="box-title">Options</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				<div class="row">
					<form class="form-horizontal">
						<div class="col-md-4">
							<div class="form-group">
								<div class="col-md-4">
									<label for="inventory_location">Inventory Location</label>
								</div>
						 		<div class="col-md-8">
						 			<select name="inventory_location" class="form-control" v-model="form.inventoryLocation">
						 				<option :value="inventoryLocation" v-for="inventoryLocation in inventoryLocations">{{ inventoryLocation }}</option>
						 			</select>
						 		</div>
							</div>
						</div>
						<div class="col-md-4 col-md-offset-1">
							<div class="form-group">
								<div class="col-md-4">
									<label for="month">Month/Year</label>
								</div>
								<div class="col-md-8">
									<date-picker name="monthyear" v-model="form.monthyear" :bootstrapStyling="true" format="MMMM yyyy" input-class="not-readonly" :minimumView="'month'" :maximumView="'month'" :full-month-name="true" calendar-button-icon="fa fa-calendar" placeholder="Select Date"></date-picker>
								</div>
							</div>
						</div>
					</form>
				</div>
				<h3 class="title">Import/Export</h3>
				<div class="row">
					<div class="col-md-3" v-if="form.inventoryLocation && form.monthyear">
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
							<input type="submit" value="Generate Excel Template" :disabled="!(form.inventoryLocation && form.monthyear)" class="btn btn-block btn-warning" :class="{ 'disabled' :!((form.inventoryLocation) && form.monthyear) }" @click="generateExcel()">
						</div>
					</div>
				</div>
				<h4 v-if="importResult.length">Errors <span class="badge bg-red">{{ errorList }}</span></h4>
				<monthly-inventory-import-table v-if="importResult.length" :TableData="importResult"></monthly-inventory-import-table>
			</div>
		</div>
		<transition name="documentName" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
			<h3 class="title" v-if="form.inventoryLocation && form.monthyear">Records</h3>
		</transition>
		<transition name="documentWindow" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
			<div class="row" v-if="(form.inventoryLocation) && form.monthyear">
				<div class="col-md-8">
					<div class="box box-default">
						<div class="box-header with-border">
							<h3 class="box-title">Table</h3>
							<div class="box-tools pull-right">
								<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
							</div>
						</div>
						<div class="box-body">
							<monthly-inventory-table v-if="form.inventoryLocation && form.monthyear" :monthyear="form.monthyear" :location="form.inventoryLocation"></monthly-inventory-table>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<transition name="tableOption" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
						<inventory-upload-create v-if="client.table.type == 'create'"  :monthyear="form.monthyear" :location="form.inventoryLocation"></inventory-upload-create>
						<inventory-upload-update v-else-if="client.table.type == 'update' && client.table.id"></inventory-upload-update>
					</transition>
				</div>
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
import MonthlyInventoryImportTable from './MonthlyInventoryImportTable'
import MonthlyInventoryTable from './MonthlyInventoryTable'
import InventoryUploadCreate from './InventoryUploadCreate'
import InventoryUploadUpdate from './InventoryUploadUpdate'

export default {
	components: {
		Alert,
		DatePicker,
		MonthlyInventoryImportTable,
		MonthlyInventoryTable,
		InventoryUploadCreate,
		InventoryUploadUpdate
	},
	data() {
		return {
			inventoryLocations: [],
			form: {
				file: null,
				fileData: null,
				inventoryLocation: null,
				monthyear: null
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
	},
	created() {
		this.getInventoryLocations()
	},
	mounted() {
		this.$store.dispatch('CLIENT_CREATE')
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
		importResult(value) {
			let count = 0
			for(let [index, val] of value.entries()) {
				if(val.status === false) {
					count++
				}
			}
			this.errorList = count
		},
		'form.inventoryLocation'() {
			this.clearExcel()
		},
		'form.monthyear'() {
			this.clearExcel()
		}
	},
	methods: {
		generateExcel() {
			let data = [{
				'MaterialID': '',
				'Qty': ''
			}]
			let ws = XLSX.utils.json_to_sheet(data)
			let wb = XLSX.utils.book_new()
			wb.Props = {
				Title: "MRP Inventory Uploads Template",
				Author: "Kay Singian"
			}
			XLSX.utils.book_append_sheet(wb, ws, "Inventory")
			let wbout = XLSX.write(wb, {type:"array", bookType:"xlsx"})
			saveAs(
				new Blob([wbout],
				{type:"application/octet-stream"}
			), "mrp_inventory_uploads.xlsx")
		},
		verifyExcel(rows) {
			axios.post('mrpinventoryupload/verifyExcel?format=json', {
				data: rows,
				division: this.auth.user.current_division,
				location: this.form.inventoryLocation,
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
		uploadExcel() {
			this.processing = true
			axios.post('mrpinventoryupload/uploadExcel?format=json', {
				data: this.form.fileData,
				division: this.auth.user.current_division,
				location: this.form.inventoryLocation,
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
		clearExcel() {
			this.form.fileData = []
			this.form.file = null
			if(this.$refs.importInventoryUploads) {
				let inputFile = this.$refs.importInventoryUploads
				inputFile.type = 'text'
				inputFile.type = 'file'
			}
			this.processing = false
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
		getInventoryLocations() {
			axios.get('mrpinventoryupload/getInventoryLocations?format=json')
			.then(response => {
				this.inventoryLocations = response.data
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		}
	}
}
</script>

<style>
	input.not-readonly.form-control{
		background-color:#ffffff !important;
	}
</style>