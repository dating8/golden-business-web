<template>
  <el-upload class="avatar-uploader flex flex-ver"
    :action="uploadAction"
    :show-file-list="false"
    :http-request="uploadSectionFile" v-loading="imgLoading">
    <el-popover
     placement="right"
     trigger="hover" v-if="uploadUrl">
     <img :src="uploadUrl">
     <img slot="reference" :src="uploadUrl" class="avatar">
    </el-popover>
    <i class="el-icon-plus avatar-uploader-icon" v-else></i>
    <div slot="tip" class="el-upload__tip">{{tip}}</div>
  </el-upload>
</template>

<script>
  import {uploadImg} from '@/api/admin/upload'
  export default {
    data() {
      return {
        imgLoading:false,
        uploadAction:'/admin/file/uploadFile',
        uploadUrl:this.imgUrl
      }
    },
    props: {
      imgUrl:{
        type: String
      },
      tip:{
        type: String
      }
    },
    methods:{
      //上传图片
      uploadSectionFile(params) {
        this.imgLoading = true
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
          this.uploadUrl = res.data.data
          this.$emit('update:imgUrl',this.uploadUrl)
          this.imgLoading = false
          this.$message.success('上传成功')
        })
      },
    }
  }
</script>

<style>
</style>
