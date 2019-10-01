<template>
	<div>
		<div class="col-md-8">
			<div class="box box-primary">
				<div class="box-header with-border">
					<h3 class="box-title">Models</h3>
					<div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					</div>
				</div>
				<div class="box-body">
					<v-client-table  :data="TableData" :columns="columns" :options="options">
						<template slot="model_id" scope="props">
							<a @click="setUpdate(props.row)">{{ props.row.model_id }}</a>
						</template>
						<template slot="qty" scope="props">{{ new Intl.NumberFormat().format(props.row.qty) }}</template>
						<template slot="has_record" scope="props">
							<span class="text-success fa fa-check" v-if="props.row.has_record == true"></span>
							<span class="text-danger fa fa-times" v-else-if="props.row.has_record == false"></span>
						</template>
						<template slot="h__model_id" scope="props">
							<span>Model #</span>
						</template>
						<template slot="h__name" scope="props">
							<span>Model Name</span>
						</template>
						<template slot="h__qty" scope="props">
							<span>Quantity</span>
						</template>
						<template slot="h__has_record" scope="props">
							<span>Has Record?</span>
						</template>
					</v-client-table>
				</div>
			</div>
		</div>
		<transition name="tableOption" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in" :duration="{ enter: 1000, leave: 500 }" appear>
			<div class="col-md-4" v-if="form.model_id">
				<form @submit.prevent>
					<div class="box box-solid box-info">
						<div class="box-header with-border">
							<h3 class="box-title">{{ EditType }} FG Inventory <span class="badge bg-maroon" v-if="form.type=='update'">{{ form.id }}</span></h3>
							<div class="box-tools pull-right">
								<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
							</div>
						</div>
						<div class="box-body">
							<div class="form-group">
								<label for="">Model #</label>
								<input type="text" class="form-control disabled" disabled :value="form.model_id">
							</div>
							<div class="form-group">
								<label for="">Model Name</label>
								<input type="text" class="form-control disabled" disabled :value="form.model_name">
							</div>
							<div class="form-group">
								<label for="">Quantity</label>
								<input type="number" class="form-control" v-model="form.qty">
							</div>
						</div>
						<div class="box-footer">
							<input type="submit" class="btn bg-maroon" value="Update" @click="updateFgInventory()">
							<input type="submit" class="btn bg-navy pull-right" value="Back" @click="back()">
						</div>
					</div>
				</form>
			</div>
		</transition>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	props: ['area', 'monthyear'],
	data() {
		return {
			TableData: [],
			columns: ['model_id','name','qty','has_record'],
			options: {
				columnsClasses: {
					model_id: 'col-md-2 pointer',
					name:'col-md-5',
					qty: 'col-md-3',
					has_record: 'col-md-2',
				},
			},
			orderBy: {ascending:false},
			orderBy: {column:''},
			form: {
				id: null,
				type: null,
				model_id: null,
				model_name: null,
				qty: null
			}
		}
	},
	computed: {
		...mapState([
		  'auth',
		  'client'
		]),
		EditType() {
			if(this.form.type == 'create') {
				return 'Create'
			}
			else if(this.form.type == 'update') {
				return 'Update'
			}
		}
	},
	watch: {
		area() {
			this.getMonthlyFGInventory()
		},
		monthyear() {
			this.getMonthlyFGInventory()
		}
	},
	created() {
		this.getMonthlyFGInventory()
	},
	methods: {
		updateFgInventory() {
			if(this.form.type == 'create') {
				axios.post('mrpfginventory/?format=json', {
					model_id: this.form.model_id,
					qty: this.form.qty,
					division: this.auth.user.current_division,
					area: this.area,
					monthyear: this.monthyear,
					user_id: this.auth.user.user_id
				})
				.then(response => {
					this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
					if(response.data.status == "success") {
						this.getMonthlyFGInventory()
						this.form.id = response.data.id
						this.form.type = 'update'
					}
		      })
		      .catch(error => {
		      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
		      	console.log(error)
		      })
			}
			else if(this.form.type == 'update') {
				axios.patch(`mrpfginventory/${this.form.id}?format=json`, {
					model_id: this.form.model_id,
					qty: this.form.qty,
					division: this.auth.user.current_division,
					area: this.area,
					monthyear: this.monthyear,
					user_id: this.auth.user.user_id
				})
				.then(response => {
					this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
					if(response.data.status == "success") {
						this.getMonthlyFGInventory()
					}
		      })
		      .catch(error => {
		      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
		      	console.log(error)
		      })
			}
		},
		back() {
			this.form.id= null
			this.form.type= null
			this.form.model_id= null
			this.form.model_name= null
			this.form.qty= null
		},
		setUpdate(row) {
			if(row.has_record == true) {
				this.form.id = row.id
				this.form.model_id = row.model_id
				this.form.type = 'update'
			}
			else {
				this.form.model_id = row.model_id
				this.form.type = 'create'
				this.form.id = null
			}
			this.getFGInventory()
		},
		getMonthlyFGInventory() {
			axios.get('mrpfginventory/?format=json', {
			params: {
				division: this.auth.user.current_division,
				area: this.area,
				monthyear: this.monthyear
				}
			})
			.then(response => {
				this.TableData = response.data
	      })
	      .catch(error => {
	      	this.$store.commit('SET_ALERT',{type:'error', message:[error]})
	      	console.log(error)
	      })
		},
		getFGInventory() {
			axios.get(`mrpfginventory/${this.form.model_id}?format=json`, {
				params: {
					id: this.form.id,
					type: this.form.type,
				}
			})
			.then(response => {
				this.form.model_name = response.data.model_name
				this.form.qty = response.data.qty
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error]})
				console.log(error)
			})
		}
	}
}
</script>

<style>
td.pointer {
	cursor: pointer;
}
</style>