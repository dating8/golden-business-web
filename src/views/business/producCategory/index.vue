<template>
    <div class="product-box">
      <template v-if="!dialogVisible">
        <div class="product-table-nav">
          <span :class="flag === 0?'active':''" @click="refreshData(0)">全部({{NumArr.allNum}})</span>
          <span :class="flag === 1?'active':''" @click="refreshData(1)">出售中({{NumArr.salingNum}})</span>
          <span :class="flag === 2?'active':''" @click="refreshData(2)">售罄中({{NumArr.seledNum}})</span>
          <span :class="flag === 3?'active':''" @click="refreshData(3)">仓库中({{NumArr.storingNum}})</span>
          <!-- <span>审核记录({{NumArr.allNum}})</span> -->
        </div>
        <!-- 搜索 -->
        <div class="product-search flex flex-ver">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-input v-model="name" placeholder="商品名称/商品货号"></el-input>
            </el-col>
            <el-col :span="10">
              <div class="product-price flex flex-ver">
                <span class="price-label">价格区间</span>
                <el-input v-model.number="minPrice" placeholder="0"></el-input>
                <span class="center-line">—</span>
                <el-input v-model.number="maxPrice" placeholder="0"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <el-select v-model="categoryId" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.categoryId"
                  :label="item.categoryName"
                  :value="item.categoryId">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <div class="search-btn" @click="getBusinessListPage">搜索</div>
            </el-col>
          </el-row>

        </div>

        <basic-container>
          <div class="product-table-top">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd" v-if="permissions.business_product_edit">新增</el-button>
            <el-button plain size="small" icon="icon-icon_shelves1 icon-s" @click="productSale">上架</el-button>
            <el-button plain size="small" icon="icon-icon_shelves icon-s" @click="productForbidSale">下架</el-button>
            <el-button plain size="small" icon="icon-icon_export icon-s">导出</el-button>
            <el-button plain size="small" icon="icon-icon_import icon-s">导入</el-button>
          </div>

          <div class="product-table">
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange" v-loading="listLoading">

              <el-table-column type="selection" width="55"></el-table-column>

              <el-table-column align='center' type="index" label="编号" width="65"></el-table-column>

              <el-table-column align='center' prop="seqNo" label="排序"></el-table-column>

              <el-table-column align='center' prop="title" label="商品名称">
                <template slot-scope="scope">
                  <div class="flex">
                    <el-image style="width: 120px;" :src="scope.row.imageUrl" fit="contain"></el-image>
                    <span style="margin-left: 10px">{{ scope.row.title }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column align='center' prop="price" label="销售价"></el-table-column>

              <el-table-column align='center' prop="totalInventory" label="库存"></el-table-column>

              <el-table-column align='center' prop="levelTwoCategoryName" label="商品分类">
                <template slot-scope="scope">
                  <span>{{ siteInfo.siteCategoryLevel === 2 ? scope.row.levelTwoCategoryName : scope.row.levelThreeCategoryName }}</span>
                </template>
              </el-table-column>

              <el-table-column align='center' prop="putonSaleTag" label="状态"  :formatter="formatStatus"></el-table-column>

              <el-table-column prop="createTime" label="发布时间"></el-table-column>

              <el-table-column label="操作" align='center'>
                <template slot-scope="scope">
                  <el-button type="text"
                              icon="el-icon-edit"
                              size="mini"
                              @click="handleEdit(scope.row.productId)" v-if="permissions.business_product_edit">编辑</el-button>
                  <el-button
                    @click.native.prevent="handleDel(scope.row,scope.$index)"
                    type="text"
                    size="small" icon="el-icon-delete" v-if="permissions.business_product_del">
                    删除
                  </el-button>
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

      <template v-else-if="dialogVisible">

        <release ref="release" :siteId="siteInfo.siteId" :siteCategoryLevel="siteInfo.siteCategoryLevel" :businessProduct="form.businessProduct"
        @update="updateRelease" v-show="activeIndex === 0"></release>

        <template v-if="activeIndex === 1">
          <div class="product-table-nav">
            <span :class="isBasic?'active':''" @click="isBasic = true">基础信息</span>
            <span :class="!isBasic?'active':''" @click="isBasic = false">库存/规格/详情</span>
          </div>

          <basic-container>
            <basicData :businessProduct="form.businessProduct" v-show="isBasic" @update="updateData"></basicData>
            <detail :form="form" :formStatus="formStatus" v-show="!isBasic" @update="updateData"></detail>
          </basic-container>
        </template>

      </template>
  </div>


</template>

<script>
  import {tableform} from "@/const/crud/business/produList"
  import bpApi from '@/api/business/produList'
  import {mapGetters} from "vuex"
  import release from "./components/release"
  import basicData from "./components/basicData"
  import detail from "./components/detail"
  import {deepClone} from '@/util/util'
  export default {
    components: {
      release, basicData, detail
    },
    computed: {
      ...mapGetters(["siteInfo","businessUserInfo", "permissions"])
    },
    data() {
      return {
        flag:0,//状态
        name:'',//商品名称
        minPrice: '',//最小价格
        maxPrice: '',//最大价格
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        options: [],
        categoryId: '',
        tableData: [],
        NumArr: {},
        productIds: [],//选择的商品id
        dialogVisible: false,
        form:deepClone(tableform),
        activeIndex: 0,
        isBasic:true,
        formStatus:'add',
      }
    },
    created(){
      this.getlastcateGory()
      this.getNum()
      this.getBusinessListPage()
    },
    methods:{
      //获取商品分类 展示最末级分类信息
      getlastcateGory(){
        bpApi.getlastcateGory({
          siteId: this.siteInfo.siteId,
          type: this.siteInfo.siteCategoryLevel
        }).then(res => {
          this.options = res.data.data
        })
      },
      //筛选数据
      refreshData(flag){
        this.flag = flag
        this.getBusinessListPage()
      },
       //获取5个状态总条数
      getNum(){
        bpApi.getNum().then(res => {
          this.NumArr = res.data.data
        })
      },
      //获取商品列表
      getBusinessListPage(){
        this.listLoading = true
        let obj = {
          businessId: this.businessUserInfo.businessId,
          flag: this.flag,
          siteCategoryLevel: this.siteInfo.siteCategoryLevel,
          name: this.name,
          maxPrice: this.maxPrice,
          minPrice: this.minPrice,
          categoryId:this.categoryId,
          pageNum:this.page.currentPage,
          pageSize:this.page.pageSize
        }
        bpApi.getBusinessListPage(obj).then(response => {
          this.listLoading = false
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
        })
      },
      //页码改变
      handleCurrentChange(cpage){
        this.page.currentPage = cpage;
        this.getBusinessListPage()
      },
      handleSizeChange(val){
        this.page.pageSize = val;
        this.getBusinessListPage()
      },
      handleSelectionChange(val) {
        this.productIds = val.map(i => i.productId)
      },
      //上架
      productSale(){
        if(this.productIds.length < 1){
          this.$message.error('请选择需要上架的商品');
          return
        }
        bpApi.productSale(this.productIds).then(res => {
          this.getBusinessListPage()
          this.$message.success('上架成功')
        })
      },
      //下架
      productForbidSale(){
        if(this.productIds.length < 1){
          this.$message.error('请选择需要下架的商品');
          return
        }
        bpApi.productForbidSale(this.productIds).then(res => {
          this.getBusinessListPage()
          this.$message.success('下架成功')
        })
      },
      //新增
      handleAdd(){
        this.form = deepClone(tableform)
        this.formStatus = 'add'
        this.dialogVisible = true
        this.activeIndex = 0
      },
      //编辑
      handleEdit(productId){
        this.listLoading = true
        bpApi.getObj(productId).then(res => {
          this.listLoading = false
          this.formStatus = 'edit'
          this.form = res.data.data
          if(!this.form.vidoAttechment){
            this.form.vidoAttechment = {attcUrl:''}
          }
          // 把标签，商品属性, 转换成数组
          let descriptionLabel = this.form.businessProduct.descriptionLabel
          let businessCategoryId = this.form.businessProduct.businessCategoryId
          // let attributeList = this.form.businessProduct.attributeList
          // this.form.businessProduct.attributeIds = Object.keys(attributeList)//增加商品属性id数组
          this.form.businessProduct.businessCategoryId = businessCategoryId.split(",")
          this.form.businessProduct.descriptionLabel = descriptionLabel.split(",")
          this.form.businessProduct.attributeList = JSON.parse(this.form.businessProduct.attributeList)
          this.form.businessProduct.extendAttributeList = JSON.parse(this.form.businessProduct.extendAttributeList)
          // this.form.businessProduct.attributeList = attributeList.split(",")
          this.dialogVisible = true
          this.activeIndex = 1
        })
      },
      //删除
      handleDel(row){
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          bpApi.delObj(row.productId).then(() => {
            this.getBusinessListPage()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      //转换表格中上下架状态的显示格式
      formatStatus(row, column) {
        return row.putonSaleTag == '1' ? "上架" : "下架";
      },
      //更新数据
      updateRelease(){
        this.activeIndex = 1
        let businessProduct = this.$refs.release.businessProduct
        this.form.businessProduct = Object.assign({},this.form.businessProduct, businessProduct)
        console.log(this.form.businessProduct)
      },
      //基础信息
      updateData(val){
        if(val === 0){
          this.activeIndex = 0
        }else if(val === 8){
          //保存成功
          this.dialogVisible = false
          this.activeIndex = 0
          this.isBasic = true
          this.getBusinessListPage()
        }else{
          this.isBasic = false
        }
        console.log(this.form.businessProduct,'数据显示')
      }
    }
  }
</script>

<style scoped lang="scss">
  $mainColor: #E1BF7F;
  .product-search{
    padding: 16px 10px 16px 30px;
    .price-label{
      flex-shrink: 0;
      margin-right: 12px;
    }
    .center-line{
      margin: 0 10px;
    }
    .search-btn{
      cursor: pointer;
      height: 36px;
      line-height: 36px;
      padding: 0 20px;
      text-align: center;
      font-size: 13px;
      color: #fff;
      background: $mainColor;
    }
  }
  .product-table-top{
    padding: 18px 0 18px 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e9e9e9;
  }
</style>
