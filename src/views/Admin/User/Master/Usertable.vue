<template>
	<div>
		<div id="user-table">
			<v-server-table name="MasterAdmin" url="admin/master/?format=json" :columns="columns" :options="options" ref="adminTable">
				<template slot="rowIndex" scope="props">
					<span>{{props.index}}</span>
				</template>
				<template slot="NAME" scope="props">
					<a @click="setUpdateID(props.row)">{{props.row.NAME}}</a>
				</template>
				<template slot="APPLICATIONS" scope="props">
					<ul>
						<li v-for="application in JSON.parse(props.row.APPLICATIONS)">{{ application }}</li>
					</ul>
				</template>
				<template slot="STATUS" scope="props">
					<span v-if="props.row.STATUS === 1"  class="label label-success">Active</span>
					<span v-else-if="props.row.STATUS === 0"  class="label label-danger">Inactive</span>
				</template>
				<template slot="h__rowIndex" scope="props">
					<span># &nbsp;</span>
				</template>
				<template slot="h__NAME" scope="props">
					<span>Name</span>
				</template>
				<template slot="h__POSITION" scope="props">
					<span>Position</span>
				</template>
				<template slot="h__APPLICATIONS" scope="props">
					<span>Applications</span>
				</template>
				<template slot="h__DESCRIPTION" scope="props">
					<span>Description</span>
				</template>
				<template slot="h__STATUS" scope="props">
					<span>Status</span>
				</template>
			</v-server-table>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			columns: ['rowIndex','NAME', 'POSITION', 'APPLICATIONS','DESCRIPTION','STATUS'],
			options: {
				responseAdapter: (resp) => {

					resp = resp.map(item => ({ 
						FK_ID: item.FK_ID,
						NAME: `${item.FIRSTNAME} ${item.LASTNAME}`, 
						POSITION: item.POSITION,
						APPLICATIONS: item.APPLICATIONS,
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
				sortable: ['NAME', 'POSITION', 'APPLICATIONS', 'DESCRIPTION', 'STATUS'],
				columnsClasses: {
						rowIndex: 'col-md-1',
						NAME:'col-md-2 pointer',
						POSITION: 'col-md-3',
						APPLICATIONS: 'col-md-3',
						DESCRIPTION: 'col-md-2',
						STATUS: 'col-md-1',
				},
				orderBy: {ascending:true}
			},
		}
	},
	computed: {
		adminTable: {
			cache: false,
			get() {
				return this.$store.getters.AdminTable
			}
		}
	},
	watch: {
		adminTable(value) {
			if(value == true) {
				this.refresh()
			}
		}
	},
	methods: {
		setUpdateID(row) {
			this.$store.commit('SET_UPDATE_ID', row.FK_ID)
		},
		refresh() {
			this.$refs.adminTable.refresh()
		}
	}
}
</script>

<style>
td.pointer {
	cursor: pointer;
}
</style>