import Vue from 'vue'
import App from './App.vue'
import iziSelect from './components/plugins/c-select'
import vFrom from './components/plugins/app'

Vue.config.productionTip = false
Vue.component('iziSelect', iziSelect)
Vue.component('vFrom', vFrom)

new Vue({
  render: h => h(App),
}).$mount('#app')
