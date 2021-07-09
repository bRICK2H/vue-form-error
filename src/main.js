import Vue from 'vue'
import App from './App.vue'
import iziSelect from './components/plugins/c-select'

Vue.config.productionTip = false
Vue.component('iziSelect', iziSelect)

new Vue({
  render: h => h(App),
}).$mount('#app')
