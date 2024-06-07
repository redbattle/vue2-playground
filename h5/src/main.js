import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant/lib';
import 'vant/lib/index.css';
import { Notify } from 'vant';

Vue.use(Vant);

Vue.config.productionTip = false

Notify.setDefaultOptions({
  className: 'notify-custom'
})

new Vue({
  render: h => h(App),
}).$mount('#app')
