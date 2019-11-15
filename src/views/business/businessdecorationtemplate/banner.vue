<template>
  <div>

    <div class="shop-banner-item" v-for="(item, idx) in bannerList" :key="item.bannerId">
      <div class="shop-banner-img">
        <i class="el-icon-circle-close" @click="tapDel(idx)"></i>
        <!-- banner图片 -->
        <singleUpload :imgUrl.sync="item.bannerFileUrl" tip="尺寸标准：710*780（jpg，png）"></singleUpload>
      </div>
      <div class="shop-edit-type">
        <el-radio-group v-model="item.type">
          <el-radio label="1">自定义链接</el-radio>
          <el-radio label="3" @click.native.prevent="tapShowPro(idx,'3')">关联商品</el-radio>
          <el-radio label="2" @click.native.prevent="tapShowPro(idx,'2')">关联分类</el-radio>
        </el-radio-group>
      </div>
      <el-input v-model="item.gotoUrl" placeholder="图片关联链接" v-if="item.type === '1'"></el-input>
    </div>
    <div class="flex flex-center">
      <el-button @click="tapAdd">添加</el-button>
      <el-button type="primary" @click="saveData">保存</el-button>
    </div>

    <!-- 关联商品 -->
    <el-dialog :title="selectObj.type === '2'?'关联分类':'关联商品'" :visible.sync="dialogTableVisible">
      <template v-if="selectObj.type === '3'">
        <div class="flex">
          <el-row :gutter="10">
            <el-col :span="20">
              <el-input v-model="productName" placeholder="商品名称" @keyup.native.enter="templateProductList"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" size="medium" class="sendBtn" icon="el-icon-search" @click="templateProductList">搜索</el-button>
            </el-col>
          </el-row>
        </div>

        <el-table :data="businessData" highlight-current-row @current-change="handleSelectionProduct">
          <el-table-column label="选择" width="80">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="title" label="商品名称"></el-table-column>
          <el-table-column align='center' prop="price" label="售价"></el-table-column>
          <el-table-column align='center' prop="putonSaleTag" label="状态" :formatter="formatStatus"></el-table-column>
        </el-table>

        <jsPagination :page="page" @pageChanged="templateProductList"></jsPagination>
      </template>
      <!-- 关联分类 -->
      <template v-if="selectObj.type === '2'">
        <el-table :data="categoryList" highlight-current-row @current-change="handleSelectionCategory">
          <el-table-column label="选择" width="80">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="categoryName" label="分类名称"></el-table-column>
        </el-table>
      </template>

      <div class="flex flex-center" style="margin-top:30px">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">保存</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import tpApi from '@/api/business/template'
  import singleUpload from "@/components/single-upload/single-upload"
  import jsPagination from "@/components/js_pagination/js_pagination"
  import {mapGetters} from "vuex"
  import { randomLenNum } from "@/util/util"
  export default {
    components: {
      singleUpload, jsPagination
    },
    computed: {
      ...mapGetters(["siteInfo","businessUserInfo"])
    },
    props: {
      bannerList:{
        type: Array,
        default: () => []
      },
      templateId:{
        type: String
      },
    },
    data() {
      return {
        page:{
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        businessData:[],//关联商品
        productName:'',//商品名称
        categoryList:[],//关联分类
        dialogTableVisible:false,//关联商品弹框
        selectObj:{},
      }
    },
    created() {
      //关联商品
      this.templateProductList()
      //关联分类
      this.getcateGory()
    },
    methods:{
      //添加
      tapAdd(){
        let obj = {
          bannerId:randomLenNum(2, true),
          gotoUrl:'',
          templateId:this.templateId,
          bannerFileUrl:'',
          type:''
        }
        this.bannerList.push(obj)
      },
      //删除
      tapDel(idx){
        this.bannerList.splice(idx,1)
      },
      //显示关联商品, 关联分类弹框
      tapShowPro(idx,type){
        this.bannerList[idx].type = type
        this.selectObj = this.bannerList[idx]
        this.dialogTableVisible = true
        if(type === '2'){
          this.categoryList.forEach(item => {
            if(item.scId === this.selectObj.businessProductCategoryId){
              item.checked = true
            }else{
              item.checked = false
            }
          })
        }else{
          this.businessData.forEach(item => {
            if(item.productId === this.selectObj.productId){
              item.checked = true
            }else{
              item.checked = false
            }
          })
        }
      },
      //转换表格中上下架状态的显示格式
      formatStatus(row, column) {
        return row.putonSaleTag == '1' ? "上架" : "下架";
      },
      //获取关联商品
      templateProductList(){
        tpApi.templateProductList({
          businessId: this.businessUserInfo.businessId,
          productName: this.productName,
          pageNum:this.page.currentPage,
          pageSize:this.page.pageSize
        }).then(res => {
          if(res.data.data){
            this.businessData = res.data.data.records
            this.businessData.forEach(item => {
              if(item.productId === this.selectObj.productId){
                item.checked = true
              }else{
                item.checked = false
              }
            })
            this.page.total = res.data.data.total
          }
        })
      },
      //获取关联
      getcateGory(){
        tpApi.getcateGory(this.businessUserInfo.businessId).then(res => {
          this.categoryList = res.data.data
        })
      },
      //关联商品当行选择
      handleSelectionProduct (row) {
        if(row.productId){
          this.selectObj.productId = row.productId
          this.selectObj.productName = row.title
          this.businessData.forEach(item => {
            // 排他,每次选择时把其他选项都清除
            if (item.productId !== row.productId) {
              item.checked = false
            }else{
              item.checked = true
            }
          })
        }

      },
      //关联分类当行选择
      handleSelectionCategory (row) {
        this.selectObj.businessProductCategoryId = row.scId
        this.selectObj.businessProductCategoryName = row.categoryName
        this.categoryList.forEach(item => {
          // 排他,每次选择时把其他选项都清除
          if (item.scId !== row.scId) {
            item.checked = false
          }else{
            item.checked = true
          }
        })
      },
      saveData(){
        this.$emit('change',this.bannerList)

      }
    }
  }

</script>

<style scoped lang="scss">
  .shop-banner-item{
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
  }
  .shop-banner-img{
    position: relative;
    i{
      font-size: 20px;
      position: absolute;
      top: -10px;
      left: 148px;
      z-index: 2;
      color: #E1BF7F;
    }
  }
  .shop-edit-type{
    margin: 20px 0;
  }
</style>
