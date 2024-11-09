//works
import { createApp } from 'vue'
import App from './App.vue'
// import * as tf from '@tensorflow/tfjs'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

loadFonts()

createApp(App)
  .use(vuetify)
  .mount('#app')

  //works




