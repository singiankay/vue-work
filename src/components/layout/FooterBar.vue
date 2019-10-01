<template>
	<transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>
		<footer class="main-footer">
		  <div class="pull-right hidden-xs">For problems/bugs, please report to MIS (159). Developed by Kay</div>
		  <strong>Copyright &copy; {{ now }} <a>Nicera Philippines</a></strong>. All rights reserved.
		</footer>
	</transition>
</template>

<script>
export default {
	computed: {
		now() {
			return moment().format('YYYY')
		}
	}
}
</script>