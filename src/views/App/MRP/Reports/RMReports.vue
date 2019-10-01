<template>
	<div>
		<div class="box box-danger">
			<div class="box-header with-border">
				<h3 class="box-title">Remaining FG</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				<v-client-table name="fgtable" :data="filteredFGInventoryData" :columns="fgInvColumns" :options="fgInvOptions" v-if="fgInventoryData">
				<!-- <v-client-table name="fgtable" :data="fgInventoryData" :columns="fgInvColumns" :options="fgInvOptions" v-if="fgInventoryData"> -->
					<template slot="name" scope="props">
						<small>{{ props.row.name }}</small>
					</template>
					<template slot="month_1" scope="props">{{ new Intl.NumberFormat().format(shipmentModelSumByMonth(monthyear,props.row.model_id, 0)) }}</template>
					<template slot="month_2" scope="props">{{ new Intl.NumberFormat().format(shipmentModelSumByMonth(monthyear,props.row.model_id, 1)) }}</template>
					<template slot="month_3" scope="props">{{ new Intl.NumberFormat().format(shipmentModelSumByMonth(monthyear,props.row.model_id, 2)) }}</template>
					<template slot="month_4" scope="props">{{ new Intl.NumberFormat().format(shipmentModelSumByMonth(monthyear,props.row.model_id, 3)) }}</template>
					<template slot="month_5" scope="props">{{ new Intl.NumberFormat().format(shipmentModelSumByMonth(monthyear,props.row.model_id, 4)) }}</template>
					<template slot="qty" scope="props">{{ new Intl.NumberFormat().format(props.row.qty) }}</template>
					<template slot="allocated_month_1" scope="props">{{ allocatedQty(monthyear, props.row.model_id, 0) }}</template>

					<template slot="projected_month_1" scope="props">
						<template v-if="shipmentModelSumByMonth(monthyear,props.row.model_id, 0) - allocatedQty(monthyear, props.row.model_id, 0) > 0">
							<label class="badge bg-red">
								{{  new Intl.NumberFormat().format(shipmentModelSumByMonth(monthyear,props.row.model_id, 0) - allocatedQty(monthyear, props.row.model_id, 0)) }}
							</label>
						</template>
						<template v-else>0</template>
					</template>
					<template slot="projected_month_2" scope="props">
						<template v-if="shipmentModelSumByMonth(monthyear, props.row.model_id, 1) == 0">0</template>
						<template v-else>
							<template v-if="props.row.qty - allocatedQty(monthyear, props.row.model_id, 0) < 0">
								<template v-if="(props.row.qty - allocatedQty(monthyear, props.row.model_id, 0)) - shipmentModelSumByMonth(monthyear, props.row.model_id, 1) >= 0">0</template>
								<template v-else>
									<label class="badge bg-red">
										{{ shipmentModelSumByMonth(monthyear, props.row.model_id, 1) - (props.row.qty - allocatedQty(monthyear, props.row.model_id, 0)) }}
									</label>
								</template>
							</template>
							<template v-else>
								<label class="badge bg-red">
									{{ shipmentModelSumByMonth(monthyear,props.row.model_id, 1) }}
								</label>
							</template>
						</template>
					</template>
					<template slot="projected_month_3" scope="props">
						<template v-if="shipmentModelSumByMonth(monthyear, props.row.model_id, 2) == 0">0</template>
						<template v-else>
							<template v-if="(shipmentModelSumByMonth(monthyear, props.row.model_id, 1)) - (props.row.qty - allocatedQty(monthyear, props.row.model_id, 0)) < 0">
								<template v-if="(props.row.qty - allocatedQty(monthyear, props.row.model_id, 0)) - (shipmentModelSumByMonth(monthyear, props.row.model_id, 2) + shipmentModelSumByMonth(monthyear, props.row.model_id, 1)) >= 0">0</template>
								<template v-else>
									<label class="badge bg-red">
										{{ (shipmentModelSumByMonth(monthyear, props.row.model_id, 2) + shipmentModelSumByMonth(monthyear, props.row.model_id, 1)) - (props.row.qty - allocatedQty(monthyear, props.row.model_id, 0)) }}
									</label>
								</template>
							</template>
							<template v-else>
								<label class="badge bg-red">
									{{ shipmentModelSumByMonth(monthyear,props.row.model_id, 2) }}
								</label>
							</template>
						</template>
					</template>
					<template slot="projected_month_4" scope="props">
						<template v-if="shipmentModelSumByMonth(monthyear, props.row.model_id, 3) == 0">0</template>
						<template v-else>
							<template v-if="(shipmentModelSumByMonth(monthyear, props.row.model_id, 2) + shipmentModelSumByMonth(monthyear, props.row.model_id, 1)) - (props.row.qty - allocatedQty(monthyear, props.row.model_id, 0)) < 0">
								<template v-if="(props.row.qty - allocatedQty(monthyear, props.row.model_id, 0)) - (shipmentModelSumByMonth(monthyear, props.row.model_id, 3) + shipmentModelSumByMonth(monthyear, props.row.model_id, 2) + shipmentModelSumByMonth(monthyear, props.row.model_id, 1)) >= 0">0</template>
								<template v-else>
									<label class="badge bg-red">
										{{ (shipmentModelSumByMonth(monthyear, props.row.model_id, 3) + shipmentModelSumByMonth(monthyear, props.row.model_id, 2) + shipmentModelSumByMonth(monthyear, props.row.model_id, 1)) - (props.row.qty - allocatedQty(monthyear, props.row.model_id, 0)) }}
									</label>
								</template>
							</template>
							<template v-else>
								<label class="badge bg-red">
									{{ shipmentModelSumByMonth(monthyear,props.row.model_id, 3) }}
								</label>
							</template>
						</template>
					</template>
					<template slot="projected_month_5" scope="props">
						<template v-if="shipmentModelSumByMonth(monthyear, props.row.model_id, 4) == 0">0</template>
						<template v-else>
							<template v-if="(shipmentModelSumByMonth(monthyear, props.row.model_id, 3) + shipmentModelSumByMonth(monthyear, props.row.model_id, 2) + shipmentModelSumByMonth(monthyear, props.row.model_id, 1)) - (props.row.qty - allocatedQty(monthyear, props.row.model_id, 0)) < 0">
								<template v-if="(props.row.qty - allocatedQty(monthyear, props.row.model_id, 0)) - (shipmentModelSumByMonth(monthyear, props.row.model_id, 4) + shipmentModelSumByMonth(monthyear, props.row.model_id, 3) + shipmentModelSumByMonth(monthyear, props.row.model_id, 2) + shipmentModelSumByMonth(monthyear, props.row.model_id, 1)) >= 0">0</template>
								<template v-else>
									<label class="badge bg-red">
										{{ (shipmentModelSumByMonth(monthyear, props.row.model_id, 4) + shipmentModelSumByMonth(monthyear, props.row.model_id, 3) + shipmentModelSumByMonth(monthyear, props.row.model_id, 2) + shipmentModelSumByMonth(monthyear, props.row.model_id, 1)) - (props.row.qty - allocatedQty(monthyear, props.row.model_id, 0)) }}
									</label>
								</template>
							</template>
							<template v-else>
								<label class="badge bg-red">
									{{ shipmentModelSumByMonth(monthyear,props.row.model_id, 4) }}
								</label>
							</template>
						</template>
					</template>
					<template slot="h__model_id" scope="props"><small>Model #</small></template>
					<template slot="h__name" scope="props"><small>Model Name</small></template>
					<template slot="h__qty" scope="props">Current Inventory <br /> ({{ monthyear | moment("MMMM") }})</template>
					<template slot="h__allocated_month_1" scope="props">Current Month <br />Allocated</template>
					<template slot="h__projected_month_1" scope="props">Lacking</template>
					<template slot="h__month_1" scope="props">SO <br />{{ monthyear | moment("MMMM") }}</template>
					<template slot="h__month_2" scope="props">SO <br />{{ monthyear | moment("add","1 months", "MMMM") }}</template>
					<template slot="h__projected_month_2" scope="props">Projected</template>
					<template slot="h__month_3" scope="props">SO <br />{{ monthyear | moment("add","2 months", "MMMM") }}</template>
					<template slot="h__projected_month_3" scope="props">Projected</template>
					<template slot="h__month_4" scope="props">SO <br />{{ monthyear | moment("add","3 months", "MMMM") }}</template>
					<template slot="h__projected_month_4" scope="props">Projected</template>
					<template slot="h__month_5" scope="props">SO <br />{{ monthyear | moment("add","4 months", "MMMM") }}</template>
					<template slot="h__projected_month_5" scope="props">Projected</template>
				</v-client-table>
			</div>
		</div>

		<div class="box box-info" v-if="">
			<div class="box-header with-border">
				<h3 class="box-title">RM Reports</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				<div class="row">
					<div class="col-md-2">
						<label>Filter By Material Type</label>
						<div class="form-group">
							<select name="filter_by" v-model="materialType" v-if="materialTypes.length" class="form-control">
								<option :value="type.type" v-for="(type, index) in materialTypes" v-if="type.type != 'Finished Goods'">{{ type.type }}</option>
							</select>
						</div>
					</div>
				</div>
				<v-client-table name="rmtable" :data="rmInventoryData" :columns="rmColumns" :options="rmOptions" v-if="rmInventoryData.length">
					<template slot="total_qty" scope="props">{{ rmInventoryTotalQty(props.row).toFixed(6) % 1 != 0 ?  rmInventoryTotalQty(props.row).toFixed(6) : rmInventoryTotalQty(props.row) }}</template>
					<template slot="month_1" scope="props">{{ (rmTotalInventoryLackingYield(props.row.material_no, 0).toFixed(6) == 0 ? 0 : rmTotalInventoryLackingYield(props.row.material_no, 0).toFixed(6)) }}</template>
					<template slot="month_2" scope="props">{{ (rmTotalInventoryLackingYield(props.row.material_no, 1).toFixed(6) == 0 ? 0 : rmTotalInventoryLackingYield(props.row.material_no, 1).toFixed(6)) }}</template>
					<template slot="month_3" scope="props">{{ (rmTotalInventoryLackingYield(props.row.material_no, 2).toFixed(6) == 0 ? 0 : rmTotalInventoryLackingYield(props.row.material_no, 2).toFixed(6)) }}</template>
					<template slot="month_4" scope="props">{{ (rmTotalInventoryLackingYield(props.row.material_no, 3).toFixed(6) == 0 ? 0 : rmTotalInventoryLackingYield(props.row.material_no, 3).toFixed(6)) }}</template>
					<template slot="month_5" scope="props">{{ (rmTotalInventoryLackingYield(props.row.material_no, 4).toFixed(6) == 0 ? 0 : rmTotalInventoryLackingYield(props.row.material_no, 4).toFixed(6)) }}</template>
					<template slot="h__month_1" scope="props">{{ monthyear | moment("MMMM") }}</template>
					<template slot="h__month_2" scope="props">{{ monthyear | moment("add","1 months", "MMMM") }}</template>
					<template slot="h__month_3" scope="props">{{ monthyear | moment("add","2 months", "MMMM") }}</template>
					<template slot="h__month_4" scope="props">{{ monthyear | moment("add","3 months", "MMMM") }}</template>
					<template slot="h__month_5" scope="props">{{ monthyear | moment("add","4 months", "MMMM") }}</template>
				</v-client-table>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { Event } from 'vue-tables-2'

