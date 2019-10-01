<template>
	<div>
		<transition name="documentName" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
			<h3 class="title">FG Allocation</h3>
		</transition>
		<transition name="documentWindow" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
			<div class="row">
				<div class="col-md-5">
					<div class="box box-primary">
						<div class="box-header with-border">
							<h3 class="box-title">FG Inventory</h3>
							<div class="box-tools pull-right">
								<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
							</div>
						</div>
						<div class="box-body">
							<v-client-table name="fgtable" :data="filteredFGInventoryData" :columns="fgInvColumns" :options="fgInvOptions" v-if="fgInventoryData">
								<template slot="name" scope="props">
									<small>{{ props.row.name }}</small>
								</template>
								<template slot="qty" scope="props">
									<small>{{ new Intl.NumberFormat().format(props.row.qty) }}</small>
								</template>
								<template slot="allocated_qty" scope="props">
									<small>{{ new Intl.NumberFormat().format(allocatedQty(props.row.model_id)) }}</small>
								</template>
								<template slot="remaining_qty" scope="props">
									<small>{{ new Intl.NumberFormat().format(remainingQty(props.row.qty, allocatedQty(props.row.model_id))) }}</small>
								</template>
								<template slot="status" scope="props">
									<span v-if="remainingQty(props.row.qty, allocatedQty(props.row.model_id)) > 0" class="text-teal fa fa-thumbs-up" title="In Stock"></span>
									<span v-else-if="remainingQty(props.row.qty, allocatedQty(props.row.model_id)) == 0" class="text-purple fa fa-circle-o" title="Empty"></span>
									<span v-else class="text-maroon fa fa-warning" title="Over Allocated"></span>
								</template>
								<template slot="h__model_id" scope="props">
									<small>Model #</small>
								</template>
								<template slot="h__name" scope="props">
									<small>Model Name</small>
								</template>
								<template slot="h__qty" scope="props">
									<small>FG Qty</small>
								</template>
								<template slot="h__allocated_qty" scope="props">
									<small>Allocated</small>
								</template>
								<template slot="h__remaining_qty" scope="props">
									<small>Remaining</small>
								</template>
								<template slot="h__status" scope="props">
									<small>Status</small>
								</template>
							</v-client-table>
						</div>
					</div>
				</div>
				<div class="col-md-7">
					<div class="box box-default">
						<div class="box-header with-border">
							<div class="box-header with-border">
								<h3 class="box-title">Allocation</h3>
								<div class="box-tools pull-right">
									<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
								</div>
							</div>
						</div>
						<div class="box-body">
							<div class="col-md-12">
								<div class="form-group">
									<label for="generate_allocations">Options</label>
									<div class="row">
										<div class="col-md-12">
											<input type="button" class="btn bg-maroon" name="generate_allocations" value="Generate FG Allocations" @click="generateFGAllocations()">
											<input type="button" class="btn bg-purple" name="generate_allocations" value="Reset Data" @click="resetWindow()">
											<input type="button" class="btn bg-olive" name="generate_allocations" value="Save FG Qty Records" @click="saveFG()">
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-12">
								<v-client-table name="shipmenttable" :data="shipmentData" :columns="shipmentColumns" :options="shipmentOptions" v-if="shipmentData">
									<template slot="so_no" scope="props">
										<span class="badge bg-aqua" v-if="props.row.line_id == client.table.id">
											{{ props.row.so_no }}
										</span>
										<template v-else>
											{{ props.row.so_no }}
										</template>
									</template>
									<template slot="model_id" scope="props">
										<a @click="setUpdateID(props.row.line_id)" v-if="rmShipment.length">{{ props.row.model_id }}</a>
										<template v-else>{{ props.row.model_id }}</template>
									</template>
									<template slot="model_name" scope="props">
										<small>{{ props.row.model_name }}</small>
									</template>
									<template slot="requested_delivery_date" scope="props">
										<small v-if="props.row.requested_delivery_date">{{ [props.row.requested_delivery_date, 'MMMM, DD YYYY HH:mm:ss'] | moment('MMM DD, YYYY') }}</small>
										<small v-else>{{ props.row.requested_delivery_date }}</small>
									</template>
									<template slot="confirmed_date" scope="props">
										<small v-if="props.row.confirmed_date">{{ [props.row.confirmed_date, 'MMMM, DD YYYY HH:mm:ss'] | moment('MMM DD, YYYY') }}</small>
										<small v-else>{{ props.row.confirmed_date }}</small>
									</template>
									<template slot="production_date" scope="props">
										<small v-if="props.row.production_date">{{ [props.row.production_date, 'MMMM, DD YYYY HH:mm:ss'] | moment('MMM DD, YYYY') }}</small>
										<small v-else>{{ props.row.production_date }}</small>
									</template>
									<template slot="qty" scope="props">{{ new Intl.NumberFormat().format(props.row.qty) }}</template>
									<template slot="fg_qty" scope="props">
										<input type="number" :id="props.row.line_id" v-model.number="shipmentData[shipmentData.findIndex(x => x.line_id == props.row.line_id)].fg_qty" class="input-xs form-control">
									</template>
									<template slot="status" scope="props">
										<h4>
											<span class="text-danger fa fa-warning" v-if="props.row.qty < props.row.fg_qty" title="Excess"></span>
											<span class="text-teal fa fa-star" v-else-if="props.row.qty == props.row.fg_qty" title="Good"></span>
											<template v-else-if="props.row.qty > props.row.fg_qty">
												<span class="text-orange fa fa-star-half-full" title="FG Lacking"></span>
												<span class="text-danger fa fa-exclamation-circle" title="FG Has Lacking or Excess Materials Allocated" v-if="checkRMStatus(props.row.line_id) == false"></span>
												<span class="text-teal fa fa-check-circle" title="Good" v-else-if="checkRMStatus(props.row.line_id) == true"></span>
											</template>
										</h4>
									</template>
									<template slot="h__so_no" scope="props"><small class="text-center">SO #</small></template>
									<template slot="h__line_id" scope="props"><small>SO Line #</small></template>
									<template slot="h__model_id" scope="props"><small>Model #</small></template>
									<template slot="h__model_name" scope="props"><small>Model Name</small></template>
									<template slot="h__requested_delivery_date" scope="props"><small>Requested Delivery Date</small></template>
									<template slot="h__confirmed_date" scope="props"><small>Confirmed Delivery Date</small></template>
									<template slot="h__production_date" scope="props"><small>Production Date</small></template>
									<template slot="h__qty" scope="props"><small>Order Qty</small></template>
									<template slot="h__fg_qty" scope="props"><small>FG Qty Allocation</small></template>
									<template slot="h__has_record" scope="props"><small>Has Record?</small></template>
									<template slot="h__status" scope="props"><small>Status</small></template>
								</v-client-table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="documentName" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
			<h3 class="title">RM Allocation</h3>
		</transition>
		<transition name="documentWindow" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }">
			<div class="row" v-if="rmInventoryData.length">
				<div class="col-md-12">
					<div class="box box-danger">
						<div class="box-header with-border">
							<h3 class="box-title">RM Inventory</h3>
							<div class="box-tools pull-right">
								<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
							</div>
						</div>
						<div class="box-body">
							<div class="row">
								<div class="col-md-6">
									<label>Options</label>
									<div class="form-group">
										<input type="button" class="btn bg-maroon" name="generate_allocations" value="Generate RM Allocations" @click="generateRMAllocations()">
										<input type="button" class="btn bg-olive" name="generate_allocations" value="Save Records" @click="saveRMAllocations()">
									</div>
								</div>
								<div class="col-md-2">
									<label>Filter By Material Type</label>
									<div class="form-group">
										<select name="filter_by" v-model="materialType" v-if="materialTypes.length" class="form-control">
											<option :value="type.type" v-for="(type, index) in materialTypes" v-if="type.type != 'Finished Goods'">{{ type.type }}</option>
										</select>
									</div>
								</div>
							</div>
							<v-client-table name="rmtable" :data="filteredRMInvData" :columns="rmColumns" :options="rmOptions" v-if="rmInventoryData.length">
								<template slot="material_no" scope="props">{{ props.row.material_no }}</template>
								<template slot="production" scope="props">{{ (props.row.production.toFixed(6) % 1 != 0 ? props.row.production.toFixed(6) : props.row.production ) }}</template>
								<template slot="wh_iqc" scope="props">{{ (props.row.wh_iqc.toFixed(6) % 1 != 0 ? props.row.wh_iqc.toFixed(6) : props.row.wh_iqc ) }}</template>
								<template slot="intransit" scope="props">{{ (props.row.intransit.toFixed(6) % 1 != 0 ? props.row.intransit.toFixed(6) : props.row.intransit ) }}</template>
								<template slot="wip" scope="props">{{ (props.row.wip.toFixed(6) % 1 != 0 ? props.row.wip.toFixed(6) : props.row.wip ) }}</template>
								<template slot="open_po" scope="props">{{ (props.row.open_po.toFixed(6) % 1 != 0 ? props.row.open_po.toFixed(6) : props.row.open_po ) }}</template>
								<template slot="grpo" scope="props">{{ (props.row.grpo.toFixed(6) % 1 != 0 ? props.row.grpo.toFixed(6) : props.row.grpo ) }}</template>
								<template slot="total" scope="props">{{ rmInventoryTotalQty(props.row).toFixed(6) % 1 != 0 ?  rmInventoryTotalQty(props.row).toFixed(6) : rmInventoryTotalQty(props.row) }}</template>
								<template slot="allocated" scope="props">{{ (rmInventoryAllocatedQty(props.row.material_no)).toFixed(6) % 1 != 0 ? (rmInventoryAllocatedQty(props.row.material_no)).toFixed(6) : rmInventoryAllocatedQty(props.row.material_no) }}</template>
								<template slot="remaining" scope="props">{{ (rmInventoryTotalQty(props.row) - rmInventoryAllocatedQty(props.row.material_no)).toFixed(6) % 1 != 0 ? (rmInventoryTotalQty(props.row) - rmInventoryAllocatedQty(props.row.material_no)).toFixed(6) : rmInventoryTotalQty(props.row) - rmInventoryAllocatedQty(props.row.material_no) }}</template>
								<template slot="lacking" scope="props">{{ rmTotalInventoryLackingYield(props.row.material_no).toFixed(6) }}</template>
								<template slot="status" scope="props">
									<span v-if="rmInventoryTotalQty(props.row) - rmInventoryAllocatedQty(props.row.material_no) > 0" class="text-teal fa fa-thumbs-up" title="In Stock"></span>
									<span v-else-if="rmInventoryTotalQty(props.row) - rmInventoryAllocatedQty(props.row.material_no) == 0" class="text-purple fa fa-circle-o" title="Empty"></span>
									<span v-else class="text-maroon fa fa-warning" title="Over Allocated"></span>
								</template>
								<template slot="h__material_id" scope="props"><small>Material #</small></template>
								<template slot="h__production" scope="props"><small>PN</small></template>
								<template slot="h__wh_iqc" scope="props"><small>WH/IQC</small></template>
								<template slot="h__intransit" scope="props"><small>InTransit</small></template>
								<template slot="h__wip" scope="props"><small>WIP</small></template>
								<template slot="h__lacking" scope="props"><small>Lacking (For PO)</small></template>
							</v-client-table>
						</div>
					</div>
				</div>
				<transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }">
					<div class="col-md-10 col-md-offset-2" v-if="client.table.id">
						<div class="box box-solid box-danger">
							<div class="box-header with-border">
								<h3 class="box-title">Model</h3>
								<div class="box-tools pull-right">
									<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
								</div>
							</div>
							<div class="box-body">
								<div class="row">
									<div class="col-md-4">
										<label for="model_no">Model No.</label>
										<input type="text" name="model_no" class="form-control disabled" disabled :value="rmUpdateModel.model_no">
									</div>
									<div class="col-md-8">
										<label for="model_name">Model Name</label>
										<input type="text" name="model_name" class="form-control disabled" disabled :value="rmUpdateModel.model_name">
									</div>
									<div class="col-md-2">
										<label for="process_rev">Process Revision</label>
										<input type="text" name="model" class="form-control disabled" disabled :value="rmUpdateModel.process_rev">
									</div>
									<div class="col-md-2">
										<label for="bom_rev">BOM Revision</label>
										<input type="text" name="model" class="form-control disabled" disabled :value="rmUpdateModel.bom_rev">
									</div>
									<div class="col-md-6">
										<label for="rm_options">Options</label>
										<div class="form-group">
											<!-- <input type="submit" value="Generate Allocations" class="btn bg-maroon"> -->
											<input type="submit" value="Save Record" class="btn bg-olive" @click="saveRMAllocation()">
											<input type="button" value="Back" class="btn bg-purple" @click="back()">
										</div>
									</div>
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
											<template v-for="(process, pIndex) in rmUpdateModel.process">
												<tr>
													<td :rowspan="getBOMAltRows(process.bom)">{{ process.order }}</td>
													<td class="col-md-1" :rowspan="getBOMAltRows(process.bom)"><small>{{ process.name }}</small></td>
													<template v-if="process.bom.length == 0">
														<td colspan="9"></td>
													</template>
													<template v-else>
														<template v-for="(bom, bIndex) in process.bom" v-if="bIndex == 0">
															<td :rowspan="getBOMRows(bom)"><label class="label label-primary">{{ bom.item }}</label></td>
															<td>
																<div class="no-overflow">
																	<label class="label label-default" :title="bom.name">{{ bom.name }}</label>
																</div>
															</td>
															<td>
																<label class="label label-success">{{ bom.yield }} %</label>
																<label class="label bg-purple">{{ bom.quantity }}</label>
															</td>
															<td><input type="number" class="input-sm form-control" :title="'(BOM) ' +bom.item +' - '+ bom.name" v-model.number="bom.stock"></td>
															<td :rowspan="getBOMRows(bom)">
																<strong>{{ parseInt(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity)) }}</strong>
																<template v-if="(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity)).toFixed(6) % 1 != 0">
																	<small>
																	. <!-- decimal point -->
																	{{ (getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity)).toFixed(6).toString().substr(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity).toFixed(6).toString().lastIndexOf(".")+1) }}
																	</small>
																</template>
															</td>
															<td :rowspan="getBOMRows(bom)">
																<strong>{{ parseInt(rmTotalQty(bom)) }}</strong>
																<template v-if="rmTotalQty(bom).toFixed(6) % 1 != 0">
																	<small>
																		. <!-- decimal point -->
																		{{ rmTotalQty(bom).toFixed(6).toString().substr(rmTotalQty(bom).toFixed(6).toString().lastIndexOf(".")+1) }}
																	</small>
																</template>
															</td>
															<td :rowspan="getBOMRows(bom)">
																<template v-if="(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toString().lastIndexOf('.') == -1">
																	<strong>
																		{{ (getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)) }}
																	</strong>
																</template>
																<template v-else>
																	<strong>
																		{{ (getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6).toString().substr(0, (getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6).toString().lastIndexOf('.')) }}
																	</strong>
																	<small>.
																		{{ (getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6).toString().substr((getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6).toString().lastIndexOf('.')+1) }}
																	</small>
																</template>
															</td>
															<td :rowspan="getBOMRows(bom)">
																<span class="text-danger fa fa-warning" v-if="(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6) < 0" title="Excess"></span>
																<span class="text-teal fa fa-star" v-else-if="(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6) == 0" title="Good"></span>
																<span class="text-orange fa fa-star-half-full" v-else-if="(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6) > 0" title="Lacking"></span>
															</td>
														</template>
													</template>
												</tr>
												<template v-for="(bom, bIndex) in process.bom">
													<template v-for="(alt, altIndex) in bom.alternative" v-if="bIndex == 0">
														<tr>
															<td colspan="2">
																<!-- <span class="label bg-maroon">{{ bom.item }}</span> -->
																<span class="label bg-maroon">{{ alt.item }}</span>
																<span class="label label-default label-overflow" :title="alt.name">{{ alt.name }}</span>
															</td>
															<td><input type="number" class="input-sm form-control" :title="'(ALT) ' +alt.item +' - '+ alt.name" v-model.number="alt.stock"></td>
														</tr>
													</template>
												</template>
												<template v-for="(bom, bIndex) in process.bom">
													<template v-if="bIndex > 0">
														<tr>
															<td><label class="label label-primary">{{ bom.item }}</label></td>
															<td>
																<div class="no-overflow">
																	<label class="label label-default" :title="bom.name">{{ bom.name }}</label>
																</div>
															</td>
															<td>
																<label class="label label-success">{{ bom.yield }} %</label>
																<label class="label bg-purple">{{ bom.quantity }}</label>
															</td>
															<td><input type="number" class="input-sm form-control" :title="'(BOM) ' +bom.item +' - '+ bom.name" v-model.number="bom.stock"></td>
															<td :rowspan="getBOMRows(bom)">
																<strong>{{ parseInt(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity)) }}</strong>
																<template v-if="(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity)).toFixed(6) % 1 != 0">
																	<small>
																	. <!-- decimal point -->
																	{{ (getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity)).toFixed(6).toString().substr(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity).toFixed(6).toString().lastIndexOf(".")+1) }}
																	</small>
																</template>
															</td>
															<td :rowspan="getBOMRows(bom)">
																<strong>{{ parseInt(rmTotalQty(bom)) }}</strong>
																<template v-if="rmTotalQty(bom).toFixed(6) % 1 != 0">
																	<small>
																		. <!-- decimal point -->
																		{{ rmTotalQty(bom).toFixed(6).toString().substr(rmTotalQty(bom).toFixed(6).toString().lastIndexOf(".")+1) }}
																	</small>
																</template>
															</td>
															<td :rowspan="getBOMRows(bom)">
																<template v-if="(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toString().lastIndexOf('.') == -1">
																	<strong>
																		{{ (getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)) }}
																	</strong>
																</template>
																<template v-else>
																	<strong>
																		{{ (getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6).toString().substr(0, (getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6).toString().lastIndexOf('.')) }}
																	</strong>
																	<small>.
																		{{ (getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6).toString().substr((getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6).toString().lastIndexOf('.')+1) }}
																	</small>
																</template>
															</td>
															<td :rowspan="getBOMRows(bom)">
																<span class="text-danger fa fa-warning" v-if="(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6) < 0" title="Excess"></span>
																<span class="text-teal fa fa-star" v-else-if="(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6) == 0" title="Good"></span>
																<span class="text-orange fa fa-star-half-full" v-else-if="(getRMRequiredQty(rmUpdateModel.so_line_id, bom.quantity) - rmTotalQty(bom)).toFixed(6) > 0" title="Lacking"></span>
															</td>
														</tr>
													</template>
													<template v-for="(alt, altIndex) in bom.alternative" v-if="bIndex > 0">
														<tr>
															<td></td>
															<td colspan="2">
																<!-- <span class="label bg-maroon">{{ bom.item }}</span> -->
																<span class="label bg-maroon">{{ alt.item }}</span>
																<span class="label label-default label-overflow" :title="alt.name">{{ alt.name }}</span>
															</td>
															<td><input type="number" class="input-sm form-control" :title="'(ALT) ' +alt.item +' - '+ alt.name" v-model.number="alt.stock"></td>
														</tr>
													</template>
												</template>
											</template>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</transition>
			</div>
		</transition>
	</div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import { Event } from 'vue-tables-2'

