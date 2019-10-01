<template>
	<div>
		<div id="production-schedule-import-table">
			<v-client-table :data="TableData" :columns="columns" :options="options">
				<template slot="requested_delivery_date" scope="props">
					<template v-if="props.row.requested_delivery_date">{{ [props.row.requested_delivery_date, 'M/D/YYYY'] | moment('MMM DD, YYYY') }}</template>
					<template v-else></template>
				</template>
				<template slot="confirmed_date" scope="props">
					<template v-if="props.row.confirmed_date">{{ [props.row.confirmed_date, 'M/D/YYYY'] | moment('MMM DD, YYYY') }}</template>
					<template v-else>{{ props.row.confirmed_date }}</template>
				</template>
				<template slot="_production_date" scope="props">
					<template v-if="props.row._production_date">{{ [props.row._production_date, 'M/D/YYYY'] | moment('MMM DD, YYYY') }}</template>
					<template v-else>{{ props.row._production_date }}</template>
				</template>
				<template slot="_production_qty" scope="props">{{ new Intl.NumberFormat().format(props.row._production_qty) }}</template>
				<template slot="_production_remarks" scope="props">{{ props.row._production_remarks }}</template>
				<template slot="status" scope="props">
					<template v-if="props.row.status == true"><span class="text-success fa fa-check"></span></template>
					<template v-else>
						<ul class="list-unstyled">
							<li v-for="item in props.row.status_message"><span class="text-danger fa fa-times"></span> {{ item}}</li>
						</ul>
					</template>
				</template>
				<template slot="qty" scope="props">{{ new Intl.NumberFormat().format(props.row.qty) }}</template>
				<template slot="h__so_no" scope="props">
					<span>SO No.</span>
				</template>
				<template slot="h__so_line_id" scope="props">
					<span>SO Line ID</span>
				</template>
				<template slot="h__model_id" scope="props">
					<span>Model No.</span>
				</template>
				<template slot="h__model_name" scope="props">
					<span>Model Name.</span>
				</template>
				<template slot="h__requested_delivery_date" scope="props">
					<span>Requested Date</span>
				</template>
				<template slot="h__confirmed_date" scope="props">
					<span>Confirmed Delivery Date</span>
				</template>
				<template slot="h___production_date" scope="props">
					<span>Production Date</span>
				</template>
				<template slot="h___production_qty" scope="props">
					<span>Production Qty</span>
				</template>
				<template slot="h___production_remarks" scope="props">
					<span>Production Remarks</span>
				</template>
				<template slot="h__status" scope="props">
					<span>Status</span>
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
			columns: ['so_no','so_line_id','model_no', 'model_name', 'qty', 'requested_delivery_date', 'confirmed_date', '_production_date', '_production_qty', '_production_remarks', 'action', 'status'],
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