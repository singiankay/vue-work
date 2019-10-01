import SPAWrapper from '../../views/SPAWrapper.vue'
import AdminIndex from '../../views/Admin/Index.vue'
import Forbidden from '../../views/Forbidden.vue'
import MasterAccess from '../../views/Admin/User/Master/App.vue'
import AppAccess from '../../views/Admin/User/App/App.vue'
import MRPMaterialGroupings from '../../views/Admin/MRP/MaterialGroupings.vue'

export default [
	{
		path: '', 
		redirect: '/admin/index'
	},
	{
		path: 'index',
		name: 'Admin Home',
		component: AdminIndex,
	},
	{
		path: 'forbidden',
		name: 'Admin Error 403: Forbidden',
		component: Forbidden
	},
	{ 
		path: 'master-access',
		name: 'Master Access',
		component: MasterAccess,
	},
	{ 
		path: 'app-access',
		name: 'App Access',
		component: AppAccess, 
	},
	{
		path: 'mrp',
		component: SPAWrapper,
		children: [
			{ 
				path: 'material-groupings',
				name: 'MRP - Material Groupings',
				component: MRPMaterialGroupings,
			}
		]
	}
]