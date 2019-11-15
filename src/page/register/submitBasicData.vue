<template>
  <div class="basicdata">
    <el-form class="register-form"
             :rules="basicRules"
             ref="basicForm"
             :model="basicForm"
             label-width="150px">

      <div class="form-group-title">A.商家联系方式</div>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="公司联系人姓名：" prop="companyContact">
          	<el-input v-model="basicForm.companyContact" placeholder="公司联系人姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司联系人手机："  prop="companyContactPhone">
          	<el-input v-model="basicForm.companyContactPhone" placeholder="公司联系人手机"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="微信/QQ号：" prop="companyContactQq">
          	<el-input v-model="basicForm.companyContactQq" placeholder="公司联系人微信/QQ号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱：">
          	<el-input v-model="basicForm.companyContactEmail" placeholder="公司联系人邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-group-title">B.商家基础概况</div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="公司名称：" prop="companyName">
          	<el-input v-model="basicForm.companyName" placeholder="公司名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册资本：" prop="companyRegisteredCapital">
            <div class="flex">
              <el-input v-model="basicForm.companyRegisteredCapital" placeholder="注册资本"></el-input>
              <span style="margin-left: 10px">万</span>
            </div>

          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="法人姓名：" prop="companyLegalPersonName">
          	<el-input v-model="basicForm.companyLegalPersonName" placeholder="法人姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法人身份证号："  prop="companyLegalPersonIdcard">
          	<el-input v-model="basicForm.companyLegalPersonIdcard" placeholder="法人身份证号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="营业执照副本：" prop="companyBusinessLicenceCopy">
          	<el-upload class="avatar-uploader flex flex-ver"
          	  :action="uploadAction" :data="{key:'companyBusinessLicenceCopy'}"
          	  :show-file-list="false"
          	  :http-request="uploadSectionFile">
          	  <img v-if="basicForm.companyBusinessLicenceCopy" :src="basicForm.companyBusinessLicenceCopy" class="avatar">
          	  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          	  <div slot="tip" class="el-upload__tip">小于15M,格式为jpg,png,gif的图片；营业执照请加盖公章或按手印</div>
          	</el-upload>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="公司官网：" prop="companyOfficialWebsite">
          	<el-input v-model="basicForm.companyOfficialWebsite" placeholder="公司官网"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成立时间：" prop="companyFormationDate">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="basicForm.companyFormationDate"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="营业期限："  prop="companyBusinessTerm">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="basicForm.companyBusinessTerm"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item label="营业执照地址：">
            <areaSelect v-model="defultAddress"></areaSelect>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-input v-model="basicForm.companyBusinessAddress" v-if="defultAddress.qu" placeholder="详细地址"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="法人身份证正面照："  prop="companyLegalPersonIdcardPic1">
          	<el-upload class="avatar-uploader flex flex-ver"
          	  :action="uploadAction" :data="{key:'companyLegalPersonIdcardPic1'}"
          	  :show-file-list="false"
          	  :http-request="uploadSectionFile">
          	  <img v-if="basicForm.companyLegalPersonIdcardPic1" :src="basicForm.companyLegalPersonIdcardPic1" class="avatar">
          	  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          	  <div slot="tip" class="el-upload__tip">法人身份证正面照不能大于15MB 格式为jpg,png,gif的图片。</div>
          	</el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">

        <el-col :span="24">
          <el-form-item label="法人身份证反面照："  prop="companyLegalPersonIdcardPic2">
          	<el-upload class="avatar-uploader flex flex-ver"
          	  :action="uploadAction" :data="{key:'companyLegalPersonIdcardPic2'}"
          	  :show-file-list="false"
          	  :http-request="uploadSectionFile">
          	  <img v-if="basicForm.companyLegalPersonIdcardPic2" :src="basicForm.companyLegalPersonIdcardPic2" class="avatar">
          	  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          	  <div slot="tip" class="el-upload__tip">法人身份证反面照不能大于15MB 格式为jpg,png,gif的图片。</div>
          	</el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-group-title">C.银行信息-结算账号</div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="开户银行名：" prop="bankName">
          	<el-input v-model="basicForm.bankName" placeholder="开户银行名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行开户名："  prop="bankAccountName">
          	<el-input v-model="basicForm.bankAccountName" placeholder="银行开户名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="银行开户账号：" prop="bankAccountNumber">
          	<el-input v-model="basicForm.bankAccountNumber" placeholder="银行开户账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户银行所在地："  prop="bankAddress">
          	<el-input v-model="basicForm.bankAddress" placeholder="开户银行所在地"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="flex flex-center" style="padding-bottom: 30px">
       <div class="js_border_btn" @click="tapUp">上一步</div>
        <div class="js_btn" @click="tapNext">下一步</div>
      </div>

    </el-form>
  </div>

</template>

<script>
  import {isvalidatemobile} from "@/util/validate";
  import {registerRules, registerForm} from '@/const/register'
  import {uploadImg} from '@/api/admin/upload'
  import regApi from '@/api/register'
  import areaSelect from "@/components/area_select/area_select";
  export default {
    name: "basicData",
    components: {
      areaSelect
    },
    data () {
      return {
        //默认值设置，可为空
        defultAddress:{
          sheng: '',
          shi: '',
          qu: '',
        },
        basicForm:registerForm,
        basicRules:registerRules,
        loading:false,
        uploadAction:'/admin/file/uploadFile',
      };
    },
    created () {

    },
    mounted () { },
    computed: {

    },
    props: [],
    methods: {
      //上传图片
      uploadSectionFile(params) {
        console.log(params.data['key'],123)
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
          let k = params.data['key']
          this.$set(this.basicForm,k,res.data.data)
          this.loading = false
          this.$message.success('上传成功')
        })
      },
      //上一步
      tapUp(){
        this.$emit('changeStep', 1)
      },
      //下一步
      tapNext(){
        this.$refs.basicForm.validate(valid => {
            if (valid) {
              let defultAddress = this.defultAddress
              this.basicForm.companyBusinessAddress = defultAddress.sheng+defultAddress.shi+defultAddress.qu+this.basicForm.companyBusinessAddress
              this.$emit('changeStep', 3, this.basicForm)
            }
        })
      }
    }
  };
</script>

<style lang="scss">
  #app{
    overflow: auto;
  }
</style>
