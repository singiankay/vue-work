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
			</div>
		</div>
		<div class="box box-default">
			<div class="box-header with-border">
				<h3 class="title">MRP FG</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				<v-client-table :data="filteredFG" :columns="fgColumns" :options="fgOptions" v-if="fg.length">
				</v-client-table>
			</div>
		</div>
		<div class="box box-default">
			<div class="box-header with-border">
				<h3 class="title">MRP Materials</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				<v-client-table :data="filteredMaterials" :columns="rmColumns" :options="rmOptions" v-if="filteredMaterials.length">
					<template slot="qty_allocated" scope="props">{{ computeRMAllocation(props.row.material_no) }}</template>
					<template slot="lacking" scope="props">{{ Number(Math.round(computeRMQtyLacking(props.row.material_no)+'e'+6)+'e-'+6) }}</template>
				</v-client-table>
			</div>
		</div>
		<div class="box box-default">
			<div class="box-header with-border">
				<h3 class="title">Sales Orders</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				<v-client-table :data="so" :columns="soColumns" :options="soOptions" v-if="so.length">
					<template slot="production_id" scope="props">
						<template v-if="props.row.lacking > 0"><a @click="setUpdateID(props.row.production_id)">{{ props.row.production_id }}</a></template>
						<template v-else>{{ props.row.production_id }}</template>
					</template>
					<template slot="date" scope="props">
						<template v-if="props.row.date">{{ [props.row.date, 'MMMM, DD YYYY HH:mm:ss'] | moment('MMM DD, YYYY') }}</template>
						<template v-else>{{ props.row.date }}</template>
					</template>
					<template slot="status" scope="props">
						<template v-if="props.row.lacking > 0">
							<span class="text-teal fa fa-star" v-if="checkBOMStatus(props.row.production_id)"></span>
							<span class="text-danger fa fa-exclamation-triangle" v-else></span>
						</template>
					</template>
				</v-client-table>
			</div>
		</div>
		<transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }">
			<form @submit.prevent v-if="client.table.id">
				<div class="box box-default">
					<div class="box-header with-border">
						<h3 class="title">Sales Order Line</h3>
						<div class="box-tools pull-right">
							<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<p>Lacking: {{ getSOLacking(client.table.id) }}</p>
						<div class="form-group">
							<button type="submit" class="btn btn-primary" @click="saveAllocation()">Save</button>
							<button type="submit" class="btn bg-navy" @click="clearUpdateID()">Back</button>
						</div>
						<div class="table-responsive">
							<table class="table table-border table-responsive table-hover table-condensed">
								<thead>
									<tr>
										<th>#</th>
										<th>Process</th>
										<th colspan="3">
											<span class="label label-primary">BOM</span> / 
											<span class="label bg-maroon">Alternative</span> / 
											<span class="label label-success"> Yield</span> / 
											<span class="label bg-purple">Qty</span> 
										</th>
										<th>Allocated Qty</th>
										<th>Required</th>
										<th>Total Qty</th>
										<th>Lacking</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									<template v-for="(p, pIndex) in soModelBOMs.find(x => x.production_id == client.table.id).process">
										<tr>
											<td :rowspan="getBOMAltRows(p.bom)">{{ p.process_order }}</td>
											<td class="col-md-1" :rowspan="getBOMAltRows(p.bom)"><small>{{ p.process_name }}</small></td>
											<template v-if="p.bom.length == 0">
												<td colspan="9"></td>
											</template>
											<template v-else>
												<template v-for="(b, bIndex) in p.bom" v-if="bIndex == 0">
													<td :rowspan="getBOMRows(b)"><label class="label label-primary">{{ b.bom_item }}</label></td>
													<td>
														<div class="no-overflow">
															<label class="label label-default" :title="b.bom_name">{{ b.bom_name }}</label>
														</div>
													</td>
													<td>
														<label class="label label-success">{{ b.bom_yield }} %</label>
														<label class="label bg-purple">{{ b.bom_qty }}</label>
													</td>
													<td :rowspan="getBOMRows(b)">{{ b.alloc_qty }}</td>
													<td>{{ b.bom_req }}</td>
													<td :rowspan="getBOMRows(b)"><strong>{{ computeTotalQtyBOM(b) }}</strong></td>
													<td :rowspan="getBOMRows(b)">{{ Number(Math.round((b.bom_req - computeTotalQtyBOM(b))+'e'+6)+'e-'+6) }}</td>
													<td :rowspan="getBOMRows(b)">
														<span class="text-orange fa fa-star-half-full" v-if="b.bom_req - computeTotalQtyBOM(b) > 0"></span>
														<span class="text-teal fa fa-star" v-else-if="b.bom_req - computeTotalQtyBOM(b) == 0"></span>
														<span class="text-danger fa fa-warning" v-else></span>
													</td>
												</template>
											</template>
										</tr>
										<template v-for="(b, bIndex) in p.bom">
											<template v-for="(a, aIndex) in b.alt" v-if="bIndex == 0">
												<tr>
													<td colspan="2">
														<label class="label bg-maroon">{{ a.alt_item }}</label>
														<label class="label label-default label-overflow" :title="a.alt_name">{{ a.alt_name }}</label>
													</td>
													<input type="number" class="input-sm form-control" v-model.number="a.alloc_qty" v-on:blur="checkInput($event, client.table.id ,pIndex, bIndex, aIndex)">
												</tr>
											</template>
										</template>
										<template v-for="(b, bIndex) in p.bom">
											<template v-if="bIndex > 0">
												<tr>
													<td><label class="label label-primary">{{ b.bom_item }}</label></td>
													<td>
														<div class="no-overflow">
															<label class="label label-default" :title="b.bom_name">{{ b.bom_name }}</label>
														</div>
													</td>
													<td>
														<label class="label label-success">{{ b.bom_yield }} %</label>
														<label class="label bg-purple">{{ b.bom_qty }}</label>
													</td>
													<td :rowspan="getBOMRows(b)">{{ b.alloc_qty }}</td>
													<td>{{ b.bom_req }}</td>
													<td :rowspan="getBOMRows(b)"><strong>{{ computeTotalQtyBOM(b) }}</strong></td>
													<td :rowspan="getBOMRows(b)">{{ Number(Math.round((b.bom_req - computeTotalQtyBOM(b))+'e'+6)+'e-'+6) }}</td>
													<td :rowspan="getBOMRows(b)">
														<span class="text-orange fa fa-star-half-full" v-if="b.bom_req - computeTotalQtyBOM(b) > 0"></span>
														<span class="text-teal fa fa-star" v-else-if="b.bom_req - computeTotalQtyBOM(b) == 0"></span>
														<span class="text-danger fa fa-warning" v-else></span>
													</td>
												</tr>
											</template>
											<template v-for="(a, aIndex) in b.alt" v-if="bIndex > 0">
												<tr>
													<td></td>
													<td colspan="2">
														<label class="label bg-maroon">{{ a.alt_item }}</label>
														<label class="label label-default label-overflow" :title="a.alt_name">{{ a.alt_name }}</label>
													</td>
													<td><input type="number" class="input-sm form-control" v-model.number="a.alloc_qty" v-on:blur="checkInput($event, client.table.id ,pIndex, bIndex, aIndex)"></td>
													<!-- <td></td> -->
												</tr>
											</template>
										</template>
									</template>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</form>
		</transition>
	</div>
