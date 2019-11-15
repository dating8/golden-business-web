<template>
  <!-- 上传多张图片 -->
  <div class="image-list">
      <div v-for="(item, index) in showImgList" :key="index" class="image-wrap">
        <img :src="item[imgkey]" class="avatar"/>
        <div class="icon-wrap flex flex-center">
          <i class="el-icon-delete" @click.stop="removeFile(index)"></i>
          <i class="el-icon-zoom-in" @click="handleFileEnlarge(item[imgkey])"></i>
        </div>
      </div>

      <el-upload :headers="headers"
        ref="imageListUpload"
        :action="uploadAction"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-error="onError"
        class="shangpin-uploader"
        :disabled="loading"
        :show-file-list="false"
        accept="image/*" list-type="picture-card">
        <div class="flex flex-col flex-center" style="height: 100%;">
          <i :class="loading ? 'el-icon-loading' : 'el-icon-circle-plus-outline'"></i>
          <div slot="tip" class="el-upload__tip" v-if="!loading">
            <div>点击添加图片</div>
            <div class="gray">建议尺寸宽度为640px格式（png，jpg，gif）</div>
          </div>
        </div>
      </el-upload>

      <!-- 放大弹窗 -->
      <el-dialog title=""
      	:visible.sync="isEnlargeImage"
      	:modal-append-to-body="false"
      	top="8%"
      	width="50%" custom-class="imgdialog">
          	<img @click="isEnlargeImage = false" style="width:100%;" :src="enlargeImage">
      </el-dialog>

  </div>
</template>
<script type="text/babel">
/**
 * 上传图片或文件
 */
import {uploadImg} from '@/api/admin/upload'
export default {
  props: {
    // 接收和返回的数据
    data: {
      type: [Array, String, Object],
      default: () => {
        return ''
      }
    },
    imgkey:{
      type: String,
      default: () => {
        return 'url'
      }
    },
    // 上传多个文件时，文件限制的个数
    limit: {
      type: Number,
      default: () => {
        return 100
      }
    }
  },
  data() {
    return {
      headers:{'Authorization': ''},
      uploadAction:'/admin/file/uploadFile',
      imageCdn: '', //图片的cdn
      showImgList: [],
      fileList: [],
      clipboard: false,
      handleSuccess: null,
      loading: false,
      isEnlargeImage: false, //放大图片
      enlargeImage: '', //放大图片地址
    }
  },
  watch: {
    data: {
      handler(value) {
        // if (!this.multiple) {
        //   this.imgUrl = value
        // } else if (this.multiple) {
          this.showImgList = value
        // }
      },
      immediate: true
    }
  },
  mounted() {
    //防抖
    this.handleSuccess = _.debounce(this.uploadSuccess, 500)
  },
  methods: {
    beforeUpload(file) {
      // console.log(file)
      // if (file.type.split('/')[0] === 'image') {
      //   let tempSize = file.size / 5242880
      //   if (tempSize > 1) {
      //     this.$message.error('图片尺寸不得大于5M！')
      //     return false
      //   }
      // }
      this.loading = true
    },
    async uploadSuccess(response, file, fileList) {
      this.loading = false
      this.showImgList.push({attcType:'1',attcUrl: response.data})
//       console.log(item)
//       const formData = new FormData()
//       formData.append('file', item.file)
//       const uid = item.file.uid
//
//       uploadImg(formData).then(res => {
//         console.log(res.data.data)
//         let k = params.data['key']
//         this.$set(this.form,k,res.data.data)
//         this.loading = false
//         this.$message.success('上传成功')
//       })
//
//       createStorage(formData).then(res => {
//         this.showImgList.push({ key: uid, value: res.data.data.url })
//         this.emptyUpload()
//       }).catch(() => {
//         this.$message.error('上传失败，请重新上传')
//         this.emptyUpload()
//       })
//       try {
//         for (let fileInfo of fileList) {
//           let imageInfo = await this.getImageInfo(fileInfo.response.key)
//           if (this.showImgList.length >= this.limit) { // 限制图片张数
//             this.showImgList.length = this.limit
//             throw(new Error(`最多上传 ${this.limit} 张图片`))
//           }
//           this.showImgList.push(imageInfo)
//           this.$emit('update:data', this.showImgList)
//
//         }
//       } catch (error) {
//         this.$message.error(error.message)
//       } finally {
//         this.loading = false
//         this.$refs.imageListUpload && this.$refs.imageListUpload.clearFiles()
//         this.$refs.imageUpload && this.$refs.imageUpload.clearFiles()
//       }
    },
    removeFile(index) {
      this.$confirm('确定删除该图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.type === 'image') {
          this.$emit('update:data', typeof this.data === 'object' ? {} : '')
        } else {
          this.showImgList.splice(index, 1)
          this.$emit('update:data', this.showImgList)
        }
      })
    },
    onError() {
      this.$message.error('上传文件失败')
    },
    getImageInfo(url){
      return new Promise((resolve, reject)=>{
        let image = new Image()
        image.src = `${this.imageCdn}${url}`
        image.onload = () => {
          resolve({
            image: url,
            width: image.width,
            height: image.height
          })
        }
        image.onerror = () => {
          reject(new Error('Could not load image at ' + url));
        };
      })
    },
    handleRemove(file, fileList) {
      let imgList = fileList.map(item => {
        return item.response.key
      })
      this.$emit('update:data', imgList)
    },
    handlerClipboard(event) {
      if (this.clipboard) {
        const rawFile = getImageFromClipboard(event)
        if (rawFile) {
          this.$refs.elUpload.handleStart(rawFile)
          this.$refs.elUpload.$refs['upload-inner'].upload(rawFile)
        }
      }
    },
    handleFileEnlarge(_url) { //放大图片
        console.log(_url)
        if (_url) {
            this.enlargeImage = _url;
            this.isEnlargeImage = !this.isEnlargeImage;
        }
    },
  }
}
</script>
<style lang="scss" scoped>
.image-list, .image-item {
  display: flex;
  .image-wrap {
    position: relative;
    display: inline-block;
    box-sizing: content-box;
    margin: 0 8px 8px 0;
    vertical-align: top;
    &:hover {
      .icon-wrap {
        opacity: 1;
        .el-icon-zoom-in{
          margin-left: 10px;
        }
      }
    }
    .icon-wrap {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .7);
      transition: opacity .3s;
      .el-icon-zoom-in {
        cursor: pointer;
        margin-right: 8px;
      }
      .el-icon-delete {
        cursor: pointer;
      }
    }
  }
}
.image-item {
  display: inline-flex;
}
</style>
