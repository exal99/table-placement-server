import Vue from 'vue'
import App from './App.vue'
import VueMeta from 'vue-meta'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.config.productionTip = false

library.add(faSync)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueMeta)


new Vue({
  render: h => h(App),
}).$mount('#app')
