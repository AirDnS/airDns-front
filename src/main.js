import {createApp} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {loadFonts} from './plugins/webfontloader'
import routers from "./routers";
import axios from 'axios'
import "@/scss/style.scss";
import VueCookies from 'vue-cookies'
import mitt from 'mitt'

loadFonts()

const emitter = mitt();
const app = createApp(App)
app.use(routers)
app.use(vuetify)
app.use(VueCookies)
app.config.globalProperties.$axios = axios
app.config.globalProperties.emitter = emitter
app.mount('#app')

// axios.interceptors.request.use(config => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers['Authorization'] = `${token}`;
//     }
//     return config;
//   });


app.config.globalProperties.authHeader = function () {
  const token = localStorage.getItem('accessToken'); 
  return { headers: {'Authorization': token} };
};