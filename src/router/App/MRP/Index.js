import Wrapper from '../../../views/SPAWrapper.vue'
import MRPIndex from '../../../views/App/MRP/Index.vue'
import ProductionSchedule from '../../../views/App/MRP/ProductionSchedule/ProductionSchedule.vue'
import InventoryUploads from '../../../views/App/MRP/InventoryUploads/InventoryUploads.vue'
import OpenPO from '../../../views/App/MRP/OpenPO/App.vue'
import WIP from '../../../views/App/MRP/WIP/WIP.vue'
import FGInventory from '../../../views/App/MRP/FGInventory/FGInventory.vue'
import MRPMain from '../../../views/App/MRP/MRP/App.vue'

export default {
	path: 'mrp',
	component: Wrapper,
	children: [
		{
		  path: 'index',
		  name: 'MRP',
		  component: MRPIndex,
		},
		{
			path: 'production-schedule',
			name: 'MRP - Production Schedule',
			component: ProductionSchedule
		},
		{
			path: 'inventory-uploads',
			name: 'MRP - Inventory Uploads',
			component: InventoryUploads
		},
		{
			path: 'open-po',
			name: 'MRP - Open PO Uploading',
			component: OpenPO
		},
		{
			path: 'fg-inventory',
			name: 'MRP - Monthly FG Inventory',
			component: FGInventory
		},
		{
			path: 'wip',
			name: 'MRP - WIP',
			component: WIP
		},
		{
			path: 'mrp',
			name: 'MRP Main',
			component: MRPMain
		}
	]
}