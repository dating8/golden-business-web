<template>
  <div style="height:100%">
    <basic-container>
      <div class="product-table">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd" style="margin-bottom: 20px;" v-if="permissions.business_offline_shop_add">添加</el-button>
          <el-table
          ref="osTable" v-loading="listLoading"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{'background-color': '#f5f5f5'}">

          <el-table-column align='center'
            type="index"
            label="排序"
            width="65">
          </el-table-column>

          <el-table-column align='center'
            prop="shopName"
            label="下线体验店名称">
          </el-table-column>

          <el-table-column
            align='center'
            prop="enable"
            label="状态"  width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enable"
                disabled class="js_switch_core" active-color="#E1BF7F" :active-value="1">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column align='center'
            prop="telephone"
            label="固定电话">
          </el-table-column>

          <el-table-column align='center'
            prop="mobile"
            label="手机">
          </el-table-column>

          <el-table-column align='center'
            prop="createTime"
            label="添加时间">
          </el-table-column>

          <el-table-column align='center'
            prop="detailAddress"
            label="地址">
          </el-table-column>

          <el-table-column label="管理" align='center'>
            <template slot-scope="scope">
              <el-button type="text"
                icon="el-icon-edit"
                size="mini" @click="handleEdit(scope.row,scope.$index)" v-if="permissions.business_offline_shop_edit">编辑</el-button>
                <el-button type="text"
                  icon="el-icon-delete"
                  size="mini" @click="handleDel(scope.row,scope.$index)" v-if="permissions.business_offline_shop_del">删除</el-button>
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

    <el-dialog :title="formStatu === 'add'?'添加线下体验店':'编辑线下体验店'" :visible.sync="dialogFormVisible" center>
      <el-form :rules="applyRules"
             ref="applyForm"
             :model="applyForm"
             label-width="130px">
        <el-form-item label="下线体验店名称:" prop="shopName">
          <el-input v-model="applyForm.shopName" placeholder="请输入下线体验店名称"></el-input>
        </el-form-item>

        <el-form-item label="地址：" prop="defultAddress">
          <areaSelect v-model="applyForm.defultAddress"></areaSelect>
        </el-form-item>

        <el-form-item label="" v-if="applyForm.defultAddress.qu">
          <el-input type="textarea" v-model="applyForm.detailAddress" placeholder="请输入详细地址…."></el-input>
        </el-form-item>

        <el-form-item label="固定电话:" prop="telephone">
          <el-input v-model="applyForm.telephone" placeholder="请输入固定电话"></el-input>
        </el-form-item>

        <el-form-item label="手机:" prop="mobile">
          <el-input v-model="applyForm.mobile" placeholder="请输入手机"></el-input>
        </el-form-item>

        <el-form-item label="排序:" prop="seqNo">
          <el-input v-model="applyForm.seqNo" placeholder="数字越小越靠前"></el-input>
        </el-form-item>

        <el-form-item label="是否启用" prop="enable">
          <el-radio-group v-model="applyForm.enable">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import osApi from '@/api/business/offlineShop'
  import {applyRules} from '@/const/crud/business/offlineshop'
  import areaSelect from "@/components/area_select/area_select";
  import {mapGetters} from "vuex"
  export default {
    computed: {
      ...mapGetters(["userInfo", "permissions"])
    },
    components: {
      areaSelect
    },
    data() {
      return {
        formStatu:'add',
        listLoading:false,
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        applyForm:{
          enable:1,
          defultAddress:{
            sheng: '',
            shi: '',
            qu: '',
          },
        },
        applyRules,
        dialogFormVisible:false
      }
    },
    created() {
      this.getOfflineShopList()
    },
    methods:{
      //获取金价设置列表
      getOfflineShopList(){
        this.listLoading = true
        osApi.getOfflineShopList({
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize,
          siteId:this.userInfo.siteId
        }).then(response => {
          this.listLoading = false
          let list = response.data.data.records
          list.forEach((o,i) => {
            o.defultAddress = {
              sheng:o.areaAddressProvince,
              shi:o.areaAddressCity,
              qu:o.areaAddressDistrict
            }
            o.enable = o.enable * 1
          })
          this.tableData = list
          this.page.total = response.data.data.total

        })
      },
      //页码改变
      handleCurrentChange(cpage){
        this.page.currentPage = cpage;
        this.getOfflineShopList()
      },
      handleSizeChange(val){
        this.page.pageSize = val;
        this.getOfflineShopList()
      },
      //新增
      handleAdd(){
        this.dialogFormVisible = true;
        this.formStatu = 'add';
        this.resetForm()
      },
      //编辑
      handleEdit(row, index){
        this.formStatu = 'edit'
        this.dialogFormVisible = true;
        this.applyForm = row;
      },
      //新增数据
      submitData(){
        this.$refs.applyForm.validate(valid => {
          if (valid) {
            console.log(this.applyForm)
            let address = this.applyForm.defultAddress
            this.applyForm.areaAddressProvince = address.sheng
            this.applyForm.areaAddressCity = address.shi
            this.applyForm.areaAddressDistrict = address.qu
            this.applyForm.siteId = this.userInfo.siteId
            if(this.formStatu === 'add'){
              this.addOfflineShop()
            }else{
              this.putObj()
            }
          }
        })
      },
      //新增数据
      addOfflineShop(){
        osApi.addOfflineShop(this.applyForm).then(res =>{
          this.dialogFormVisible = false
          this.$message.success('添加成功')
          this.getOfflineShopList()
        })
      },
      //修改数据
      putObj(){
        osApi.putObj(this.applyForm).then(res =>{
          this.dialogFormVisible = false
          this.$message.success('修改成功')
          this.getOfflineShopList()
        })
      },
      //删除数据
      handleDel(row, index){
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          osApi.delObj(row.shopId).then(() => {
            this.getOfflineShopList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      // 重置
      resetForm(){
        if(this.applyForm.shopName){
          this.$refs.applyForm.resetFields()
          this.applyForm = {
            enable:1,
            defultAddress:{
              sheng: '',
              shi: '',
              qu: '',
            },
          }
        }

      }
    }
  }
</script>

<style scoped lang="scss">
  .product-table{
    padding: 20px 0 0 20px;
  }
</style>
