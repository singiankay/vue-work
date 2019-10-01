<template>
	<div>
		<navbar-admin></navbar-admin>
		<sidebar-admin></sidebar-admin>
		<div class="content-wrapper">
		  <section class="content-header">
		    <h1>{{ $route.name }}</h1>
		  </section>
		  <section class="content">
		  	<transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut">
		  		<router-view class="animated"></router-view>
		    </transition>  
		  </section>
		</div>
		<footer-bar></footer-bar>
	</div>
</template>
<script>
import NavbarAdmin from '../../components/layout/NavbarAdmin.vue'
import SidebarAdmin from '../../components/layout/SidebarAdmin.vue'
import FooterBar from '../../components/layout/FooterBar.vue'

export default {
	beforeCreate: function() {
      document.body.className = 'hold-transition skin-blue sidebar-collapse sidebar-mini'
  	},
	components: {
		NavbarAdmin,
		SidebarAdmin,
		FooterBar,
	},
}
</script>