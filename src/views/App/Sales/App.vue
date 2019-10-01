<template>
	<div>
		<alert></alert>
		<div class="row">
			<div class="col-md-6">
				<transition name="tableWindow" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
					<div class="box box-primary">
						<div class="box-header with-border">
							<h3 class="box-title">Sales Order Records</h3>
							<div class="box-tools pull-right">
								<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
							</div>
						</div>
						<div class="box-body">
							<sales-table :division="auth.user.current_division" v-if="showTable"></sales-table>
						</div>
					</div>
				</transition>
			</div>
			<div class="col-md-6">
				<transition name="documentWindow" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
					<create-sales-order :divisionID="auth.user.current_division" :divisionName="currentDivisionCode" v-if="!so_id" key="create"></create-sales-order>
					<update-sales-order v-else-if="so_id" :id="so_id" key="update"></update-sales-order>
				</transition>
			</div>
		</div>
		<transition name="documentName" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="{ enter: 1500, leave: 500 }">
			<h2 v-if="so_id" class="page-header">Lines</h2>
		</transition>
		<transition name="documentWindow" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1500, leave: 500 }">
			<sales-lines v-if="so_id" :id="so_id"></sales-lines>
		</transition>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Alert from '../../../components/layout/Alert.vue'
import SalesTable from './SalesorderTable.vue'
import CreateSalesOrder from './Create.vue'
import UpdateSalesOrder from './Update.vue'
import SalesLines from './Lines.vue'
// import xlsx from 'xlsx'

export default {
	components: {
		Alert,
		// DatePicker,
		SalesTable,
		CreateSalesOrder,
		UpdateSalesOrder,
		SalesLines
		// xlsx
	},
	data() {
		return {
			divisionName: null,
			types: [],
			form: {
				area: '',
				type: ''
			},
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
		so_id() {
			return this.client.table.id
		},
		currentDivisionCode() {
			if(this.auth.divisions) {
				for(let [index, value] of this.auth.divisions.entries()) {
					if(value.id == this.auth.user.current_division) return value.code
				}
			}
		},
		showTable() {
			if(this.auth.user.current_division) {
				return true
			}
			else {
				return false
			}
		}
	},
	watch: {
		formAreas(areas) {
			if(areas.find((obj) => { return obj.id === 0 })) {
				this.form.area = 0
			}
		},
		'form.area'(value) {
			if(!value) {
				this.$store.dispatch('CLIENT_CLEAR')
			}
		}
	},
	mounted() {
		this.form.type = ""
		this.$store.dispatch('CLIENT_CREATE')
		this.$store.dispatch('SET_ACTIVE_DIVISION',this.auth.user.current_division)
		.catch(error => {
			this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
		})
	},
	created() {
		this.$store.dispatch('CLIENT_CLEAR')
		this.$store.dispatch('CLIENT_LINE_CLEAR')
		this.getDivision(this.auth.user.current_division)
	},
	methods: {
		getDivision(division) {
			axios.get('main/getDivision?format=json',{
				params: {id: division}
			})
			.then(response => {
				this.divisionName = response.data.code
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      })
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
	input.not-readonly.form-control{
		background-color:#ffffff !important;
	}
</style>