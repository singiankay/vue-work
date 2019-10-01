<template>
	<div>
		<div class="row">
			<div class="col-md-8">
				<div class="box box-solid box-default">
					<div class="box-header with-border">
						<h3 class="box-title">Materials SO # {{ id }}</h3>
						<div class="box-tools pull-right">
							<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<div id="sales-order-lines-table">
							<v-client-table name="clientTableLine" :data="tableData" :columns="columns" :options="options" v-if="tableData">
								<template slot="rowIndex" scope="props">{{ props.index }}</template>
								<template slot="model_id" scope="props">
									<strong><a @click="setUpdateID(props.row.line_id)">{{props.row.model_id}}</a></strong>
								</template>
								<template slot="model_name" scope="props">
									<small>{{ props.row.model_name }}</small>
								</template>
								<template slot="customer_name" scope="props">
									<small>{{ props.row.customer_name }}</small>
								</template>
								<template slot="area" scope="props">{{ areaName(props.row.area) }}</template>
								<template slot="qty" scope="props">
									{{ new Intl.NumberFormat().format(props.row.qty) }}
								</template>
								<template slot="h__line_id" scope="props">
									<span>Line ID</span>
								</template>
								<template slot="h__model_id" scope="props">
									<span>Model #</span>
								</template>
								<template slot="h__model_name" scope="props">
									<span>Name</span>
								</template>
								<template slot="h__qty" scope="props">
									<span>Qty</span>
								</template>
								<template slot="h__customer_pn" scope="props">
									<span>Customer P/N</span>
								</template>
								<template slot="h__customer_name" scope="props">
									<span>Customer</span>
								</template>
								<template slot="h__requested_delivery_date" scope="props">
									<small>Requested Delivery Date</small>
								</template>
								<template slot="h__confirmed_date" scope="props">
									<small>Confirmed Delivery Date</small>
								</template>
								<template slot="h__remarks" scope="props">
									<span>Remarks</span>
								</template>
							</v-client-table>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				<transition name="lineOption" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
					<line-create :id="id" :customer-id="customer_id" v-if="client.line.type =='create' && customer_id"></line-create>
					<line-update :id="line_id" :sales-order-id="id" :customer-id="customer_id" v-if="client.line.type =='update' && customer_id"></line-update>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import LineCreate from './LineCreate.vue'
import LineUpdate from './LineUpdate.vue'

export default {
	components: {
		LineCreate,
		LineUpdate
	},
	props: ['id'],
	data() {
		return {
			columns: ['model_id', 'model_name', 'area', 'qty', 'customer_name',  'customer_pn','requested_delivery_date','confirmed_date', 'remarks'],
			tableData: [],
			options: {
				columnsClasses: {
					area: 'col-md-1',
					model_id:'col-md-1 pointer',
					model_name: 'col-md-2',
					qty: 'col-md-1',
					customer_pn: 'col-md-1',
					customer_name: 'col-md-2',
					requested_delivery_date: 'col-md-1',
					confirmed_date: 'col-md-1',
					remarks: 'col-md-1'
				},
				orderBy: {ascending:false},
				orderBy: {column:'line_id'},
			},
			customer_id: '',
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
		tableStatus() {
			return this.client.line.status
		},
		line_id() {
			return this.client.line.id
		}
	},
	watch: {
		id(value) {
			if(value) {
				this.getSalesOrder()
				this.getSalesOrderLines()
				this.$store.dispatch('CLIENT_LINE_CREATE')
			}
		},
		tableStatus(value) {
			if(value === true) {
				this.getSalesOrderLines()
			}
		}
	},
	created() {
		this.getSalesOrder()
		this.getSalesOrderLines()
		this.$store.dispatch('CLIENT_LINE_CREATE')
		this.$store.dispatch('CLIENT_INIT_LINE_ACTIVE')
	},
	methods: {
		getSalesOrder() {
			this.$Progress.start()
			axios.get(`salesorder/${this.id}?format=json`)
			.then(response => {
				this.customer_id = response.data.customer_id
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		},
		getSalesOrderLines() {
			this.tableData = []
			this.$Progress.start()
			axios.get(`salesorder/${this.id}/salesorderline?format=json`)
			.then(response => {
				for (let [index, value] of response.data.entries()) {
					this.tableData.push({
						line_id: value.id,
						area: value.area,
						model_id: value.model_id,
						model_name: value.model_name,
						qty: value.qty,
						customer_name: value.customer_name,
						customer_pn: value.customer_pn,
						requested_delivery_date: value.requested_delivery_date,
						confirmed_date: value.confirmed_date,
						remarks: value.remarks
					})
				}
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		},
		setUpdateID(id) {
			this.$store.dispatch('CLIENT_LINE_UPDATE_ID', id)
		},
		areaName(area) {
			return this.auth.areas.find(x => x.id == area).area
		}
	},
	beforeDestroy() {
		this.$store.dispatch('CLIENT_LINE_CLEAR')
	}
}
</script>

<style>
td.pointer {
	cursor: pointer;
}
</style>