import Vue from 'vue'
import App from './App.vue'
import VTooltip from 'v-tooltip'
import VueObserveVisibility from 'vue-observe-visibility'

Vue.use(VTooltip)
Vue.use(VueObserveVisibility)
Vue.config.productionTip = false

import "@/assets/css/tooltip.css"

new Vue({
  render: h => h(App),
}).$mount('#app')