export default {
	components: {
		
	},
	props: ['division','area','monthyear'],
	data() {
		return {
			fgInventoryData: [],
			fgInvColumns: ['model_id', 'name', 'qty', 'allocated_qty','remaining_qty', 'status'],
			fgInvOptions: {
				columnsClasses: {
					'model_id': 'col-xs-2',
					'name': 'col-xs-3',
					'qty': 'col-xs-2',
					'allocated_qty': 'col-xs-2',
					'remaining_qty': 'col-xs-2',
					'status': 'col-xs-1',
				},
				sortable: ['model_id', 'name', 'qty', 'allocated_qty','remaining_qty']
			},
			shipmentData: [],
			shipmentColumns: ['so_no', 'model_id', 'model_name', 'requested_delivery_date', 'confirmed_date', 'production_date', 'qty', 'fg_qty', 'status'],
			shipmentOptions: {
				columnsClasses: {
					// 'so_no': 'col-md-1',
					// 'line_id': 'col-md-1',
					'model_id': 'col-md-1 pointer',
					'model_name': 'col-md-2',
					'requested_delivery_date': 'col-md-1',
					'confirmed_date': 'col-md-1',
					'production_date': 'col-md-1',
					// 'production_date': 'col-md-2 bg-info',
					'qty': 'col-md-1',
					'fg_qty': 'col-md-2',
					// 'has_record': 'col-md-1',
				},
				sortable: ['so_no', 'line_id', 'model_id', 'model_name', 'requested_delivery_date', 'confirmed_date', 'production_date', 'qty'],
			},
			rmShipment: [],
			materialTypes: [],
			materialType: '',
			sapPO: [],
			productionScheduleData: [],
			wip: [],
			rmInventoryData: [],
			rmColumns: ['material_no', 'material_name', 'production', 'wh_iqc', 'intransit', 'wip', 'open_po', 'grpo', 'total', 'allocated', 'remaining', 'lacking', 'status'],
			rmOptions: {
				// columnsClasses: {
				// 	'material_no': 'col-md-1', 
				// 	'material_name': 'col-md-1', 
				// 	'production': 'col-md-1', 
				// 	'wh_iqc': 'col-md-1', 
				// 	'intransit': 'col-md-1', 
				// 	'wip': 'col-md-1', 
				// 	'open_po': 'col-md-1', 
				// 	'grpo': 'col-md-1', 
				// 	'total': 'col-md-1', 
				// 	'allocated': 'col-md-1', 
				// 	'remaining': 'col-md-1', 
				// 	'status': 'col-md-1'
				// },
				customFilters: [{ 
					name: 'mt', 
					callback(row, types) {
						// types.code
						return types.code.includes(row.material_group)
						// return query.code.includes(row.material_group)
						// return row.material_group
					}
				}],
				sortable: ['material_no', 'material_name', 'production', 'wh_iqc', 'intransit', 'wip', 'open_po', 'grpo']
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
		uniqueRMInvData() {
			let rm = []
			for(let [index, value] of this.rmShipment.entries()) {
				for(let [pIndex, pValue] of value.process.entries()) {
					for(let [bIndex,bValue] of pValue.bom.entries()) {
						rm.push(bValue.item)
						for(let [aIndex, aValue] of bValue.alternative.entries()) {
							rm.push(aValue.item)
						}
					}
				}
			}
			return [...(new Set(rm))]
		},
		filteredRMInvData() {
			return this.rmInventoryData.filter(obj => {
				return this.uniqueRMInvData.find(arr => arr == obj.material_no)
			})
		},
		soLines() {
			return [...(new Set(this.shipmentData.map(({ line_id }) => line_id)))]
		},
		rmUpdateModel() {
			if(this.client.table.id && this.rmShipment.length) {
				return this.rmShipment.find(x => x.so_line_id === this.client.table.id)
			}
			else {
				return []
			}
		}
	},
	watch: {
		division() {
			this.resetWindow()
		},
		area() {
			this.$store.dispatch('CLIENT_CREATE')
			this.resetWindow()
		},
		monthyear() {
			this.$store.dispatch('CLIENT_CREATE')
			this.resetWindow()
		},
		materialType(value) {
			if(this.rmShipment.length) {
				Event.$emit('vue-tables.rmtable.filter::mt', this.materialTypes.find(q => q.type == value))
			}
		} 
	},
	created() {
		this.startUp()
	},
	mounted() {
		this.$store.dispatch('CLIENT_CREATE')
	},
	methods: {
		resetWindow() {
			this.clearAll()
			this.startUp()
		},
		startUp() {
			this.getMaterialTypes()
			this.getShipments()
			this.getFGInventoryData()
		},
		clearAll() {
			this.shipmentData = []
			this.fgInventoryData = []
			this.rmShipment = []
			this.sapPO = []
			this.productionScheduleData = []
			this.wip = []
			this.rmInventoryData = []
			this.rmUpdateModel = []
		},
		generateRMAllocations() {
			for(let sh of this.shipmentData) {

				let shLacking = sh.qty - sh.fg_qty
				for(let [rmI, rm] of this.rmShipment.entries()) {
					if(rm.so_line_id == sh.line_id) {
						for(let [pI, p] of rm.process.entries()) {
							for(let [bI,b] of p.bom.entries()) {
								let rmInventory = this.rmInventoryData.find(x => x.material_no == b.item)
								let remaining = this.rmInventoryTotalQty(rmInventory) - this.rmInventoryAllocatedQty(b.item)
								let lacking = this.rmInventoryLacking(b.item, shLacking, rmI, pI, bI)
								
								if(this.rmInventoryTotalQty(rmInventory) != 0) {
									if(lacking > 0) {
										if(remaining > 0) {
											if(remaining > lacking) {
												b.stock += lacking
											}
											else {
												b.stock += remaining
											}
										}
									}
									else if(lacking < 0) {
										b.stock = 0
										let remaining2 = this.rmInventoryTotalQty(rmInventory) - this.rmInventoryAllocatedQty(b.item)
										let lacking2 = this.rmInventoryLacking(b.item, shLacking, rmI, pI, bI)
										if(lacking2 > 0) {
											if(remaining2 > 0) {
												if(remaining2 > lacking2) {
													b.stock += lacking2
												}
												else {
													b.stock += remaining2
												}
											}
										}
									}
									else if(lacking == 0) {
										let remaining3 = this.rmInventoryTotalQty(rmInventory) - this.rmInventoryAllocatedQty(b.item)
										let lacking3 = this.rmInventoryLacking(b.item, shLacking, rmI, pI, bI)
										if(remaining3 < 0 && lacking3 == 0) {
											b.stock += remaining3
										}
									}

									for(let [aI, a] of b.alternative.entries()) {
										let altInventory = this.rmInventoryData.find(x => x.material_no == a.item)
										let altRemaining = this.rmInventoryTotalQty(altInventory) - this.rmInventoryAllocatedQty(a.item)
										let bomLacking = this.rmInventoryLacking(b.item, shLacking, rmI, pI, bI)

										if(this.rmInventoryTotalQty(altInventory) != 0) {
											if(bomLacking > 0) {
												if(altRemaining > 0) {
													if(altRemaining > bomLacking) {
														a.stock += bomLacking
													}
													else {
														a.stock += altRemaining
													}
												}
											}
											else if(lacking < 0) {
												a.stock = 0 
												let altRemaining2 = this.rmInventoryTotalQty(altInventory) - this.rmInventoryAllocatedQty(a.item)
												let bomLacking2 = this.rmInventoryLacking(b.item, shLacking, rmI, pI, bI)
												if(bomLacking2 > 0) {
													if(altRemaining2 > 0) {
														if(altRemaining2 > bomLacking2) {
															a.stock += bomLacking2
														}
														else {
															a.stock += altRemaining2
														}
													}
												}
											}
											else if(lacking == 0) {
												let altRemaining3 = this.rmInventoryTotalQty(altInventory) - this.rmInventoryAllocatedQty(a.item)
												let bomLacking3 = this.rmInventoryLacking(b.item, shLacking, rmI, pI, bI)
												if(altRemaining3 < 0 && bomLacking3 == 0) {
													a.stock += altRemaining3
												}
											}
										}
										else {
											a.stock = 0
										}
									}
								}
								else {
									b.stock = 0

									for(let [aI, a] of b.alternative.entries()) {
										let altInventory = this.rmInventoryData.find(x => x.material_no == a.item)
										let altRemaining = this.rmInventoryTotalQty(altInventory) - this.rmInventoryAllocatedQty(a.item)
										let bomLacking = this.rmInventoryLacking(b.item, shLacking, rmI, pI, bI)

										if(this.rmInventoryTotalQty(altInventory) != 0) {
											if(bomLacking > 0) {
												if(altRemaining > 0) {
													if(altRemaining > bomLacking) {
														a.stock += bomLacking
													}
													else {
														a.stock += altRemaining
													}
												}
											}
											else if(lacking < 0) {
												a.stock = 0 
												let altRemaining2 = this.rmInventoryTotalQty(altInventory) - this.rmInventoryAllocatedQty(a.item)
												let bomLacking2 = this.rmInventoryLacking(b.item, shLacking, rmI, pI, bI)
												if(bomLacking2 > 0) {
													if(altRemaining2 > 0) {
														if(altRemaining2 > bomLacking2) {
															a.stock += bomLacking2
														}
														else {
															a.stock += altRemaining2
														}
													}
												}
											}
											else if(lacking == 0) {
												let altRemaining3 = this.rmInventoryTotalQty(altInventory) - this.rmInventoryAllocatedQty(a.item)
												let bomLacking3 = this.rmInventoryLacking(b.item, shLacking, rmI, pI, bI)
												if(altRemaining3 < 0 && bomLacking3 == 0) {
													a.stock += altRemaining3
												}
											}
										}
										else {
											a.stock = 0
										}
									}
								}
							}
						}
					}
				}
			}
		},
		setUpdateID(id) {
			this.$store.commit('SET_CLIENT_TABLE_ID', id)
		},
		saveRMAllocation() {
			axios.post('mrprmstock/?format=json', {
				record: [this.rmUpdateModel]
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
				if(response.data.status == "success") {
					this.resetWindow()
				}
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      })
		},
		saveRMAllocations() {
			axios.post('mrprmstock/?format=json', {
				record: this.rmShipment
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
				if(response.data.status == "success") {
					this.resetWindow()
				}
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      })
		},
		saveFG() {
			let save = Object.values(this.shipmentData.reduce((r,{ line_id, fg_qty }) => {
				r[line_id] = r[line_id] || { line_id, fg_qty }
				return r
			},{}))

			axios.post('mrpfgstock/?format=json', {
				record: save,
				user_id: this.auth.user.user_id
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
				if(response.data.status == "success") {
					this.resetWindow()
				}
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      })
		},
		generateFGAllocations() {
			for(let [shIndex, shValue] of this.shipmentData.entries()) {
				if(shValue.qty != shValue.fg_qty) {
					if(shValue.qty > shValue.fg_qty) {
						if((shValue.qty - shValue.fg_qty) <= this.remainingQty(this.fgInventoryData[this.fgInventoryData.findIndex(x => x.model_id == shValue.model_id)].qty, this.allocatedQty(shValue.model_id)) ) {
							this.shipmentData[this.shipmentData.findIndex(x => x.line_id == shValue.line_id)].fg_qty += (shValue.qty - shValue.fg_qty)
						}
						else {
							if(this.remainingQty(this.fgInventoryData[this.fgInventoryData.findIndex(x => x.model_id == shValue.model_id)].qty, this.allocatedQty(shValue.model_id)) > 0) {
								this.shipmentData[this.shipmentData.findIndex(x => x.line_id == shValue.line_id)].fg_qty = this.remainingQty(this.fgInventoryData[this.fgInventoryData.findIndex(x => x.model_id == shValue.model_id)].qty, this.allocatedQty(shValue.model_id))
							}
							else {
								this.shipmentData[this.shipmentData.findIndex(x => x.line_id == shValue.line_id)].fg_qty += (this.remainingQty(this.fgInventoryData[this.fgInventoryData.findIndex(x => x.model_id == shValue.model_id)].qty, this.allocatedQty(shValue.model_id)) - 0)
							}
						}
					}
					else if(shValue.qty < shValue.fg_qty){
						this.shipmentData[this.shipmentData.findIndex(x => x.line_id == shValue.line_id)].fg_qty = shValue.qty
					}
				}
			}	
		},
		allocatedQty(model_id) {
			let qty = 0 
			for(let [index, value] of this.shipmentData.entries()) {
				if (value.model_id == model_id) qty += value.fg_qty
			}
			return qty
		},
		rmTotalInventoryLackingYield(material_no) {
			let lacking = 0
			for(let fg of this.shipmentData) {
				let line_id = fg.line_id
				let fgLacking = fg.qty - fg.fg_qty
				for(let rm of this.rmShipment) {
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
			return lacking
		},
		rmInventoryLacking(material_no, shipmentLacking, shipmentIndex, processIndex, bomIndex) {
			let stock = 0
			let shipment = this.rmShipment[shipmentIndex].process[processIndex].bom[bomIndex]
			let qty = shipment.quantity
			stock += shipment.stock
			for(let alt of shipment.alternative) {
				stock += alt.stock
			}
			let lacking = (shipmentLacking * qty ) - stock
			return lacking
		},
		checkRMStatus(so_line_id) {
			if(this.shipmentData.length) {
				let so_required = this.shipmentData[this.shipmentData.findIndex(x => x.line_id == so_line_id)].qty - this.shipmentData[this.shipmentData.findIndex(x => x.line_id == so_line_id)].fg_qty
				if(this.rmShipment.length) {
					let rm_line = this.rmShipment[this.rmShipment.findIndex(x => x.so_line_id == so_line_id)]
					for(let pValue of rm_line.process) {
						for(let bValue of pValue.bom) {
							let stock = 0
							stock += bValue.stock
							for(let aValue of bValue.alternative) {
								stock+= aValue.stock
							}
							if(parseFloat(stock.toFixed(6)) != parseFloat((bValue.quantity * so_required).toFixed(6))) {
								return false
							}
						}
					}
					return true
				}
			}
		},
		getBOMRows(bom) {
			let rows = 1
			for(let [index, value] of bom.alternative.entries()) {
				rows++
			}
			return rows
		},
		getBOMAltRows(bom) {
			let rows = 0
			for(let [index, value] of bom.entries()) {
				rows++
				for(let [index2,value2] of value.alternative.entries()) {
					rows++
				}
			}
			return (rows == 0 ? 1 : rows)
		},
		rmTotalQty(bom) {
			let qty = 0
			qty += bom.stock
			for(let [index, value] of bom.alternative.entries()) {
				qty += value.stock
			}
			return qty
		},
		getRMRequiredQty(so_line_id, bomQty) {
			return (this.shipmentData[this.shipmentData.findIndex(x => x.line_id == so_line_id)].qty - this.shipmentData[this.shipmentData.findIndex(x => x.line_id == so_line_id)].fg_qty) * bomQty
		},
		rmInventoryTotalQty(row) {
			return row.production + row.wh_iqc + row.intransit + row.wip + row.open_po + row.grpo
		},
		rmInventoryAllocatedQty(material_no) {
			let qty = 0
			for(let [index,value] of this.rmShipment.entries()) {
				for(let [pIndex, pValue] of value.process.entries()) {
					for(let [bIndex, bValue] of pValue.bom.entries()) {
						if(bValue.item == material_no) {
							qty += bValue.stock
						}
						for(let [aIndex, aValue] of bValue.alternative.entries()) {
							if(aValue.item == material_no) {
								qty += aValue.stock
							}
						}
					}
				}
			}
			return qty
		},
		remainingQty(qty, allocatedQty) {
			return qty - allocatedQty
		},
		setAlternativeMaterialsModelNumber(id) {
			this.$store.dispatch('CLIENT_UPDATE_ID', id)
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
		getShipments() {
			axios.get('mrpallocation/getShipments?format=json',{
				params: {
					division: this.division,
					area: this.area,
					monthyear: this.monthyear
				}
			})
			.then(response => {
				let shipmentArray = []
				for(let [index, value] of response.data.entries()) {
					shipmentArray.push({
						line_id: value.id,
						so_id: value.so_id,
						so_no: value.so_no,
						model_id: value.model_id,
						model_name: value.model_name,
						requested_delivery_date: value.requested_delivery_date,
						confirmed_date: value.confirmed_date,
						production_date: value.production_date,
						qty: value.qty,
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
		computeRMInventory() {
			let rmShipmentArray = []

			for(let [index, value] of this.rmShipment.entries()) {
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
			}
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
					this.rmShipment = response.data.rows
					this.getRMInventoryData()
				}
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      })
		},
		back() {
			this.$store.dispatch('CLIENT_CLEAR')
			this.$store.dispatch('CLIENT_LINE_CLEAR')
		}
	},
	beforeDestroy() {
		this.$store.dispatch('CLIENT_CLEAR')
		this.$store.dispatch('CLIENT_LINE_CLEAR')
		this.$store.commit('CLEAR_ALERT')
	}
}
</script>

<style>
/*.table {
	empty-cells: show !important;
   border: 1px solid #000 !important;
}
table td,
table th {
    border: 1px solid #000;
}*/
td.pointer {
	cursor: pointer;
}
.no-overflow {
	overflow: hidden;
	max-width: 150px;
	margin-left: .3em;
	margin-right: .3em;
	word-wrap: break-word;
	text-overflow: ellipsis;
}
</style>

