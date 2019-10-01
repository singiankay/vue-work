import store from '../store'

class NavGuard 
{

  constructor(to, from, next) {
    this.store = store
    this.to = to
    this.from = from
    this.next = next
  }

  init() {
    if(this.to.path.match('^/logout')) {
      this.next()
    }
    else if(this.to.path.match('^/forbidden')) {
      this.next()
    }
    else if(this.isValidated() && this.to.path.match('^/login')) {
      this.next()
    }
    else {
      this.recoverLocalSession()
      if(this.isAuthenticated() === false && (this.isPageLogin() || this.isPageForbidden())) {
        this.next()
      }
      if(this.isAuthenticated() === false) {
        this.redirectLogin()
      }
      else if(this.isValidated()) {
        this.redirectLogin()
      }
      else if(this.isClient()) {
        if(this.to.path.match('^/app/sales')) {
          if(this.accessAuth('Sales')) {
            this.salesGuard('Sales')
          }
          else {
            this.redirectAppForbidden()
          }
        }
        else if(this.to.path.match('^/app/mrp')) {
          if(this.accessAuth('MRP')) {
            this.mrpGuard('MRP')
          }
          else {
            this.redirectAppForbidden()
          }
        }
        else if(this.to.path.match('^/app/wh')) {
          if(this.accessAuth('WH')) {
            this.whGuard('WH')
          }
          else {
            this.redirectAppForbidden()
          }
        }
        else {
          this.next()
        }
      }
      else if(this.isAdmin()) {
        this.next()
      }
      else {
        this.redirectForbidden()

      }
    }
  }

  accessAuth(access) {
    for(let role of this.store.state.auth.user.client) {
      if(role.ACCESS_TYPE == access) {
        return true
      }
    }
    return false
  }

  salesGuard(code) {
    let isAccess = false
    for(let role of this.store.state.auth.user.client) {
     if(role.ACCESS_TYPE == code) {
       if(this.to.path.match('^/app/sales/order')) {
         if(role.ROLE == 'Order') {
            isAccess = true
            break
         }
       }
       else if(this.to.path.match('^/app/sales/customer-pn')) {
        if(role.ROLE == 'Customer PN') {
          isAccess = true
          break
         }
       }
       else {
         isAccess = false
         break
       }
     }
   }
   if(isAccess === false) {
     this.redirectAppForbidden()
   }
   else {
     this.next()
   }
  }

  mrpGuard(code) {
    let isAccess = false
    for(let role of this.store.state.auth.user.client) {
      if(role.ACCESS_TYPE == code) {
        if(this.to.path.match('^/app/mrp/production-schedule')) {
          if(role.ROLE == 'Production Schedule') {
           isAccess = true
           break
          }
        }
        else if(this.to.path.match('^/app/mrp/inventory-uploads')) {
          if(role.ROLE == 'RM Inventory Uploads') {
           isAccess = true
           break
          }
        }
        else if(this.to.path.match('^/app/mrp/open-po')) {
          if(role.ROLE == 'Open PO') {
           isAccess = true
           break
          }
        }
        else if(this.to.path.match('^/app/mrp/wip')) {
          if(role.ROLE == 'WIP') {
           isAccess = true
           break
          }
        }
        else if(this.to.path.match('^/app/mrp/fg-inventory')) {
          if(role.ROLE == 'FG Inventory') {
           isAccess = true
           break
          }
        }
        else if(this.to.path.match('^/app/mrp/monthly-alternative-planning')) {
          isAccess = true
          break
        }
        else if(this.to.path.match('^/app/mrp/mrp')) {
          isAccess = true
          break
        }
        else {
          isAccess = false
          break
        }
      }
    }
    if(isAccess === false) {
      this.redirectAppForbidden()
    }
    else {
      this.next()
    }
  }

  whGuard(code) {
    let isAccess = false
    for(let role of this.store.state.auth.user.client) {
      if(role.ACCESS_TYPE == code) {
        if(this.to.path.match('^/app/wh/iqc-less-materials')) {
          if(role.ROLE == 'IQC Less Materials') {
            isAccess = true
            break
          }
        }
        else {
           isAccess = false
           break
        }
      }
    }
    if(isAccess === false) {
      this.redirectAppForbidden()
    }
    else {
      this.next()
    }
  }

  recoverLocalSession() {
    this.store.dispatch('ASSIGN_LOCALSTORAGE_SESSION')
  }
  isLoggedIn() {
    if(this.to.path == 'login') {
      if(isClient()) {
        return true
      }
      else if(isAdmin()) {
        return true
      }
    }
    return false
  }
  isAuthenticated() {
    if(this.store.state.auth.user.type === null) {
      return false
    }
    return true
  }
  isClient() {
    if(this.store.state.auth.user.type == 'Client') {
      return true
    }
    return false
  }
  isAdmin() {
    if(this.store.state.auth.user.type == 'Admin') {
      return true
    }
    return false
  }
  isValidated() {
    if(this.store.state.auth.user.type == 'validation') {
      return true
    }
    return false
  }
  isPageLogin() {
    if(this.to.path == '/login') {
      return true
    }
    return false
  }
  isPageForbidden() {
    if(this.to.path == '/forbidden') {
      return true
    }
    return false
  }
  isPageApp() {
    if(this.to.path.match('^/app')) {
      return true
    }
    return false
  }
  isPageAdmin() {
    if(this.to.path.match('^/admin')) {
      return true
    }
    return false
  }
  redirectForbidden() {
    this.next('/forbidden')
  }
  redirectAppForbidden() {
    this.next('/app/forbidden')
  }
  redirectLogin() {
    this.next('/login')
  }

}

export default NavGuard