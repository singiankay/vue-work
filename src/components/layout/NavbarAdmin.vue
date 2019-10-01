<template>
  <header class="main-header">
	 <a href="./" class="logo">
		<span class="logo-mini" style="font-size: 14px !important;"><b>ERPX</b></span>
		<span class="logo-lg"><b>ERP</b> Expansion</span>
	 </a>
	 <nav class="navbar navbar-static-top" role="navigation">
		<a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
		  <span class="sr-only">Toggle navigation</span>
		</a>
		<div class="navbar-custom-menu">
		  <ul class="nav navbar-nav">
			 <li>
				<a href="#" aria-expanded="false">{{ user.type }}</a>
			 </li>
			 <li class="dropdown user user-menu">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown">
				  <img :src="user.image_path" class="user-image" alt="User Image">
				  <span class="hidden-xs">{{ user.username }}</span>
				</a>
				<ul class="dropdown-menu">
				  <li class="user-header">
					 <img :src="user.image_path" class="img-circle" alt="User Image">
					 <p>{{ user.firstname }} {{ user.lastname }} - {{ user.position }} <small>Member since {{ [user.date_hired, "MMMM, DD YYYY HH:mm:ss"] | moment('MMM YYYY') }}</small></p>
				  </li>
				  <li class="user-footer">
					 <div class="pull-left">
						<a href="/" class="btn btn-default btn-flat">Go to NPI Appserver</a>
					 </div>
					 <div class="pull-right">
						<router-link to="/logout" class="btn btn-default btn-flat">Sign out</router-link>
						<!-- <a href="login.cfm?logout=true" class="btn btn-default btn-flat">Sign out</a> -->
					 </div>
				  </li>
				</ul>
			 </li>
		  </ul>
		</div>
	 </nav>
  </header>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
	computed: {
		...mapState([
			'auth',
		]),
		user() {
			return this.auth.user
		}
	},
}
</script>