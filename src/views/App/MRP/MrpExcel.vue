<template>
	<div id="example-container">
      <HotTable :root="root" :settings="hotSettings"></HotTable>
  </div>
</template>

<script>
import HotTable from 'vue-handsontable-official'

export default {
	name: 'MRPReport',
	components: {
		HotTable
	},
	props: ['type', 'division', 'area', 'month'],
	data() {
		return {
			mrpData: null,
			root: 'test-hot',
			hotSettings: {
				colHeaders: [
					'Material No.',
					'Material Name',
					'MOQ',
					'Minimum Stock Qty',
					'Lead Time (days)',
					moment(this.month).format('MMMM YYYY'),
					moment().add(1,'M').format('MMMM YYYY'),
					moment().add(2,'M').format('MMMM YYYY'),
					moment().add(3,'M').format('MMMM YYYY'),
					moment().add(4,'M').format('MMMM YYYY'),
					'Subtotal'
				],
				readOnly: true,
				contextMenu: false,
				comments: false,
				columns: [
					{ data: 'material_no', type: 'text' },
					{ data: 'material_name', type: 'text' },
					{ data: 'moq', type: 'text' },
					{ data: 'minimum_stock_qty', type: 'numeric' },
					{ data: 'lead_time', type: 'date', dateFormat: 'MM/DD/YYYY' },
					{ data: 'month_1', type: 'date', dateFormat: 'MM/DD/YYYY' },
					{ data: 'month_2', type: 'numeric' },
					{ data: 'month_3', type: 'numeric' },
					{ data: 'month_4', type: 'numeric' },
					{ data: 'month_5', type: 'numeric' },
					{ data: 'subtotal', type: 'numeric'}
				],
				stretchH: 'all',
				columnSorting: true,
				autoWrapRow: true,
				manualRowResize: true,
				manualColumnResize: true,
				sortIndicator: true,
				fixedRowsTop: 1,
				fixedColumnsLeft: 1,
				minRows: 0,
				data: this.report
			}
		}
	},
	created() {
		
	},
}
</script>

<style>
  #test-hot {
    height: 500px;
    overflow: hidden;
  }
</style>