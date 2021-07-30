import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require("path")
import viteSvgIcons from 'vite-plugin-svg-icons';

export default defineConfig({
  plugins: [vue(),
    viteSvgIcons({
    // 配置路劲在你的src里的svg存放文件
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      symbolId: 'icon-[dir]-[name]',
    })
  ],
  base:  './', //打包路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')//设置别名
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: []
    }
  },
  css:{
    preprocessorOptions: {
      scss: {
        additionalData: `@import 'src/assets/style/reset.scss';` // sass变量
      }
    }
  },
  assetsDir:'assets',
  // 代理服务
  server: {
    proxy: {
      '/api': {
        target: 'http://www.oscross.com:3000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})