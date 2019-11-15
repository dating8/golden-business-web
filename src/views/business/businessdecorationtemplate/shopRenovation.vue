<template>
  <div class="shoptemp-box">
    <div class="nav-box">
      <span :class="current === 0?'active':''" @click="current = 0">店铺首页</span>
      <span :class="current === 1?'active':''" @click="current = 1">店铺入口</span>
    </div>
    <div class="flex flex-ver">
      <!-- 店铺专修 -->
      <div class="shoptemp" v-loading="loading" v-if="current === 0">
        <div class="shop-top dash"
         :style="{backgroundImage: 'url(' + shopObj.businessDecorationTemplate.shopBgUrl + ')', backgroundSize:'contain'}"
         @click="shopEdit('店铺背景',2)">
          <div class="shop-search">搜索店铺商品</div>
          <div class="shop-info flex">
            <img :src="shopObj.businessDecorationTemplate.shopLogoUrl" alt="" class="shop-logo dash" @click.stop="shopEdit('logo',1)">
            <div class="shop-name-type">
              <p class="shop-name dash" @click.stop="shopEdit('店铺信息',5)">{{shopObj.businessUser.shopName}}</p>
              <p class="shop-type" v-if="shopObj.businessUser.shopType == 1">{{shopObj.businessUser.shopType == '1'?'自营':''}}</p>
            </div>
          </div>
        </div>

        <div class="shop-cen">
          <!-- <div class="shop-num">共用<span style="color:#E1BF7F">8</span>家线下体验店<i class="el-icon-arrow-right"></i></div> -->
          <div class="shop-address flex flex-ver">
            <i class="el-icon-location-outline"></i>
            <span class="flex-1">{{shopObj.businessUser.shopDetailAddress}}</span>
            <el-divider direction="vertical"></el-divider>
            <span class="phone-box flex flex-center">
              <i class="icon-icon_phone"></i>
            </span>
          </div>
          <div class="shop-banner dash" @click="shopEdit('轮播图',4)">
            <el-carousel trigger="click" height="390px">
              <el-carousel-item v-for="item in shopObj.businessDecorationTemplateBannerList" :key="item.bannerId">
                <div class="shop-banner-img" :style="{backgroundImage: 'url(' + item.bannerFileUrl + ')', backgroundSize:'cover'}">
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>

      </div>
      <!-- 店铺入口 -->
      <div class="shoptemp" v-loading="loading" v-if="current === 1">
        <div class="shop-entry-top">
          <div class="shop-entry-search">
            <i class="el-icon-search"></i>
            <span>搜索品牌关键词</span>
          </div>
        </div>
        <div class="shop-entry-banner">
          <div class="shop-entry-title flex flex-ver">
            <span class="flex-1">{{shopObj.businessUser.shopName}}</span>
            <span class="pro-num">{{shopObj.newProductList.length}}件新品</span>
          </div>
          <img :src="shopObj.businessDecorationTemplate.shopEnterImageUrl" alt="" class="shop-entry-img dash" @click.stop="shopEdit('店铺封面',3)">
        </div>
      </div>

      <div class="edit-line" v-if="dialogEditVisible"></div>

      <div class="shop-edit-box" v-if="dialogEditVisible" v-loading="formload">
        <div class="shop-edit-title">
          {{editTitle}}<i class="el-icon-close" @click="dialogEditVisible = false"></i>
        </div>

        <div class="shop-edit-content flex flex-col flex-center" v-if="currentEdit !== 4">
          <!-- 店铺背景 -->
          <singleUpload ref="bgImg" :imgUrl.sync="shopObj.businessDecorationTemplate.shopBgUrl" tip="点击上传/修改 尺寸标准：750*300" v-if="currentEdit === 2"></singleUpload>
          <!-- 店铺logo -->
          <singleUpload ref="logoImg" :imgUrl.sync="shopObj.businessDecorationTemplate.shopLogoUrl" tip="点击上传/修改 尺寸标准：90*90" v-if="currentEdit === 1"></singleUpload>
          <!-- 店铺logo -->
          <singleUpload :imgUrl.sync="shopObj.businessDecorationTemplate.shopEnterImageUrl" tip="点击上传/修改 尺寸标准：710*340" v-if="currentEdit === 3"></singleUpload>

          <!-- 店铺信息 -->
          <template v-if="currentEdit === 5">
            <div class="el-form-item">
              <label class="el-form-item__label" style="width: 100px;">店铺介绍：</label>
              <div style="margin-left: 100px;">
                <el-input
                type="textarea"
                placeholder="支持150个字"
                v-model="shopDescription"
                maxlength="150">
              </el-input>
              </div>
            </div>

            <div class="el-form-item">
              <label class="el-form-item__label" style="width: 100px;">证件信息：</label>
              <span class="re-label">营业执照</span>
            </div>

            <!-- 店铺logo -->
            <singleUpload ref="licenceImg" :imgUrl.sync="shopObj.businessUser.companyBusinessLicenceCopy" tip="尺寸标准：290*84或者290*290"></singleUpload>
          </template>
          <el-button type="primary" @click="saveShopInfo" class="shop-edit-btn" v-if="currentEdit === 5">保 存</el-button>
          <el-button type="primary" @click="saveImg" class="shop-edit-btn" v-else>保 存</el-button>
        </div>

        <!-- 轮播图 -->
        <div class="shop-edit-content" v-if="currentEdit === 4">
          <banner :templateId="templateId" :bannerList="bannerList" @change="handlChange"></banner>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import tpApi from '@/api/business/template'
  import singleUpload from "@/components/single-upload/single-upload"
  import banner from "./banner"
  import {mapGetters} from "vuex"
  import { deepClone } from "@/util/util"
  export default {
    components: {
      singleUpload,banner
    },
    computed: {
      ...mapGetters(["siteInfo"])
    },
    data() {
      return {
        current:0,
        loading:false,
        formload:false,
        shopObj:{
          businessDecorationTemplate:{
            shopBgUrl:''
          },
          businessUser:{},
          businessDecorationTemplateBannerList:[],
        },
        shopDescription:'',
        currentEdit:0,//2编辑店铺背景 1编辑店铺logo 3修改店铺封面图 5编辑店铺信息 4编辑轮播
        editTitle:'',
        dialogEditVisible:false,
        bannerList:[],
      }
    },
    props: {
      templateId:{
        type: String
      },
    },
    created() {
      this.getObj()
    },
    methods:{
      //编辑
      shopEdit(title,current){
        this.editTitle = title
        this.currentEdit = current
        this.dialogEditVisible = true
      },
      //通过id修改商家店铺装修模版启用状态
      getObj(){
        this.loading = true
        tpApi.getObj(this.templateId).then(res => {
          this.shopObj = res.data.data
          this.shopDescription = this.shopObj.businessUser.shopDescription//店铺描述
          this.bannerList = deepClone(this.shopObj.businessDecorationTemplateBannerList)
          this.loading = false
        })
      },
      //保存修改图片
      saveImg(){
        this.formload = true
        let url = ''
        if(this.currentEdit === 1){
          url = this.shopObj.businessDecorationTemplate.shopLogoUrl
        }else if(this.currentEdit === 2){
          url = this.shopObj.businessDecorationTemplate.shopBgUrl
        }else if(this.currentEdit === 3){
          url = this.shopObj.businessDecorationTemplate.shopEnterImageUrl
        }
        let formData = new FormData();
        formData.append('flag',this.currentEdit)
        formData.append('templateId',this.templateId);
        formData.append('url',url);
        tpApi.putObj(formData).then(res => {
          this.formload = false
          this.$message.success('修改成功')
          // if(this.currentEdit === 2){
          //   this.shopObj.businessDecorationTemplate.shopBgUrl = url
          // }else if(this.currentEdit === 1){
          //   this.shopObj.businessDecorationTemplate.shopLogoUrl = url
          // }
          this.dialogEditVisible = false
        })
      },
      //编辑店铺信息
      saveShopInfo(){
        this.formload = true
        let companyBusinessLicenceCopy = this.$refs.licenceImg.uploadUrl//营业执照
        let shopDescription = this.shopDescription//店铺描述
        let formData = new FormData();
        formData.append('businessId',this.shopObj.businessUser.businessId)
        formData.append('companyBusinessLicenceCopy',companyBusinessLicenceCopy)
        formData.append('shopDescription',shopDescription)
        tpApi.updateShopInfo(formData).then(res => {
          this.formload = false
          this.$message.success('修改成功')
          this.shopObj.businessUser.shopDescription = shopDescription
          this.shopObj.businessUser.companyBusinessLicenceCopy = companyBusinessLicenceCopy
          this.dialogEditVisible = false
        })
      },
      handlChange(arr){
        this.formload = true
        tpApi.batchSaveBanner(arr).then(res => {
          this.getObj()
          this.$message.success('修改成功')
          this.dialogEditVisible = false
          this.formload = false
        })

      }
    }
  }
