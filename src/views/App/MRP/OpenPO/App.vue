<template>
	<div>
		<alert></alert>
		<div class="box">
			<div class="box-header with-border">
				<div class="box-title">Open PO Uploading</div>
			</div>
			<div class="box-body">
				<div class="col-md-3">
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
						<input type="submit" value="Generate Excel Template" class="btn btn-block btn-warning" @click="generateExcel()">
					</div>
				</div>
				<div class="col-md-12" v-if="importResult.length">
					<h4 v-if="importResult.length">Errors <span class="badge bg-red">{{ errorList }}</span></h4>
					<v-client-table :data="importResult" :options="tableOptions" :columns="tableColumns">
						<template slot="h__status_message" scope="props">Status</template>
						<template slot="h__material_no" scope="props">Material #</template>
						<template slot="h__material_name" scope="props">Material Name</template>
						<template slot="month" scope="props">
							<template v-if="props.row.month">{{ [props.row.month, 'MM/DD/YYYY'] | moment('MMMM YYYY') }}</template>
							<template v-else>{{ props.row.month }}</template>
						</template>
						<template slot="status_message" scope="props">
							<span class="text-success fa fa-check" v-if="props.row.status"></span>
							<ul class="list-unstyled" v-if="props.row.status == false" v-for="message in props.row.status_message">
								<li v-if="props.row.status == false"><span class="text-danger fa fa-close"></span> {{ message }}</li>
							</ul>
						</template>
					</v-client-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Alert from '../../../../components/layout/Alert.vue'
import { mapMutations, mapState } from 'vuex'
import DatePicker from 'vuejs-datepicker'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default {
	components: {
		Alert,
		DatePicker,
	},
	data() {
		return {
			inventoryLocations: [],
			form: {
				file: null,
				fileData: null,
			},
			importResult: [],
			tableOptions: {

			},
			tableColumns: ['material_no', 'material_name','month','qty','status_message'],
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
	},
	methods: {
		generateExcel() {
			let data = [{
				'MaterialID': '',
				'Qty': '',
				'PODate': ''
			}]
			let ws = XLSX.utils.json_to_sheet(data)
			let wb = XLSX.utils.book_new()
			wb.Props = {
				Title: "MRP Open PO Upload Template",
				Author: "Kay Singian"
			}
			XLSX.utils.book_append_sheet(wb, ws, "Open PO")
			let wbout = XLSX.write(wb, {type:"array", bookType:"xlsx"})
			saveAs(
				new Blob([wbout],
				{type:"application/octet-stream"}
			), "mrp_openpo_upload.xlsx")
		},
		verifyExcel(rows) {
		   let data = [
				...rows.reduce((map, item) => {
					let { MaterialID, PODate, Qty } = item
					let key = `${MaterialID}:${moment(PODate, 'M/D/YYYY').format('MMM/YYYY')}`
					let prev = map.get(key)
					if(prev) {
				  		prev.Qty += parseInt(Qty)
					} else {
				  		map.set(key, Object.assign({}, { MaterialID, PODate : moment(PODate, 'M/D/YYYY').format('MM/01/YYYY') , Qty: parseInt(Qty) } ))
					}
					return map
				}, new Map()).values()
			]
			axios.post('mrpopenpoimport?format=json', {
				division: this.auth.user.current_division,
				data: data
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
			axios.patch(`mrpopenpoimport/${this.auth.user.user_id}?format=json`, {
				data: this.importResult,
				division: this.auth.user.current_division
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message })
				this.processing = false
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error] })
				console.log(error)
				this.processing = false
			})
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
		beforeDestroy() {
			this.$store.dispatch('CLIENT_CLEAR')
			this.$store.dispatch('CLIENT_LINE_CLEAR')
			this.$store.commit('CLEAR_ALERT')
		}
	}
}
</script>