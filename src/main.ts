import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGamepad, faHammer, faCodeBranch } from '@fortawesome/free-solid-svg-icons'
import { faJava } from '@fortawesome/free-brands-svg-icons'

library.add(faGamepad, faHammer, faCodeBranch, faJava)

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
