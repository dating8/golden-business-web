<template>
  <div style="text-align: center;margin-top: 30px;">
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="page.pageSize"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>

  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: {
      page:{
        type: Object,
        default: function () {
            return {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10 // 每页显示多少条
            }
        }
      },
    },
    methods:{
      //页码改变
      handleCurrentChange(cpage){
        this.page.currentPage = cpage
        this.$emit('pageChanged')
      },
      handleSizeChange(val){
        this.page.pageSize = val;
        this.$emit('pageChanged')
      },
    }
  }
</script>

<style>
</style>
