<template>
	<div>
		<v-server-table name="SalesOrderTable" :url="'salesorder/?division='+division+'&format=json'" :columns="columns" :options="options" ref="salesorderTable">
			<template slot="row_index" scope="props">{{ props.index }}</template>
			<template slot="so_date" scope="props">{{ props.row.so_date }}</template>
			<template slot="document_status" scope="props">
				<span v-if="props.row.document_status == 'Posted'" class="label label-success">{{ props.row.document_status }}</span>
				<span v-else-if="props.row.document_status == 'Void'" class="label bg-navy">{{ props.row.document_status }}</span>
			</template>
			<template slot="shipment_status" scope="props">
				<span v-if="props.row.shipment_status == 'Forecast'" class="label label-warning">{{ props.row.shipment_status }}</span>
				<span v-else-if="props.row.shipment_status == 'Balance'" class="label label-primary">{{ props.row.shipment_status }}</span>
				<span v-else-if="props.row.shipment_status == 'Shipped'" class="label label-success">{{ props.row.shipment_status }}</span>
				<span v-else-if="props.row.shipment_status == 'On Hold'" class="label label-danger">{{ props.row.shipment_status }}</span>
				<span v-else-if="props.row.shipment_status == 'Canceled'" class="label bg-navy">{{ props.row.shipment_status }}</span>
			</template>
			<template slot="so_number" scope="props">
				<strong>
					<a @click="setUpdateID(props.row)" v-if="props.row.so_number || props.row.so_number === 0">{{ props.row.so_number }}</a>
					<a @click="setUpdateID(props.row)" v-else>n/a</a>
				</strong>
			</template>
			<template slot="h__row_index" scope="props">
				<span># &nbsp;</span>
			</template>
			<template slot="h__so_number" scope="props">
				<span>Sales Order No.</span>
			</template>
			<template slot="h__so_date" scope="props">
				<span>Date</span>
			</template>
			<template slot="h__customer_name" scope="props">
				<span>Customer Name</span>
			</template>
			<template slot="h__remarks" scope="props">
				<span>Remarks</span>
			</template>
			<template slot="h__document_status" scope="props">
				<span>Document Status</span>
			</template>
			<template slot="h__shipment_status" scope="props">
				<span>Shipment Status</span>
			</template>
		</v-server-table>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	props: ['division'],
	data() {
		return {
			columns: ['so_number', 'so_date', 'customer_name', 'document_status', 'shipment_status', 'remarks'],
			options: {
				responseAdapter: (resp) => {
					let count
					if(resp[0] != null) {
						count = resp[0]['total']
					}
					else {
						count = 0
					}
					resp = resp.map(item => ({
						id: item.id,
						so_number: item.so_number,
						so_date: item.so_date,
						customer_name: item.customer_name,
						remarks: item.remarks,
						document_status: item.document_status,
						shipment_status: item.shipment_status
					}))
					return { 
						data: resp,
						count: count
					}
				},
				sortable: ['so_number', 'so_date', 'customer_req_delivery_date', 'confirmation_date', 'remarks', 'document_status', 'shipment_status'],
				filterable: ['so_number', 'so_date', 'customer_req_delivery_date', 'confirmation_date', 'remarks', 'document_status', 'shipment_status'],
				columnsClasses: {
					row_index: 'col-md-1',
					so_number:'col-md-2 pointer',
					so_date: 'col-md-2',
					customer_name: 'col-md-3',
					document_status: 'col-md-1',
					shipment_status: 'col-md-1',
					remarks: 'col-md-2',
				},
				orderBy: {ascending: false}
			}
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
		tableStatus() {
			return this.$store.getters.CLIENTTABLESTATUS
		}
	},
	watch: {
		division() {
			this.refresh()
		},
		area() {
			this.refresh()
		},
		tableStatus(value) {
			if(value === false) {
				this.refresh()
			}
		}
	},
	created() {
		this.$store.dispatch('CLIENT_INIT_TABLE_ACTIVE')
	},
	methods: {
		setUpdateID(row) {
			this.$store.dispatch('CLIENT_UPDATE_ID', row.id)
		},
		refresh() {
			setTimeout(() => {
             this.$refs.salesorderTable.refresh()
         }, 1)
		}
	},
}
</script>

<style>
td.pointer {
	cursor: pointer;
}
</style>