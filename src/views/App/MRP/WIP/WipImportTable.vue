<template>
	<div>
		<v-client-table :data="tableData" :columns="columns" :options="options">
			<template slot="status" scope="props">
				<template v-if="props.row.status == true"><span class="text-success fa fa-check"></span></template>
				<template v-else><span class="text-danger fa fa-times"></span> {{ props.row.status_message }}</template>
			</template>
			<template slot="type" scope="props">{{ props.row.type | capitalize }}</template>
			<template slot="h__model_no" scopr="props">Model #</template>
			<template slot="h__process_order" scopr="props">Process #</template>
			<template slot="h__qty" scopr="props">Qty</template>
			<template slot="h__type" scopr="props">Type</template>
			<template slot="h__status" scopr="props">Status</template>
			<template slot="h__description" scopr="props">Description</template>
		</v-client-table>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	props: ['tableData'],
	data() {
		return {
			columns: ['model_no','process_order','qty','type','description','status'],
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
	filters: {
	  capitalize: function (value) {
	    if (!value) return ''
	    value = value.toString()
	    return value.charAt(0).toUpperCase() + value.slice(1)
	  }
	}
}
</script>