<template>
  <div style="height:100%">
    <basic-container>
      <div class="product-table" >
          <el-table
          ref="msTable" v-loading="listLoading"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{'background-color': '#f5f5f5'}">

          <el-table-column align='center'
            type="index"
            label="编号"
            width="65">
          </el-table-column>

          <el-table-column align='center'
            prop="title"
            label="消息标题">
          </el-table-column>

          <el-table-column align='center'
            prop="sendTime"
            label="通知时间">
          </el-table-column>

          <el-table-column align='center'
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <span>{{scope.row.status === '1'?'已查阅':'未查阅'}}</span>
            </template>
          </el-table-column>

          <el-table-column label="管理" align='center'>
            <template slot-scope="scope">
              <el-button type="text"
                icon="el-icon-view"
                size="mini" @click="handleCheck(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <jsPagination :page="page" @pageChanged="getFetchList"></jsPagination>
      </div>

      <el-dialog
        :title="checkObj.title"
        :visible.sync="dialogVisible" center>
        <div v-html="checkObj.content" style="padding-bottom: 20px"></div>
      </el-dialog>

    </basic-container>

  </div>
</template>

<script>
  import {fetchList} from '@/api/business/message'
  import {mapGetters} from "vuex"
  import jsPagination from "@/components/js_pagination/js_pagination"
  export default {
    components: {
      jsPagination
    },
    computed: {
      ...mapGetters(["userInfo", "permissions"])
    },
    data() {
      return {
        listLoading:false,
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        dialogVisible:false,
        checkObj:{}
      }
    },
    created() {
      this.getFetchList()
    },
    methods:{
      handleCheck(row){
        this.dialogVisible = true
        this.checkObj = row
      },
      //获取列表
      getFetchList(){
        this.listLoading = true
        fetchList({
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize,
          siteId:this.userInfo.siteId,
          receiveUserId:this.userInfo.userId,
        }).then(response => {
          this.listLoading = false
          if(response.data.data){
            this.tableData = response.data.data.records
            this.page.total = response.data.data.total
          }

        })
      }
    }

  }
</script>

<style scoped lang="scss">
  .dialog-content{
    padding-bottom: 20px;
  }
</style>
