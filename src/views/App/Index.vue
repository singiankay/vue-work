<template>
	<div>
		<alert></alert>
		<div class="box box-solid">
			<div class="box-header with-border">
				<h3 class="box-title">ERP Expansion</h3>
			</div>
			<div class="box-body">
				<p>Where do you like to go?</p>
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
	}
}
</script>