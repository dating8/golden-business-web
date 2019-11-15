<template>
  <basic-container>
    <div class="template-box flex flex-wrap" v-if="!dialogVisible">
      <div class="template-item" v-for="(item, index) of tableData" :key="index">
        <div class="temp-img" :style="{backgroundImage: 'url(' + item.templateImageUrl + ')'}" @click="handleShop(item.templateId)"></div>

        <div class="template-name flex flex-sb">
          <span class="tname">{{item.templateName}}</span>
          <el-switch
            v-model="item.avaliable" active-color="#E1BF7F" active-value="1" inactive-value="0" @change="updateAvaliable($event,item.templateId)">
          </el-switch>
        </div>
        <div class="template-btn flex flex-col flex-center">
          <div class="templ">
            <el-image style="width: 100px;height: 32px;" :src="item.templateImageUrl" :preview-src-list="[item.templateImageUrl]"></el-image>
            <span class="tbtn btn1">模板预览</span>
          </div>
          <div class="tbtn btn2" @click="handleShop(item.templateId)">店铺装修</div>
        </div>
      </div>
    </div>

    <div class="shopRenovation whiteBg" v-if="dialogVisible">

      <shopRenovation :templateId="templateId"></shopRenovation>
    </div>
  </basic-container>

</template>

<script>
  import tpApi from '@/api/business/template'
  import {mapGetters} from 'vuex'
  import shopRenovation from "./shopRenovation"
  export default {
    components: {
      shopRenovation
    },
    computed: {
      ...mapGetters(['permissions', 'businessUserInfo'])
    },
    data() {
      return {
        listLoading:false,
        tableData:[],
        dialogVisible:false,
        current:0,
        shopObj:{},
        templateId:'',
      }
    },
    created() {
      this.getTemplateList()
    },
    methods:{
      //店铺装修
      handleShop(id){
        this.templateId = id
        this.dialogVisible = true
      },
      //获取店铺装修列表
      getTemplateList(){
        this.listLoading = true
        tpApi.getTemplateList({
          businessId: this.businessUserInfo.businessId
        }).then(response => {
          this.listLoading = false
          this.tableData = response.data.data

        })
      },
      //通过id修改商家店铺装修模版启用状态
      updateAvaliable(statu,templateId){
        tpApi.updateAvaliable(templateId).then(response => {
          this.getTemplateList()
          if(statu == 1){
            this.$message.success('启用成功')
          }else{
            this.$message.success('关闭成功')
          }

        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .template-item{
    margin: 20px 0 0 50px;
    width: 300px;
    .template-name{
      margin: 30px 0;
      font-size: 16px;
      line-height: 22px;
    }
    .temp-img{
      width: 300px;
      height: 610px;
      background-position: 0 0;
      background-repeat: no-repeat;
      background-size: cover;
    }
    .template-btn{
      padding-top: 30px;
      border-top: 1px solid #eee;
      .templ{
        width: 100px;
        height: 32px;
        position: relative;
        .el-image{
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .tbtn{
        width: 100px;
        font-size: 14px;
        line-height: 32px;
        text-align: center;
        border-radius: 2px;
        border: 1px solid #E1BF7F;
        display: block;
        cursor: pointer;
        &.btn1{
          color: #E1BF7F;
          background: #fff;
        }
        &.btn2{
          margin-top: 20px;
          background: #E1BF7F;
          color: #fff;
        }
      }
    }
  }
  .shopRenovation{
    padding: 20px 20px;
  }
</style>