</template>

<script>
import Alert from '../../../../components/layout/Alert.vue'
import { mapMutations, mapState } from 'vuex'
import DatePicker from 'vuejs-datepicker'

export default {
	components: {
		Alert,
		DatePicker,
	},
	data() {
		return {
			form: {
				month: null,
				area: '',
			},
			materials: [],
			rmColumns: ['material_no','inventory_wh', 'inventory_intransit', 'inventory_pn', 'inventory_open_po', 'wip', 'total', 'qty_allocated', 'lacking'],
			rmOptions: {
				columnsClasses: {
					id: 'col-md-2 pointer',
					qty: 'col-md-2',
					date: 'col-md-2',
					remarks: 'col-md-3',
					encoded_by: 'col-md-3'
				},
				sortable: ['material_no', 'inventory_wh', 'inventory_intransit', 'inventory_pn', 'inventory_open_po', 'wip', 'total']
			},
			so: [],
			soColumns: ['production_id','model_no','model_name','date','so_no','so_line_id','remarks','qty','fg_allocation_qty','lacking','status'],
			soOptions: {
				columnsClasses: {
					production_id: 'col-md-1 pointer',
				},
				sortable: ['production_id', 'model_no', 'model_name', 'date', 'so_no', 'so_line_id', 'remarks', 'qty','fg_allocation_qty', 'lacking']
			},
			fg: [],
			fgColumns: ['model_no','model_name','qty','so_required','lacking'],
			fgOptions: {
				sortable: ['model_no', 'model_name', 'qty', 'so_required', 'lacking']
			},
			soModelBOMs: []
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
		filteredMaterials() {
			return this.materials.filter(mats => {
				if(mats.inventory_wh > 0 || mats.inventory_intransit > 0 || mats.inventory_pn > 0 || mats.inventory_open_po > 0 || mats.wip > 0 || this.computeRMQtyLacking(mats.material_no) > 0) {
					return mats
				}
			})
		},
		filteredFG() {
			return this.fg.filter(fg => {
				if(fg.qty > 0 || fg.so_required > 0 || fg.lacking > 0) {
					return fg
				}
			})
		}
	},
	watch: {
		'form.area'() {
			this.clearFields()
			if(this.form.month) {
				this.getMaterials()
			}
		},
		'form.month'() {
			if(this.form.area || this.form.area == 0) {
				this.clearFields()
				this.getMaterials()
			}
		}
	},
	mounted() {
		this.$store.dispatch('SET_ACTIVE_DIVISION',this.auth.user.current_division)
		.catch(error => {
			this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
		})
	},
	methods: {
		saveAllocation() {
			axios.patch(`mrpalternative/${this.client.table.id}`, {
				data: this.soModelBOMs.find(x => x.production_id == this.client.table.id),
				user_id: this.auth.user.user_id
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		setUpdateID(id) {
			this.$store.commit('SET_CLIENT_TABLE_ID', id)
		},
		clearUpdateID() {
			this.$store.dispatch('CLIENT_CLEAR')
		},
		clearFields() {
			this.materials = []
			this.so = []
			this.fg = []
			this.soModelBOMs = []
		},
		getMaterials() {
			axios.get('mrpmaterials/?format=json', {
				params: {
					division: this.auth.user.current_division,
					area: this.form.area,
				}
			})
			.then(response => {
				let result = response.data.map(item => ({
					material_no: item.ITEMCODE,
					material_name: item.ITEMNAME,
					item_groupcode: item.ITMSGRPCOD,
					inventory_wh: 0,
					inventory_intransit: 0,
					inventory_pn: 0,
					inventory_open_po: 0,
					wip: 0,
					total: 0
				}))
				this.materials = result
				this.getRMInventory()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		getRMInventory() {
			axios.get('mrpmaterials/getInventory?format=json', {
				params: {
					division: this.auth.user.current_division,
					area: this.form.area,
					month: this.form.month
				}
			})
			.then(response => {
				for(let result of response.data) {
					if(result.LOCATION == 'WH/IQC') {
						this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].inventory_wh += result.QTY
					}
					else if(result.LOCATION == 'InTransit') {
						this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].inventory_intransit += result.QTY
					}
					else if(result.LOCATION == 'Production') {
						this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].inventory_pn += result.QTY
					}
					else if(result.LOCATION == 'oPENpo') {
						this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].inventory_open_po += result.QTY
					}
				}
				this.getWip()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		getWip() {
			axios.get('mrprminventory/getWip?format=json', {
				params: {
					division: this.auth.user.current_division,
					area: this.form.area,
					monthyear: this.form.month
				}
			})
			.then(response => {
				for(let r of response.data) {
					for(let m of this.materials) {
						if(r.material_no.toString() == m.material_no.toString()) {
							m.wip += Number(Math.round(r.qty+'e'+6)+'e-'+6)
						}
					}
					
				}
				this.computeRMTotal()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		getProductionSchedule() {
			axios.get('mrpproductionschedule?format=json', {
				params: {
					division: this.auth.user.current_division,
					area: this.form.area,
					month: this.form.month
				}
			})
			.then(response => {
				this.so = response.data.map(item => ({
					so_no: item.so_no,
					so_line_id: item.so_line_id,
					production_id: item.production_id,
					date: item.date,
					model_no: item.model_no,
					model_name: item.model_name,
					qty: item.qty,
					remarks: item.remarks,
					fg_allocation_qty: 0,
					lacking: 0,
				}))
				this.getFGInventory()
			})
			.catch(error => {
				 this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				 console.log(error)
			})
		},
		getFGInventory() {
			axios.get('mrpfginventory/?format=json', {
				params: {
					division: this.auth.user.current_division,
					area: this.form.area,
					monthyear: this.form.month
				}
			})
			.then(response => {
				let result =  response.data.map(item => ({
					model_no: item.model_id,
					model_name: item.name,
					qty: item.qty,
					so_required: this.computeSOQtyRequired(item.model_id),
					lacking: this.computeSOLacking(item.model_id, item.qty)
				}))
				this.fg = result
				this.computeFGMRP()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
			})
		},
		getRMAllocation() {
			axios.get('mrpallocation/?format=json', {
				params: {
					division: this.auth.user.current_division,
					area: this.form.area,
					month: this.form.month
				}
			})
			.then(response => {
				let model = []
				let mDup = []

				for(let m of response.data) {
					if(mDup.indexOf(m.model_id) == -1) {
						model.push({
							model_id: m.model_id,
							model_no: m.model_no,
							process_rev: m.process_rev,
							bom_rev: m.bom_rev,
							process: []
						})
						mDup.push(m.model_id)
					}	
				}

				for(let m of model) {
					let px = []
					let pDup = []
					for(let d of response.data) {
						if(d.model_id == m.model_id) {
							if(pDup.indexOf(d.process_no) == -1) {
								px.push({
									process_order: d.process_order,
									process_no: d.process_no,
									process_name: d.process_name,
									process_yield: d.process_yield,
									bom: []
								})
							}
							pDup.push(d.process_no)
						}
					}
					m.process = px
				}
				
				for(let m of model) {
					for(let p of m.process) {
						let bx = []
						let bDup = []
						for(let d of response.data) {
							if(d.model_id == m.model_id) {
								if(d.process_no == p.process_no) {
									if(bDup.indexOf(d.bom_item) == -1 && d.bom_item) {
										bx.push({
											bom_item: d.bom_item,
											bom_name: d.bom_name,
											bom_code: d.bom_code,
											bom_yield: d.bom_yield,
											bom_qty: d.bom_qty,
											bom_req: 0,
											alloc_qty: 0,
											alt: []
										})
										bDup.push(d.bom_item)
									}
								}
							}
						}
						p.bom = bx
					}
				}

				for(let m of model) {
					for(let p of m.process) {
						for(let b of p.bom) {
							let ax = []
							let aDup = []
							for(let d of response.data) {
								if(d.model_id == m.model_id) {
									if(d.process_no == p.process_no) {
										if(d.bom_item == b.bom_item) {
											if(aDup.indexOf(d.alt_item) == -1 && d.alt_item) {
												ax.push({
													alt_item: d.alt_item,
													alt_name: d.alt_name,
													alt_code: d.alt_code,
													alt_type: d.alt_type,
													alloc_qty: 0
												})
												aDup.push(d.alt_item)
											}
										}
									}
								}
							}
							b.alt = ax
						}
					}
				}

				this.soModelBOMs = this.so.filter(x => x.lacking > 0).map(so => {
					let m = model.find(x => x.model_no == so.model_no)
					if(m) {
						return {
							production_id: so.production_id,
							...m,
							process: m.process.map(p => ({
								...p,
								bom: p.bom.map(b => ({
									...b,
									bom_req: Number(Math.round((b.bom_qty * so.lacking)+'e'+6)+'e-'+6),
									alloc_qty: 0
								}))
							}))
						}
					}
				})
				this.getAlternativeAllocations()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		getAlternativeAllocations() {
			axios.get('mrpalternative?format=json', {
				params: {
					division: this.auth.user.current_division,
					area: this.form.area,
					month: this.form.month
				}
			})
			.then(response => {
				for(let x of response.data) {
					for(let so of this.soModelBOMs) {
						if(x.PRODUCTION_SCHEDULE_ID == so.production_id) {
							for(let p of so.process) {
								if(x.PROCESS_ID == p.process_no) {
									for(let b of p.bom) {
										if(x.BOM_NO.toString() == b.bom_item.toString()) {
											for(let a of b.alt) {
												if(x.ALTERNATIVE_NO.toString() == a.alt_item.toString()) {
													a.alloc_qty = x.QTY
												}
											}
										}
										
									}
								}
								
							}
						}
					}
				}
				this.computeFGAllocation()		
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		computeFGAllocation() {
			for(let rm of this.materials) {
				let rmAllocated = 0
				let rmTotal = rm.total
				for(let so of this.soModelBOMs) {
					for(let p of so.process) {
						for(let b of p.bom) {
							if(rm.material_no.toString() == b.bom_item.toString()) {
								if(rmTotal > 0) {
									if(rmTotal >= b.bom_req - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
										b.alloc_qty += b.bom_req - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
										rmTotal -= b.bom_req - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
									}
									else {
										b.alloc_qty += rmTotal
										rmTotal -= rmTotal
									}
								}
							}
						}
					}
				}
			}
		},
		computeRMAllocation(item) {
			let rmAllocated = 0
			for(let so of this.soModelBOMs) {
				for(let p of so.process) {
					for(let b of p.bom) {
						if(b.bom_item.toString() == item.toString()) {
							rmAllocated += b.alloc_qty
						}
					}
				}
			}
			return rmAllocated
		},
		computeRMQtyLacking(item) {
			let lacking = 0
			for(let so of this.soModelBOMs) {
				for(let p of so.process) {
					for(let b of p.bom) {
						if(b.bom_item.toString() == item.toString()) {
							if(b.bom_req - this.computeTotalQtyBOM(b) > 0) {
								lacking += ((b.bom_req - this.computeTotalQtyBOM(b)) / b.bom_yield * 100)
							}
						}
					}
				}
			}
			return lacking
		},
		computeSOQtyRequired(model_no) {
			let sumRequired = this.so.reduce((x, so) => {
				if(so.model_no == model_no) {
					x += so.qty
				}
				return x
			} ,0)
			return sumRequired
		},
		computeSOLacking(model_no, qty) {
			let required = this.computeSOQtyRequired(model_no)
			if(required > qty) {
				return required - qty
			}
			else {
				return 0
			}
			 
		},
		computeFGMRP() {
			for(let fg of this.fg) {
				let fgQty = fg.qty
				for(let so of this.so) {
					if(so.model_no == fg.model_no) {
						if(so.qty < fgQty) {
							so.fg_allocation_qty = so.qty
							fgQty -= so.qty
						}
						else if(so.qty > fgQty) {
							so.fg_allocation_qty = fgQty
							fgQty -= fgQty
						}
					}
					if(so.qty > so.fg_allocation_qty) {
						so.lacking = so.qty - so.fg_allocation_qty
					}
				}
			}
			this.getRMAllocation()
		},
		computeRMTotal() {
			this.materials = this.materials.map(m => ({
				...m,
				total: m.inventory_intransit + m.inventory_pn + m.inventory_wh + m.inventory_open_po + m.wip 
			}))
			this.getProductionSchedule()
		},
		getBOMAltRows(bom) {
			let rows = 0
			for(let v of bom) {
				rows++
				for(let v2 of v.alt) {
					rows++
				}
			}
			return (rows == 0 ? 1 : rows)
		},
		getBOMRows(bom) {
			let rows = 1
			for(let v of bom.alt) {
				rows++
			}
			return rows
		},
		getSOLacking(id) {
			return this.so.find( x => x.production_id == id).lacking
		},
		computeTotalQtyBOM(b) {
			return b.alloc_qty + b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
		},
		checkBOMStatus(id) {
			let so = this.soModelBOMs.find(x => x.production_id == id)
			if(so) {
				for(let p of so.process) {
					for(let b of p.bom) {
						if(b.bom_req - this.computeTotalQtyBOM(b) != 0) {
							return false
						}
					}
				}
				return true
			}
			else {
				return false
			}
			
		},
		checkInput(value, production_id, process, bom, alt) {
			if(value.target.value.length == 0) {
				this.soModelBOMs[this.soModelBOMs.findIndex(so => so.production_id == production_id)].process[process].bom[bom].alt[alt].alloc_qty = 0
			}
			else {
				if(value.target.value < 0) {
					this.soModelBOMs[this.soModelBOMs.findIndex(so => so.production_id == production_id)].process[process].bom[bom].alt[alt].alloc_qty = 0
				}
			}
		}
	},
	beforeDestroy() {
		this.clearUpdateID()
		this.$store.commit('CLEAR_ALERT')
	}
}
</script>

<style>
	input.not-readonly.form-control{
		background-color:#ffffff !important;
	}
	td.pointer {
		cursor: pointer;
	}
	.no-overflow {
		overflow: hidden;
		max-width: 500px;
		margin-left: .3em;
		margin-right: .3em;
		word-wrap: break-word;
		text-overflow: ellipsis;
	}
</style>
