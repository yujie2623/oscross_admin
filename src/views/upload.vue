<template>
  <div class="uplaod">
    <div class="add">
      <el-button type="primary" @click="add({}, 'add')">上传</el-button>
    </div>
    <el-table :data="items.list" border stripe style="width: 100%">
      <el-table-column prop="name" label="名称" min-width="180" align="center" />
      <el-table-column prop="size" label="文件大小" min-width="180" align="center">
        <template #default="scope">
          {{ bytesToSize(scope.row.size) }}
        </template>
      </el-table-column>
      <el-table-column prop="version" label="版本号" min-width="180" align="center" />
      <el-table-column prop="version" label="版本号" min-width="180" align="center">
        <template #default="scope">
          <el-button type="text" size="small" v-html="scope.row.status === 0 ? '未发布' : '已发布'"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述" min-width="180" align="center" show-overflow-tooltip />
      <el-table-column prop="release_time" label="发布日期" min-width="180" align="center" />
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        min-width="100">
        <template #default="scope">
          <el-button @click="add(scope.row, 'edit')" type="text" size="small">编辑</el-button>
          <el-button @click="deleteList(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="uploadData.uploadTitle" v-model="uploadDialog" :close-on-click-modal="false" center>
      <el-form :model="uploadData" label-width="100px" :rules="uploadRules" ref="uploadRef">
        <el-form-item label="包名称" prop="name">
          <el-input v-model="uploadData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="uploadData.version" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否发布">
          <el-radio-group v-model="uploadData.status">
            <el-radio :label="0">不发布</el-radio>
            <el-radio :label="1">发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="uploadData.desc" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="文件上传" v-if="uploadData.uploadTitle === '文件上传'">
          <input type="file" class="files" name="file" ref="file" />
          <el-progress v-if="progress>0" :text-inside="true" :stroke-width="26" :percentage="progress">
            正在准备文件...
          </el-progress>
          <el-progress v-if="uploadProgress>0" :text-inside="true" :stroke-width="26" :percentage="uploadProgress"></el-progress>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitUpload" :disabled="isClickUpload">上传</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { onMounted, reactive, ref, unref } from 'vue'
import { ElMessage, ElMessageBox  } from 'element-plus'
import SparkMD5 from "spark-md5"
import { add_apk, upload_apk, get_apk, deleteApk, edit_apk } from '@/api/admin'
import { bytesToSize } from '@/utils/validator'

