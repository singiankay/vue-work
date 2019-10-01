<template>
	<div>
		<form @submit.prevent>
			<div class="box box-solid box-primary">
				<div class="box-header with-border">
					<h3 class="box-title">WIP Data</h3>
					<div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					</div>
				</div>
				<div class="box-body">
					<ul class="list-group list-group-unbordered">
						<li class="list-group-item">
							<b>Model No.</b>
							<a class="pull-right">{{ model_id }}</a>
						</li>
						<li class="list-group-item">
							<b>Model Name</b>
							<a class="pull-right">{{ model_name }}</a>
						</li>
						<li class="list-group-item">
							<b>Process Revision</b>
							<span class="badge bg-maroon pull-right">{{ process_rev }}</span>
						</li>
						<li class="list-group-item">
							<b>BOM Revision</b>
							<span class="badge bg-purple pull-right">{{ bom_rev }}</span>
						</li>
					</ul>
					<table class="table table-bordered table-striped table-condensed table-hover table-responsive">
						<thead>
							<tr>
								<th>#</th>
								<th>Process Name</th>
								<th>Material</th>
								<th>WIP</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="rows in data">
								<td class="col-md-1">{{ rows.process_order }}</td>
								<td class="col-md-2">{{ rows.process_name }}</td>
								<td class="col-md-7">
									<ul class="list-unstyled" v-for="material in rows.materials">
										<li v-if="material.material_id">
											<strong><span class="label label-primary">{{ material.material_id }}</span></strong> 
											<span class="label label-default">{{ material.name }}</span>
											<span class="label bg-maroon">{{ material.qty }}</span>
										</li>
									</ul>
								</td>
								<td class="col-md-2">
									<input type="number" :class="{ 'form-control' : true }" v-model="rows.wip_qty">
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="box-footer">
					<input type="submit" value="Save Record" class="btn btn-primary" @click="saveWip(action)">
					<input type="button" value="Back" class="btn btn-default pull-right" @click="back()">
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	props: ['id', 'division', 'divisionName', 'area', 'monthyear'],
	data() {
		return {
			model_id: null,
			model_name:  null,
			bom_rev:  null,
			process_rev:  null,
			data:  null,
			action: null
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
	},
	watch: {
		id() {
			this.getWip()
		}
	},
	created() {
		this.getWip()
	},
	mounted() {

	},
	methods: {
		saveWip(action) {
			axios.post(`wip/?format=json`, {
				wip_action: action,
				bom_rev: this.bom_rev,
				process_rev: this.process_rev,
				model_id: this.model_id,
				model_name: this.model_name,
				data: this.data,
				area: this.area,
				division: this.division,
				monthyear: this.monthyear,
				user_id: this.auth.user.user_id
			})
			.then(response => {
				this.$store.commit('SET_ALERT',{type: response.data.status, message: response.data.message})
				if(response.data.status == "success") {
					this.$store.dispatch('CLIENT_TABLE_REFRESH')
					this.getWip()
				}
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
			})
		},
		getWip() {
			axios.get(`wip/${this.id}?format=json`,{
				params: {
					division: this.division,
					division_name: this.divisionName,
					area: this.area,
					monthyear: this.monthyear,
				}
			})
			.then(response => {
				if(response.data.status == 'success') {
					this.setUpdateTable(response.data)
				}
			})
			.catch(error => {
				this.$store.commit('SET_ALERT',{type:'error', message:[error.message]})
			})
		},
		setUpdateTable(data) {
			this.model_id = data.model_id
			this.model_name = data.model_name
			this.process_rev = data.process_rev
			this.bom_rev = data.bom_rev
			this.action = data.action
			let result = Object.values(data.data.reduce((r,{ id, process_id, process_name, process_order, material_id, material_name, bom_qty, wip_qty, has_record }) => {
				r[process_id] = r[process_id] || { id, process_id, process_name, process_order, materials : [], wip_qty, has_record }
				r[process_id].materials.push({ material_id: material_id, name: material_name, qty: bom_qty })
				return r
			},{}))
			this.data = result.sort((a,b)=> {
				return a.process_order - b.process_order
			})
		},
		back() {
			this.$store.dispatch('CLIENT_CLEAR')
		},

	},
}
</script>