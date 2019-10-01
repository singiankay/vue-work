<template>
<div>
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
          <a href="#"> <i class="fa fa-dollar text-green"></i><span>Sales</span> <i class='fa fa-angle-left pull-right'></i></a>
          <ul class="treeview-menu">
            <router-link tag="li" to="/app/sales/order"><a><i class='fa fa-file-text'></i><span>Order</span></a></router-link>
            <router-link tag="li" to="/app/sales/customer-pn"><a><i class='fa fa-tag'></i><span>Customer PN</span></a></router-link>
          </ul>
        </li>
         <li class="treeview">
          <a href="#"> <i class="fa fa-gears text-aqua"></i><span>MRP</span> <i class='fa fa-angle-left pull-right'></i></a>
          <ul class="treeview-menu">
            <router-link tag="li" to="/app/mrp/production-schedule"><a><i class='fa fa-area-chart'></i><span>Production Schedule</span></a></router-link>
            <router-link tag="li" to="/app/mrp/inventory-uploads"><a><i class='fa fa-upload'></i><span>RM Inventory Uploads</span></a></router-link>
            <router-link tag="li" to="/app/mrp/open-po"><a><i class='fa fa-opencart'></i><span>Open PO Uploading</span></a></router-link>
            <router-link tag="li" to="/app/mrp/wip"><a><i class='fa fa-clock-o'></i><span>WIP</span></a></router-link>
            <router-link tag="li" to="/app/mrp/fg-inventory"><a><i class='fa fa-dropbox'></i><span>FG Inventory</span></a></router-link>
            <router-link tag="li" to="/app/mrp/mrp"><a><i class='fa fa-pie-chart'></i><span>MRP</span></a></router-link>
          </ul>
        </li>
        <li class="treeview">
          <a href="#"> <i class="fa fa-dropbox text-yellow"></i><span>WH</span> <i class='fa fa-angle-left pull-right'></i></a>
          <ul class="treeview-menu">
            <router-link tag="li" to="/app/wh/iqc-less-materials"><a><i class='fa fa-mail-forward'></i><span>IQC-less Materials</span></a></router-link>
          </ul>
        </li>
      </ul>
    </section>
  </aside>
</div>
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