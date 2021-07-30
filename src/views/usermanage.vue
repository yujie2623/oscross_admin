<template>
  <div class="newslist" style="padding:50px 20px">
    <el-table :data="items.list" stripe style="width: 100%" height="580" border>
      <el-table-column prop="username" label="用户名" min-width="180" align="center" show-overflow-tooltip />
      <el-table-column prop="phone" label="手机号" min-width="180" align="center" show-overflow-tooltip />
      <el-table-column prop="auth_num" label="剩余授权数" min-width="180" align="center" show-overflow-tooltip />
      <el-table-column prop="create_time" label="创建时间" min-width="180" align="center" show-overflow-tooltip />
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
  </div>
</template>
<script>
import { reactive, onMounted } from 'vue'
import { getUserlist } from '@/api/admin'
export default {
  setup() {
    const items = reactive({
      page_size: 10,
      page_no: 1,
      list: [],
      pagenum: 1
    })
    // 分页操作
    const handleCurrentChange = (v) => { // 当前页
      items.page_no = v
      userlist()
    }
    const handleSizeChange = (v) => { // 每页的条数
      items.page_size = v
      userlist()
    }
    // 获取用户
    const userlist = () => {
      getUserlist(items).then(res => {
        if (res.res === 0) {
          items.list = res.data
          items.pagenum = res.count // 总条数
        }
      })
    }

    onMounted(() => {
      userlist()
    });
    return {
      items,
      handleCurrentChange,
      handleSizeChange
    }
  }
}
</script>
<style lang="scss" scoped>
.newslist {
  width: 100%;
  padding: 20px;
}
</style>