import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import container from "@/plugins/inversify";
import { vueInversifyPlugin} from '@vanroeybe/vue-inversify-plugin';

Vue.config.productionTip = false

Vue.use(vueInversifyPlugin(container));

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
