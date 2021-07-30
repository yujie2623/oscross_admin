<template>
  <div class="footer">
    <p>Copyright © {{new Date().getFullYear()}} 安徽淝软信息科技有限公司 皖ICP备2021005601号-3</p>
  </div>
</template>
<script>
export default {
  name: 'footerMain'
}
</script>
<style lang="scss" scoped>
.footer {
  height: 60px;
  line-height: 60px;
  text-align: center;
}

</style>