<template>
	<div>
		<form method="post" @submit.prevent="createMaterialGroupings">
			<div :class="{'form-group' : true, 'has-error' : errors.first('name')}">
				<label for="name">Name</label>
				<input type="text" name="name" class="form-control" aria-describedby="nameHelpBlock" v-model="form.name" v-validate="'required'" readonly>
				<span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
			</div>
			<div :class="{'form-group' : true, 'has-error' : errors.first('code')}">
				<label for="code">Code</label>
				<input type="text" name="code" class="form-control" aria-describedby="codeHelpBlock" v-model="form.code" v-validate="'required'" readonly>
				<span v-show="errors.has('code')" class="help-block">{{ errors.first('code') }}</span>
			</div>
			<div :class="{'form-group' : true, 'has-error' : errors.first('division')}">
				<label for="division">Division</label>
				<select name="division" class="form-control" aria-describedby="divisionHelpBlock" v-model="form.division" v-validate="'required'" ref="division">
					<option value="" disabled>Select Division</option>
					<option v-for="division in divisions" :value="division.id">{{ division.code }}</option>
				</select>
				<span v-show="errors.has('division')" class="help-block">{{ errors.first('division') }}</span>
			</div>
			<div :class="{'form-group' : true, 'has-error' : errors.first('type')}">
				<label for="type">Type</label>
				<select name="type" class="form-control" aria-describedby="typeHelpBlock" v-model="form.type" v-validate="'required'">
					<option value="" disabled>Select Type</option>
					<option v-for="type in types" :value="type">{{ type }}</option>
				</select>
				<span v-show="errors.has('type')" class="help-block">{{ errors.first('type') }}</span>
			</div>
			<div class="box-footer">
				<input type="submit" :class="{ 'btn btn-primary' : true }" :disabled="errors.any()" value="Create">
			</div>
		</form>
	</div>
</template>

<script>
export default {
	props: ['id'],
	data() {
		return {
			form: {
				name: null,
				code: null,
				division: '',
				type: ''
			},
			divisions: [],
			types: []
		}
	},
	computed: {

	},
	mounted() {
		this.$refs.division.focus()
	},
	created() {
		if(this.id) this.getGroupByID(this.id)
		this.getDivisions()
		this.getMaterialTypes()
	},
	watch: {
		id(value) {
			if(value) {
				this.getGroupByID(value)
			}
		}
	},
	methods: {
		getGroupByID(id) {
			this.$Progress.start()
			axios.get('admin/mrpgroupings/getSAPMaterialGroupByID?format=json', { 
				params: { 
					id:id
				} 
			})
			.then(response => {
				this.form.name = response.data.name
				this.form.code = response.data.id
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.isLoading = false
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		},
		getDivisions() {
			this.$Progress.start()
			axios.get('admin/mrpgroupings/getDivisions?format=json')
			.then(response => {
				this.divisions = response.data
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		},
		getMaterialTypes() {
			this.$Progress.start()
			axios.get('admin/mrpgroupings/getMaterialTypes?format=json')
			.then(response => {
				this.types = response.data
				this.$Progress.finish()
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      	this.$Progress.fail()
	      })
		},
		createMaterialGroupings() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					this.$Progress.start()
					axios.post('admin/mrpgroupings/?format=json', {
						form: this.form
					})
					.then(response => {
						this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
						if(response.data.status == "success") {
							this.$store.commit('RELOAD_TABLE')
							this.$store.commit('CLEAR_TABLE_ID')
						}
						this.$Progress.finish()
			      })
			      .catch(error => {
			      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
			      	console.log(error)
			      	this.$Progress.fail()
			      })
				}
			})
		}
	}
}
</script>