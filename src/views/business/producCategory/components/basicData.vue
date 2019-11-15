<template>
  <div>
    <el-form ref="basicForm" label-width="100px" :model="businessProduct" class="demo-ruleForm" >

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="产品信息">
            <span>{{businessProduct.levelOneCategoryName}}</span>
            <span>{{businessProduct.levelTwoCategoryName ? ' > ' + businessProduct.levelTwoCategoryName : ''}}</span>
            <span v-if="siteInfo.siteCategoryLevel == 3">{{businessProduct.levelThreeCategoryName ? ' > ' + businessProduct.levelThreeCategoryName : ''}}</span>
            <span>{{businessProduct.styleName ? ' > ' + businessProduct.styleName : ''}}</span>

            <el-button type="primary" style="margin-left: 12px;" @click="tapNext(0)">选择发布分类</el-button>

          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="商品标题" required>
            <el-input v-model="businessProduct.title" placeholder="请输入商品标题"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="商品副标题">
            <el-input v-model="businessProduct.subtitle"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="排序" required>
            <el-input v-model="businessProduct.seqNo"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <span class="seqNo">数字越大，排名越靠前,如果为空，默认排序方式为创建时间</span>
        </el-col>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="商品款号" required>
            <el-input v-model="businessProduct.stkCode"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="店铺分类" required>
            <el-cascader v-model="businessProduct.businessCategoryId" :options="ShopCategory" :props="defaultProps" :show-all-levels="false"></el-cascader>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="预售设置">
            <el-radio-group v-model="businessProduct.presell">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="商品品牌" required>
            <el-select v-model="businessProduct.productBrandId" placeholder="请选择" @change="handle1">
              <el-option
                v-for="item in brandArr"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="已出售数">
            <el-input v-model="businessProduct.salesQty" placeholder="设置后前端出现虚拟已出售数"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="设置商品单位">
            <el-input v-model="businessProduct.salesUnit" placeholder="个/箱/件/瓶…"></el-input>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="运费模版" required>
            <el-select v-model="businessProduct.freightTemplateId" placeholder="请选择" @change="handleTemp">
              <el-option
                v-for="item in freightArr"
                :key="item.ftId"
                :label="item.templateName"
                :value="item.ftId">
              </el-option>
            </el-select>

            <el-checkbox v-model="businessProduct.selfPickup" true-label="1" false-label="0">到店自提（勾选则该商品支持用户体验店自提）</el-checkbox>

          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="货到付款">
            <el-checkbox v-model="businessProduct.arrivePay" true-label="1" false-label="0">支持</el-checkbox>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="人气推荐">
            <el-checkbox v-model="businessProduct.recommendTag" true-label="1" false-label="0">推荐</el-checkbox>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="标签">
            <el-select v-model="businessProduct.descriptionLabel" multiple placeholder="请选择">
              <el-option
                v-for="item in tagArr"
                :key="item.id"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>

          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="发票">
            <el-checkbox v-model="businessProduct.invoiceTag" true-label="1" false-label="0">支持</el-checkbox>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="上架">
            <el-radio-group v-model="businessProduct.putonSaleTag">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

      </el-row>

    </el-form>

    <div class="flex flex-center" style="margin-top: 50px;">
      <el-button type="primary" @click="tapNext(1)">保存下一步</el-button>
    </div>
  </div>
</template>

<script>
  import bpApi from '@/api/business/produList'
  import {mapGetters} from "vuex"
  import {findObj} from '@/util/util'
  export default {
    computed: {
      ...mapGetters(["siteInfo","businessUserInfo"])
    },
    data () {
      return {
        defaultProps:{
          value: 'scId',
          label: 'categoryName',
        },
        ShopCategory: [],
        brandArr:[],//品牌数组
        freightArr:[],///运费模板
        tagArr:[
          {
            id: '1',
            label: '正品保证'
          },{
            id: '2',
            label: '7天无理由退换'
          }],//标签
      }
    },
    created () {
      this.getShopCategory()
      this.getbusinessBrand()
      this.getFreightTemplate()
    },
    mounted () {
    },
    props: {
      businessProduct:{
        type: Object,
        default: () => ({})
      }
    },
    methods:{
      //获取店铺分类列表
      getShopCategory(){
        bpApi.getShopCategory(this.businessUserInfo.businessId).then(res => {
          let list = res.data.data;
          list.forEach((item,i) => {
            item.children = item.list
          })
          this.ShopCategory = list
        })
      },
      //获取品牌
      getbusinessBrand(){
        bpApi.getbusinessBrand({
          businessId: this.businessUserInfo.businessId,
          siteId: this.siteInfo.siteId,
        }).then(res => {
          this.brandArr = res.data.data
        })
      },
      //获取运费模板
      getFreightTemplate(){
        bpApi.getFreightTemplate({
          siteId: this.siteInfo.siteId,
        }).then(res => {
          this.freightArr = res.data.data
        })
      },
      //品牌选择
      handle1(id){
        this.businessProduct.productBrandName = findObj(this.brandArr,'brandId',id).brandName
      },
      //模板选择
      handleTemp(item){
        this.businessProduct.freightTemplateName = findObj(this.freightArr,'ftId',item).templateName
      },
      //保存下一步
      tapNext(num){
        this.$emit('update',num)
      }
    },
  }
</script>

<style scoped lang="scss">
  .seqNo{
    font-size: 12px;
    color: #ccc;
  }
</style>
