<template>
	<div>
		<div id="monthly-inventory-import-table">
			<v-client-table :data="TableData" :columns="columns" :options="options">
				<template slot="status" scope="props">
					<template v-if="props.row.status == true"><span class="text-success fa fa-check"></span></template>
					<template v-else><span class="text-danger fa fa-times"></span> {{ props.row.status_message }}</template>
				</template>
			</v-client-table>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	props: ['TableData'],
	data() {
		return {
			columns: ['material_id','material_name','qty','status',],
			options: {

			},
			orderBy: {ascending:false},
			orderBy: {column:''},
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
	},
}
</script>