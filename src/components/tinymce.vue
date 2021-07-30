<template>
  <editor v-model="content" :init="init" />
</template>
<script>
import { onMounted, inject, nextTick } from 'vue'
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/icons/default/icons'
// 插件
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/link'
import '/public/tinymce/axupimgs/plugin'

import { imageUpload } from '@/api/admin'

export default {
  components: { Editor },
  setup() {
    const init = {
      language_url: '/tinymce/langs/zh_CN.js',// 语言包的路径
      language: 'zh_CN',//语言
      skin_url: '/tinymce/skins/ui/oxide',// skin路径
      height: 500,//编辑器高度
      branding: false,//是否禁用“Powered by TinyMCE”
      menubar: false,//顶部菜单栏显示
      plugins: 'link lists image axupimgs table media',
      toolbar: `
        bold italic underline strikethrough |
        fontsizeselect | formatselect | forecolor backcolor |
        alignleft aligncenter alignright alignjustify |
        bullist numlist outdent indent blockquote | undo redo | axupimgs | table tabledelete
      `,
      images_upload_base_path: import.meta.env.DEV ? '/api/media/faq' : '/media/faq',
      file_picker_types: 'image',
      images_upload_handler: (blobInfo, success, failure) => {
        let data = new FormData()
        data.append("files", blobInfo.blob())
				// //这里为自己的上传接口调用方法
				imageUpload(data).then(res => {
					if (res.res === 0) {
            success(res.filename)
					} else {
						ElMessage.error(res.msg)
					}
				})
      }
    }
    const content = inject('editContent')

    onMounted(() => {
      nextTick(
        tinymce.init({})
      )
    })
    return {
      init,
      content
    }
  },
}
</script>