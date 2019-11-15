<template>
  <div class="demo-ruleForm">
    <el-form ref="detailForm" label-width="100px" :model="form" class="demo-ruleForm">
      <el-form-item label="商品属性">
        <el-button  @click="addNature('',true,'','TEXT')" type="primary">添加自定义属性</el-button>
      </el-form-item>

      <el-row :gutter="20" v-for="(col,i ) of attr_names" :key="col.prop" v-if="col.isShow">
        <el-col :span="7">
          <el-form-item label="">
            <el-input v-model="col.label" class="f-cent" placeholder="属性名"/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="属性值">
            <el-input v-model="form.businessProductSkuList[0][col.prop]" placeholder="属性值" class="f-cent" />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <span class="del flex flex-ver" v-on:click="delColumn(i)"><i class="golden el-icon-close"></i></span>
        </el-col>
      </el-row>

      <div class="space-line"></div>

      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="商品属性" required>
            <el-select v-model="attributeIds" multiple :disabled="isSet" placeholder="请选择" @change="handleFreightChange">
              <el-option
                v-for="item in attribute"
                :key="item.attributeId"
                :label="item.attributeName"
                :value="item.attributeId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="成色" required>
            <el-select v-model="form.businessProduct.finelessId" placeholder="请选择成色" @change="handleFineness">
              <el-option
                v-for="item in fineness"
                :key="item.finenessId"
                :label="item.chineseName"
                :value="item.finenessId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="商品计价" required>
            <el-select v-model="form.businessProduct.priceRule" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="21">
          <el-form-item>
            <el-table :data="form.businessProductSkuList" style="width: 100%" border :header-cell-style="{'background-color': '#f5f5f5'}">

                  <!-- 自定义部分 -->
                  <el-table-column v-for="item of attr_names" :key="item.prop" :prop="item.prop" :label="item.label" align='center'>
                    <template slot-scope="scope">
                      <el-input size="mini" v-model="scope.row[item.prop]" v-if="item.itemType === 'TEXT'"></el-input>

                      <el-select placeholder="请选择" v-model="scope.row[item.prop]" v-if="item.itemType == 'RADIO'">
                        <el-option
                          v-for="p in item.producattributeItemList"
                          :key="p.itemId"
                          :label="p.itemValue"
                          :value="p.itemValue">
                        </el-option>
                      </el-select>

                      <el-select placeholder="请选择" multiple v-model="scope.row[item.prop]" v-if="item.itemType == 'CHECKBOX'">
                        <el-option
                          v-for="p in item.producattributeItemList"
                          :key="p.itemId"
                          :label="p.itemValue"
                          :value="p.itemValue">
                        </el-option>
                      </el-select>

                    </template>
                  </el-table-column>

                  <!-- 固定写死的部分 -->
                  <el-table-column prop="inventory" label="库存" align='center'>
                    <template slot-scope="scope">
                      <el-input size="mini" v-model="scope.row['inventory']"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="weight" label="重量" align='center'>
                    <template slot-scope="scope">
                      <el-input size="mini" v-model="scope.row['weight']"></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column prop="price" label="实时金价" align='center'>
                    <template slot-scope="scope">
                      <el-input size="mini" :disabled="form.businessProduct.priceRule == 21 || form.businessProduct.priceRule == 22" v-model="scope.row['price']"></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column prop="itemNo" label="商品货号" align='center'>
                    <template slot-scope="scope">
                      <el-input size="mini" v-model="scope.row['itemNo']"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="150" align='center'>
                    <template slot-scope="scope">
                      <template v-if="scope.$index === form.businessProductSkuList.length - 1">
                        <el-button
                          @click.native.prevent="addSku(scope.$index)"
                          type="text"
                          size="small" icon="el-icon-circle-plus-outline">
                          添加
                        </el-button>
                        <el-divider direction="vertical"></el-divider>
                      </template>
                      <el-button
                        @click.native.prevent="deleteRow(scope.$index, form.businessProductSkuList)"
                        type="text"
                        size="small" icon="el-icon-delete">
                        移除
                      </el-button>
                    </template>
                  </el-table-column>

            </el-table>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="21">
          <el-form-item label="商品图片" required>
            <image-upload :data.sync="form.imageAttechmentList" imgkey="attcUrl" :limit="5"></image-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="21">
          <el-form-item label="视频上传">
            <!-- action必选参数, 上传的地址 -->
              <div class="flex flex-ver">
                <el-upload v-loading="videoLoad" class="avatar-uploader flex flex-ver" action="/admin/file/uploadFile" accept="video/mp4" :show-file-list="false" :http-request="uploadVideo">
                    <video v-if="form.vidoAttechment.attcUrl !=''" :src="form.vidoAttechment.attcUrl" class="avatar" controls="controls">您的浏览器不支持视频播放</video>
                    <i v-else-if="form.vidoAttechment.attcUrl ==''" class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">上传视频后商品详情首图默认显示视频，建议视频小于20M。</div>
                </el-upload>
              </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="21">
          <div class="el-form-item">
            <label class="el-form-item__label" style="width: 100px;">商品详情：</label>
            <div style="margin-left: 100px;">
              <vue-ueditor-wrap v-model="form.businessProduct.productDetail" :config="myConfig"></vue-ueditor-wrap>
            </div>
          </div>
        </el-col>
      </el-row>

    </el-form>

    <div class="flex flex-center" style="padding-bottom: 50px;">
      <el-button type="primary" @click="tapNext()" :loading="isLoad">发布商品</el-button>
    </div>
  </div>
