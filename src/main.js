import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus';
import store from './store'
import './permission.js'
import '@/assets/style/index.scss'
import '@/assets/style/element-variables.scss'
import 'element-plus/lib/theme-chalk/display.css';
import 'tinymce/skins/ui/oxide/skin.css'

// 国际化
import i18n from './i18n'

// svg
import 'vite-plugin-svg-icons/register';
import svgIcon from '@/components/svgIcon.vue'

const app = createApp(App)

app.component('svg-icon', svgIcon)

app.use(router)
// 要记得使用这个插件.
app.use(i18n)
app.use(ElementPlus, {
  i18n: i18n.global.t,
})

app.use(store)
app.mount('#app')