export default {
  setup() {
    const items = reactive({
      page_size: 10,
      page_no: 1,
      list: [],
      pagenum: 1
    })
    const uploadDialog = ref(false)
    const uploadData = reactive({
      uploadTitle: '文件上传',
      name: '',
      version: '',
      desc: '',
      status: 0
    })
    const uploadRef = ref(null)
    const uploadRules = {
      name: [
        { required: true, message: '请输入包名称', trigger: 'blur' },
        { min: 3, max: 25, message: '包名称在3到25个字符之间', trigger: 'blur' }
      ],
      version: [
        { required: true, message: '请输入版本号', trigger: 'blur' },
      ],
      desc: [
        { min: 0, max: 25, message: '描述内容不能超过25个字符', trigger: 'blur' }
      ]
    }
    // 获取上传列表
    const getApk = () => {
      get_apk(items).then(res => {
        if (res.res === 0) {
          items.list = res.data
        }
      })
    }

    // 添加编辑
    const add = async (data, obj) => {
      // 清空表单
      const formUploadRef = unref(uploadRef)
      if (formUploadRef) await formUploadRef.resetFields()

      uploadDialog.value = true
      if (obj === 'edit') {
        uploadData.uploadTitle = '文件编辑'
        uploadData.name = data.name
        uploadData.version = data.version
        uploadData.desc = data.desc
        uploadData.status = data.status
        uploadData.id = data.id
      } else {
        uploadData.uploadTitle = '文件上传'
        uploadData.name = ''
        uploadData.version = ''
        uploadData.desc = ''
        uploadData.status = 0
        uploadData.id = ''
      }
    }

    // 删除
    const deleteList = (data) => {
      ElMessageBox.confirm('确定删除该文件？此动作不可撤销', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteApk({ id: data.id }).then(res => {
            if (res.res === 0) {
              getApk()
              ElMessage.success(res.msg)
            } else {
              ElMessage.error(res.msg)
            }
          })
        }).catch(() => {})
    }

    // 分段上传
    // 进度条
    let progress = ref(0) // 前台进度
    let uploadProgress = ref(0) // 后台上传进度
    let chunkSize = 5 * 1024 * 1024 // 切片大小 100M
    const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice // 各个不同浏览器支持
    const handleFileChange = (file) => {
      return new Promise((resolve, reject) => {
        const chunks = Math.ceil(file.size / chunkSize) //切片数
        let currentChunk = 0
        const spark = new SparkMD5.ArrayBuffer()
        const fileReader = new FileReader()
        const loadNext = () => {
          const start = currentChunk * chunkSize
          const end = start + chunkSize >= file.size ? file.size : start + chunkSize
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
          progress.value = Math.round(currentChunk / chunks * 100) // 准备进度条
        }
        fileReader.onload = e => {
          spark.append(e.target.result); // Append array buffer
          currentChunk += 1
          if (currentChunk < chunks) {
            loadNext()
          } else {
            progress.value = 100 // 进度条
            console.log('finished loading')
            const result = spark.end()
            // 如果单纯的使用result 作为hash值的时候, 如果文件内容相同，而名称不同的时候
            // 想保留两个文件无法保留。所以把文件名称加上。
            const sparkMd5 = new SparkMD5()
            sparkMd5.append(result)
            sparkMd5.append(file.name)
            const hexHash = sparkMd5.end()
            resolve(hexHash)
          }
        }
        fileReader.onerror = () => {
          console.warn('文件读取失败！')
        }
        loadNext()
      })
    }

    const isClickUpload = ref(false)
    const submitUpload = async () =>  {
      isClickUpload.value = true
      // 表单验证
      const formUploadRef = unref(uploadRef)
      if (!formUploadRef) return
      await formUploadRef.validate()
      if (uploadData.uploadTitle === '文件上传') {
        const file = document.querySelector('.files').files[0]
        if (!file) {
          return ElMessage.error('请选择上传文件')
        }
        const blockCount = Math.ceil(file.size / chunkSize) // 分片总数
        const axiosPromiseArray = [] // axiosPromise数组
        const hash = await handleFileChange(file) //文件 hash
        // 获取文件hash之后，如果需要做断点续传，可以根据hash值去后台进行校验。
        // 看看是否已经上传过该文件，并且是否已经传送完成以及已经上传的切片。
        for (let i = 0; i < blockCount; i++) {
          const start = i * chunkSize
          const end = Math.min(file.size, start + chunkSize)
          // 构建表单
          const form = new FormData()
          form.append('file', blobSlice.call(file, start, end))
          form.append('name', file.name)
          form.append('total', blockCount)
          form.append('now_chunk', i)
          form.append('size', file.size)
          form.append('uuid', hash)
          progress.value = 0 // 文件准备进度
          uploadProgress.value = Math.round(i / blockCount * 100) // 文件上传进度
          // 加入到 Promise 数组中
          axiosPromiseArray.push(await upload_apk(form))
        }
        await Promise.all(axiosPromiseArray).then(() => {
        const data = {
          size: file.size,
          filename: file.name,
          uuid: hash
        }
        const query = Object.assign({}, data, uploadData)
        add_apk(query).then(res => {
          if (res.res === 0) {
            isClickUpload.value = false // 上传按钮重置
            uploadDialog.value = false // 关闭弹框
            uploadProgress.value = 0 // 清空进度值
            getApk()
            ElMessage.success(res.msg)
          } else {
            ElMessage.error(res.msg)
          }
        })
      })
      } else {
        const query = Object.assign({}, uploadData)
        edit_apk(query).then(res => {
          if (res.res === 0) {
            getApk()
            isClickUpload.value = false // 上传按钮重置
            uploadDialog.value = false // 关闭弹框
            uploadProgress.value = 0 // 清空进度值
            ElMessage.success(res.msg)
          } else {
            ElMessage.error(res.msg)
          }
        })
      }
    }

    onMounted(() => {
      getApk()
    })

    return {
      items,
      add,
      deleteList,
      uploadDialog,
      bytesToSize,
      uploadData,
      uploadRules,
      uploadRef,
      submitUpload,
      isClickUpload,
      progress,
      uploadProgress
    }
  },
}
</script>
<style lang="scss" scoped>
.uplaod {
  padding: 30px 50px;
  .add {
    text-align: right;
    padding-bottom: 30px;
  }
}
</style>