// require('es6-promise').polyfill()
import 'es6-promise/auto'
import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router'
import Home from './Home.vue'
import VueProgressBar from 'vue-progressbar'

import Vuex from 'vuex'
import axios from 'axios'
import store from './store/index.js'
import {ServerTable, ClientTable, Event} from 'vue-tables-2'
import VeeValidate from 'vee-validate'
let VueMoment = require('vue-moment')
let moment = require('moment')

// import qs from 'qs'
// import assert from 'assert'
// import FileSaver from 'file-saver'

window.Vue = Vue
window.axios = axios
window.axios.defaults.baseURL = 'http://npi-appserver/warea/kay/erpx/index.cfm/'
// window.axios.defaults.baseURL = 'http://npi-appserver/erpx/api/index.cfm/'
window.moment = moment
// window.qs = qs
// window.assert = assert

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueMoment)
Vue.use(VueProgressBar, {
	color: 'rgb(143, 255, 199)',
	// color: 'rgb(255, 174, 66)',
	failedColor: 'red',
	height: '8px'
})

Vue.use(Event)

Vue.use(ClientTable, {
	skin: 'table table-striped table-bordered table-hover table-condensed',
	texts: {
		filter:'Filter data:',
		filterPlaceholder:'Search here...',
		limit:'Per page:'
	},
	orderBy: { ascending:false },
}, false, 'bootstrap3', 'default')

Vue.use(ServerTable, {
	debounce: 250,
	skin: 'table table-striped table-bordered table-hover',
	texts: {
		filter:'Filter data:',
		filterPlaceholder:'Search here...',
		limit:'Per page:',
	},
	orderBy: { ascending:false }
}, true, 'bootstrap3', 'default')

Vue.use(VeeValidate)
// Vue.use(FileSaver)
Vue.config.productionTip = false

import 'admin-lte/bootstrap/css/bootstrap.min.css'
import 'admin-lte/build/less/skins/skin-blue.less'
import 'admin-lte/build/less/AdminLTE.less'
import 'animate.css/animate.min.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'font-awesome-loader';
import 'admin-lte/bootstrap/js/bootstrap.min.js'
import 'admin-lte/dist/js/app.min.js'

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(Home)
})
