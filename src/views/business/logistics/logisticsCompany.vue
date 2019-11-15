<template>
    <basic-container>
      <div class="product-table">
          <el-table
          ref="lcTable" v-loading="listLoading"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{'background-color': '#f5f5f5'}">

          <el-table-column align='center'
            type="index"
            label="编号">
          </el-table-column>

          <el-table-column align='center'
            prop="companyName"
            label="物流公司名称">
          </el-table-column>

          <el-table-column
            align='center'
            prop="enable"
            label="是否启用">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enable" :disabled="permissions.business_logistics_company_enable" class="js_switch_core" @change="changeEnable(scope.row)" active-color="#E1BF7F" inactive-value="0" active-value="1">
              </el-switch>
            </template>
          </el-table-column>

        </el-table>

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
      </div>
    </basic-container>
</template>

<script>
  import lcApi from '@/api/business/logisticsCompany'
  import {mapGetters} from "vuex"
  export default {
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
        }
      }
    },
    created() {
      this.getLogisticsCompanyList()
    },
    mounted() {
    },
    methods:{
      //获得所有物流公司分页列表
      getLogisticsCompanyList(){
        this.listLoading = true
        lcApi.getLogisticsCompanyList({
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize,
          siteId:this.userInfo.siteId,
        }).then(response => {
          this.listLoading = false
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total

        })
      },
      //页码改变
      handleCurrentChange(cpage){
        this.page.currentPage = cpage;
        this.getLogisticsCompanyList()
      },
      handleSizeChange(val){
        this.page.pageSize = val;
        this.getLogisticsCompanyList()
      },
      //修改启用状态
      changeEnable(row){
        lcApi.modifyEnable(row.companyId).then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .product-table{
    padding: 20px 0 0 20px;
  }
</style>