export default {
	props: ['division','area','monthyear'],
	components: {

	},
	data() {
		return {
			materialTypes: [],
			materialType: '',
			shipmentData: [],
			fgInventoryData: [],
			fgInvColumns: ['model_id', 'name', 'qty', 'month_1', 'allocated_month_1', 'projected_month_1', 'month_2', 'projected_month_2', 'month_3', 'projected_month_3', 'month_4', 'projected_month_4', 'month_5', 'projected_month_5'],
			fgInvOptions: {
				columnsClasses: {
					// model_id: 'bg-primary disabled',
					// name: 'bg-maroon disabled',
					// qty: 'bg-blue disabled',
					month_1: 'bg-gray',
					month_2: 'bg-gray',
					month_3: 'bg-gray',
					month_4: 'bg-gray',
					month_5: 'bg-gray',
				},
				sortable: ['model_id', 'name', 'qty']
			},
			rmShipmentCurrent: [],
			rmShipmentProjected: [],
			productionScheduleData: [],
			wip: [],
			sapPO: [],
			rmInventoryData: [],
			rmAdditionalInfo: [],
			// rmColumns: ['material_no', 'material_name', 'moq', 'min_stock_qty', 'lead_time', 'total_qty', 'month_1', 'month_2', 'month_3', 'month_4', 'month_5'],
			rmColumns: ['material_no', 'material_name', 'total_qty', 'month_1', 'month_2', 'month_3', 'month_4', 'month_5'],
			rmOptions: {
				customFilters: [{ 
					name: 'mt', 
					callback(row, types) {
						return types.code.includes(row.material_group)
					}
				}],
				sortable: ['material_no', 'material_name', 'moq', 'min_stock_qty', 'lead_time']
			}
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
		uniqueShipmentData() {
			return [...(new Set(this.shipmentData.map(({ model_id }) => model_id)))]
		},
		filteredFGInventoryData() {
			return this.fgInventoryData.filter((obj) => {
				return this.uniqueShipmentData.find((arr) => arr == obj.model_id )
			})
		},
	},
	watch: {
		division() {
			this.resetWindow()
		},
		area() {
			this.resetWindow()
		},
		monthyear() {
			this.resetWindow()
		},
		materialType(value) {
			if(this.rmShipmentCurrent.length) {
				Event.$emit('vue-tables.rmtable.filter::mt', this.materialTypes.find(q => q.type == value))
			}
		} 
	},
	created() {
		this.startUp()
	},
	mounted() {

	},
	methods: {
		resetWindow() {
			this.clearAll()
			this.startUp()
		},
		clearAll() {
			this.shipmentData = []
			this.fgInventoryData = []
			this.rmShipmentCurrent = []
			this.rmShipmentProjected = []
			this.productionScheduleData = []
			this.wip = []
			this.sapPO = []
			this.rmInventoryData = []
			this.rmAdditionalInfo = []
		},
		startUp() {
			this.getMaterialTypes()
			this.getShipments()
			this.getFGInventoryData()
		},
		getMaterialTypes() {
			axios.get('mrprminventory/getMaterialTypes?format=json', {
				params: {
					division: this.division
				}
			})
			.then(response => {
				this.materialTypes = response.data.sort((a,b) => b.type < a.type)
				this.materialType = "All"
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		getShipments() {
			axios.get('mrpallocation/getFiveMonthShipments?format=json',{
				params: {
					division: this.division,
					area: this.area,
					monthyear: this.monthyear
				}
			})
			.then(response => {
				let shipmentArray = []
				for([index, value] of response.data.entries()) {
					shipmentArray.push({
						line_id: value.id,
						so_id: value.so_id,
						model_id: value.model_id,
						model_name: value.model_name,
						requested_delivery_date: value.requested_delivery_date,
						confirmed_date: value.confirmed_date,
						production_date: value.production_date,
						qty: value.qty,
						// month_1: ( moment(value.production_date, 'MMMM, DD YYYY hh:mm:ss').format('MM-YYYY') == moment(this.monthyear).format('MM-YYYY')  ? value.qty : 0),
						// month_2: ( moment(value.production_date, 'MMMM, DD YYYY hh:mm:ss').format('MM-YYYY') == moment(this.monthyear).add(1, 'months').format('MM-YYYY')  ? value.qty : 0),
						// month_3: ( moment(value.production_date, 'MMMM, DD YYYY hh:mm:ss').format('MM-YYYY') == moment(this.monthyear).add(2, 'months').format('MM-YYYY')  ? value.qty : 0),
						// month_4: ( moment(value.production_date, 'MMMM, DD YYYY hh:mm:ss').format('MM-YYYY') == moment(this.monthyear).add(3, 'months').format('MM-YYYY')  ? value.qty : 0),
						// month_5: ( moment(value.production_date, 'MMMM, DD YYYY hh:mm:ss').format('MM-YYYY') == moment(this.monthyear).add(4, 'months').format('MM-YYYY')  ? value.qty : 0),
						fg_qty: 0,
						has_record: false,
						stock_id: null
					})
				}
				this.shipmentData = shipmentArray
				this.getFGStockQty()
				this.getRMStockQty()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		shipmentModelSumByMonth(monthyear, model, increment) {
			if(increment ==0) {
				return this.shipmentData.filter(r => r.model_id == model && moment(r.production_date, 'MMMM, DD YYYY hh:mm:ss').format('MM-YYYY') == moment(monthyear).format('MM-YYYY')).reduce((sum, r) => sum + r.qty, 0)
			}
			else {
				return this.shipmentData.filter(r => r.model_id == model && moment(r.production_date, 'MMMM, DD YYYY hh:mm:ss').format('MM-YYYY') == moment(monthyear).add(increment, 'months').format('MM-YYYY')).reduce((sum, r) => sum + r.qty, 0)
			}
		},
		allocatedQty(monthyear, model, increment) {
			if(increment ==0) {
				return this.shipmentData.filter(r => r.model_id == model && moment(r.production_date, 'MMMM, DD YYYY hh:mm:ss').format('MM-YYYY') == moment(monthyear).format('MM-YYYY')).reduce((sum, r) => sum + r.fg_qty, 0)
			}
			else {
				return this.shipmentData.filter(r => r.model_id == model && moment(r.production_date, 'MMMM, DD YYYY hh:mm:ss').format('MM-YYYY') == moment(monthyear).add(increment, 'months').format('MM-YYYY')).reduce((sum, r) => sum + r.fg_qty, 0)
			}
		},
		remainingQty(qty, allocatedQty) {
			return qty - allocatedQty
		},
		getFGInventoryData() {
			axios.get('mrpfginventory/?format=json', {
				params: {
					division: this.division,
					area: this.area,
					monthyear: this.monthyear
				}
			})
			.then(response => {
				this.fgInventoryData = response.data
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      })
		},
		getFGStockQty() {
			axios.get('mrpfgstock/?format=json',{
				params: {
					division: this.division,
					area: this.area,
					monthyear: this.monthyear
				}
			})
			.then(response => {
				let tempData = []
				for(let [i,v] of this.shipmentData.entries()) {
					let isData = false
					for(let [index, value] of response.data.entries()) {
						if(value.SO_LINE_ID == v.line_id) {
							this.shipmentData[i].fg_qty = value.FG_QTY
							this.shipmentData[i].stock_id = value.ID
							this.shipmentData[i].has_record = true
							isData = true
						}
					}
					if(!isData) {
						this.shipmentData[i].fg_qty = 0
						this.shipmentData[i].stock_id = null
						this.shipmentData[i].has_record = false
					}
				}
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		getRMStockQty() {
			axios.get('mrprmstock/?format=json', {
				params: {
					division: this.division,
					area: this.area,
					monthyear: this.monthyear
				}
			})
			.then(response => {
				if(response.data.status == "success") {
					this.rmShipmentCurrent = response.data.rows
					this.getRMProjectedQty()
				}
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      })
		},
		getRMProjectedQty() {
			axios.get('mrprmstock/getProjectedShipmentBoms?format=json', {
				params: {
					division: this.division,
					area: this.area,
					monthyear: this.monthyear
				}
			})
			.then(response => {
				if(response.data.status == "success") {
					this.rmShipmentProjected = response.data.rows
					this.getRMInventoryData()
				}
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		getRMInventoryData() {
			axios.get('mrprmInventory/?format=json', {
				params: {
					division: this.division,
					area: this.area,
					monthyear: this.monthyear
				}
			})
			.then(response => {
				this.productionScheduleData = response.data
				this.getRMWipData()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		getRMWipData() {
			axios.get('mrprminventory/getWip?format=json', {
				params: {
					division: this.division,
					area: this.area,
					monthyear: this.monthyear
				}
			})
			.then(response => {
				this.wip = [ ...response.data.reduce((map, item) => {
						let { material_no: key, qty } = item
						let prev = map.get(key)
						if(prev) 
							prev.qty += qty
						else 
							map.set(key, Object.assign({}, item))
						return map
					}, new Map()).values()
				]
				this.getRMStocks()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      })
		},
		getRMStocks() {
			axios.get('mrprminventory/getRMStocks?format=json', {
				params: {
					division: this.division,
					area: this.area,
					monthyear: this.monthyear
				}
			})
			.then(response => {
				let result = Object.values(response.data.reduce((r,{ PO_NO, PO_LINE_NO, MATERIAL_NO, MATERIAL_NAME, MATERIAL_GROUP, PO_QTY, GRPO_QTY, GRPO_SHIPDATE }, index, array) => {
					r[PO_NO] = r[PO_NO] || { po_no: PO_NO, lines: [] }
					r[PO_NO].lines.push({ po_line_no: PO_LINE_NO, po_qty: PO_QTY, material_no: MATERIAL_NO, material_name: MATERIAL_NAME, material_group: MATERIAL_GROUP, grpo_qty: GRPO_QTY, grpo_shipdate: GRPO_SHIPDATE })
					return r
				},{}))
				
				const matchLine = (a, b) =>
				  a.line_no === b.line_no
				    && a.po_qty === b.po_qty
				    && a.material_no === b.material_no
				    
				const combineLine = ({ grpo_shipdate:_, ...a }, b) =>
				  ({ ...a, grpo_qty: a.grpo_qty + b.grpo_qty })

				const groupPoLines = ({ lines, ...po }) => ({
				  ...po,
				  lines: lines.reduce ((r, x) => {
				      const i = r.findIndex (y => matchLine (x, y))
				      if (i < 0)
				        return [ ...r, x ]
				      else
				        return Object.assign (r, { [i]: combineLine (r[i], x)})
				    }, [])
				})
				this.sapPO = result.map(po => groupPoLines(po))
				this.computeRMInventory()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      })
		},
		computeRMInventory() {
			let rmShipmentArray = []

			for(let [index, value] of this.rmShipmentCurrent.entries()) {
				for(let [pIndex, pValue] of value.process.entries()) {
					for(let [bIndex, bValue] of pValue.bom.entries()) {
							rmShipmentArray.push({
								material_no: String(bValue.item),
								material_name: bValue.name,
								material_group: bValue.group
							})
						for(let [aIndex, aValue] of bValue.alternative.entries()) {
							rmShipmentArray.push({
								material_no: String(aValue.item),
								material_name: aValue.name,
								material_group: aValue.group
							})
						}
					}
				}
			}

			let sapPOArray = []
			for(let value of this.sapPO) {
				let x = Object.values(value.lines.reduce((r,{ material_no, material_name, material_group }) => {
					r[material_no] = r[material_no] || { material_no: String(material_no), material_name, material_group }
					return r
				},{}))
				sapPOArray = sapPOArray.concat(x)
			}

			let materialsArray = Object.values(this.productionScheduleData.reduce((r, {material_id, material_name, material_group }) => {
				r[material_id] = r[material_id] || { material_no: String(material_id), material_name, material_group }
				return r
			}, {}))

			let wipArray = Object.values(this.wip.reduce((r, {material_no, material_name, material_group }) => {
				r[material_no] = r[material_no] || { material_no: String(material_no), material_name, material_group }
				return r
			}, {}))

			let materialsConcat = rmShipmentArray.concat(sapPOArray, materialsArray, wipArray)

			let materials =  [ ...materialsConcat.reduce((map, item) => {
					let { material_no: key, material_name, material_group } = item
					let prev = map.get(key)
					if(prev) {
						prev.material_name = material_name
						prev.material_group = material_group
					}
					else 
						map.set(key, Object.assign({}, item))
					return map
				}, new Map()).values()
			]

			for(let [index,value] of materials.entries()) {
				let production = 0
				let wh_iqc = 0 
				let intransit = 0
				let wip = 0
				let open_po = 0
				let grpo = 0

				for(let [psdIndex, psdValue] of this.productionScheduleData.entries()) {
					if(psdValue.material_id == value.material_no) {
						switch(psdValue.location) {
							case "Production": 
								production += psdValue.qty
							break
							case "InTransit":
								intransit += psdValue.qty 
							break
							case "WH/IQC": 
								wh_iqc += psdValue.qty 
							break
						}
					}
				}

				for(let [wipIndex, wipValue] of this.wip.entries() ) {
					if(wipValue.material_no == value.material_no) {
						wip += wipValue.qty
					}
				}

				for(let [sapIndex, sapValue] of this.sapPO.entries()) {
					for(let [lIndex, lValue] of sapValue.lines.entries()) {
						if(lValue.material_no == value.material_no) {
							open_po += lValue.po_qty
							grpo +=  lValue.grpo_qty
						}
					}
				}
				
				this.rmInventoryData.push({
					material_no: value.material_no,
					material_name: value.material_name,
					material_group: value.material_group,
					production: production,
					intransit: intransit,
					wh_iqc: wh_iqc,
					wip: wip,
					open_po: open_po,
					grpo: grpo
				})
				this.getRMAdditionalInfo(Object.values(this.rmInventoryData.reduce((r, {material_no }) => {
					r[material_no] = r[material_no] || String(material_no)
					return r
				}, {})))
			}
		},
		rmInventoryTotalQty(row) {
			return row.production + row.wh_iqc + row.intransit + row.wip + row.open_po + row.grpo
		},
		rmTotalInventoryLackingYield(material_no, increment) {
			let lacking = 0
			let modelsHasMaterial = []
			
			if(increment == 0) {
				for(let fg of this.shipmentData) {
					let line_id = fg.line_id
					let fgLacking = fg.qty - fg.fg_qty
					for(let rm of this.rmShipmentCurrent) {
						if(rm.so_line_id == line_id) {
							for(let p of rm.process) {
								for(let b of p.bom) {
									if(b.item == material_no) {
										let item = 0
										for(let a of b.alternative) {
											item += a.stock
										}
										lacking += ((b.quantity * fgLacking) - (b.stock + item)) / (b.yield / 100)
									}
								}
							}
						}
					}
				}
			}
			else {
				for(let m of this.rmShipmentProjected) {
					for(let p of m.process) {
						for(let b of p.bom) {
							if(b.item == material_no) {
								modelsHasMaterial.push(m.model_no)
							}
						}
					}
				}

				let uniqueModels = [...(new Set(modelsHasMaterial))]

				for(let uniqueModel of uniqueModels) {
					let modelLacking = 0
					let fgInventory = this.fgInventoryData.find(x => x.model_id == uniqueModel)

					switch(increment) {
						case 1:
							if(this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 1) == 0) {
								modelLacking = 0
							}
							else {
								if(fgInventory.qty - this.allocatedQty(this.monthyear, uniqueModel, 0) < 0) {
									if((fgInventory.qty - this.allocatedQty(this.monthyear, uniqueModel, 0)) - this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 1) >= 0) { 
											modelLacking = 0
									}
									else {
										modelLacking = this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 1) - (fgInventory.qty - this.allocatedQty(this.monthyear, uniqueModel, 0))
									}
								}
								else {
									modelLacking = this.shipmentModelSumByMonth(this.monthyear,uniqueModel, 1)
								}
							}
						break;
						case 2: 
							if(this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 2) == 0) {
								modelLacking = 0
							}
							else {
								if((this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 1)) - (fgInventory.qty - this.allocatedQty(this.monthyear, uniqueModel, 0)) < 0) {
									if((fgInventory.qty - this.allocatedQty(this.monthyear, uniqueModel, 0)) - (this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 2) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 1)) >= 0) {
										modelLacking = 0
									}
									else {
										modelLacking = (this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 2) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 1)) - (fgInventory.qty - this.allocatedQty(this.monthyear, uniqueModel, 0))
									}
								}
								else {
									modelLacking = this.shipmentModelSumByMonth(this.monthyear,uniqueModel, 2)
								}
							}
						break;
						case 3:
							if(this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 3) == 0) {
								modelLacking = 0
							}
							else {
								if((this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 2) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 1)) - (fgInventory.qty - this.allocatedQty(this.monthyear, uniqueModel, 0)) < 0) {
									if((fgInventory.qty - this.allocatedQty(this.monthyear, uniqueModel, 0)) - (this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 3) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 2) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 1)) >= 0) {
										modelLacking = 0
									}
									else {
										modelLacking = this.shipmentModelSumByMonth(this.monthyear,uniqueModel, 3)
									}
								}
								else {
									modelLacking = this.shipmentModelSumByMonth(this.monthyear,uniqueModel, 3)
								}
							}
						break;
						case 4: 
							if(this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 4) == 0) {
								modelLacking = 0
							}
							else {
								if((this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 3) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 2) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 1)) - (fgInventory.qty - this.allocatedQty(this.monthyear, uniqueModel, 0)) < 0) {
									if((fgInventory.qty - this.allocatedQty(this.monthyear, uniqueModel, 0)) - (this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 4) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 3) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 2) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 1)) >= 0) {
										modelLacking = 0
									}
									else {
										modelLacking = (this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 4) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 3) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 2) + this.shipmentModelSumByMonth(this.monthyear, uniqueModel, 1)) - (fgInventory.qty - this.allocatedQty(this.monthyear, uniqueModel, 0))
									}
								}
								else {
									modelLacking = this.shipmentModelSumByMonth(this.monthyear,uniqueModel, 4)
								}
							}
						break;
					}

					for(let p of this.rmShipmentProjected.find(x => x.model_no == uniqueModel).process) {
						for(let b of p.bom) {
							if(b.item == material_no) {
								lacking += (b.quantity * modelLacking) / (b.yield / 100)
							}
						}
					}
				}

			}
			return lacking
		},
		getRMAdditionalInfo(materialArray) {
			// axios.get('', {
			// 	params: {

			// 	}
			// })
			// .then(response => {

			// })
			// .catch(error => {
			// 	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
			// 	console.log(error)
			// })
		}
	}
}
</script>