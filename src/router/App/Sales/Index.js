import SalesWrapper from '../../../views/App/Sales/Wrapper.vue'
import SalesOrder from '../../../views/App/Sales/App.vue'
import CustomerPN from '../../../views/App/Sales/CustomerPN.vue'

export default {
	path: 'sales',
	component: SalesWrapper,
	children: [
		{
			path: 'order',
			component: SalesOrder,
			name:'Sales Order'
		},
		{
			path: 'customer-pn',
			component: CustomerPN,
			name: 'Customer PN'
		}
	]
}