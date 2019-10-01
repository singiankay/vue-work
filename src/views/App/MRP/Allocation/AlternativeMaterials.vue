<template>
	<div>
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">Alternative Materials</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
				</div>
			</div>
			<div class="box-body">
				test
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	components: {
		
	},
	data() {
		return {
			
		}
	},
	computed: {
		...mapState([
		  'client'
		]),
	},
	watch: {
		'client.table.id'(value) {
			if(value) {
				this.getModelAlternativeMaterials()
			}
		}
	},
	created() {
		this.getModelAlternativeMaterials()
	},
	methods: {
		getModelAlternativeMaterials() {
			axios.get('mrpallocation/getModelAlternativeMaterials?format=json', {
				params: {
					id: this.client.table.id
				}
			})
			.then(response => {
				
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
			})
		}
	}
}
</script>