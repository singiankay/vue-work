<template>
	<div>
		<form @submit.prevent>
			<div class="box box-success box-solid">
				<div class="box-header with-border">
					<h3 class="box-title">Update Material</h3>
					<div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					</div>
				</div>
				<div class="box-body">
					<div :class="{'form-group' : true, 'has-error' : errors.first('Material')}">
						<label for="Material">Material<span class="text-danger">*</span></label>
						<multiselect v-model="form.material" :options="multiselectOptions" label="text" track-by="id" @search-change="searchMaterial" placeholder="Type to search Material" :close-on-select="true" :show-labels="false" :loading="isLoading" :internal-search="false" :allow-empty="true" v-validate="'required'" data-vv-name="Material" data-vv-value-path="Material">
						</multiselect>
						<span v-show="errors.has('Material')" class="help-block">{{ errors.first('Material')}}</span>
					</div>
				</div>
				<div class="box-footer">
					<input type="submit" class="btn btn-info" value="Update" @click="updateIQC()">
					<input type="submit" class="btn btn-danger" value="Delete" @click="DeleteIQC()">
					<input type="button" class="btn bg-navy pull-right" value="Back" @click="back()">
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Multiselect from 'vue-multiselect'

export default {
	components: {
		Multiselect
	},
	props: ['id'],
	data() {
		return {
			form: {
				material: ''
			},
			isLoading: false,
			multiselectOptions: []
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
	},
	watch: {
		id() {
			this.getSkipIQCData()
		}
	},
	created() {
		this.getSkipIQCData()
	},
	methods: {
		updateIQC() {
			this.$Progress.start()
			axios.patch(`skipiqcinspection/${this.id}`, {
				form: this.form.material
			})
			.then(response=> {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
				if(response.data.status == "success") {
					this.$store.dispatch('CLIENT_TABLE_REFRESH')
				}
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		},
		DeleteIQC() {
			let choice = confirm("Are you sure you want to delete this line?")
			if (choice) {
				this.$Progress.start()
				axios.delete(`skipiqcinspection/${this.id}`)
				.then(response=> {
					this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
					if(response.data.status == "success") {
						this.$store.dispatch('CLIENT_TABLE_REFRESH')
						this.back()
					}
					this.$Progress.finish()
				})
				.catch(error => {
					this.$store.commit('SET_ALERT',{type:'error', message:[error]})
					console.log(error)
					this.$Progress.fail()
				})
			}
		},
		getSkipIQCData() {
			this.$Progress.start()
			axios.get(`skipiqcinspection/${this.id}`)
			.then(response => {
				this.form.material = {
					id: response.data.material_no,
					text: `${response.data.material_no} ${response.data.material_name}`
				}
				this.$Progress.finish()
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
				this.$Progress.fail()
			})
		},
		searchMaterial(query) {
			this.isLoading = true	
			this.search(query)
		},
		search: _.debounce(function(query) {
			this.$Progress.start()
			axios.get('material/search?format=json', { 
					params: { 
						query:query,
						division: this.auth.user.current_division
					} 
			})
			.then(response => {
				let data = response.data.map(item => (
					{ text: `${item.ITEMCODE} ${item.ITEMNAME}`, id: item.ITEMCODE }
				))
				this.isLoading = false
				this.multiselectOptions = data
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.isLoading = false
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		}, 250),
		back() {
			this.$store.dispatch('CLIENT_CREATE')
		}
	}
}
</script>