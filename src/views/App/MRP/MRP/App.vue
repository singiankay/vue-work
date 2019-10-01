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
		<div class="box box-info">
			<div class="box-header with-border">
				<h3 class="box-title">Finished Goods</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				<div class="row">
					<div class="col-md-12">
						<div class="form-group">
							<input type="button" value="Download in Excel" class="btn btn-warning" v-if="fg.length" @click="generateFGExcel()">
						</div>
					</div>
				</div>
				<v-client-table :data="filteredFG" :columns="fgColumns" :options="fgOptions" v-if="fg.length">
					<template slot="h__required_1" scope="props">{{ form.month | moment("MMMM") }}</template>
					<template slot="h__required_2" scope="props">{{ form.month | moment("add","1 months", "MMMM") }}</template>
					<template slot="h__required_3" scope="props">{{ form.month | moment("add","2 months", "MMMM") }}</template>
					<template slot="h__required_4" scope="props">{{ form.month | moment("add","3 months", "MMMM") }}</template>
					<template slot="h__required_5" scope="props">{{ form.month | moment("add","4 months", "MMMM") }}</template>
					<template slot="h__required_6" scope="props">{{ form.month | moment("add","5 months", "MMMM") }}</template>
					<template slot="h__required_7" scope="props">{{ form.month | moment("add","6 months", "MMMM") }}</template>
					<template slot="h__lacking_1" scope="props">Lacking</template>
					<template slot="h__lacking_2" scope="props">Lacking</template>
					<template slot="h__lacking_3" scope="props">Lacking</template>
					<template slot="h__lacking_4" scope="props">Lacking</template>
					<template slot="h__lacking_5" scope="props">Lacking</template>
					<template slot="h__lacking_6" scope="props">Lacking</template>
					<template slot="h__lacking_7" scope="props">Lacking</template>
				</v-client-table>
				
			</div>
		</div>
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">Materials</h3>
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
					<div class="col-md-10">
						<label>Options</label>
						<div class="form-group">
							<input type="button" value="Download in Excel" class="btn btn-warning" v-if="filteredMaterials.length" @click="generateRMExcel()">
						</div>
					</div>
				</div>
				<v-client-table :data="filteredMaterials" :columns="rmColumns" :options="rmOptions" v-if="filteredMaterials.length">
					<template slot="required_1" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyRequired(props.row.material_no, 1)+'e'+6)+'e-'+6)) }}</template>
					<template slot="required_2" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyRequired(props.row.material_no, 2)+'e'+6)+'e-'+6)) }}</template>
					<template slot="required_3" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyRequired(props.row.material_no, 3)+'e'+6)+'e-'+6)) }}</template>
					<template slot="required_4" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyRequired(props.row.material_no, 4)+'e'+6)+'e-'+6)) }}</template>
					<template slot="required_5" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyRequired(props.row.material_no, 5)+'e'+6)+'e-'+6)) }}</template>
					<template slot="required_6" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyRequired(props.row.material_no, 6)+'e'+6)+'e-'+6)) }}</template>
					<template slot="required_7" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyRequired(props.row.material_no, 7)+'e'+6)+'e-'+6)) }}</template>
					<template slot="allocated_1" scope="props">{{ NumberFormat(Number(Math.round(computeRMAllocation(props.row.material_no, 1)+'e'+6)+'e-'+6)) }}</template>
					<template slot="allocated_2" scope="props">{{ NumberFormat(Number(Math.round(computeRMAllocation(props.row.material_no, 2)+'e'+6)+'e-'+6)) }}</template>
					<template slot="allocated_3" scope="props">{{ NumberFormat(Number(Math.round(computeRMAllocation(props.row.material_no, 3)+'e'+6)+'e-'+6)) }}</template>
					<template slot="allocated_4" scope="props">{{ NumberFormat(Number(Math.round(computeRMAllocation(props.row.material_no, 4)+'e'+6)+'e-'+6)) }}</template>
					<template slot="allocated_5" scope="props">{{ NumberFormat(Number(Math.round(computeRMAllocation(props.row.material_no, 5)+'e'+6)+'e-'+6)) }}</template>
					<template slot="allocated_6" scope="props">{{ NumberFormat(Number(Math.round(computeRMAllocation(props.row.material_no, 6)+'e'+6)+'e-'+6)) }}</template>
					<template slot="allocated_7" scope="props">{{ NumberFormat(Number(Math.round(computeRMAllocation(props.row.material_no, 7)+'e'+6)+'e-'+6)) }}</template>
					<template slot="lacking_1" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyLacking(props.row.material_no, 1)+'e'+6)+'e-'+6)) }}</template>
					<template slot="lacking_2" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyLacking(props.row.material_no, 2)+'e'+6)+'e-'+6)) }}</template>
					<template slot="lacking_3" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyLacking(props.row.material_no, 3)+'e'+6)+'e-'+6)) }}</template>
					<template slot="lacking_4" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyLacking(props.row.material_no, 4)+'e'+6)+'e-'+6)) }}</template>
					<template slot="lacking_5" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyLacking(props.row.material_no, 5)+'e'+6)+'e-'+6)) }}</template>
					<template slot="lacking_6" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyLacking(props.row.material_no, 6)+'e'+6)+'e-'+6)) }}</template>
					<template slot="lacking_7" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyLacking(props.row.material_no, 7)+'e'+6)+'e-'+6)) }}</template>
					<template slot="total" scope="props">{{ NumberFormat(Number(Math.round(computeRMQtyTotal(props.row.material_no)+'e'+6)+'e-'+6)) }}</template>
					<template slot="h__material_no" scope="props">Material #</template>
					<template slot="h__material_name" scope="props">MaterialName_________________________</template>
					<template slot="h__open_po_1" scope="props">{{ form.month | moment("MMMM") }} Open PO</template>
					<template slot="h__open_po_2" scope="props">{{ form.month | moment("add","1 months", "MMMM") }} Open PO</template>
					<template slot="h__open_po_3" scope="props">{{ form.month | moment("add","2 months", "MMMM") }} Open PO</template>
					<template slot="h__open_po_4" scope="props">{{ form.month | moment("add","3 months", "MMMM") }} Open PO</template>
					<template slot="h__open_po_5" scope="props">{{ form.month | moment("add","4 months", "MMMM") }} Open PO</template>
					<template slot="h__open_po_6" scope="props">{{ form.month | moment("add","5 months", "MMMM") }} Open PO</template>
					<template slot="h__open_po_7" scope="props">{{ form.month | moment("add","6 months", "MMMM") }} Open PO</template>
					<template slot="h__required_1" scope="props">Qty Required</template>
					<template slot="h__required_2" scope="props">Qty Required</template>
					<template slot="h__required_3" scope="props">Qty Required</template>
					<template slot="h__required_4" scope="props">Qty Required</template>
					<template slot="h__required_5" scope="props">Qty Required</template>
					<template slot="h__required_6" scope="props">Qty Required</template>
					<template slot="h__required_7" scope="props">Qty Required</template>
					<template slot="h__allocated_1" scope="props">Allocated</template>
					<template slot="h__allocated_2" scope="props">Allocated</template>
					<template slot="h__allocated_3" scope="props">Allocated</template>
					<template slot="h__allocated_4" scope="props">Allocated</template>
					<template slot="h__allocated_5" scope="props">Allocated</template>
					<template slot="h__allocated_6" scope="props">Allocated</template>
					<template slot="h__allocated_7" scope="props">Allocated</template>
					<template slot="h__lacking_1" scope="props">Lacking</template>
					<template slot="h__lacking_2" scope="props">Lacking</template>
					<template slot="h__lacking_3" scope="props">Lacking</template>
					<template slot="h__lacking_4" scope="props">Lacking</template>
					<template slot="h__lacking_5" scope="props">Lacking</template>
					<template slot="h__lacking_6" scope="props">Lacking</template>
					<template slot="h__lacking_7" scope="props">Lacking</template>
					<template slot="h__total" scope="props">Total</template>
				</v-client-table>
			</div>
		</div>
		<div class="box box-danger">
			<div class="box-header with-border">
				<h3 class="box-title">Sales Orders</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				<div class="row">
					<div class="col-md-12">
						<div class="form-group">
							<input type="button" value="Download in Excel" class="btn btn-warning" v-if="so.length" @click="generateSOExcel()">
						</div>
					</div>
				</div>
				<v-client-table :data="so" :columns="soColumns" :options="soOptions" v-if="so.length">
					<template slot="production_id" scope="props">
						<a @click="setUpdateID(props.row.production_id)" v-if="getClickableSO(soModelBOMs, props.row.production_id)">{{ props.row.production_id }}</a>
						<template v-else>{{ props.row.production_id }}</template>
					</template>
					<template slot="allocated_qty" scope="props">{{ getSOAllocatedQty(props.row) }}</template>
					<template slot="date" scope="props">
						<template v-if="props.row.date">{{ [props.row.date, 'MMMM, DD YYYY HH:mm:ss'] | moment('MMM DD, YYYY') }}</template>
						<template v-else>{{ props.row.date }}</template>
					</template>
					<template slot="lacking" scope="props">
						<template v-if="props.row.lacking_1 > 0">{{ props.row.lacking_1 }}</template>
						<template v-else-if="props.row.lacking_2 > 0">{{ props.row.lacking_2 }}</template>
						<template v-else-if="props.row.lacking_3 > 0">{{ props.row.lacking_3 }}</template>
						<template v-else-if="props.row.lacking_4 > 0">{{ props.row.lacking_4 }}</template>
						<template v-else-if="props.row.lacking_5 > 0">{{ props.row.lacking_5 }}</template>
						<template v-else-if="props.row.lacking_6 > 0">{{ props.row.lacking_6 }}</template>
						<template v-else-if="props.row.lacking_7 > 0">{{ props.row.lacking_7 }}</template>
						<template v-else>0</template>
					</template>
					<template slot="h__qty_1" scope="props">{{ form.month | moment("MMMM") }}</template>
					<template slot="h__qty_2" scope="props">{{ form.month | moment("add","1 months", "MMMM") }}</template>
					<template slot="h__qty_3" scope="props">{{ form.month | moment("add","2 months", "MMMM") }}</template>
					<template slot="h__qty_4" scope="props">{{ form.month | moment("add","3 months", "MMMM") }}</template>
					<template slot="h__qty_5" scope="props">{{ form.month | moment("add","4 months", "MMMM") }}</template>
					<template slot="h__qty_6" scope="props">{{ form.month | moment("add","5 months", "MMMM") }}</template>
					<template slot="h__qty_7" scope="props">{{ form.month | moment("add","6 months", "MMMM") }}</template>
					<template slot="h__lacking" scope="props">Lacking</template>
				</v-client-table>
			</div>
		</div>
		<transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }">
			<div class="box" v-if="client.table.id">
				<div class="box-header with-border">
					<h3 class="box-title">Sales Order Line</h3>
					<div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					</div>
				</div>
				<div class="box-body">
					<form @submit.prevent>
						<div class="row">
							<div class="col-md-3">
								<div class="form-group">
									<label>Production ID</label>
									<p>{{ client.table.id }}</p>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Sales Order Number</label>
									<p>{{ getSO(client.table.id).so_no }}</p>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Sales Order Line ID Number</label>
									<p>{{ getSO(client.table.id).so_line_id }}</p>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Model</label>
									<p>{{ getSO(client.table.id).model_no }} - {{ getSO(client.table.id).model_name }}</p>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-3">
								<div class="form-group">
									<label>Production Date</label>
									<p>{{ [getSO(client.table.id).date, 'MMMM, DD YYYY HH:mm:ss'] | moment('MMMM DD, YYYY') }}</p>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Lacking</label>
									<p>{{ getSOLacking(client.table.id) }}</p>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<div class="form-group">
									<button type="submit" class="btn btn-primary" :disabled="getSOLacking(client.table.id) <= 0" @click="saveAllocation()">Save</button>
									<button type="submit" class="btn bg-navy" @click="clearUpdateID()">Back</button>
								</div>
							</div>	
						</div>
						<div class="row">
							<div class="col-md-12">
								
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
										<th>Yield Required</th>
										<th>Total Allocated Qty</th>
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
													<td><span title="Allocated Qty">{{ Number(Math.round(b.alloc_qty+'e'+6)+'e-'+6) }}</span></td>
													<!-- <td><input type="number" class="form-control" v-model.number="b.alloc_qty"></td> -->
													<td :rowspan="getBOMRows(b)"><span title="Qty Required">{{ b.bom_req }}</span></td>
													<td :rowspan="getBOMRows(b)"><span title="Yield Required">{{  Number(Math.round(((200 - b.bom_yield) /100 * b.bom_req)+'e'+6)+'e-'+6) }}</span></td>
													<td :rowspan="getBOMRows(b)"><span title="Total Allocated Qty">{{ Number(Math.round(computeTotalQtyBOM(b)+'e'+6)+'e-'+6) }}</span></td>
													<td :rowspan="getBOMRows(b)"><span title="Lacking Qty">{{ Number(Math.round((((200 - b.bom_yield) /100 * b.bom_req) - computeTotalQtyBOM(b))+'e'+6)+'e-'+6) }}</span></td>
													<td :rowspan="getBOMRows(b)">
														<span class="text-orange fa fa-star-half-full" v-if="((200 - b.bom_yield) /100 * b.bom_req) - computeTotalQtyBOM(b) > 0"></span>
														<span class="text-teal fa fa-star" v-else-if="((200 - b.bom_yield) /100 * b.bom_req) - computeTotalQtyBOM(b) == 0"></span>
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
													<!-- {{ Number(Math.round(a.alloc_qty+'e'+6)+'e-'+6) }} -->
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
													<td><span title="Allocated Qty">{{ Number(Math.round(b.alloc_qty+'e'+6)+'e-'+6) }}</span></td>
													<!-- <td><input type="number" class="form-control" v-model.number="b.alloc_qty"></td> -->
													<td :rowspan="getBOMRows(b)"><span title="Qty Required">{{ b.bom_req }}</span></td>
													<td :rowspan="getBOMRows(b)"><span title="Yield Required">{{  Number(Math.round(((200 - b.bom_yield) /100 * b.bom_req)+'e'+6)+'e-'+6) }}</span></td>
													<td :rowspan="getBOMRows(b)" border><span title="Total Allocated Qty">{{ Number(Math.round(computeTotalQtyBOM(b)+'e'+6)+'e-'+6) }}</span></td>
													<td :rowspan="getBOMRows(b)"><span title="Lacking Qty">{{ Number(Math.round((((200 - b.bom_yield) /100 * b.bom_req) - computeTotalQtyBOM(b))+'e'+6)+'e-'+6) }}</span></td>
													<td :rowspan="getBOMRows(b)">
														<span class="text-orange fa fa-star-half-full" v-if="((200 - b.bom_yield) /100 * b.bom_req) - computeTotalQtyBOM(b) > 0"></span>
														<span class="text-teal fa fa-star" v-else-if="((200 - b.bom_yield) /100 * b.bom_req) - computeTotalQtyBOM(b) == 0"></span>
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
													<!-- {{ Number(Math.round(a.alloc_qty+'e'+6)+'e-'+6) }} -->
													<!-- <td></td> -->
												</tr>
											</template>
										</template>
									</template>
								</tbody>
							</table>
						</div>
					</form>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import Alert from '../../../../components/layout/Alert.vue'
