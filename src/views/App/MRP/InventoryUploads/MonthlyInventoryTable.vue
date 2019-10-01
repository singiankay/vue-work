<template>
	<div>
		<ul class="list-group list-group-unbordered">
			<li class="list-group-item">
				<b>Location:</b>
				<a class="pull-right">{{ showLocation }}</a>
			</li>
			<li class="list-group-item">
				<b>Month/Year:</b>
				<a class="pull-right">{{ showMonthYear }}</a>
			</li>
		</ul>
		<div id="monthly-inventory-table">
			<v-client-table :data="TableData" :columns="columns" :options="options" v-if="TableData">
				<template slot="id" scope="props">
					<a @click="setUpdateID(props.row.id)">{{ props.row.id }}</a>
				</template>
				<template slot="qty" scope="props">{{ new Intl.NumberFormat().format(props.row.qty) }}</template>
				<template slot="h__material_id" scope="props">
					<span>Material #</span>
				</template>
				<template slot="h__name" scope="props">
					<span>Material Name</span>
				</template>
				<template slot="h__qty" scope="props">
					<span>Quantity</span>
				</template>
			</v-client-table>	
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	props: ['monthyear', 'location'],
	data() {
		return {
			columns: ['id','material_id','material_name', 'qty'],
			TableData: [],
			options: {
				columnsClasses: {
					id: 'col-md-1 pointer',
					material_id: 'col-md-3',
					material_name:'col-md-5',
					qty: 'col-md-2',
				},
			},
			showMonthYear: null,
			showLocation: null
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
		monthyear() {
			this.getTableData()
		},
		location() {
			this.getTableData()
		},
		tableStatus(value) {
			if(value === false) {
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
			axios.get('mrpinventoryupload/?format=json', {
				params: {
					division: this.auth.user.current_division,
					monthyear: this.monthyear,
					location: this.location
				}
			})
			.then(response => {
				this.TableData = response.data
				this.showMonthYear = moment(this.monthyear).format('MMMM YYYY')
				this.showLocation = this.location
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		},
		setUpdateID(id) {
			this.$store.dispatch('CLIENT_UPDATE_ID', id)
		},
	}

}
</script>

<style>
td.pointer {
	cursor: pointer;
}
</style>