</template>

<script>
  import bpApi from '@/api/business/produList'
  import {randomLenNum, deepClone, getArrDifference, getValue, findObj} from '@/util/util'
  import {mapGetters} from "vuex"
  import imageUpload from "@/components/image-upload/image-upload"
  import {uploadImg} from '@/api/admin/upload'
  export default {
    components: {
      VueUeditorWrap,
      imageUpload
    },
    computed: {
      ...mapGetters(["siteInfo","businessUserInfo"])
    },
    data () {
      return {
        isLoad:false,
        myConfig: {
          autoHeightEnabled: false,
          initialFrameHeight: 200,
          initialFrameWidth: '100%',
          UEDITOR_HOME_URL: '/ueditor/',
        },
        attr_names: [],//属性
        len: 0,//属性的长度
        //商品计价
        options: [{
          value: '10',
          label: '一口价(固定价)'
        }, {
          value: '21',
          label: '实时金价-浮动方案1'
        }, {
          value: '22',
          label: '实时金价-浮动方案2'
        }],
        attributeIds:[],//属性id
        attribute:[],//属性列表
        fineness:[],//成色列表
        videoLoad:false,
        isSet:false //防斗商品属性选择
      }
    },
    created () {
      this.getAttribute()
      this.getFineness()
      this.showExtend()
      this.getAttributeObj()
    },
    mounted () { },
    props: {
      form:{
        type: Object,
        default: () => ({})
      },
      formStatus:{
        type:String,
        default:''
      }
    },
    methods:{
      //获取属性列表
      getAttribute(){
        bpApi.getAttribute(this.siteInfo.siteId).then(res => {
          this.attribute = res.data.data
        })
      },
      //根据属性id查找属性信息
      getAttrObj(id){
        bpApi.getAttrObj(id).then(res => {
          let data = res.data.data
          this.addNature(data.attributeName,false,'',data.itemType,'', id,data.producattributeItemList)
          this.isSet = false
        })
      },
      //获得所有商品成色列表
      getFineness(){
        bpApi.getFineness().then(res => {
          this.fineness = res.data.data
        })
      },
      //成色选择
      handleFineness(id){
        //根据成色id获取价格
        let chineseName = findObj(this.fineness,'finenessId',id).chineseName
        this.form.businessProduct.finelessName = chineseName
        bpApi.getFinenessPrice({finenessId:id}).then(res => {
          let data = res.data.data
          this.form.businessProductSkuList.forEach((o,i) =>{
            o.price = data.price
          })
        })
      },
      //上传视频
      uploadVideo(params){
        this.videoLoad = true
        var self = this,
            file = params.file;
        const isLt20M = file.size / 1024 / 1024  < 20;
        if (!isLt20M) {
            this.$message.error('上传视频大小不能超过10MB哦!');
            return;
        }
        let formData = new FormData();
        formData.append('file',file);
        uploadImg(formData).then(res => {
          this.form.vidoAttechment.attcType = '2'
          this.form.vidoAttechment.attcUrl = res.data.data
          this.videoLoad = false
          this.$message.success('上传成功')
        })
      },
      // 选择商品属性
      handleFreightChange(item){
        let arr = []
        this.attr_names.forEach((o,i) => {
          if(!o.isShow){arr.push(o.attributeId)}
        })
        let result = getArrDifference(item,arr)
        let index = this.attr_names.findIndex(item => item.attributeId === result[0])
        if(index > -1){
          //删除
          this.delColumn(index)
        }else{
          this.isSet = true
          this.getAttrObj(result[0])
        }
      },
      /*增加商品属性
      lab:属性名
      flag：是否自定义属性
      val:属性值,
      type:属性值的操作类型 TEXT|RADIO|CHECKBOX
      prop:table字段名
      attributeId:属性id
      producattributeItemList:属性值选项 单选和多选才有
      */
      addNature(lab = '', flag, val = '',type = 'TEXT',prop, attributeId = randomLenNum(4, true), producattributeItemList = ''){
        if(this.form.businessProductSkuList.length < 1){
          this.form.businessProductSkuList = [{
            weight: '', //重量
            price: ' ',//实时金价
            inventory: '',//库存
            itemNo: '',//商品货号
          }]
        }
        let len=this.len;
        //新增以 attr_ 开关，也可以自行定义
        let obj = { label: lab || '', isShow:flag, attributeId, itemType: type, producattributeItemList}
        obj.prop = prop || `attr_${len}`
        this.$set(this.form.businessProductSkuList[0],obj.prop,val)

        this.attr_names.push(obj)
        this.len = len + 1
      },
      // 增加商品SKU
      addSku(index){
        let data=deepClone(this.form.businessProductSkuList[index])
        data.skuId = '' // 防止编辑的时候添加sku覆盖上一条数据
        this.form.businessProductSkuList.push(data);
      },
      //删除一排   tableData ARR
      deleteRow(index, rows) {
        rows.splice(index, 1);
        if(this.form.businessProductSkuList.length < 1){
          this.form.extendAttributeList = {}
          this.form.attributeList = {}
          this.len = 0
          this.attributeIds = []
          this.attr_names = []//清空选中的属性和自定义的属性
        }
      },
      //删除SKU列 每次删除最后一列数据
      delColumn(index){
        let str=this.attr_names[index].prop;
        this.attr_names.splice(index,1)
        if(this.attr_names.length < 1){
          this.len = 0
          this.form.businessProductSkuList = []
        }else{
          this.form.businessProductSkuList.map((item)=>{
            delete item[str];
          })
        }

      },
      //回显自定义属性
      showExtend(){
        let arr1 = this.form.businessProduct.extendAttributeList
        if(Object.keys(arr1).length < 1){
          return
        }
        // let i = 0
        Object.entries(arr1).forEach((o,i)=>{
          let arr = o[1].split("|")
          this.addNature(o[0],true,arr[0],'TEXT',`selfattr_${i}`)
          for(let j = 0;j<arr.length;j++){
            this.form.businessProductSkuList[j][`selfattr_${i}`] = arr[j]
          }
        })
      },
      //商品属性回显
      getAttributeObj() {
        let _this = this
        let attributeList = this.form.businessProduct.attributeList //商品属性列表（JSON）
        if(Object.keys(attributeList).length < 1){
          return
        }
        let arr = []
        for (const [key, value] of Object.entries(attributeList)) {
          arr.push({attributeId:key.toString(),attributeVal:value})
          this.attributeIds.push(key.toString())
        }
        let arrays = []
        arr.forEach((o,i) => {
          arrays.push(
            bpApi.getAttrObj(o.attributeId.toString()).then(res => {
              let data = res.data.data
              data.attributeVal = o.attributeVal
              return data
            })
          )
        })

        Promise.all(arrays).then(function(values) {
          console.log(values)
          values.forEach((o,i)=>{
            let arr = o.attributeVal.split("|")
            _this.addNature(o.attributeName, false, arr[0], o.itemType, `attr_${i}`,o.attributeId, o.producattributeItemList)
            for(let j = 0;j<arr.length;j++){
              if(o.itemType === 'CHECKBOX'){
                _this.form.businessProductSkuList[j][`attr_${i}`] = arr[j].split(',')
              }else{
                _this.form.businessProductSkuList[j][`attr_${i}`] = arr[j]
              }
            }
          })
        });
      },
      //发布商品
      tapNext(){
        this.isLoad = true
        let attr_names = this.attr_names
        let attr1 = {}//选择的
        let attr2 = {}//自定义的
        attr_names.forEach((o,i)=>{
          if(o.isShow){
            attr1[o.label] = getValue(this.form.businessProductSkuList,o.prop)
          }else{
            attr2[o.attributeId+''] = getValue(this.form.businessProductSkuList,o.prop)
          }
        })
        for(let i = 0;i<this.form.businessProductSkuList.length;i++){
          let obj = new Object()
          for(let j = 0;j<this.attr_names.length;j++){
            obj[''+this.attr_names[j].label+''] = this.form.businessProductSkuList[i][this.attr_names[j].prop]
          }
          this.form.businessProductSkuList[i].siteId = this.siteInfo.siteId
          this.form.businessProductSkuList[i].attributeJson = JSON.stringify(obj)
        }
        // console.log(this.form,this.businessUserInfo,'提交')
        this.form.businessProduct.businessId = this.businessUserInfo.businessId
        this.form.businessProduct.businessName = this.businessUserInfo.shopName
        this.form.businessProduct.siteId = this.siteInfo.siteId
        this.form.businessProduct.descriptionLabel = this.form.businessProduct.descriptionLabel.join(',')
        this.form.businessProduct.businessCategoryId = this.form.businessProduct.businessCategoryId.join(",")
        this.form.businessProduct.extendAttributeList = JSON.stringify(attr1)
        this.form.businessProduct.attributeList = JSON.stringify(attr2)
        if(this.formStatus === 'add'){
          bpApi.addObj(this.form).then(res => {
            this.isLoad = false
            this.$message.success('添加成功')
            this.$emit('update',8)
          })
        }else{
          bpApi.putObj(this.form).then(res => {
            this.isLoad = false
            this.$message.success('修改成功')
            this.$emit('update',8)
          })
        }

      }
    }
  }
</script>

<style scoped lang="scss">
  .del{
    i{
      margin-top: 12px;
    }
  }
</style>
