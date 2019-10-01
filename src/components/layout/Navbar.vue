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
					<li><a>{{currentDivisionCode}}</a></li>
					<!-- <li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">{{ currentDivisionCode }} <span class="caret" v-if="allowedDivisions.length > 1"></span></a>
						<ul class="dropdown-menu" role="menu" v-if="allowedDivisions.length > 1">
							<li v-for="division in allowedDivisions">
								<a href="#" v-if="division.id != auth.user.current_division" @click.prevent="changeDivision(division.id)">{{ division.code }}</a>
							</li>
	              </ul>
					</li> -->
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
									<a href="http://npi-appserver/" class="btn btn-default btn-flat">Go to NPI Appserver</a>
								</div>
								<div class="pull-right">
								 <router-link to="/logout" class="btn btn-default btn-flat">Sign out</router-link>
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
	data() {
		return {
			divisions: [],
		}
	},
	computed: {
		...mapState([
			'auth',
		]),
		user() {
			return this.auth.user
		},
		allowedDivisions() {
			let divisions = []
			if(this.auth.divisions) {
				for(let [index, value] of this.auth.divisions.entries()) {
					if(this.divisions.includes(value.id)) {

						divisions.push(value)
					}
				}
			}
			return divisions
		},
		currentDivisionCode() {
			if(this.auth.divisions) {
				for(let [index, value] of this.auth.divisions.entries()) {
					if(value.id == this.auth.user.current_division) return value.code
				}
			}
			
		}
	},
	created() {
		this.$store.dispatch('SET_DIVISIONS')
		for (let [index, value] of this.auth.user.client.entries()) {
			if(!this.divisions.includes(value.DIVISION)) {
				this.divisions.push(parseInt(value.DIVISION))
			}
		}
	},
	methods: {
		changeDivision(division) {
			this.$store.dispatch('SET_CURRENT_DIVISION', division)
		}
	}
}
</script>