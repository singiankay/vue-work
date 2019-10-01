import VueRouter from 'vue-router'
import store from '../store'

import Wrapper from '../views/App/Wrapper.vue'
import AdminWrapper from '../views/Admin/Wrapper.vue'
import SPAWrapper from '../views/SPAWrapper.vue'

import AppIndex from '../views/App/Index.vue'

import Sales from './App/Sales/Index'
import MRP from './App/MRP/Index'
import WH from './App/WH/Index'
import Admin from './Admin/Index'

import Forbidden from '../views/Forbidden.vue'

import Login from '../views/Login/LoginPage.vue'
import Logout from '../views/Login/Logout.vue'

import NavGuard from './NavGuard'

let router = new VueRouter({
  routes: [
    {
      path: '/app',
      component: Wrapper,
      children: [
        {
          path: 'index',
          name: 'ERP Expansion',
          component: AppIndex,
        },
        Sales,
        MRP,
        WH,
        {
          path: 'forbidden',
          name: 'Access Error 403: Forbidden',
          component: Forbidden
        },
        {
          path: '',
          redirect: '/app/index'
        },
      ]
    },
    {
      path: '/admin',
      component: AdminWrapper,
      children: Admin
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/logout',
      component: Logout
    },
    {
      path: '/',
      redirect: '/login',
    },
  ]
})

router.beforeEach((to, from, next) => {
  let navGuard = new NavGuard(to, from, next)
  navGuard.init()
})

export default router