import { mapMutations, mapState } from 'vuex'
import { saveAs } from 'file-saver'
import XLSX from 'xlsx'
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
			fgErrors: [],
			rmErrors: [],
			materialTypes: [],
			materialType: '',
			materials: [],
			rmColumns: ['material_no','material_name','inventory_wh', 'inventory_intransit', 'inventory_pn','wip','open_po_1','required_1','allocated_1','lacking_1','open_po_2','required_2','allocated_2','lacking_2','open_po_3','required_3','allocated_3','lacking_3','open_po_4','required_4','allocated_4','lacking_4','open_po_5','required_5','allocated_5','lacking_5','open_po_6','required_6','allocated_6','lacking_6','open_po_7','required_7','allocated_7','lacking_7','total'],
			rmOptions: {
				columnsClasses: {
					'material_name': 'col-md-2 primary',
					'inventory_wh': 'col-md-1 success', 
					'inventory_intransit': 'col-md-1  success', 
					'inventory_pn': 'col-md-1  success',
					'wip': 'col-md-1  success',
					'allocated_1': 'col-md-1 info',
					'required_1': 'col-md-1 danger',
					'lacking_1': 'col-md-1 warning text-right',
					'allocated_2': 'col-md-1 info',
					'required_2': 'col-md-1 danger',
					'lacking_2': 'col-md-1 warning text-right',
					'allocated_3': 'col-md-1 info',
					'required_3': 'col-md-1 danger',
					'lacking_3': 'col-md-1 warning text-right',
					'allocated_4': 'col-md-1 info',
					'required_4': 'col-md-1 danger',
					'lacking_4': 'col-md-1 warning text-right',
					'allocated_5': 'col-md-1 info',
					'required_5': 'col-md-1 danger',
					'lacking_5': 'col-md-1 warning text-right',
					'allocated_6': 'col-md-1 info',
					'required_6': 'col-md-1 danger',
					'lacking_6': 'col-md-1 warning text-right',
					'allocated_7': 'col-md-1 info',
					'required_7': 'col-md-1 danger'
					,'lacking_7': 'col-md-1 warning text-right'
				}
			},
			so: [],
			soColumns: ['production_id','so_no','so_line_id','remarks','date','model_no','model_name','qty_1','qty_2','qty_3','qty_4','qty_5','qty_6','qty_7','allocated_qty','lacking'],
			soOptions: {
				sortable: ['production_id','model_no','model_name','date','so_no','so_line_id','remarks','qty_1','qty_2','qty_3','qty_4','qty_5','qty_6','qty_7','allocated_qty', 'lacking'],
				columnsClasses: {
					'production_id': 'col-md-1 pointer',
					'model_no': 'col-md-1',
					'model_name': 'col-md-2',
					'date': 'col-md-2',
					'allocated_qty': 'col-md-1 info',
					'qty_1': 'col-md-1 info',
					'qty_2': 'col-md-1 info',
					'qty_3': 'col-md-1 info',
					'qty_4': 'col-md-1 info',
					'qty_5': 'col-md-1 info',
					'qty_6': 'col-md-1 info',
					'qty_7': 'col-md-1 info',
					'lacking': 'col-md-1 info'
				}
			},
			fg: [],
			fgColumns: ['model_no','model_name','qty','required_1','lacking_1','required_2','lacking_2','required_3','lacking_3','required_4','lacking_4','required_5','lacking_5','required_6','lacking_6','required_7','lacking_7'],
			fgOptions: {
				columnsClasses: {
					'required_1': 'col-md-1 info',
					'lacking_1': 'col-md-1 info',
					'required_2': '',
					'lacking_2': '',
					'required_3': 'col-md-1 info',
					'lacking_3': 'col-md-1 info',
					'required_4': '',
					'lacking_4': '',
					'required_5': 'col-md-1 info',
					'lacking_5': 'col-md-1 info',
					'required_6': '',
					'lacking_6': '',
					'required_7': 'col-md-1 info',
					'lacking_7': 'col-md-1 info',
				}
			},
			soModelBOMs: [],
			fgSheet: {
				jsondata:  []
			},
			rmSheet: {
				jsondata:  []
			},
			soSheet: {
				jsondata:  []
			},
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
		filteredFG() {
			return this.fg.filter(fg => {
				if(fg.qty > 0 || fg.required_1 > 0 || fg.required_2 > 0 || fg.required_3 > 0 || fg.required_4 > 0 || fg.required_5 > 0 || fg.required_6 > 0 || fg.required_7 > 0) {
					return fg
				}
			})
		},
		mt() {
			if(this.materialTypes) {
				if(this.materialTypes.findIndex(q => q.type == this.materialType) != - 1) {
					return this.materialTypes.find(q => q.type == this.materialType).code
				}
			}
		},
		filteredMaterials() {
			return this.materials.filter(mats => {
				if( this.mt.findIndex(x => x == mats.item_groupcode) != -1 && 
						(
							mats.inventory_wh > 0 || 
							mats.inventory_intransit > 0 || 
							mats.inventory_pn > 0 || 
							mats.wip > 0 || 
							mats.open_po_1 > 0 || 
							mats.open_po_2 > 0 || 
							mats.open_po_3 > 0 || 
							mats.open_po_4 > 0 || 
							mats.open_po_5 > 0 || 
							mats.open_po_6 > 0 || 
							mats.open_po_7 > 0 || 
							this.computeRMQtyLacking(mats.material_no, 1) > 0 || 
							this.computeRMQtyLacking(mats.material_no, 2) > 0 || 
							this.computeRMQtyLacking(mats.material_no, 3) > 0 || 
							this.computeRMQtyLacking(mats.material_no, 4) > 0 || 
							this.computeRMQtyLacking(mats.material_no, 5) > 0 || 
							this.computeRMQtyLacking(mats.material_no, 6) > 0 || 
							this.computeRMQtyLacking(mats.material_no, 7) > 0
						)
				) {
					return mats
				}
			})
		}
	},
	watch: {
		'form.area'() {
			this.clearFields()
			if(this.form.month) {
				this.getFG()
			}
		},
		'form.month'() {
			if(this.form.area || this.form.area == 0) {
				this.clearFields()
				this.getFG()
			}
		},
	},
	mounted() {
		this.$store.dispatch('SET_ACTIVE_DIVISION',this.auth.user.current_division)
		.catch(error => {
			this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
		})
	},
	created() {
		this.getMaterialTypes()
	},
	methods: {
		getMaterialTypes() {
			axios.get('mrprminventory/getMaterialTypes?format=json', {
				params: {
					division: this.auth.user.current_division
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
			this.fgErrors = []
			this.rmErrors = []
			this.clearUpdateID()
		},
		getFG() {
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
					required_1: 0,
					required_2: 0,
					required_3: 0,
					required_4: 0,
					required_5: 0,
					required_6: 0,
					required_7: 0,
					lacking_1: 0,
					lacking_2: 0,
					lacking_3: 0,
					lacking_4: 0,
					lacking_5: 0,
					lacking_6: 0,
					lacking_7: 0
				}))
				this.fg = result
				this.getProductionSchedules()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		getProductionSchedules() {
			axios.get('aggregateproductionschedule?format=json', {
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
					remarks: item.remarks,
					qty_1: (this.getAggregateMonth(item.date,1) ? item.qty : 0),
					qty_2: (this.getAggregateMonth(item.date,2) ? item.qty : 0),
					qty_3: (this.getAggregateMonth(item.date,3) ? item.qty : 0),
					qty_4: (this.getAggregateMonth(item.date,4) ? item.qty : 0),
					qty_5: (this.getAggregateMonth(item.date,5) ? item.qty : 0),
					qty_6: (this.getAggregateMonth(item.date,6) ? item.qty : 0),
					qty_7: (this.getAggregateMonth(item.date,7) ? item.qty : 0),
					lacking_1: 0,
					lacking_2: 0,
					lacking_3: 0,
					lacking_4: 0,
					lacking_5: 0,
					lacking_6: 0,
					lacking_7: 0,
					fg_allocation_qty_1: 0,
					fg_allocation_qty_2: 0,
					fg_allocation_qty_3: 0,
					fg_allocation_qty_4: 0,
					fg_allocation_qty_5: 0,
					fg_allocation_qty_6: 0,
					fg_allocation_qty_7: 0,
				}))
				this.computeFG()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		computeFG() {
			for(let fg of this.fg) {
				fg.required_1 = this.computeFGQtyRequired(fg.model_no, 1)
				fg.required_2 = this.computeFGQtyRequired(fg.model_no, 2)
				fg.required_3 = this.computeFGQtyRequired(fg.model_no, 3)
				fg.required_4 = this.computeFGQtyRequired(fg.model_no, 4)
				fg.required_5 = this.computeFGQtyRequired(fg.model_no, 5)
				fg.required_6 = this.computeFGQtyRequired(fg.model_no, 6)
				fg.required_7 = this.computeFGQtyRequired(fg.model_no, 7)
				fg.lacking_1 = this.computeFGQtyLacking(fg, 1)
				fg.lacking_2 = this.computeFGQtyLacking(fg, 2)
				fg.lacking_3 = this.computeFGQtyLacking(fg, 3)
				fg.lacking_4 = this.computeFGQtyLacking(fg, 4)
				fg.lacking_5 = this.computeFGQtyLacking(fg, 5)
				fg.lacking_6 = this.computeFGQtyLacking(fg, 6)
				fg.lacking_7 = this.computeFGQtyLacking(fg, 7)
			}
			this.allocateFG()
		},
		computeFGQtyRequired(model, increment) {
			let sumRequired = this.so.reduce((x, so) => {
				if(so.model_no == model) {
					switch(increment) {
						case 1:
							x += so.qty_1
						break
						case 2:
							x += so.qty_2
						break
						case 3:
							x += so.qty_3
						break
						case 4:
							x += so.qty_4
						break
						case 5:
							x += so.qty_5
						break 
						case 6:
							x += so.qty_6
						break
						case 7:
							x += so.qty_7
						break
					}
				}
				return x
			} ,0)
			return sumRequired
		},
		computeFGQtyLacking(fg, increment) {
			switch(increment) {
				case 1:
					if(fg.qty - fg.required_1 >= 0) {
						return 0
					}
					else {
						return fg.required_1 - fg.qty
					}
				break
				case 2:
					if(fg.qty - fg.required_1 >= 0) {
						if(fg.qty - (fg.required_1 + fg.required_2) >= 0) {
							return 0
						}
						else {
							return (fg.required_1 + fg.required_2) - fg.qty
						}
					}
					else {
						return fg.required_2
					}
				break
				case 3:
					if(fg.qty - (fg.required_1 + fg.required_2) >= 0) {
						if(fg.qty - (fg.required_1 + fg.required_2 + fg.required_3) >= 0) {
							return 0
						}
						else {
							return (fg.required_1 + fg.required_2 + fg.required_3) - fg.qty
						}
					}
					else {
						return fg.required_3
					}
				break
				case 4:
					if(fg.qty - (fg.required_1 + fg.required_2 + fg.required_3) >= 0) {
						if(fg.qty - (fg.required_1 + fg.required_2 + fg.required_3 + fg.required_4) >= 0) {
							return 0
						}
						else {
							return (fg.required_1 + fg.required_2 + fg.required_3 + fg.required_4) - fg.qty
						}
					}
					else {
						return fg.required_4
					}
				break
				case 5:
					if(fg.qty - (fg.required_1 + fg.required_2 + fg.required_3 + fg.required_4) >= 0) {
						if(fg.qty - (fg.required_1 + fg.required_2 + fg.required_3 + fg.required_4 + fg.required_5) >= 0) {
							return 0
						}
						else {
							return (fg.required_1 + fg.required_2 + fg.required_3 + fg.required_4 + fg.required_5) - fg.qty
						}
					}
					else {
						return fg.required_5
					}
				break
				case 6:
					if(fg.qty - (fg.required_1 + fg.required_2 + fg.required_3 + fg.required_4 + fg.required_5) >= 0) {
						if(fg.qty - (fg.required_1 + fg.required_2 + fg.required_3 + fg.required_4 + fg.required_5 + fg.required_6) >= 0) {
							return 0
						}
						else {
							return (fg.required_1 + fg.required_2 + fg.required_3 + fg.required_4 + fg.required_5 + fg.required_6) - fg.qty
						}
					}
					else {
						return fg.required_6
					}
				break
				case 7:
					if(fg.qty - (fg.required_1 + fg.required_2 + fg.required_3 + fg.required_4 + fg.required_5 + fg.required_6) >= 0) {
						if(fg.qty - (fg.required_1 + fg.required_2 + fg.required_3 + fg.required_4 + fg.required_5 + fg.required_6 + fg.required_7) >= 0) {
							return 0
						}
						else {
							return (fg.required_1 + fg.required_2 + fg.required_3 + fg.required_4 + fg.required_5 + fg.required_6 + fg.required_7) - fg.qty
						}
					}
					else {
						return fg.required_7
					}
				break
			}
		},
		allocateFG() {
			for(let fg of this.fg) {
				let qty = fg.qty
				if(qty > 0) {
					for(let so of this.so) {
						if(qty > 0) {
							if(so.model_no == fg.model_no) {
								if(so.qty_1 > 0) {
									if(qty >= so.qty_1) {
										so.fg_allocation_qty_1 = so.qty_1
										qty -= so.qty_1 
									}
									else {
										so.fg_allocation_qty_1 = qty
										qty = 0
									}
								}
							}
						}
					}
					for(let so of this.so) {
						if(qty > 0) {
							if(so.model_no == fg.model_no) {
								if(so.qty_2 > 0) {
									if(qty >= so.qty_2) {
										so.fg_allocation_qty_2 = so.qty_2
										qty -= so.qty_2 
									}
									else {
										so.fg_allocation_qty_2 = qty
										qty = 0
									}
								}
							}
						}
					}
					for(let so of this.so) {
						if(qty > 0) {
							if(so.model_no == fg.model_no) {
								if(so.qty_3 > 0) {
									if(qty >= so.qty_3) {
										so.fg_allocation_qty_3 = so.qty_3
										qty -= so.qty_3 
									}
									else {
										so.fg_allocation_qty_3 = qty
										qty = 0
									}
								}
							}
						}
					}
					for(let so of this.so) {
						if(qty > 0) {
							if(so.model_no == fg.model_no) {
								if(so.qty_4 > 0) {
									if(qty >= so.qty_4) {
										so.fg_allocation_qty_4 = so.qty_4
										qty -= so.qty_4
									}
									else {
										so.fg_allocation_qty_4 = qty
										qty = 0
									}
								}
							}
						}
					}
					for(let so of this.so) {
						if(qty > 0) {
							if(so.model_no == fg.model_no) {
								if(so.qty_5 > 0) {
									if(qty >= so.qty_5) {
										so.fg_allocation_qty_5 = so.qty_5
										qty -= so.qty_5 
									}
									else {
										so.fg_allocation_qty_5 = qty
										qty = 0
									}
								}
							}
						}
					}
					for(let so of this.so) {
						if(qty > 0) {
							if(so.model_no == fg.model_no) {
								if(so.qty_6 > 0) {
									if(qty >= so.qty_6) {
										so.fg_allocation_qty_6 = so.qty_6
										qty -= so.qty_6 
									}
									else {
										so.fg_allocation_qty_6 = qty
										qty = 0
									}
								}
							}
						}
					}
					for(let so of this.so) {
						if(qty > 0) {
							if(so.model_no == fg.model_no) {
								if(so.qty_7 > 0) {
									if(qty >= so.qty_7) {
										so.fg_allocation_qty_7 = so.qty_7
										qty -= so.qty_7 
									}
									else {
										so.fg_allocation_qty_7 = qty
										qty = 0
									}
								}
							}
						}
					}
				}
			}
			for(let so of this.so) {
				if(so.qty_1 > 0) {
					so.lacking_1 = so.qty_1 - so.fg_allocation_qty_1
				}
				else if(so.qty_2 > 0) {
					so.lacking_2 = so.qty_2 - so.fg_allocation_qty_2
				}
				else if(so.qty_3 > 0) {
					so.lacking_3 = so.qty_3 - so.fg_allocation_qty_3
				}
				else if(so.qty_4 > 0) {
					so.lacking_4 = so.qty_4 - so.fg_allocation_qty_4
				}
				else if(so.qty_5 > 0) {
					so.lacking_5 = so.qty_5 - so.fg_allocation_qty_5
				}
				else if(so.qty_6 > 0) {
					so.lacking_6 = so.qty_6 - so.fg_allocation_qty_6
				}
				else if(so.qty_7 > 0) {
					so.lacking_7 = so.qty_7 - so.fg_allocation_qty_7
				}
			}
			this.getMaterials()
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
					wip: 0,
					open_po_1: 0,
					open_po_2: 0,
					open_po_3: 0,
					open_po_4: 0,
					open_po_5: 0,
					open_po_6: 0,
					open_po_7: 0
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
			axios.get('aggregatematerials/?format=json', {
				params: {
					division: this.auth.user.current_division,
					area: this.form.area,
					month: this.form.month
				}
			})
			.then(response => {
				for(let result of response.data) {
					if(result.LOCATION == 'WH/IQC') {
						if(this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString()) != -1) {
							this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].inventory_wh += result.QTY
						}
					}
					else if(result.LOCATION == 'InTransit') {
						if(this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString()) != -1) {
							this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].inventory_intransit += result.QTY
						}
					}
					else if(result.LOCATION == 'Production') {
						if(this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString()) != -1) {
							this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].inventory_pn += result.QTY
						}
					}
				}
				this.getOpenPO()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		getOpenPO() {
			axios.get('aggregatematerials/getopenpo?format=json', {
				params: {
					division: this.auth.user.current_division,
					area: this.form.area,
					month: this.form.month
				}
			})
			.then(response => {
				let a = moment(moment(this.form.month).format('YYYY-MM-01'))
				for(let result of response.data) {
					let b = moment(moment(result.MONTHYEAR, 'MMMM, DD YYYY HH:mm:ss').format('YYYY-MM-01'))

					switch(b.diff(a, 'months') + 1) {
						case 1:
							if(this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString()) != -1) {
								this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].open_po_1 += result.QTY
							}
						break;
						case 2:
							if(this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString()) != -1) {
								this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].open_po_2 += result.QTY
							}
						break;
						case 3:
							if(this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString()) != -1) {
								this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].open_po_3 += result.QTY
							}
						break;
						case 4:
							if(this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString()) != -1) {
								this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].open_po_4 += result.QTY
							}
						break;
						case 5:
							if(this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString()) != -1) {
								this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].open_po_5 += result.QTY
							}
						break;
						case 6:
							if(this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString()) != -1) {
								this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].open_po_6 += result.QTY
							}
						break;
						case 7:
							if(this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString()) != -1) {
								this.materials[this.materials.findIndex(x => x.material_no.toString() == result.MATERIAL_ID.toString())].open_po_7 += result.QTY
							}
						break;
					}
				}
				this.getWIP()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		getWIP() {
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
				this.getSOModelBOMs()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		getSOModelBOMs() {
			axios.get('aggregateallocation/?format=json', {
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
					if(m.bom_item && m.alt_item) {
						if(this.materials.findIndex(x => x.material_no.toString().replace(/^0\./,".") == m.alt_item.toString().replace(/^0\./,".")) == -1) {
							this.rmErrors.push(m.alt_item.toString().replace(/^0\./,"."))
						}
					}
					else if(m.bom_item && !m.alt_item) {
						if(this.materials.findIndex(x => x.material_no.toString().replace(/^0\./,".") == m.bom_item.toString().replace(/^0\./,".")) == -1) {
							this.rmErrors.push(m.bom_item.toString().replace(/^0\./,"."))
						}
					}
				}
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
									if(bDup.indexOf(d.bom_item.toString().replace(/^0\./,".")) == -1 && d.bom_item.toString().replace(/^0\./,".")) {
										bx.push({
											bom_item: d.bom_item.toString().replace(/^0\./,"."),
											bom_name: d.bom_name,
											bom_code: d.bom_code,
											bom_yield: d.bom_yield,
											bom_qty: d.bom_qty,
											bom_req: 0,
											alloc_qty: 0,
											alt: []
										})
										bDup.push(d.bom_item.toString().replace(/^0\./,"."))
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
										if(d.bom_item.toString().replace(/^0\./,".") == b.bom_item.toString().replace(/^0\./,".")) {
											if(aDup.indexOf(d.alt_item.toString().replace(/^0\./,".")) == -1 && d.alt_item.toString().replace(/^0\./,".")) {
												ax.push({
													alt_item: d.alt_item.toString().replace(/^0\./,"."),
													alt_name: d.alt_name,
													alt_code: d.alt_code,
													alt_type: d.alt_type,
													alloc_qty: 0
												})
												aDup.push(d.alt_item.toString().replace(/^0\./,"."))
											}
										}
									}
								}
							}
							b.alt = ax
						}
					}
				}

				this.soModelBOMs = this.so.filter(x => x.lacking_1 > 0 || x.lacking_2 > 0 || x.lacking_3 > 0 || x.lacking_4 > 0 || x.lacking_5 > 0 || x.lacking_6 > 0 || x.lacking_7 > 0).map(so => {
					let m = model.find(x => x.model_no.toString() == so.model_no.toString())
					if(m) {
						return {
							production_id: so.production_id,
							...m,
							process: m.process.map(p => ({
								...p,
								bom: p.bom.map(b => ({
									...b,
									bom_req: Number(Math.round((b.bom_qty * this.getLackingQty(so))+'e'+6)+'e-'+6),
									alloc_qty: 0,
									alt: b.alt.map(a => ({
										...a,
										alloc_qty: 0
									}))
								}))
							}))
						}
					}
					else {
						this.fgErrors.push(so.model_no)
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
				this.computeSOAllocation()
				// alert("MRP finished loading")
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		computeSOAllocation() {
			for(let so of this.so) {
				for(let soBoms of this.soModelBOMs) {
					if(typeof soBoms !== "undefined") {
						if(soBoms.production_id == so.production_id) {
							for(let p of soBoms.process) {
								for(let b of p.bom) {
									if(((200 - b.bom_yield) /100 * b.bom_req) - this.computeTotalQtyBOM(b) > 0) {
										for(let rm of this.materials) {
											if(rm.material_no.toString() == b.bom_item.toString()) {
												if(so.lacking_1 > 0) {
													if(this.computeRMQtyRemaining(b.bom_item.toString(), 1) > 0) {
														if(this.computeRMQtyRemaining(b.bom_item.toString(), 1) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
															b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
														}
														else {
															b.alloc_qty += this.computeRMQtyRemaining(b.bom_item.toString(), 1)
														}
													}
												}
												else if(so.lacking_2 > 0) {
													if(this.computeRMQtyRemaining(b.bom_item.toString(), 2) > 0) {
														if(this.computeRMQtyRemaining(b.bom_item.toString(), 2) >= ((200 - b.bom_yield) / 100 * b.bom_req) -  this.computeTotalQtyBOM(b) ) {
															b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
														}
														else {
															b.alloc_qty += this.computeRMQtyRemaining(b.bom_item.toString(), 2)
														}
													}
												}
												else if(so.lacking_3 > 0) {
													if(this.computeRMQtyRemaining(b.bom_item.toString(), 3) > 0) {
														if(this.computeRMQtyRemaining(b.bom_item.toString(), 3) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
															b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
														}
														else {
															b.alloc_qty += this.computeRMQtyRemaining(b.bom_item.toString(), 3)
														}
													}
												}
												else if(so.lacking_4 > 0) {
													if(this.computeRMQtyRemaining(b.bom_item.toString(), 4) > 0) {
														if(this.computeRMQtyRemaining(b.bom_item.toString(), 4) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
															b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
														}
														else {
															b.alloc_qty += this.computeRMQtyRemaining(b.bom_item.toString(), 4)
														}
													}
												}
												else if(so.lacking_5 > 0) {
													if(this.computeRMQtyRemaining(b.bom_item.toString(), 5) > 0) {
														if(this.computeRMQtyRemaining(b.bom_item.toString(), 5) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
															b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
														}
														else {
															b.alloc_qty += this.computeRMQtyRemaining(b.bom_item.toString(), 5)
														}
													}
												}
												else if(so.lacking_6 > 0) {
													if(this.computeRMQtyRemaining(b.bom_item.toString(), 6) > 0) {
														if(this.computeRMQtyRemaining(b.bom_item.toString(), 6) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
															b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
														}
														else {
															b.alloc_qty += this.computeRMQtyRemaining(b.bom_item.toString(), 6)
														}
													}
												}
												else if(so.lacking_7 > 0) {
													if(this.computeRMQtyRemaining(b.bom_item.toString(), 7) > 0) {
														if(this.computeRMQtyRemaining(b.bom_item.toString(), 7) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
															b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
														}
														else {
															b.alloc_qty += this.computeRMQtyRemaining(b.bom_item.toString(), 7)
														}
													}
												}
												break
											}
										}
										for(let a of b.alt) {
											if(((200 - b.bom_yield) /100 * b.bom_req) - this.computeTotalQtyBOM(b) > 0) {
												for(let rm of this.materials) {
													if(rm.material_no.toString() == a.alt_item.toString()) {
														if(so.lacking_1 > 0) {
															if(this.computeRMQtyRemaining(a.alt_item.toString(), 1) > 0) {
																if(this.computeRMQtyRemaining(a.alt_item.toString(), 1) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
																	a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
																}
																else {
																	a.alloc_qty += this.computeRMQtyRemaining(a.alt_item.toString(), 1)
																}
															}
														}
														else if(so.lacking_2 > 0) {
															if(this.computeRMQtyRemaining(a.alt_item.toString(), 2) > 0) {
																if(this.computeRMQtyRemaining(a.alt_item.toString(), 2) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
																	a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
																}
																else {
																	a.alloc_qty += this.computeRMQtyRemaining(a.alt_item.toString(), 2)
																}
															}
														}
														else if(so.lacking_3 > 0) {
															if(this.computeRMQtyRemaining(a.alt_item.toString(), 3) > 0) {
																if(this.computeRMQtyRemaining(a.alt_item.toString(), 3) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
																	a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
																}
																else {
																	a.alloc_qty += this.computeRMQtyRemaining(a.alt_item.toString(), 3)
																}
															}
														}
														else if(so.lacking_4 > 0) {
															if(this.computeRMQtyRemaining(a.alt_item.toString(), 4) > 0) {
																if(this.computeRMQtyRemaining(a.alt_item.toString(), 4) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
																	a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
																}
																else {
																	a.alloc_qty += this.computeRMQtyRemaining(a.alt_item.toString(), 4)
																}
															}
														}
														else if(so.lacking_5 > 0) {
															if(this.computeRMQtyRemaining(a.alt_item.toString(), 5) > 0) {
																if(this.computeRMQtyRemaining(a.alt_item.toString(), 5) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
																	a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
																}
																else {
																	a.alloc_qty += this.computeRMQtyRemaining(a.alt_item.toString(), 5)
																}
															}
														}
														else if(so.lacking_6 > 0) {
															if(this.computeRMQtyRemaining(a.alt_item.toString(), 6) > 0) {
																if(this.computeRMQtyRemaining(a.alt_item.toString(), 6) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
																	a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
																}
																else {
																	a.alloc_qty += this.computeRMQtyRemaining(a.alt_item.toString(), 6)
																}
															}
														}
														else if(so.lacking_7 > 0) {
															if(this.computeRMQtyRemaining(a.alt_item.toString(), 7) > 0) {
																if(this.computeRMQtyRemaining(a.alt_item.toString(), 7) >= ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b) ) {
																	a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
																}
																else {
																	a.alloc_qty += this.computeRMQtyRemaining(a.alt_item.toString(), 7)
																}
															}
														}
														break
													}
												}
											}
											else {
												break
											}
										}
									}	
								}
							}
							break
						}
					}
				}
			}

			// for(let rm of this.materials) {
			// 	let rmAllocated = 0
			// 	let rmTotal = rm.inventory_pn + rm.inventory_intransit + rm.inventory_wh + rm.wip + rm.open_po_1
			// 	if(rmTotal > 0) {
			// 		for(let so of this.so) {
			// 			if(so.lacking_1 > 0) {
			// 				for(let soBoms of this.soModelBOMs) {
			// 					if(typeof soBoms !== "undefined") {
			// 						if(soBoms.production_id == so.production_id) {
			// 							for(let p of soBoms.process) {
			// 								for(let b of p.bom) {
			// 									if(rm.material_no.toString() == b.bom_item.toString()) {
			// 										if(rmTotal > 0) {
			// 											if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 												b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 												rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 											}
			// 											else {
			// 												b.alloc_qty += rmTotal
			// 												rmTotal -= rmTotal
			// 											}
			// 										}
			// 									}
			// 									for(let a of b.alt) {
			// 										if(rm.material_no.toString() == a.alt_item.toString()) {
			// 											if(rmTotal > 0) {
			// 												if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 													a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 													rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 												}
			// 												else {
			// 													a.alloc_qty += rmTotal
			// 													rmTotal -= rmTotal
			// 												}
			// 											}
			// 										}
			// 									}
			// 								}
			// 							}
			// 						}
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// 	rmTotal += rm.open_po_2
			// 	if(rmTotal > 0) {
			// 		for(let so of this.so) {
			// 			if(so.lacking_2 > 0) {
			// 				for(let soBoms of this.soModelBOMs) {
			// 					if(typeof soBoms !== "undefined") {
			// 						if(soBoms.production_id == so.production_id) {
			// 							for(let p of soBoms.process) {
			// 								for(let b of p.bom) {
			// 									if(rm.material_no.toString() == b.bom_item.toString()) {
			// 										if(rmTotal > 0) {
			// 											if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 												b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 												rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 											}
			// 											else {
			// 												b.alloc_qty += rmTotal
			// 												rmTotal -= rmTotal
			// 											}
			// 										}
			// 									}
			// 									for(let a of b.alt) {
			// 										if(rm.material_no.toString() == a.alt_item.toString()) {
			// 											if(rmTotal > 0) {
			// 												if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 													a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 													rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 												}
			// 												else {
			// 													a.alloc_qty += rmTotal
			// 													rmTotal -= rmTotal
			// 												}
			// 											}
			// 										}
			// 									}
			// 								}
			// 							}
			// 						}
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// 	rmTotal += rm.open_po_3
			// 	if(rmTotal > 0) {
			// 		for(let so of this.so) {
			// 			if(so.lacking_3 > 0) {
			// 				for(let soBoms of this.soModelBOMs) {
			// 					if(typeof soBoms !== "undefined") {
			// 						if(soBoms.production_id == so.production_id) {
			// 							for(let p of soBoms.process) {
			// 								for(let b of p.bom) {
			// 									if(rm.material_no.toString() == b.bom_item.toString()) {
			// 										if(rmTotal > 0) {
			// 											if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 												b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 												rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 											}
			// 											else {
			// 												b.alloc_qty += rmTotal
			// 												rmTotal -= rmTotal
			// 											}
			// 										}
			// 									}
			// 									for(let a of b.alt) {
			// 										if(rm.material_no.toString() == a.alt_item.toString()) {
			// 											if(rmTotal > 0) {
			// 												if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 													a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 													rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 												}
			// 												else {
			// 													a.alloc_qty += rmTotal
			// 													rmTotal -= rmTotal
			// 												}
			// 											}
			// 										}
			// 									}
			// 								}
			// 							}
			// 						}
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// 	rmTotal += rm.open_po_4
			// 	if(rmTotal > 0) {
			// 		for(let so of this.so) {
			// 			if(so.lacking_4 > 0) {
			// 				for(let soBoms of this.soModelBOMs) {
			// 					if(typeof soBoms !== "undefined") {
			// 						if(soBoms.production_id == so.production_id) {
			// 							for(let p of soBoms.process) {
			// 								for(let b of p.bom) {
			// 									if(rm.material_no.toString() == b.bom_item.toString()) {
			// 										if(rmTotal > 0) {
			// 											if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 												b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 												rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 											}
			// 											else {
			// 												b.alloc_qty += rmTotal
			// 												rmTotal -= rmTotal
			// 											}
			// 										}
			// 									}
			// 									for(let a of b.alt) {
			// 										if(rm.material_no.toString() == a.alt_item.toString()) {
			// 											if(rmTotal > 0) {
			// 												if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 													a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 													rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 												}
			// 												else {
			// 													a.alloc_qty += rmTotal
			// 													rmTotal -= rmTotal
			// 												}
			// 											}
			// 										}
			// 									}
			// 								}
			// 							}
			// 						}
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// 	rmTotal += rm.open_po_5
			// 	if(rmTotal > 0) {
			// 		for(let so of this.so) {
			// 			if(so.lacking_5 > 0) {
			// 				for(let soBoms of this.soModelBOMs) {
			// 					if(typeof soBoms !== "undefined") {
			// 						if(soBoms.production_id == so.production_id) {
			// 							for(let p of soBoms.process) {
			// 								for(let b of p.bom) {
			// 									if(rm.material_no.toString() == b.bom_item.toString()) {
			// 										if(rmTotal > 0) {
			// 											if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 												b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 												rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 											}
			// 											else {
			// 												b.alloc_qty += rmTotal
			// 												rmTotal -= rmTotal
			// 											}
			// 										}
			// 									}
			// 								}
			// 								for(let a of b.alt) {
			// 									if(rm.material_no.toString() == a.alt_item.toString()) {
			// 										if(rmTotal > 0) {
			// 											if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 												a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 												rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 											}
			// 											else {
			// 												a.alloc_qty += rmTotal
			// 												rmTotal -= rmTotal
			// 											}
			// 										}
			// 									}
			// 								}
			// 							}
			// 						}
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// 	rmTotal += rm.open_po_6
			// 	if(rmTotal > 0) {
			// 		for(let so of this.so) {
			// 			if(so.lacking_6 > 0) {
			// 				for(let soBoms of this.soModelBOMs) {
			// 					if(typeof soBoms !== "undefined") {
			// 						if(soBoms.production_id == so.production_id) {
			// 							for(let p of soBoms.process) {
			// 								for(let b of p.bom) {
			// 									if(rm.material_no.toString() == b.bom_item.toString()) {
			// 										if(rmTotal > 0) {
			// 											if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 												b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 												rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 											}
			// 											else {
			// 												b.alloc_qty += rmTotal
			// 												rmTotal -= rmTotal
			// 											}
			// 										}
			// 									}
			// 									for(let a of b.alt) {
			// 										if(rm.material_no.toString() == a.alt_item.toString()) {
			// 											if(rmTotal > 0) {
			// 												if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 													a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 													rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 												}
			// 												else {
			// 													a.alloc_qty += rmTotal
			// 													rmTotal -= rmTotal
			// 												}
			// 											}
			// 										}
			// 									}
			// 								}
			// 							}
			// 						}
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// 	rmTotal += rm.open_po_7
			// 	if(rmTotal > 0) {
			// 		for(let so of this.so) {
			// 			if(so.lacking_7 > 0) {
			// 				for(let soBoms of this.soModelBOMs) {
			// 					if(typeof soBoms !== "undefined") {
			// 						if(soBoms.production_id == so.production_id) {
			// 							for(let p of soBoms.process) {
			// 								for(let b of p.bom) {
			// 									if(rm.material_no.toString() == b.bom_item.toString()) {
			// 										if(rmTotal > 0) {
			// 											if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 												b.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 												rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 											}
			// 											else {
			// 												b.alloc_qty += rmTotal
			// 												rmTotal -= rmTotal
			// 											}
			// 										}
			// 									}
			// 									for(let a of b.alt) {
			// 										if(rm.material_no.toString() == a.alt_item.toString()) {
			// 											if(rmTotal > 0) {
			// 												if(rmTotal >= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) ) {
			// 													a.alloc_qty += ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 ) 
			// 													rmTotal -= ((200 - b.bom_yield) / 100 * b.bom_req) - b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
			// 												}
			// 												else {
			// 													a.alloc_qty += rmTotal
			// 													rmTotal -= rmTotal
			// 												}
			// 											}
			// 										}
			// 									}
			// 								}
			// 							}
			// 						}
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// }
			this.fgErrors = Array.from(new Set(this.fgErrors))
			this.rmErrors = Array.from(new Set(this.rmErrors))

			if(this.fgErrors.length || this.rmErrors.length) {
				let errorLogs = ''
				if(this.fgErrors.length) {
					errorLogs+= 'Models with errors: '+this.fgErrors.toString()+'. \n'
				}
				if(this.rmErrors.length) {
					errorLogs+= 'Materials with errors: '+this.rmErrors.toString()+'.'
				}
				saveAs(
					new Blob([errorLogs],
					{type:"text/plain;charset=utf-8"}
				), "errorlog.txt")
			}
			
			alert("MRP finished loading")
		},
		computeRMQtyRequired(item, increment) {
			let required = 0
			if(increment == 1) {
				for(let so of this.so) {
					if(so.lacking_1 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												required += (200 - b.bom_yield) / 100 * b.bom_req
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 2) {
				for(let so of this.so) {
					if(so.lacking_2 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												required += (200 - b.bom_yield) / 100 * b.bom_req
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 3) {
				for(let so of this.so) {
					if(so.lacking_3 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												required += (200 - b.bom_yield) / 100 * b.bom_req
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 4) {
				for(let so of this.so) {
					if(so.lacking_4 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												required += (200 - b.bom_yield) / 100 * b.bom_req
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 5) {
				for(let so of this.so) {
					if(so.lacking_5 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												required += (200 - b.bom_yield) / 100 * b.bom_req
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 6) {
				for(let so of this.so) {
					if(so.lacking_6 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												required += (200 - b.bom_yield) / 100 * b.bom_req
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 7) {
				for(let so of this.so) {
					if(so.lacking_7 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												required += (200 - b.bom_yield) / 100 * b.bom_req
											}
										}
									}
								}
							}
						}
					}
				}
			}
			return required
		},
		computeRMQtyLacking(item, increment) {
			let lacking = 0
			if(increment == 1) {
				for(let so of this.so) {
					if(so.lacking_1 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												if(b.bom_req - this.computeTotalQtyBOM(b) > 0) {
													lacking += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 2) {
				for(let so of this.so) {
					if(so.lacking_2 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												if(b.bom_req - this.computeTotalQtyBOM(b) > 0) {
													lacking += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 3) {
				for(let so of this.so) {
					if(so.lacking_3 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												if(b.bom_req - this.computeTotalQtyBOM(b) > 0) {
													lacking += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 4) {
				for(let so of this.so) {
					if(so.lacking_4 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												if(b.bom_req - this.computeTotalQtyBOM(b) > 0) {
													lacking += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 5) {
				for(let so of this.so) {
					if(so.lacking_5 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												if(b.bom_req - this.computeTotalQtyBOM(b) > 0) {
													lacking += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 6) {
				for(let so of this.so) {
					if(so.lacking_6 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												if(b.bom_req - this.computeTotalQtyBOM(b) > 0) {
													lacking += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 7) {
				for(let so of this.so) {
					if(so.lacking_7 > 0) {
						for(let soBOMs of this.soModelBOMs) {
							if(typeof soBOMs !== "undefined") {
								if(soBOMs.production_id == so.production_id) {
									for(let p of soBOMs.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												if(b.bom_req - this.computeTotalQtyBOM(b) > 0) {
													lacking += ((200 - b.bom_yield) / 100 * b.bom_req) - this.computeTotalQtyBOM(b)
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			return lacking
		},
		computeRMQtyTotal(material_no) {
			let required = Number(Math.round(this.computeRMQtyRequired(material_no, 1)+'e'+6)+'e-'+6) + Number(Math.round(this.computeRMQtyRequired(material_no, 2)+'e'+6)+'e-'+6) + Number(Math.round(this.computeRMQtyRequired(material_no, 3)+'e'+6)+'e-'+6) + Number(Math.round(this.computeRMQtyRequired(material_no, 4)+'e'+6)+'e-'+6) + Number(Math.round(this.computeRMQtyRequired(material_no, 5)+'e'+6)+'e-'+6) + Number(Math.round(this.computeRMQtyRequired(material_no, 6)+'e'+6)+'e-'+6) + Number(Math.round(this.computeRMQtyRequired(material_no, 7)+'e'+6)+'e-'+6)
			let material = this.materials.find(x => x.material_no.toString() == material_no.toString())
			let alt_alloc = 0
			let alt = 0
			for(let so of this.soModelBOMs) {
				if(typeof so !== "undefined") {
					for(let p of so.process) {
						for(let b of p.bom) {
							for(let a of b.alt) {
								if(a.alt_item.toString() == material_no.toString()) {
									alt_alloc += a.alloc_qty
								}
							}
						}
						for(let b of p.bom) {
							if(b.bom_item.toString() == material_no.toString()) {
								for(let a of b.alt) {
									alt += a.alloc_qty
								}
							}
						}
					}
				}
			}
			
			return  ( material.inventory_wh + material.inventory_intransit + material.inventory_pn + material.wip + material.open_po_1 + material.open_po_2 + material.open_po_3 + material.open_po_4 + material.open_po_5 + material.open_po_6 + material.open_po_7) - (required + alt_alloc - alt)
		},
		computeRMQtyRemaining(item, increment) {
			let mat = this.materials.find(x => x.material_no.toString() == item.toString())
			if(increment == 1) {
				return mat.inventory_pn + mat.inventory_intransit + mat.inventory_wh + mat.wip + mat.open_po_1 - this.computeRMAllocation(item, 1)
			}
			else if(increment == 2) {
				return (mat.inventory_pn + mat.inventory_intransit + mat.inventory_wh + mat.wip + mat.open_po_1 + mat.open_po_2) - (this.computeRMAllocation(item, 1) + this.computeRMAllocation(item, 2))
			}
			else if(increment == 3) {
				return (mat.inventory_pn + mat.inventory_intransit + mat.inventory_wh + mat.wip + mat.open_po_1 + mat.open_po_2 + mat.open_po_3) - (this.computeRMAllocation(item, 1) + this.computeRMAllocation(item, 2) + this.computeRMAllocation(item, 3))
			}
			else if(increment == 4) {
				return (mat.inventory_pn + mat.inventory_intransit + mat.inventory_wh + mat.wip + mat.open_po_1 + mat.open_po_2 + mat.open_po_3 + mat.open_po_4) - (this.computeRMAllocation(item, 1) + this.computeRMAllocation(item, 2) + this.computeRMAllocation(item, 3) + this.computeRMAllocation(item, 4))
			}
			else if(increment == 5) {
				return (mat.inventory_pn + mat.inventory_intransit + mat.inventory_wh + mat.wip + mat.open_po_1 + mat.open_po_2 + mat.open_po_3 + mat.open_po_4 + mat.open_po_5) - (this.computeRMAllocation(item, 1) + this.computeRMAllocation(item, 2) + this.computeRMAllocation(item, 3) + this.computeRMAllocation(item, 4) + this.computeRMAllocation(item, 5))
			}
			else if(increment == 6) {
				return (mat.inventory_pn + mat.inventory_intransit + mat.inventory_wh + mat.wip + mat.open_po_1 + mat.open_po_2 + mat.open_po_3 + mat.open_po_4 + mat.open_po_5 + mat.open_po_6) - (this.computeRMAllocation(item, 1) + this.computeRMAllocation(item, 2) + this.computeRMAllocation(item, 3) + this.computeRMAllocation(item, 4) + this.computeRMAllocation(item, 5) + this.computeRMAllocation(item, 6))
			}
			else if(increment == 7) {
				return (mat.inventory_pn + mat.inventory_intransit + mat.inventory_wh + mat.wip + mat.open_po_1 + mat.open_po_2 + mat.open_po_3 + mat.open_po_4 + mat.open_po_5 + mat.open_po_6 + mat.open_po_7) - (this.computeRMAllocation(item, 1) + this.computeRMAllocation(item, 2) + this.computeRMAllocation(item, 3) + this.computeRMAllocation(item, 4) + this.computeRMAllocation(item, 5) + this.computeRMAllocation(item, 6) + this.computeRMAllocation(item, 7))
			}
		},
		computeRMAllocation(item, increment) {
			let rmAllocated = 0
			if(increment == 1) {
				for(let so of this.so) {
					if(so.lacking_1 > 0) {
						for(let soBoms of this.soModelBOMs) {
							if(typeof soBoms !== "undefined") {
								if(soBoms.production_id == so.production_id) {
									for(let p of soBoms.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												rmAllocated += b.alloc_qty
											}
											for(let a of b.alt) {
												if(a.alt_item.toString() == item.toString()) {
													rmAllocated += a.alloc_qty
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 2) {
				for(let so of this.so) {
					if(so.lacking_2 > 0) {
						for(let soBoms of this.soModelBOMs) {
							if(typeof soBoms !== "undefined") {
								if(soBoms.production_id == so.production_id) {
									for(let p of soBoms.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												rmAllocated += b.alloc_qty
											}
											for(let a of b.alt) {
												if(a.alt_item.toString() == item.toString()) {
													rmAllocated += a.alloc_qty
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 3) {
				for(let so of this.so) {
					if(so.lacking_3 > 0) {
						for(let soBoms of this.soModelBOMs) {
							if(typeof soBoms !== "undefined") {
								if(soBoms.production_id == so.production_id) {
									for(let p of soBoms.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												rmAllocated += b.alloc_qty
											}
											for(let a of b.alt) {
												if(a.alt_item.toString() == item.toString()) {
													rmAllocated += a.alloc_qty
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 4) {
				for(let so of this.so) {
					if(so.lacking_4 > 0) {
						for(let soBoms of this.soModelBOMs) {
							if(typeof soBoms !== "undefined") {
								if(soBoms.production_id == so.production_id) {
									for(let p of soBoms.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												rmAllocated += b.alloc_qty
											}
											for(let a of b.alt) {
												if(a.alt_item.toString() == item.toString()) {
													rmAllocated += a.alloc_qty
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 5) {
				for(let so of this.so) {
					if(so.lacking_5 > 0) {
						for(let soBoms of this.soModelBOMs) {
							if(typeof soBoms !== "undefined") {
								if(soBoms.production_id == so.production_id) {
									for(let p of soBoms.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												rmAllocated += b.alloc_qty
											}
											for(let a of b.alt) {
												if(a.alt_item.toString() == item.toString()) {
													rmAllocated += a.alloc_qty
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 6) {
				for(let so of this.so) {
					if(so.lacking_6 > 0) {
						for(let soBoms of this.soModelBOMs) {
							if(typeof soBoms !== "undefined") {
								if(soBoms.production_id == so.production_id) {
									for(let p of soBoms.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												rmAllocated += b.alloc_qty
											}
											for(let a of b.alt) {
												if(a.alt_item.toString() == item.toString()) {
													rmAllocated += a.alloc_qty
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			else if(increment == 7) {
				for(let so of this.so) {
					if(so.lacking_7 > 0) {
						for(let soBoms of this.soModelBOMs) {
							if(typeof soBoms !== "undefined") {
								if(soBoms.production_id == so.production_id) {
									for(let p of soBoms.process) {
										for(let b of p.bom) {
											if(b.bom_item.toString() == item.toString()) {
												rmAllocated += b.alloc_qty
											}
											for(let a of b.alt) {
												if(a.alt_item.toString() == item.toString()) {
													rmAllocated += a.alloc_qty
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			return rmAllocated
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
		computeTotalQtyBOM(b) {
			return b.alloc_qty + b.alt.reduce((sum, alt) => { return sum + alt.alloc_qty }, 0 )
		},
		computeRMTotalRequired(material, increment) {

		},
		getSO(id) {
			return this.so.find( x => x.production_id == id)
		},
		getSOLacking(id) {
			return this.getLackingQty(this.so.find( x => x.production_id == id))
		},
		getLackingQty(so) {
			if(so.lacking_1 > 0) {
				return so.lacking_1
			}
			else if(so.lacking_2 > 0) {
				return so.lacking_2
			}
			else if(so.lacking_3 > 0) {
				return so.lacking_3
			}
			else if(so.lacking_4 > 0) {
				return so.lacking_4
			}
			else if(so.lacking_5 > 0) {
				return so.lacking_5
			}
			else if(so.lacking_6 > 0) {
				return so.lacking_6
			}
			else if(so.lacking_7 > 0) {
				return so.lacking_7
			}
			return false
		},
		getLackingIncrement(so) {
			if(so.lacking_1 > 0) {
				return 1
			}
			else if(so.lacking_2 > 0) {
				return 2
			}
			else if(so.lacking_3 > 0) {
				return 3
			}
			else if(so.lacking_4 > 0) {
				return 4
			}
			else if(so.lacking_5 > 0) {
				return 5
			}
			else if(so.lacking_6 > 0) {
				return 6
			}
			else if(so.lacking_7 > 0) {
				return 7
			}
			return false
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
		},
		getSOAllocatedQty(so) {
			return so.fg_allocation_qty_1 + so.fg_allocation_qty_2 + so.fg_allocation_qty_3 + so.fg_allocation_qty_4 + so.fg_allocation_qty_5 + so.fg_allocation_qty_6 + so.fg_allocation_qty_7
		},
		getSORequiredQty(so) {
			return so.qty_1 + so.qty_2 + so.qty_3 + so.qty_4 + so.qty_5 + so.qty_6 + so.qty_7 
		},
		getLackingSOQty(so) {
			return this.getSORequiredQty(so) - this.getSOAllocatedQty(so)
		},
		getAggregateMonth(month, increment) {
			let a = moment(moment(this.form.month).format('YYYY-MM-01'))
			let b = moment(moment(month, 'MMMM, DD YYYY HH:mm:ss').format('YYYY-MM-01'))
			if(b.diff(a, 'months') == increment- 1) {
				return true
			}
			else {
				return false
			}
		},
		generateFGExcel() {
			let excelData = this.filteredFG.map(item => ({
				model_no: item.model_no,
				model_name: item.model_name,
				qty: item.qty,
				month_1 : item.required_1,
				month1_lacking: item.lacking_1,
				month2: item.required_2,
				month2_lacking: item.lacking_2,
				month3: item.requried_3,
				month3_lacking: item.lacking_3,
				month4: item.required_4,
				month4_lacking: item.lacking_4,
				month5: item.required_5,
				month5_lacking: item.lacking_5,
				month6: item.required_6,
				month6_lacking: item.lacking_6,
				month7: item.required_7,
				month7_lacking: item.lacking_7,
			}))
			let ws = XLSX.utils.json_to_sheet(excelData)
			ws.A1.v = "Model No"
			ws.B1.v = "Model Name"
			ws.C1.v = "Qty"
			ws.D1.v = moment(this.form.month).format('MMMM')
			ws.E1.v = `${moment(this.form.month).format('MMMM')} Lacking`
			ws.F1.v = moment(this.form.month).add(1, 'months').format('MMMM')
			ws.G1.v = `${moment(this.form.month).add(1, 'months').format('MMMM')} Lacking`
			ws.H1.v = moment(this.form.month).add(2, 'months').format('MMMM')
			ws.I1.v = `${moment(this.form.month).add(2, 'months').format('MMMM')} Lacking`
			ws.J1.v = moment(this.form.month).add(3, 'months').format('MMMM')
			ws.K1.v = `${moment(this.form.month).add(3, 'months').format('MMMM')} Lacking`
			ws.L1.v = moment(this.form.month).add(4, 'months').format('MMMM')
			ws.M1.v = `${moment(this.form.month).add(4, 'months').format('MMMM')} Lacking`
			ws.N1.v = moment(this.form.month).add(5, 'months').format('MMMM')
			ws.O1.v = `${moment(this.form.month).add(5, 'months').format('MMMM')} Lacking`
			ws.P1.v = moment(this.form.month).add(6, 'months').format('MMMM')
			ws.Q1.v = `${moment(this.form.month).add(6, 'months').format('MMMM')} Lacking`
			ws['!autofilter'] = { ref: `A1:Q${excelData.length+1}` }
			let wb = XLSX.utils.book_new()
			wb.Props = {
				Title: "MRP - FG",
				Author: "Kay Singian"
			}
			XLSX.utils.book_append_sheet(wb, ws, "MRP FG")
			let wbout = XLSX.write(wb, {type:"array", bookType:"xlsx"})
			saveAs(
				new Blob([wbout],
				{type:"application/octet-stream"}
			), "mrp_fg.xlsx")
		},
		generateRMExcel() {
			let excelData = this.filteredMaterials.map(item => ({
				material_no: item.material_no,
				material_name: item.material_name,
				inventory_wh: item.inventory_wh,
				inventory_intransit: item.inventory_intransit,
				inventory_pn: item.inventory_pn,
				wip: item.wip,
				open_po_1: item.open_po_1,
				required_1: Number(Math.round(this.computeRMQtyRequired(item.material_no, 1)+'e'+6)+'e-'+6),
				allocated_1: this.computeRMAllocation(item.material_no, 1),
				lacking_1: Number(Math.round(this.computeRMQtyLacking(item.material_no, 1)+'e'+6)+'e-'+6),
				open_po_2: item.open_po_2,
				required_2: Number(Math.round(this.computeRMQtyRequired(item.material_no, 2)+'e'+6)+'e-'+6),
				allocated_2: this.computeRMAllocation(item.material_no, 2),
				lacking_2: Number(Math.round(this.computeRMQtyLacking(item.material_no, 2)+'e'+6)+'e-'+6),
				open_po_3: item.open_po_3,
				required_3: Number(Math.round(this.computeRMQtyRequired(item.material_no, 3)+'e'+6)+'e-'+6),
				allocated_3: this.computeRMAllocation(item.material_no, 3),
				lacking_3: Number(Math.round(this.computeRMQtyLacking(item.material_no, 3)+'e'+6)+'e-'+6),
				open_po_4: item.open_po_4,
				required_4: Number(Math.round(this.computeRMQtyRequired(item.material_no, 4)+'e'+6)+'e-'+6),
				allocated_4: this.computeRMAllocation(item.material_no, 4),
				lacking_4: Number(Math.round(this.computeRMQtyLacking(item.material_no, 4)+'e'+6)+'e-'+6),
				open_po_5: item.open_po_5,
				required_5: Number(Math.round(this.computeRMQtyRequired(item.material_no, 5)+'e'+6)+'e-'+6),
				allocated_5: this.computeRMAllocation(item.material_no, 5),
				lacking_5: Number(Math.round(this.computeRMQtyLacking(item.material_no, 5)+'e'+6)+'e-'+6),
				open_po_6: item.open_po_6,
				required_6: Number(Math.round(this.computeRMQtyRequired(item.material_no, 6)+'e'+6)+'e-'+6),
				allocated_6: this.computeRMAllocation(item.material_no, 6),
				lacking_6: Number(Math.round(this.computeRMQtyLacking(item.material_no, 6)+'e'+6)+'e-'+6),
				open_po_7: item.open_po_7,
				required_7: Number(Math.round(this.computeRMQtyRequired(item.material_no, 7)+'e'+6)+'e-'+6),
				allocated_7: this.computeRMAllocation(item.material_no, 7),
				lacking_7: Number(Math.round(this.computeRMQtyLacking(item.material_no, 7)+'e'+6)+'e-'+6),
				total: Number(Math.round(this.computeRMQtyTotal(item.material_no)+'e'+6)+'e-'+6)
			}))
			let ws = XLSX.utils.json_to_sheet(excelData)
			ws.A1.v = "Material No"
			ws.B1.v = "Material Name"
			ws.C1.v = "Inventory Warehouse"
			ws.D1.v = "Inventory InTransit"
			ws.E1.v = "Inventory Production"
			ws.F1.v = "WIP"
			ws.G1.v = `${moment(this.form.month).format('MMMM')} Open PO`
			ws.H1.v = `${moment(this.form.month).format('MMMM')} Required`
			ws.I1.v = `${moment(this.form.month).format('MMMM')} Material Allocated`
			ws.J1.v = `${moment(this.form.month).format('MMMM')} Lacking`
			ws.K1.v = `${moment(this.form.month).add(1, 'months').format('MMMM')} Open PO`
			ws.L1.v = `${moment(this.form.month).add(1, 'months').format('MMMM')} Required`
			ws.M1.v = `${moment(this.form.month).add(1, 'months').format('MMMM')} Material Allocated`
			ws.N1.v = `${moment(this.form.month).add(1, 'months').format('MMMM')} Lacking`
			ws.O1.v = `${moment(this.form.month).add(2, 'months').format('MMMM')} Open PO`
			ws.P1.v = `${moment(this.form.month).add(2, 'months').format('MMMM')} Required`
			ws.Q1.v = `${moment(this.form.month).add(2, 'months').format('MMMM')} Material Allocated`
			ws.R1.v = `${moment(this.form.month).add(2, 'months').format('MMMM')} Lacking`
			ws.S1.v = `${moment(this.form.month).add(3, 'months').format('MMMM')} Open PO`
			ws.T1.v = `${moment(this.form.month).add(3, 'months').format('MMMM')} Required`
			ws.U1.v = `${moment(this.form.month).add(3, 'months').format('MMMM')} Material Allocated`
			ws.V1.v = `${moment(this.form.month).add(3, 'months').format('MMMM')} Lacking`
			ws.W1.v = `${moment(this.form.month).add(4, 'months').format('MMMM')} Open PO`
			ws.X1.v = `${moment(this.form.month).add(4, 'months').format('MMMM')} Required`
			ws.Y1.v = `${moment(this.form.month).add(4, 'months').format('MMMM')} Material Allocated`
			ws.Z1.v = `${moment(this.form.month).add(4, 'months').format('MMMM')} Lacking`
			ws.AA1.v = `${moment(this.form.month).add(5, 'months').format('MMMM')} Open PO`
			ws.AB1.v = `${moment(this.form.month).add(5, 'months').format('MMMM')} Required`
			ws.AC1.v = `${moment(this.form.month).add(5, 'months').format('MMMM')} Material Allocated`
			ws.AD1.v = `${moment(this.form.month).add(5, 'months').format('MMMM')} Lacking`
			ws.AE1.v = `${moment(this.form.month).add(6, 'months').format('MMMM')} Open PO`
			ws.AF1.v = `${moment(this.form.month).add(6, 'months').format('MMMM')} Required`
			ws.AG1.v = `${moment(this.form.month).add(6, 'months').format('MMMM')} Material Allocated`
			ws.AH1.v = `${moment(this.form.month).add(6, 'months').format('MMMM')} Lacking`
			ws.AI1.v = 'Total'
			ws['!autofilter'] = { ref: `A1:AI${excelData.length+1}` }
			let wb = XLSX.utils.book_new()
			wb.Props = {
				Title: "MRP - RM",
				Author: "Kay Singian"
			}
			XLSX.utils.book_append_sheet(wb, ws, "MRP RM")
			let wbout = XLSX.write(wb, {type:"array", bookType:"xlsx"})
			saveAs(
				new Blob([wbout],
				{type:"application/octet-stream"}
			), "mrp_rm.xlsx")
		},
		generateSOExcel() {
			let excelData = this.so.map(item => ({
				production_id: item.production_id,
				so_no: item.so_no,
				so_line_id: item.so_line_id,
				remarks: item.remarks,
				date: (item.date ? moment(item.date, 'MMMM, DD YYYY HH:mm:ss').format('MMM DD, YYYY') : item.date),
				model_no: item.model_no,
				model_name: item.model_name,
				qty_1: item.qty_1,
				qty_2: item.qty_2,
				qty_3: item.qty_3,
				qty_4: item.qty_4,
				qty_5: item.qty_5,
				qty_6: item.qty_6,
				qty_7: item.qty_7,
				allocated_qty: this.getSOAllocatedQty(item),
				lacking: this.getLackingWithQty(item)
			}))
			let ws = XLSX.utils.json_to_sheet(excelData)
			ws.A1.v = "Production ID"
			ws.B1.v = "Sales Order Number"
			ws.C1.v = "Sales Order Line ID"
			ws.D1.v = "Remarks"
			ws.E1.v = "Date"
			ws.F1.v = "Model Number"
			ws.G1.v = "Model Name"
			ws.H1.v = moment(this.form.month).format("MMMM")
			ws.I1.v = moment(this.form.month).add(1, "months").format("MMMM")
			ws.J1.v = moment(this.form.month).add(2, "months").format("MMMM")
			ws.K1.v = moment(this.form.month).add(3, "months").format("MMMM")
			ws.L1.v = moment(this.form.month).add(4, "months").format("MMMM")
			ws.M1.v = moment(this.form.month).add(5, "months").format("MMMM")
			ws.N1.v = moment(this.form.month).add(6, "months").format("MMMM")
			ws.O1.v = "Allocated Qty"
			ws.P1.v = "Lacking"
			ws['!autofilter'] = { ref: `A1:P${excelData.length+1}` }
			let wb = XLSX.utils.book_new()
			wb.Props = {
				Title: "MRP - SO",
				Author: "Kay Singian"
			}
			XLSX.utils.book_append_sheet(wb, ws, "MRP SO")
			let wbout = XLSX.write(wb, {type:"array", bookType:"xlsx"})
			saveAs(
				new Blob([wbout],
				{type:"application/octet-stream"}
			), "mrp_so.xlsx")
		},
		getLackingWithQty(item) {
			if(item.lacking_1 > 0) {
				return item.lacking_1
			}
			else if(item.lacking_2 > 0) {
				return item.lacking_2
			}
			else if(item.lacking_3 > 0) {
				return item.lacking_3
			}
			else if(item.lacking_4 > 0) {
				return item.lacking_4
			}
			else if(item.lacking_5 > 0) {
				return item.lacking_5
			}
			else if(item.lacking_6 > 0) {
				return item.lacking_6
			}
			else if(item.lacking_7 > 0) {
				return item.lacking_7
			}
			else {
				return 0
			}
		},
		getClickableSO(soModelBoms, production_id) {
			for(let so of soModelBoms) {
				if(typeof so !== "undefined") {
					if(so.production_id == production_id) {
						return true
					}
				}
			}
			return false
		},
		NumberFormat(value) {
		    // return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		    // return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
		    return value
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