<template>
	<div>
		<div id="user-table" v-if="division">
			<v-server-table name="UserAdmin" :url="'admin/app/?category='+category+'&role='+role+'&division='+division+'&format=json'" :columns="columns" :options="options" ref="adminTable">
				<template slot="NAME" scope="props">
					<a @click="setUpdateID(props.row)">{{ props.row.NAME }}</a>
				</template>
				<template slot="DIVISION" scope="props">
					<template v-for="div in auth.divisions">
						<template v-if="div.id == props.row.DIVISION">{{ div.code }}</template>
					</template>
				</template>
				<template slot="STATUS" scope="props">
					<span v-if="props.row.STATUS == 1" class="label label-success">Active</span>
					<span v-else-if="props.row.STATUS == 0" class="label label-danger">Inactive</span>
				</template>
				<template slot="h__NAME" scope="props">
					<span>Name</span>
				</template>
				<template slot="h__CATEGORY" scope="props">
					<span>Category</span>
				</template>
				<template slot="h__ROLE" scope="props">
					<span>Role</span>
				</template>
				<template slot="h__DIVISION" scope="props">
					<span>Division</span>
				</template>
				<template slot="h__STATUS" scope="props">
					<span>Status</span>
				</template>
				<template slot="h__DESCRIPTION" scope="props">
					<span>Description</span>
				</template>
			</v-server-table>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	props: ['category','role','division'],
	data() {
		return {
			tableDivisions: [],
			columns: ['NAME','CATEGORY','ROLE','DIVISION','STATUS','DESCRIPTION'],
			options: {
				responseAdapter: (resp) => {
					resp = resp.map(item => ({ 
						ID: item.ID,
						FK_ID: item.FK_ID,
						NAME: `${item.FIRSTNAME} ${item.LASTNAME}`, 
						CATEGORY: item.CATEGORY,
						ROLE: item.ROLE,
						DIVISION: item.DIVISION,
						DESCRIPTION: item.DESCRIPTION,
						STATUS: item.STATUS,
						TOTAL: item.TOTAL
					}))
					let count
					if(resp[0] != null) {
						count = resp[0]['TOTAL']
					}
					else {
						count = 0
					}
					return { 
						data: resp,
						count: count
					}
				},
				sortable: ['NAME','CATEGORY','ROLE','DIVISION','STATUS','DESCRIPTION'],
				columnsClasses: {
						ID: 'col-md-1',
						NAME:'col-md-2 pointer',
						CATEGORY:'col-md-1',
						ROLE: 'col-md-2',
						APPLICATIONS: 'col-md-2',
						DESCRIPTION: 'col-md-2',
						STATUS: 'col-md-2',
						ENCODED_BY: 'col-md-2',
				},
				orderBy: {ascending:true},
			},
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
		adminTable() {
			return this.$store.getters.AdminTable
		},
	},
	created() {
		this.getDivisions(this.division)
	},
	watch: {
		adminTable(value) {
			if(value == true) {
				this.refresh()
			}
		},
		category() {
			if(this.adminTable) {
				this.refresh()
			}
		},
		role() {
			if(this.adminTable) {
				this.refresh()
			}
		},
		division() {
			if(this.adminTable) {
				this.refresh()
			}
		},
	},
	methods: {
		setUpdateID(row) {
			this.$store.dispatch('CLIENT_UPDATE_ID', row.ID)
		},
		refresh() {
			this.$Progress.start()
         setTimeout(() => {
         	if(this.$refs.adminTable) {
         		this.$refs.adminTable.refresh()
         	}
             this.$store.commit('CLEAR_TABLE_ID')
         }, 1)
         this.$Progress.finish()
		},
		getDivisions() {
			this.$Progress.start()
			axios.get('admin/app/getDivisions?format=json')
			.then(response => {
				this.tableDivisions = response.data
				this.$Progress.finish()
			})
			.catch(error => {
				console.log(error)
				this.$Progress.fail()
			})
		},
	}
}
</script>

<style>
td.pointer {
	cursor: pointer;
}
</style>