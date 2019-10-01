<template>
	<div>
		<alert></alert>
		<div class="box box-solid">
			<div class="box-header with-border">
				<h3 class="box-title">Administration Page - ERP Expansion</h3>
			</div>
			<div class="box-body">
				<p>Information here are sensitive</p>
			</div>
		</div>
	</div>
</template>

<script>	
import Alert from '../../components/layout/Alert.vue'

export default {
	components: {
		Alert
	},
	beforeDestroy() {
		this.$store.commit('CLEAR_ALERT')
		this.$store.commit('CLEAR_TABLE_ID')
		this.$store.commit('CLEAR_AUTH_DEFAULTS')
	}
}
</script>