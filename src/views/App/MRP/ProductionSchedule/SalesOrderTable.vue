<template>
	<div>
		<v-client-table :data="TableData" :columns="columns" :options="options" v-if="TableData">
			<template slot="requested_delivery_date" scope="props">
				<template v-if="props.row.requested_delivery_date">{{ [props.row.requested_delivery_date, 'MMMM, DD YYYY HH:mm:ss'] | moment('MMM DD, YYYY') }}</template>
				<template v-else></template>
			</template>
			<template slot="so_line_id" scope="props">
				<strong><a @click="setUpdateID(props.row.so_line_id)">{{ props.row.so_line_id }}</a></strong>
			</template>
			<template slot="so_no" scope="props">
				<template v-if="props.row.so_no || props.row.so_no === 0">{{ props.row.so_no }}</template>
				<template v-else>n/a</template>
			</template>
			<template slot="confirmed_date" scope="props">
				<template v-if="props.row.confirmed_date">{{ [props.row.confirmed_date, 'MMMM, DD YYYY HH:mm:ss'] | moment('MMM DD, YYYY') }}</template>
				<template v-else>{{ props.row.confirmed_date }}</template>
			</template>
			<template slot="production_date" scope="props">
				<template v-if="props.row.production_date">{{ [props.row.production_date, 'MMMM, DD YYYY HH:mm:ss'] | moment('MMM DD, YYYY') }}</template>
				<template v-else>{{ props.row.production_date }}</template>
			</template>
			<template slot="sum_qty" scope="props">
				<template v-if="props.row.sum_qty">
					<span class="badge bg-red"  v-if="props.row.sum_qty > props.row.qty">{{ props.row.sum_qty }}</span>
					<span class="badge bg-green"  v-else-if="props.row.sum_qty == props.row.qty">{{ props.row.sum_qty }}</span>
					<span class="badge bg-yellow" v-else>{{ props.row.sum_qty }}</span>
				</template>
			</template>
			<template slot="qty" scope="props">{{ new Intl.NumberFormat().format(props.row.qty) }}</template>
			<template slot="h__so_no" scope="props"><span>SO No.</span></template>
			<template slot="h__so_line_id" scope="props">
				<span>SO Line</span>
			</template>
			<template slot="h__model_no" scope="props">
				<span>Model No.</span>
			</template>
			<template slot="h__model_name" scope="props">
				<span>Model Name.</span>
			</template>
			<template slot="h__sum_qty" scope="props">
				<span>Scheduled Production Qty</span>
			</template>
			<template slot="h__requested_delivery_date" scope="props">
				<span>Requested Date</span>
			</template>
			<template slot="h__confirmed_date" scope="props">
				<span>Confirmed Delivery Date</span>
			</template>
		</v-client-table>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	props: ['month', 'area'],
	data() {
		return {
			columns: ['so_line_id','so_no','model_no', 'model_name', 'qty', 'sum_qty', 'requested_delivery_date', 'confirmed_date',],
			TableData: [],
			options: {
				columnsClasses: {
					so_line_id: 'col-md-1 pointer',
					so_id: 'col-md-1',
					model_no: 'col-md-1',
					model_name: 'col-md-3',
					qty: 'col-md-1',
					sum_qty: 'col-md-1',
					requested_delivery_date: 'col-md-2',
					confirmed_date: 'col-md-2',
				},
			},
			orderBy: { ascending:false },
			orderBy: { column:'' },
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
		month() {
			this.getTableData()
		},
		area() {
			this.getTableData()
		},
		tableStatus(value) {
			if(value === true) {
				this.getTableData()
			}
		}
	},
	created() {
		this.getTableData()
	},
	methods: {
		getTableData() {
			this.Tabledata = []
			axios.get('mrpproductionsalesorder/?format=json', {
				params: {
					division: this.auth.user.current_division,
					area: this.area,
					month: this.month
				}
			})
			.then(response => {
				this.TableData = response.data
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		setUpdateID(id) {
			this.$store.commit('SET_CLIENT_TABLE_ID', id)
		}
	}
}
</script>

<style>
td.pointer {
	cursor: pointer;
}
</style>