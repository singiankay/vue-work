<template>
	<transition name="alert" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" mode="out-in" :duration="{ enter: 500, leave: 500 }" appear>
		<div :class="'alert alert-dismissible alert-'+alertType" v-if="alertStatus">
			<button type="button" class="close" aria-hidden="true" @click="closeAlert">&times;</button>
			<h4><i :class="'icon fa fa-'+alertIcon"></i>{{ alertTitle|capitalize }}</h4>
			<ul class="list-unstyled">
				<li v-for="message in alertMessage">{{ message|capitalize }}</li>
			</ul>
		</div>
	</transition>
</template>

<script>
export default {
	computed: {
		alertStatus() {
			return this.$store.getters.AlertStatus
		},
		alertType() {
			let type = this.$store.getters.AlertType
			if(type == null) {
				return "error"
			}
			else {
				return type
			}
		},
		alertMessage() {
			return this.$store.getters.AlertMessage
		},
		alertTitle(){
			if(this.alertType != null) {
				return this.alertType
			}
			else {
				return "error"
			}
		},
		alertIcon() {
			switch(this.alertType) {
				case "success":
					return "check"
					break;
				case "warning":
					return "warning"
					break;
				case "error":
					return "ban"
					break;
				case "info":
					return "info"
					break;
				default:
					return "ban"
			}
		},
	},
	methods: {
		closeAlert() {
			this.$store.commit('CLEAR_ALERT')
		}
	},
	filters: {
		capitalize: function (value) {
			if (!value) return ''
			value = value.toString()
			return value.charAt(0).toUpperCase() + value.slice(1)
		}
	}
}
</script>