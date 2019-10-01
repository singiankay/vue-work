<template>
	<div id="groupings-table">
		<v-server-table name="GroupingsTable" :url="'admin/mrpgroupings/?format=json'" :columns="columns" :options="options" ref="adminTable">
			<template slot="ID" scope="props">{{ props.index }}</template>
			<template slot="groupName" scope="props">
				<a @click="setUpdateID(props.row)">{{props.row.groupName}}</a>
			</template>
			<template slot="h__ID" scope="props">
				<span># &nbsp;</span>
			</template>
			<template slot="h__groupName" scope="props">
				<span>Group Name</span>
			</template>
			<template slot="h__code" scope="props">
				<span>Code</span>
			</template>
			<template slot="h__divisionName" scope="props">
				<span>Division</span>
			</template>
			<template slot="h__groupType" scope="props">
				<span>Group</span>
			</template>
		</v-server-table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			columns: ['ID', 'groupName', 'code', 'divisionName', 'groupType'],
			options: {
				responseAdapter: (resp) => {
					resp = resp.map(item => ({
						id: item.id,
						groupName: item.groupName, 
						code: item.code, 
						divisionName: item.divisionName,
						groupType: item.groupType,
						total: item.total
					}))
					let count
					if(resp[0] != null) {
						count = resp[0]['total']
					}
					else {
						count = 0
					}
					return { 
						data: resp,
						count: count
					}
				},
				sortable: ['code', 'divisionName', 'groupType'],
				columnsClasses: {
					ID: 'col-md-1',
					groupName:'col-md-4 pointer',
					code: 'col-md-2',
					divisionName: 'col-md-2',
					groupType: 'col-md-4'
				},
				orderBy: {ascending:true},
			}
		}
	},
	computed: {
		table() {
			return this.$store.getters.AdminTable
		}
	},
	watch: {
		table(value) {
			if(value == true) {
				this.refresh()
			}
		},
	},
	methods: {
		setUpdateID(row) {
			this.$store.commit('SET_UPDATE_ID', row.id)
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


