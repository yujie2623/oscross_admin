<template>
  <div class="newslist">
    <div class="right add pb20">
      <el-button type="primary" @click="addnews({}, 'add')">添加</el-button>
    </div>
    <el-table :data="items.list" stripe height="580" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="title" label="段落标题" min-width="180" align="center">
        <template #default="scope">
          <div class="font_hideen" v-html="scope.row.title"></div>
        </template>
      </el-table-column>
      <el-table-column prop="section" label="段落章节" min-width="180" align="center">
        <template #default="scope">
          <div class="font_hideen" v-html="scope.row.section"></div>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="文章" min-width="180" align="center">
        <template #default="scope">
          <div class="font_hideen">{{scope.row.content}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="180" align="center">
        <template #default="scope">
          <span v-if="scope.row.status === 0" style="color:#f56c6c">草稿</span>
          <span v-else>已发布</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" min-width="180" align="center" show-overflow-tooltip />
      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="text" size="small" @click="addnews(scope.row, 'edit')">编辑</el-button>
          <el-button @click="onDeleteArticle(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :image-size="300" description="暂无数据"></el-empty>
      </template>>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="text-align:center;padding-top:30px"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="items.pagenum"
      :page-sizes="[10,20,50,100]"
      :page-size="items.page_size"
      hide-on-single-page
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 编辑器 -->
    <el-dialog :title="htmlvalue.dialogTitle" v-model="htmlvalue.articleDialog" fullscreen :close-on-click-modal="false">
      <el-form :model="htmlvalue" label-width="100px">
        <el-form-item label="列表标题">
          <el-input v-model="htmlvalue.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="列表段落">
          <el-input v-model="htmlvalue.section" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章内容">
          <tinymce v-model="editFormContent" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="htmlvalue.articleDialog = false">取 消</el-button>
          <el-button type="primary" @click="htmlval(0)">草稿</el-button>
          <el-button type="primary" @click="htmlval(1)">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, ref, reactive, provide } from 'vue'
import { getlist, add, edit, deleteArticle } from '@/api/admin'
import { ElMessageBox, ElMessage } from 'element-plus';
import tinymce from '@/components/tinymce.vue'
export default {
  components: { tinymce },
  setup() {
    // 分页
    const items = reactive({
      page_size: 10,
      page_no: 1,
      list: [],
      pagenum: 1
    })

    // 分页操作
    const handleCurrentChange = (v) => { // 当前页
      items.page_no = v
      getListQuestion()
    }
    const handleSizeChange = (v) => { // 每页的条数
      items.page_size = v
      getListQuestion()
    }
    const getListQuestion = () => { // 获取列表
      getlist(items).then(res => {
        if (res.res === 0) {
          items.list = res.data
          items.pagenum = res.count // 总条数
        }
      })
    }

    // 删除文章
    const onDeleteArticle = (data) => {
      ElMessageBox.confirm('您确定删除该文章？', '删除文章', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle({ id: data.id }).then(res => {
          if (res.res === 0) {
            ElMessage.success(res.msg)
            getListQuestion()
          } else {
            ElMessage.error(res.msg)
          }
        })
      }).catch(() => {})
    }

    // 编辑器
    const htmlvalue = reactive({ // 编辑器内容
      articleDialog: false,
      dialogTitle: '发布文章',
      content: '',
      title: '',
      section: '',
      status: 0 // 0 草稿, 1 发布
    })
    const editFormContent = ref('')
    provide('editContent', editFormContent)

    // 显示添加新闻框
    const addnews = (data, obj) => {
      htmlvalue.articleDialog = true
      if (obj === 'add') {
        htmlvalue.dialogTitle = '发布文章'
        htmlvalue.status = 1
        htmlvalue.title = ''
        htmlvalue.section = ''
        editFormContent.value = ''
        htmlvalue.content = ''
      } else {
        htmlvalue.dialogTitle = '编辑文章'
        htmlvalue.title = data.title
        htmlvalue.section = data.section
        editFormContent.value = data.content
        htmlvalue.content = editFormContent
        htmlvalue.id = data.id
      }
    }

    // 发布/草稿
    const htmlval = (v) => {
      let api = null
      if (htmlvalue.dialogTitle === '编辑文章') {
        api = edit
      } else {
        api = add
        htmlvalue.content = editFormContent
      }
      htmlvalue.status = v
      api(htmlvalue).then(res => {
        if (res.res === 0) {
          location.reload()
          ElMessage.success(res.msg)
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    onMounted(() => {
      getListQuestion()
    })

    return {
      items,
      onDeleteArticle,
      addnews,
      editFormContent,
      htmlvalue,
      htmlval,
      handleCurrentChange,
      handleSizeChange
    }
  },
}
</script>
<style lang="scss">
.tox-tinymce-aux {
  z-index: 2005!important;
}
</style>
<style lang="scss" scoped>
.newslist {
  width: 100%;
  padding: 20px;
  .font_hideen {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .add {
    text-align: right;
    margin-bottom: 20px;
  }
}
</style>
