import Vue from 'vue'
import App from './App.vue'
import VTooltip from 'v-tooltip'

Vue.use(VTooltip)
Vue.config.productionTip = false

import "@/assets/css/tooltip.css"

new Vue({
  render: h => h(App),
}).$mount('#app')
