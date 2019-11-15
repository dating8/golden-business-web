<template>
  <basic-container>
    <div class="product-release">
      <div class="product-release-title">选择发布分类</div>
      <el-row>

        <el-col :span="4">
          <div class="card-box" v-loading="formload">
            <div class="card-title">一级分类</div>
            <div class="card-body flex flex-col flex-center">
              <span v-for="item of firstCategory" :key="item.categoryId" :class="businessProduct.levelOneCategoryId === item.categoryId?'active':''" @click="selectSecondCateGory(item.categoryId, item.categoryName)">{{item.categoryName}}</span>
            </div>
          </div>
        </el-col>
        <template v-if="secondCategory.length > 0">
          <el-col :span="2">
            <div class="icon_nextstep flex flex-center">
              <i class="icon-icon_nextstep"></i>
            </div>
          </el-col>

          <el-col :span="4">
            <div class="card-box">
              <div class="card-title">二级分类</div>
              <div class="card-body flex flex-col flex-center">
                <span v-for="item of secondCategory" :key="item.categoryId" :class="businessProduct.levelTwoCategoryId === item.categoryId?'active':''" @click="handleNext(item.categoryId, item.categoryName)">{{item.categoryName}}</span>
              </div>
            </div>
          </el-col>
        </template>
        <template v-if="ThreeCategory.length > 0">
          <el-col :span="2">
            <div class="icon_nextstep flex flex-center">
              <i class="icon-icon_nextstep"></i>
            </div>
          </el-col>

          <el-col :span="4">
            <div class="card-box">
              <div class="card-title">三级分类</div>
              <div class="card-body flex flex-col flex-center">
                <span v-for="item of ThreeCategory" :key="item.categoryId" :class="businessProduct.levelThreeCategoryId === item.categoryId?'active':''" @click="getproductstyle(item.categoryId, item.categoryName)">{{item.categoryName}}</span>
              </div>
            </div>
          </el-col>
        </template>

        <template v-if="productstyle.length > 0">
          <el-col :span="2">
            <div class="icon_nextstep flex flex-center">
              <i class="icon-icon_nextstep"></i>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="card-box">
              <div class="card-title">款式</div>
              <div class="card-body flex flex-col flex-center">
                <span v-for="item of productstyle" :key="item.styleId" :class="businessProduct.styleId == item.styleId ? 'active' : ''" @click="handleStyle(item.styleId,item.styleName)">{{item.styleName}}</span>
              </div>
            </div>
          </el-col>
        </template>

      </el-row>
    </div>
    <div class="select-lever">
      当前选择：<!-- {{selectCategory}} -->
      <span>{{businessProduct.levelOneCategoryName ? businessProduct.levelOneCategoryName : ''}}</span>
      <span>{{businessProduct.levelTwoCategoryName ? ' > ' + businessProduct.levelTwoCategoryName : ''}}</span>
      <span v-if="siteCategoryLevel == 3">{{businessProduct.levelThreeCategoryName ? ' > ' + businessProduct.levelThreeCategoryName : ''}}</span>
      <span>{{businessProduct.styleName? ' > ' + businessProduct.styleName : ''}}</span>
    </div>
    <div class="flex flex-center" style="margin-top: 50px;">
      <el-button type="primary" @click="tapNext">下一步</el-button>
    </div>
	</basic-container>
</template>

