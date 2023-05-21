import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import 'animate.css'

Vue.config.productionTip = false

// Configurar los encabezados CORS para cada solicitud fetch
const fetchWithCors = (url, options) => {
  const headers = options.headers || {};
  headers['Content-Type'] = 'application/json';
  headers['Access-Control-Allow-Origin'] = '*';
  headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
  options.headers = headers;
  return fetch(url, options);
};

Vue.prototype.$fetch = fetchWithCors;

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
