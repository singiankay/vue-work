import WHWrapper from '../../../views/App/WH/Wrapper.vue'
import WH from '../../../views/App/WH/App.vue'

export default {
	path: 'wh',
		component: WHWrapper,
		children: [
			{
				path: 'iqc-less-materials',
				component: WH,
				name:'IQC Inspection-less Materials'
			},
		]
}