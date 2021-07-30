import { createI18n } from 'vue-i18n'
import enLocale from 'element-plus/lib/locale/lang/en'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import zh from './zh'
import en from './en'

const messages = {
  [enLocale.name]: {
    el: enLocale.el, // el 这个属性很关键，一定要保证有这个属性，
    ...enLocale,
    ...en
  },
  [zhLocale.name]: {
    el: zhLocale.el,
    ...zhLocale,
    ...zh
  },
  testLocale: {
    el: {},
    // 没有定义 message 字段，会 fallback 回到 en 去, fallbackLocale 的定义在下方 👇
  },
}

const i18n = createI18n({
  locale: zhLocale.name,
  fallbackLocale: enLocale.name,
  messages,
})

export default i18n