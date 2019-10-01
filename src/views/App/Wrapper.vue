<template>
	<div>
		<navbar></navbar>
		<sidebar></sidebar>
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
import Navbar from '../../components/layout/Navbar.vue'
import Sidebar from '../../components/layout/Sidebar.vue'
import FooterBar from '../../components/layout/FooterBar.vue'

export default {
	beforeCreate() {
      document.body.className = 'hold-transition skin-blue sidebar-collapse sidebar-mini'
  	},
	components: {
		Navbar,
		Sidebar,
		FooterBar,
	},
}
</script>