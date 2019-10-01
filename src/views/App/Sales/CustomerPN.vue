<template>
	<div>
		<alert></alert>
		<div class="row">
			<div class="col-md-8">
				<div class="box box-primary">
					<div class="box-header with-border">
						<h3 class="box-title">Customers</h3>
						<div class="box-tools pull-right">
							<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<v-server-table name="CustomerTable" :url="'customerpn/?format=json'" :columns="customerColumns" :options="customerOptions" ref="CustomerTable">
							<template slot="name" scope="props">
								<a @click="setCustomerID(props.row.code)">{{ props.row.name }}</a>
							</template>
						</v-server-table>
					</div>
				</div>
			</div>
			<transition name="documentWindow" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
				<customer-models v-if="client.table.id" :code="client.table.id"></customer-models>
			</transition>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Alert from '../../../components/layout/Alert.vue'
import CustomerModels from './CustomerModels.vue'

export default {
	components: {
		Alert,
		CustomerModels
	},
	data() {
		return {
			customerColumns: ['name'],
			customerOptions: {
				responseAdapter: (resp) => {
					let data = resp.data.map(item => ({
						code: item.CARDCODE,
						name: item.CARDNAME
					}))
					return { 
						data: data,
						count: resp.total
					}
				},
				columnsClasses: {
					name: 'pointer'
				}
			}
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
	},
	created() {
		this.$store.dispatch('CLIENT_CREATE')
	},
	methods: {
		setCustomerID(code) {
			this.$store.dispatch('CLIENT_UPDATE_ID', code)
		},
	},
	beforeDestroy() {
		this.$store.dispatch('CLIENT_CLEAR')
		this.$store.dispatch('CLIENT_LINE_CLEAR')
		this.$store.commit('CLEAR_ALERT')
	}
}
</script>

<style>
td.pointer {
	cursor: pointer;
}
</style>