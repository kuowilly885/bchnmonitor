import Vue from 'vue'
import App from './App.vue'
import VTooltip from 'v-tooltip'
import VueObserveVisibility from 'vue-observe-visibility'
import Clipboard from 'v-clipboard'

Vue.use(VTooltip)
Vue.use(VueObserveVisibility)
Vue.use(Clipboard)

Vue.config.productionTip = false

import "@/assets/css/universal.css"
export const EventBus = new Vue();

new Vue({
  render: h => h(App),
}).$mount('#app')
