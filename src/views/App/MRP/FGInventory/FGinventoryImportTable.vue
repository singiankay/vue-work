<template>
	<div>
		<v-client-table :data="tableData" :columns="columns" :options="options">
			<template slot="status" scope="props">
				<template v-if="props.row.status == true"><span class="text-success fa fa-check"></span></template>
				<template v-else><span class="text-danger fa fa-times"></span> {{ props.row.description }}</template>
			</template>
			<template slot="h__model_no" scope="props">
				<span>Model Number</span>
			</template>
			<template slot="h__model_name" scope="props">
				<span>Model Name</span>
			</template>
			<template slot="h__qty" scope="props">
				<span>Qty</span>
			</template>
			<template slot="h__status" scope="props">
				<span>Status</span>
			</template>
		</v-client-table>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	props: ['tableData'],
	data() {
		return {
			columns: ['model_no','model_name','qty', 'status'],
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