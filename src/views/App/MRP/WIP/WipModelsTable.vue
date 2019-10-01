<template>
	<div>
		<div id="wip-models-table">
			<v-client-table :data="TableData" :columns="columns" :options="options" v-if="TableData">
				<template slot="id" scope="props">
					<a @click="setModelNumber(props.row.id)">{{ props.row.id }}</a>
				</template>
				<template slot="has_record" scope="props">
					<span class="text-success fa fa-check" v-if="props.row.has_record == true"></span>
					<span class="text-danger fa fa-times" v-else-if="props.row.has_record == false"></span>
				</template>
				<template slot="options" scope="props">
					<!-- <input type="button" class="btn btn-sm btn-success" value="Download Latest Wip" "> -->
					<button class="btn btn-sm btn-primary" @click="generateLatestWipData(props.row.id)">
						<i class="fa fa-download fa-fw"></i>Latest Wip
					</button>
				</template>
				<template slot="h__id" scope="props">
					<span>Model No.</span>
				</template>
				<template slot="h__name" scope="props">
					<span>Model Name</span>
				</template>
				<template slot="h__has_record" scope="props">
					<span>Is Recorded</span>
				</template>
			</v-client-table>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default {
	props:['division', 'divisionName','area','monthyear'],
	data() {
		return {
			columns: ['id','name','has_record', 'options'],
			TableData: [],
			options: {
				columnsClasses: {
					id: 'col-md-2 pointer',
					name: 'col-md-6',
					has_record:'col-md-2',
					options:'col-md-1',
				},
			},
			showMonthYear: null,
			showLocation: null,
			sheet: {
				jsondata:  []
			},
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
		tableStatus() {
			return this.client.table.status
		},
	},
	watch: {
		division() {
			this.getModels()
		},
		area() {
			this.getModels()
		},
		monthyear() {
			this.getModels()
		},
		tableStatus(value) {
			if(value === true) {
				this.getModels()
			}
		}
	},
	created() {
		this.getModels()
	},
	methods: {
		generateLatestWipData(model_id) {
			axios.get('wip/getLatestWipData', {
				params: {
					model_id: model_id,
					division: this.division,
					division_name: this.divisionName
				}
			})
			.then(response => {
				this.sheet.jsondata = response.data.data.map(item => (
					{
						wip_no : item.process_order,
						process_name : item.process_name
					}
				))

				let ws = XLSX.utils.json_to_sheet(this.sheet.jsondata)
				ws['!autofilter'] = { ref: `A1:L${response.data.length+1}` }
				let wb = XLSX.utils.book_new()
				wb.Props = {
					Title: "Latest Wip Record",
					Author: "Kay Singian"
				}
				// XLSX.utils.book_append_sheet(wb, ws, `wip_${response.data.model_id}_${response.data.model_name}`)
				XLSX.utils.book_append_sheet(wb, ws, `wip_${response.data.model_id}`)
				let wbout = XLSX.write(wb, {type:"array", bookType:"xlsx"})
				saveAs(
					new Blob([wbout],
					{type:"application/octet-stream"}
				), `wip_${response.data.model_id}.xlsx`)
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
				console.log(error)
			})
		},
		setModelNumber(id) {
			this.$store.dispatch('CLIENT_UPDATE_ID', id)
		},
		getModels() {
			axios.get('wip/?format=json',{
				params: {
					division: this.division,
					area: this.area,
					monthyear: this.monthyear
				}
			})
			.then(response => {
				this.TableData = response.data
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
				console.log(error)
			})
		}
	}
}
</script>

<style>
td.pointer {
	cursor: pointer;
}
</style>