<script>
  import bpApi from '@/api/business/produList'
  export default {
    data () {
      return {
        formload:false,
        firstCategory:[],//一级
        secondCategory:[],//二级
        ThreeCategory:[],//三级
        productstyle:[],//款式
        formstatus: 'add'
      }
    },
    created () {
      this.selectFirstCateGory()
      if(this.businessProduct.levelOneCategoryId){
        this.formstatus = 'edit'
        let {
          levelOneCategoryId, levelOneCategoryName,
          levelTwoCategoryId, levelTwoCategoryName,
          levelThreeCategoryId, levelThreeCategoryName,
          styleId,styleName} = this.businessProduct
        this.selectSecondCateGory(levelOneCategoryId,levelOneCategoryName)
        if(this.siteCategoryLevel === 2){
          this.getproductstyle()
        }else if(this.siteCategoryLevel === 3){
          this.selectThreeCateGory(levelTwoCategoryId)
          this.getproductstyle(levelThreeCategoryId, levelThreeCategoryName)
        }

      }
    },
    mounted () {

    },
    props: {
      siteId:{
        type: String,
        default: ''
      },
      siteCategoryLevel:{//平台分类等级
        type: Number
      },
      businessProduct:{//商品信息
        type: Object,
        default: () => ({})
      }
    },
    methods:{
      //根据站点id获取一级品类
      selectFirstCateGory(){
        this.formload = true
        bpApi.selectFirstCateGory({siteId:this.siteId}).then(res => {
          this.formload = false
          this.firstCategory = res.data.data
        })
      },
      //根据站点id获取二级级品类
      selectSecondCateGory(categoryId,name){
        // this.firstObj = item
        // 清除二级以下存储数据
        this.resetData(1)
        this.businessProduct.levelOneCategoryId = categoryId
        this.businessProduct.levelOneCategoryName = name

        bpApi.selectSecondCateGory({categoryId}).then(res => {
          this.secondCategory = res.data.data
        })
      },
      //根据站点id获取三级品类
      selectThreeCateGory(categoryId){
        bpApi.selectThreeCateGory({categoryId}).then(res => {
          this.ThreeCategory = res.data.data
        })
      },
      //根据品类id获取款式列表
      getproductstyle(categoryId,name){
        if(this.siteCategoryLevel * 1 === 3){
          this.resetData(3)
          this.businessProduct.levelThreeCategoryId = categoryId
          this.businessProduct.levelThreeCategoryName = name
          // this.ThreeObj = item
        }
        bpApi.getproductstyle({categoryId:this.businessProduct.levelOneCategoryId}).then(res => {
          this.productstyle = res.data.data
        })
      },
      //点击二级判断是直接请求款式还是获取三级
      handleNext(categoryId,name){
        this.resetData(2)
        // this.secondObj = item
        this.businessProduct.levelTwoCategoryId = categoryId
        this.businessProduct.levelTwoCategoryName = name
        if(this.siteCategoryLevel === 2){
          this.getproductstyle(categoryId,name)
        }else{
          this.selectThreeCateGory(categoryId)
        }
      },
      //点击款式
      handleStyle(styleId,name){
        this.businessProduct.styleId = styleId
        this.businessProduct.styleName = name
        this.$forceUpdate()
      },
      //清空数据
      resetData(num){
        if(this.formstatus === 'edit'){
          this.formstatus = 'add'
          return
        }
        this.businessProduct.styleId = ''
        this.businessProduct.styleName = ''
        this.productstyle = []
        if(num == 1 || num == 2){
          if(num == 1){
            this.businessProduct.levelTwoCategoryId = ''
            this.businessProduct.levelTwoCategoryName = ''
            this.secondCategory = []
          }
          this.businessProduct.levelThreeCategoryId = ''
          this.businessProduct.levelThreeCategoryName = ''
          this.ThreeCategory = []
        }
      },
      //下一步
      tapNext(){
        this.$emit('update')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .product-release{
    padding: 0 15px;
    .product-release-title{
      padding: 16px 0;
      font-size: 15px;
      color: #262626;
    }
    .icon_nextstep{
      margin-top: 146px;
      i{
        color: #E1BF7F;
        font-size: 44px !important;
      }
    }
    .card-box{
      min-height: 336px;
      line-height:36px;
      border-radius: 4px;
      text-align: center;
      background: #f5f5f5;
      font-size: 14px;
      .card-body{
        padding:8px 0;
        span{
          cursor: pointer;
          width: 100%;
          &.active{
            background: #fff;
            color: #E1BF7F;
          }
        }
      }
      .card-title{
        border-radius: 4px 4px 0 0;
        background: #E1BF7F;
        color: #fff;
      }
    }
  }
  .select-lever{
    padding-left: 15px;
    line-height: 50px;
    margin-top: 30px;
    background: #f5f5f5;
    font-size: 14px;
  }

</style>
