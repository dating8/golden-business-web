<template>
  <basic-container>
    <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="商品属性">
        <el-button  @click="addSpec()" type="primary">添加自定义属性</el-button>

      </el-form-item>

      <el-row :gutter="20" v-for="(item, index) in specification" :key="item.prop" v-if="item.isShow">
        <el-col :span="7">
          <el-form-item label="">
            <el-input v-model="item.name" class="f-cent" placeholder="属性名"/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="属性值">
            <div class="flex">
              <span class="el-tag" v-for="(tag, num) in item.value" :key="tag[item.prop]">
                <span class="el-select__tags-text">{{tag[item.prop]}}</span>
                <i class="el-tag__close el-icon-close" @click="delSpecTag(index, num)"></i>
              </span>

              <el-input v-model="addValues[index]" placeholder="属性值" class="f-cent"  @keyup.native.enter="addSpecTag(index)"/>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <div class="flex">
            <el-button type="primary" @click="addSpecTag(index)" size="small">添加</el-button>
           <!-- <span class="del flex flex-ver" @click="delSpec(index)"><i class="golden el-icon-close"></i></span> -->

            <el-button type="primary" @click="delSpec(index)" size="small">删除</el-button>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="商品属性" required>
            <el-select v-model="attributeIds" value-key="attributeId" multiple :disabled="isSet" placeholder="请选择" @change="handleFreightChange">
              <el-option
                v-for="item in attribute"
                :key="item.attributeId"
                :label="item.attributeName"
                :value="item.attributeId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="20">

          <div v-for="(item,index) of specification" :key="item.attributeName" v-if="!item.isShow">
            <el-col :span="12">
              <el-form-item :label="item.name">
                <!-- 文本框 -->
       <!--         <el-input v-model="textArr[index]" v-if="item.itemType === 'TEXT'" placeholder="属性值"></el-input> -->

                <div class="flex" v-if="item.itemType === 'TEXT'">
                  <span class="el-tag" v-for="(tag, num) in item.value" :key="tag[item.prop]">
                    <span class="el-select__tags-text">{{tag[item.prop]}}</span>
                    <i class="el-tag__close el-icon-close" @click="delSpecTag(index, num)"></i>
                  </span>

                  <el-input v-model="addValues[index]" placeholder="属性值" class="f-cent"  @keyup.native.enter="addSpecTag(index)"/>

                    <el-button type="primary" @click="addSpecTag(index)" size="small">添加</el-button>
                   <!-- <span class="del flex flex-ver" @click="delSpec(index)"><i class="golden el-icon-close"></i></span> -->

                    <el-button type="primary" @click="delSpec(index)" size="small">删除</el-button>
                </div>

                <!-- 单选框 -->
                <el-select placeholder="请选择" v-model="radioArray[index]" value-key="itemId" v-if="item.itemType === 'RADIO'" @change="tapChoose($event,index)">
                  <el-option
                    v-for="bute in item.producattributeItemList"
                    :key="bute.itemId"
                    :label="bute.itemValue"
                    :value="bute.itemValue">
                  </el-option>
                </el-select>

                <!-- 多选框 -->
                <el-select placeholder="请选择" multiple v-model="checkedEquipments[index]" value-key="itemId" v-if="item.itemType === 'CHECKBOX'" @change="tapMulChoose($event,index)">
                  <el-option
                    v-for="bute in item.producattributeItemList"
                    :key="bute.itemId"
                    :label="bute.itemValue"
                    :value="bute.itemValue">
                  </el-option>
                </el-select>
              </el-form-item>

            </el-col>
            <!-- <el-col :span="2"></el-col> -->
          </div>

      </el-row>

    </el-form>

    <div class="price-wra">

      <el-table :data="tableData" border>

        <el-table-column v-for="item of specification" :key="item.prop" :label="item.name" align='center'>
          <template slot-scope="scope">
            <span v-if="scope.row[item.prop]">{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>

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
            <el-input size="mini" v-model="scope.row['price']"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="itemNo" label="商品货号" align='center'>
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row['itemNo']"></el-input>
          </template>
        </el-table-column>

      </el-table>

    </div>
  </basic-container>
</template>

<script>
    import {descartes,deepClone, getArrDifference,randomLenNum } from '@/util/util'
    import bpApi from '@/api/business/produList'
    import {mapGetters} from "vuex"

    export default {
      computed: {
        ...mapGetters(["userInfo", "siteInfo"]),
      },
      data () {
        return {
          len: 0,
          tableData:[],
          specification:[],//自定义属性
          addValues: [], // 用来存储要添加的规格属性
          attribute:[],
          attributeIds:[],
          isSet:false,
          butes:[],
          selectAttr:[],//所有选中的属性
          radioArray:[],
          checkedEquipments:[],
          itemId:[],//选项id数组
        }
      },
      created(){
        this.getAttribute()
//         let specification = [
//             {
//               name: '颜色',
//               prop:'attr0',
//               value: [{
//                 attr0: '红褐色',
//                 weight: '1', //重量
//                 price: '1',//实时金价
//                 inventory: '1',//库存
//                 itemNo: '1',//商品货号
//               },
//               // {
//               //   attr0: '白色',
//               //   weight: '', //重量
//               //   price: '',//实时金价
//               //   inventory: '',//库存
//               //   itemNo: '',//商品货号
//               // },
//               ]
//             },
//             {
//               name: '尺寸',
//               prop:'attr1',
//               value: [{
//                 attr1: '12cm',
//                 weight: '', //重量
//                 price: '',//实时金价
//                 inventory: '',//库存
//                 itemNo: '',//商品货号
//               },
//               {
//                 attr1: '13cm',
//                 weight: '', //重量
//                 price: '',//实时金价
//                 inventory: '',//库存
//                 itemNo: '',//商品货号
//               },
//               ]
//             }
//           ]
//           this.specification = specification
//           let arr = []
//           specification.forEach((o,i)=>{
//             arr.push(o.value)
//           })
//           let tableData = descartes(arr)
//           console.log(tableData)
//           let arr2 = []
//
//             tableData.forEach((_o,i) => {
//               if(Array.isArray(_o)){
//                 let obj = {
//                   weight: _o[0].weight, //重量
//                   price: _o[0].price,//实时金价
//                   inventory: _o[0].inventory,//库存
//                   itemNo: _o[0].itemNo,//商品货号
//                 }
//
//                 _o.forEach((a,b)=>{
//                   let aaa = Object.entries(a)
//                   for (let [k, v] of Object.entries(a)) {
//                       if(k.startsWith('attr')){
//                         obj[k] = v
//                         break
//                       }
//                   }
//                 })
//                 arr2.push(obj)
//               }else{
//                 arr2.push(_o)
//               }
//
//             })
//
//           console.log(arr2,111)
//           this.tableData = arr2
      },
      methods: {
        //获取属性列表
        getAttribute(){
          bpApi.getAttribute(this.siteInfo.siteId).then(res => {
            this.attribute = res.data.data
          })
        },
        //根据属性id查找属性信息
        getAttrObj(id){
          // let arrays = this.butes
          this.checkedEquipments.push([])
          bpApi.getAttrObj(id).then(res => {
            let data = res.data.data
            // arrays.push(data)
            this.addSpec(data.attributeName,false,data.itemType,id,data.producattributeItemList)
            this.isSet = false
          })
          // this.butes = arrays
        },
        // 平台属性选择
        handleFreightChange(item){

          let arr = []
          this.specification.forEach((o,i) => {
            if(!o.isShow){arr.push(o.attributeId)}
          })
          let result = getArrDifference(item,arr)
          let index = this.specification.findIndex(item => item.attributeId === result[0])
          if(index > -1){
            //删除
            this.delSpec(index)
          }else{
            this.isSet = true
            this.getAttrObj(result[0])
          }

//           let arr = []
//           arr = this.butes.map(it => it.attributeId)
//
//           let result = getArrDifference(item,arr)
//           let index = this.butes.map(it => it.attributeId).indexOf(result[0])
//           if(index > -1){
//             //删除
//             this.butes.splice(index,1)
//           }else{
//             this.isSet = true
//             this.getAttrObj(result[0])
//           }
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
        // 添加规格项目
        addSpec (name = '', flag = true, type = 'TEXT',attributeId = randomLenNum(4, true), producattributeItemList = '') {
          let len = this.len
          // this.specification.push({
          //   isShow,
          //   prop:`attr${len}`,
          //   name,
          //   value: []
          // })
          let obj = { name: name || '',prop:`attr${len}`, value: [], isShow:flag, attributeId, itemType: type, producattributeItemList}

          this.specification.push(obj)
          this.len = len + 1
        },

        // 删除规格项目
        delSpec (index) {
          this.specification.splice(index, 1)
          this.getTable()
        },
        //单选框值改变时
        tapChoose(event,index){
          this.addValues[index] = event
          this.addSpecTag(index)
        },
        //多选框值改变时
        tapMulChoose(event,index){
          let prop = this.specification[index].prop
          let arr1 = this.specification[index].value.map(it => it[prop])
          let result = getArrDifference(event,arr1)
          let idx = arr1.findIndex(item => item === result[0])
          if(idx > -1){
            //删除
            this.delSpecTag(index,idx)
          }else{
            this.tapChoose(result[0],index)
          }
        },
        // 添加规格属性
        addSpecTag (index) {

          let arr = this.addValues[index].trim().split(' ')
          let obj = {};
          let newArrs = []
          arr.forEach(item => {
            let prop = this.specification[index].prop
            let arr1 = this.specification[index].value.map(it => it[prop])
            if(arr1.indexOf(item) != -1){
              this.$message.error('属性值不能重复');
              return
            }
            this.specification[index].value.push({
              [prop]: item,
              // weight: '', //重量
              // price: '',//实时金价
              // inventory: '',//库存
              // itemNo: '',//商品货号
            })
          })
          // const res = new Map();
          // console.log(res,333)
          // let newArr = this.specification[index].value.filter(key => !res.has(key.specParamName) && res.set(key.specParamName, 1))
          // console.log(newArr)
          // // newArr = Array.from(new Set(newArr)) // 去重
          // this.$set(this.specification[index], 'value', newArr)
          this.clearAddValues(index)
          //得到表格
          this.getTable()
        },

        // 删除规格属性
        delSpecTag (index, num) {
          this.specification[index].value.splice(num, 1)
          this.getTable()
        },

        // 清空 addValues
        clearAddValues (index) {
          this.$set(this.addValues, index, '')
        },

        getTable(){
          let specification = deepClone(this.specification)
          let arr = []
          specification.forEach((o,i)=>{
            if(o.value.length > 0){
              arr.push(o.value)
            }
          })
          console.log(arr)
          let tableData = descartes(arr)

          let arr2 = []

          tableData.forEach((_o,i) => {
            let obj = {
              weight: '', //重量
              price: '',//实时金价
              inventory: '',//库存
              itemNo: '',//商品货号
            }
            if(Array.isArray(_o)){
              _o.forEach((a,b)=>{
                for (let [k, v] of Object.entries(a)) {
                    if(k.startsWith('attr')){
                      obj[k] = v
                      break
                    }
                }
              })
              arr2.push(obj)
            }else{
              arr2.push(Object.assign({},obj,_o))
            }

          })
          if(this.tableData.length < 1){
            this.tableData = arr2
          }else{
            this.getPrice(arr2)
          }
        },
        //保存原来的填写的固定值
        getPrice(arr){
           let arr1 = this.tableData
           arr1.forEach((o,i)=>{
             if(arr[i]){
               arr[i].weight = o.weight
               arr[i].price = o.price
               arr[i].inventory = o.inventory
               arr[i].itemNo = o.itemNo
             }
           })
           this.tableData = arr
        }
      }
    }
  </script>

  <style scoped lang="scss">
    .tip {
      color: red;
      font-size: 12px;
    }
    // input[type="text"] {
    //   width: 280px;
    // }
    .price-wra input[type="text"] {
      width: 80px;
    }
    // .el-input {
    //   width: auto;
    // }
    .must-fill {
      color: red;
    }
    .el-row {
      margin-top: 15px;
    }
    .spec-table {
      margin-top: 15px;
    }
    .spec {
      padding-bottom: 20px;
      border-bottom: 1px solid #535353;
    }
    .mar-t {
      margin-top: 20px;
    }
    .price-modi {
      width: 70px
    }
  </style>
