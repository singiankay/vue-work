<template>
	<div>
		<div id="sales-order-table">
			<v-server-table name="SalesOrderTable" :url="'salesorder/?division='+division+'&area='+area+'&format=json'" :columns="columns" :options="options" ref="salesTable">
				<template slot="row_index" scope="props">{{ props.index }}</template>
				<template slot="so_number" scope="props">
					<a @click="setUpdateID(props.row)">{{ props.row.so_number }}</a>
				</template>
				<template slot="h__row_index" scope="props">
					<span># &nbsp;</span>
				</template>
				<template slot="h__so_number" scope="props">
					<span>Sales Order</span>
				</template>
				<template slot="h__so_date" scope="props">
					<span>SO Date</span>
				</template>
				<template slot="h__customer_name" scope="props">
					<span>Customer Name</span>
				</template>
				<template slot="h__customer_req_delivery_date" scope="props">
					<span>Customer Delivery Date</span>
				</template>
				<template slot="h__confirmation_date" scope="props">
					<span>Confirmation Date</span>
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
	</div>
</template>

<script>
export default {
	props: ['division','area'],
	data() {
		return {
			columns: ['row_index', 'so_number', 'so_date', 'customer_name', 'customer_req_delivery_date', 'confirmation_date', 'remarks', 'document_status', 'shipment_status'],
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
						so_number: item.so_number,
						so_date: item.so_date,
						customer_name: item.customer_name,
						customer_req_delivery_date: item.customer_req_delivery_date,
						confirmation_date: item.confirmation_date,
						remarks: item.remarks,
						document_status: item.document_status,
						shipment_status: item.shipment_status
					}))
					return { 
						data: resp,
						count: count
					}
				},
				sortable: ['so_number', 'so_date', 'customer_name', 'customer_req_delivery_date', 'confirmation_date', 'remarks', 'document_status', 'shipment_status'],
				columnsClasses: {
					row_index: 'col-md-1',
					so_number:'col-md-1 pointer',
					so_date: 'col-md-1',
					customer_name: 'col-md-2',
					customer_req_delivery_date: 'col-md-2',
					confirmation_date: 'col-md-2',
					remarks: 'col-md-1',
					document_status: 'col-md-1',
					shipment_status: 'col-md-1'
				},
			}
		}
	}
}
</script>

<style>
td.pointer {
	cursor: pointer;
}
</style>