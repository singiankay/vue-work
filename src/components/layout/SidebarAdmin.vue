<template>
	<aside class="main-sidebar">
		<section class="sidebar">
			<div class="user-panel">
				<div class="pull-left image">
					<img :src="user.image_path" class="img-circle" alt="User Image">
				</div>
				<div class="pull-left info">
					<p>{{user.firstname}} {{user.lastname}}</p>
					<p class="text-green">Welcome!</p>
				</div>
			</div>
			<ul class="sidebar-menu">
				<li class="header">NAVIGATION</li>
				<li class="treeview">
					<a href="#"><i class='fa fa-gears'></i><span>MRP</span> <i class='fa fa-angle-left pull-right'></i></a>
					<ul class="treeview-menu">
						<router-link tag="li" to="/admin/mrp/material-groupings"><a><i class='fa fa-object-group'></i><span>Material Groupings</span></a></router-link>
					</ul>
				</li>
				<li class="treeview">
					<a href="#"><i class='fa fa-user'></i><span>User Access</span> <i class='fa fa-angle-left pull-right'></i></a>
					<ul class="treeview-menu">
						<router-link tag="li" to="/admin/master-access"><a><i class='fa fa-key'></i><span>Master Access</span></a></router-link>
						<router-link tag="li" to="/admin/app-access"><a><i class='fa fa-bar-chart-o'></i><span>App Access</span></a></router-link>
					</ul>
				</li>
			</ul>
		</section>
	</aside>
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