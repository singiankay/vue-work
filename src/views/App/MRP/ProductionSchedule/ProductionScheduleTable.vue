<template>
	<div>
		<div class="box box-primary">
			<div class="box-header">
				<h3 class="box-title">Production Schedule for SO Line # {{ id }}</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				
				<p>Quantity Remaining: {{ qtyRemaining() }}</p>
				<v-client-table :data="TableData" :columns="columns" :options="options" v-if="TableData">
					<template slot="id" scope="props"><a @click="setUpdateID(props.row.id)">{{ props.row.id }}</a></template>
					<template slot="qty" scope="props">{{ props.row.qty }}</template>
					<template slot="date" scope="props">
						<template v-if="props.row.date">{{ [props.row.date, 'MMMM, DD YYYY HH:mm:ss'] | moment('MMM DD, YYYY') }}</template>
						<template v-else>{{ props.row.date }}</template>
					</template>
					<template slot="remarks" scope="props">{{ props.row.remarks }}</template>
					<template slot="encoded_by" scope="props">{{ props.row.encoded_by }}</template>
					<template slot="h__id" scope="props">Production Schedule #</template>
					<template slot="h__qty" scope="props">Qty</template>
					<template slot="h__date" scope="props">Production Date</template>
					<template slot="h__remarks" scope="props">Remarks</template>
					<template slot="h__updated_by" scope="props">Last Updated By</template>
				</v-client-table>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	props: ['id'],
	data() {
		return {
			columns: ['id','qty','date', 'remarks', 'updated_by'],
			TableData: [],
			options: {
				columnsClasses: {
					id: 'col-md-2 pointer',
					qty: 'col-md-2',
					date: 'col-md-2',
					remarks: 'col-md-3',
					encoded_by: 'col-md-3'
				},
			},
			orderBy: { ascending:false },
			orderBy: { column:'' },
			so_line: {
				qty: null
			}
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
		id() {
			this.getProductionSchedule()
			this.$store.dispatch('CLIENT_LINE_CLEAR')
		},
		tableStatus(value) {
			if(value === true) {
				this.getProductionSchedule()
			}
		}
	},
	created() {
		this.getProductionSchedule()
	},
	methods: {
		setUpdateID(id) {
			this.$store.dispatch('CLIENT_LINE_UPDATE_ID', id)
		},
		getProductionSchedule() {
			axios.get('productionschedule', {
				params: {
					so_line_id: this.id
				}
			})
			.then(response => {
				this.so_line = {
					id: response.data.id,
					area: response.data.area,
					confirmed_date: response.data.confirmed_date,
					customer_id: response.data.customer_id,
					customer_pn: response.data.customer_pn,
					date_created: response.data.date_created,
					date_updated: response.data.date_updated,
					is_active: response.data.is_active,
					model_id: response.data.model_id,
					qty: response.data.qty,
					remarks: response.data.remarks,
					requested_delivery_date: response.data.requested_delivery_date,
					so_id: response.data.so_id
				}
				this.TableData = response.data.productionschedules
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		qtyRemaining() {
			if(this.TableData) {
				return this.so_line.qty - this.TableData.reduce((sum, key) => sum += key.qty, 0)
			}
			else {
				return 0
			}
		}
	},
	beforeDestroy() {
		
	}
}
</script>

<style>
td.pointer {
	cursor: pointer;
}
</style>