</script>

<style scoped lang="scss">
  .dash{
    border: 1px dashed #E1BF7F;
  }
  .edit-line{
    width: 200px;
    height: 1px;
    border-bottom: 1px dashed #E1BF7F;
  }
  .nav-box{
    width: 212px;
    margin-bottom: 18px;
    font-size: 14px;
    text-align: center;
    border:1px solid #E1BF7F;
    color: #E1BF7F;
    span{
      cursor: pointer;
      width: 106px;
      line-height: 34px;
      display: inline-block;
      &.active{
        background: #E1BF7F;
        color: #fff;
      }
    }
  }
  .shoptemp{
    width: 375px;
    .shop-top{
      padding: 12px 15px 0;
      height: 150px;
      .shop-search{
        margin-bottom: 20px;
        padding: 0 10px;
        height: 36px;
        line-height: 36px;
        background: rgba(255,255,255,0.10);
        border-radius: 20px;
        color: #fff;
        font-size: 14px;
      }
      .shop-logo{
        width: 45px;
        height: 45px;
        border-radius: 2px;
        margin-right: 10px;
      }
      .shop-name{
        cursor: pointer;
        line-height: 22px;
        font-size: 16px;
        color:#fff;
      }
      .shop-type{
        width: 36px;
        padding: 3px 0;
        font-size: 10px;
        text-align: center;
        color: #fff;
        background: #E1BF7F;
        border-radius: 2px;
      }
    }
    .shop-cen{
      margin-top: -20px;
      padding: 0 10px;
      border-radius: 10px 10px 0 0;
      background: #fff;
      font-size: 14px;
      line-height: 20px;
      .shop-num{
        padding: 10px 5px;
        color: #999;
        i{
          vertical-align: middle;
        }
      }
      .shop-address{
        padding-top: 10px;
        .el-divider--vertical{
          height: 30px;
        }
        .phone-box{
          width: 30px;
          height: 30px;
          border: 1px solid #E1BF7F;
          border-radius: 100%;
          color: #E1BF7F;
          margin-left: 7px;
        }
        i{
          flex-shrink: 0;
          &.el-icon-location-outline{
            margin-right: 10px;
          }
          &.icon-icon_phone{
            font-size: 30px !important;
          }
        }
      }
      .shop-banner{
        margin-top: 13px;
        .shop-banner-img{
          height: 390px;
        }
      }
    }
  }
  .shop-edit-box{
    width: 460px;
    background: #FFFFFF;
    box-shadow: 0 3px 9px 0 rgba(230,230,230,0.50);
    border-radius: 5px;
    overflow: hidden;
    .shop-edit-content{
      padding: 30px 30px;
      .shop-edit-btn{
        padding: 12px 40px;
        margin-top: 30px;
      }
      .re-label{
        line-height: 40px;
        font-size: 14px;
      }
      .el-form-item{
        width: 100%
      }
    }
    .shop-edit-title{
      height: 46px;
      line-height: 46px;
      background: #E1BF7F;
      color: #fff;
      text-align: center;
      position: relative;
      font-size: 14px;
      i{
        font-size: 24px;
        position: absolute;
        top: 11px;
        right: 11px;
      }
    }

  }
  .shop-entry-top{
    padding: 11px 10px;
    background: #f5f5f5;
    .shop-entry-search{
      padding: 0 16px;
      height: 36px;
      line-height: 36px;
      border-radius: 20px;
      background: #fff;
      color: #ccc;
      font-size: 16px;
      i{
        margin-right: 10px;
      }
    }
  }
  .shop-entry-banner{
    padding: 0 10px;
    .shop-entry-title{
      line-height: 45px;
      font-size: 16px;
    }
    .pro-num{
      font-size: 12px;
      color: #999;
    }
    .shop-entry-img{
      width: 100%;
      height: 170px;
      margin-bottom: 10px;
    }
  }
</style>
