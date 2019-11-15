<template>
  <div class="register-main">
    <el-form class="register-form"
             :rules="shopRules"
             ref="shopForm"
             :model="shopForm"
             label-width="120px">
      <el-form-item prop="shopType" label="店铺类型:">
        <el-select v-model="shopForm.shopType" placeholder="请选择">
          <el-option
            v-for="item of shopArr"
            :key="item.modelId"
            :label="item.modelName"
            :value="item.modelId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="brandId" class="smsCode" label="店铺经营品牌:">
        <el-row :gutter="10">
          <el-col :span="15">
            <el-select v-model="shopForm.brandId" value-key="brandId" multiple placeholder="请选择">
              <el-option
                v-for="item in brandArr"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8" style="padding:0">
            <el-button type="button" class="sendBtn" @click="dialogFormVisible = true">申请品牌</el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="店铺名称:" prop="shopName">
        <el-input v-model="shopForm.shopName" placeholder="请输入店铺名称"></el-input>
      </el-form-item>

      <el-form-item label="店铺描述:">
        <el-input type="textarea" v-model="shopForm.shopDescription" placeholder="描述（60字内）" maxlength="60"></el-input>
      </el-form-item>

      <el-form-item label="商家办公地址：" >
        <areaSelect v-model="defultAddress"></areaSelect>
      </el-form-item>

      <el-form-item label="">
        <el-input type="textarea" v-model="shopForm.shopDetailAddress" v-if="defultAddress.qu" placeholder="请输入详细地址…."></el-input>
      </el-form-item>

      <el-form-item class="login-item">
        <el-button type="primary"
                   size="small"
                   @click.native.prevent="handleSubmit"
                   class="login-submit">提交</el-button>
      </el-form-item>

    </el-form>

    <el-dialog title="申请品牌" :visible.sync="dialogFormVisible" center>
      <el-form :rules="applyRules"
             ref="applyForm"
             :model="applyForm"
             label-width="120px">
        <el-form-item label="品牌名称:" prop="brandName">
          <el-input v-model="applyForm.brandName" placeholder="请输入品牌名称"></el-input>
        </el-form-item>

        <el-form-item label="品牌别名:">
          <el-input v-model="applyForm.brandAlias" placeholder="请输入品牌别名"></el-input>
        </el-form-item>

        <el-form-item label="品牌网址:">
          <el-input v-model="applyForm.brandWebsite" placeholder="请输入品牌网址"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO：" prop="brandLogoUrl">
        	<el-upload class="avatar-uploader flex flex-ver" v-loading="loading"
        	  :action="uploadAction"
        	  :show-file-list="false"
        	  :http-request="uploadSectionFile">
        	  <img v-if="applyForm.brandLogoUrl" :src="applyForm.brandLogoUrl" class="avatar">
        	  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	  <div slot="tip" class="el-upload__tip">建议尺寸：100X100px(png,jpg)</div>
        	</el-upload>
        </el-form-item>
        <el-form-item label="品牌描述:">
          <el-input
            type="textarea"
            placeholder="品牌描述..."
            v-model="applyForm.brandDesc"
            maxlength="150">
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveApply">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import regApi from '@/api/register'
import areaSelect from "@/components/area_select/area_select";
import {uploadImg} from '@/api/admin/upload'
export default {
  name: "shopInfo",
  components: {
    areaSelect
  },
  data () {

    return {
      shopArr:[],
      brandArr:[],
      defultAddress:{
        sheng: '',
        shi: '',
        qu: '',
      },
      shopForm: {
        shopType: "", //店铺类型id
        brandId: [], //经营品牌id
        shopName: "", //店铺名称
        shopDescription: "", //店铺描述
        shopAreaProvince: "",//省
        shopAreaCity: "",//市
        shopAreaDistrict: "",//区
        shopDetailAddress: "",//店铺地址
      },
      shopRules: {
        shopType: [
          { required: true, message: '请选择店铺类型', trigger: 'change' }
        ],
        brandId: [
          { required: true, message: '请选择店铺经营品牌', trigger: 'change' }
        ],
        shopName: [
          { required: true, message: "请输入店铺名称", trigger: "blur" }
        ]

      },
      applyForm:{
        brandName:'',
        brandAlias:'',
        brandWebsite:'',
        brandLogoUrl:'',
        brandDesc:''
      },
      applyRules:{
        brandName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" }
        ],
        brandLogoUrl:[
          { required: true, message: '品牌LOGO' }
        ],
      },
      uploadAction:'/admin/file/uploadFile',
      dialogFormVisible:false,
      loading:false,
    };
  },
  created () {

  },
  mounted () {
    this.getgetBusinessShop()//获取店铺类型
    this.getBusinessBrand()//获取店铺品牌
  },
  computed: {

  },
  props: {
    siteId:{
      type: String,
      default: ''
    }
  },
  methods: {
    //上传图片
    uploadSectionFile(params) {
      this.loading = true
      var self = this,
          file = params.file,
          fileType = file.type;
      const isJPG = fileType === 'image/jpeg';
      const isPNG = fileType === 'image/png';
      if (!isJPG && !isPNG ) {
        this.$message.error('上传图片只能是 JPG,PNG 格式!');
        return
      }
      let formData = new FormData();
      formData.append('file',file);
      uploadImg(formData).then(res => {
        console.log(res.data.data)

        this.$set(this.applyForm,'brandLogoUrl',res.data.data)
        this.loading = false
        this.$message.success('上传成功')
      })
    },
    //获取店铺类型
    getgetBusinessShop () {
      regApi.getBusinessShop().then(res => {
        this.shopArr = res.data.data
      })
    },
    //获取店铺品牌
    getBusinessBrand () {
      regApi.getBusinessBrand({siteId:this.siteId,businessId:''}).then(res => {
        this.brandArr = res.data.data
      })
    },
    //申请品牌
    saveApply(){
      this.$refs.applyForm.validate(valid => {
        if (valid) {
          console.log(this.applyForm)
          regApi.applyBrand(this.applyForm).then(res =>{
            this.getBusinessBrand()
            this.dialogFormVisible = false
            this.$message.success('申请成功')
          })
        }
      })

    },
    //提交
    handleSubmit () {
      this.$refs.shopForm.validate(valid => {
        if (valid) {
          this.shopForm.shopAreaProvince = this.defultAddress.sheng
          this.shopForm.shopAreaCity = this.defultAddress.shi
          this.shopForm.shopAreaDistrict = this.defultAddress.qu
          console.log(this.shopForm)
          this.$emit('changeStep', 4, this.shopForm)
        }
      });
    }
  }
};
</script>

<style>
</style>
