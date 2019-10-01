<template>
	<div>
		<div class="login-box">
				<alert></alert>
			<div class="login-logo">
				<a href="./"><b>ERP</b> Expansion</a>
			</div>
			<div class="login-box-body">
				<transition name="login" enter-active-class="animated flipInY" leave-active-class="animated flipOutY" mode="out-in" :duration="{ enter: 1000, leave: 500 }">
					<loginPrecede v-if="type==null" key="precede"></loginPrecede>
					<loginProceed  v-else-if="type=='validation'" key="next"></loginProceed>
				</transition>
				<div class="social-auth-links text-center">
				  <p>- OR -</p>
				  <a href="/" class="btn btn-block btn-social btn-facebook btn-flat" tabindex="4"><i class="fa fa-home"></i>Go back to AppServer Home</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Alert from '../../components/layout/Alert.vue'
import LoginPrecede from './LoginPrecede.vue'
import LoginProceed from './LoginProceed.vue'

export default {
	beforeCreate() {
		document.body.className = 'hold-transition login-page'
	},
	data() {
		return {
			username: null,
			password: null
		}
	},
	computed: {
		...mapState([
		  'auth',
		]),
		type() {
			return this.auth.user.type
		}
	},
	created() {
		if(this.auth.user.type) {
			if(this.auth.user.type === 'Admin') {
				this.$router.push('/admin')
			}
			else if(this.auth.user.type === 'Client') {
				this.$router.push('/app')		
			}
		}
	},
	components: {
		Alert,
		LoginPrecede,
		LoginProceed
	}
}
</script>

<style>
body: {
	height: 100%;
}
</style>