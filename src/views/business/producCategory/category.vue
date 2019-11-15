<template>
<basic-container>
  <div class="product-table-top" style="padding: 18px 0 18px 20px">
    <template v-if="permissions.business_product_category_edit">
      <el-button plain size="small" @click="addFirstCategory">添加一级分类</el-button>
      <el-button plain size="small" @click="addSecCategory">添加二级分类</el-button>
      <el-button type="primary" size="small" @click="saveData">保存</el-button>
    </template>
  </div>
  <div style="padding-left:20px">
    <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
      <div class="el-table__header-wrapper">

        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%">
          <colgroup><col name="el-table_1_column_1" width="5%"><col name="el-table_1_column_2" width="30%"><col name="el-table_1_column_3" width="15%"><col name="el-table_1_column_4" width="10%"><col name="el-table_1_column_4" width="15%"><col name="el-table_1_column_5" width="20%"></colgroup>
          <thead class="has-gutter">
            <tr class="">
              <th colspan="1" rowspan="1" class="el-table_1_column_1 is-center is-leaf" style="background-color: rgb(239, 239, 239);">
                <div class="cell"></div>
              </th>
              <th colspan="1" rowspan="1" class="el-table_1_column_2 is-left is-leaf" style="background-color: rgb(239, 239, 239);">
                <div class="cell">分类名称</div>
              </th>
              <th colspan="1" rowspan="1" class="el-table_1_column_3 is-center is-leaf" style="background-color: rgb(239, 239, 239);">
                <div class="cell">排序</div>
              </th>
              <th colspan="1" rowspan="1" class="el-table_1_column_4 is-center is-leaf" style="background-color: rgb(239, 239, 239);">
                <div class="cell">状态</div>
              </th>
              <th colspan="1" rowspan="1" class="el-table_1_column_5 is-center is-leaf" style="background-color: rgb(239, 239, 239);">
                <div class="cell">添加时间</div>
              </th>
              <th colspan="1" rowspan="1" class="el-table_1_column_6 is-center is-leaf" style="background-color: rgb(239, 239, 239);">
                <div class="cell">操作</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <div class="el-table__body-wrapper is-scrolling-none">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%">
          <colgroup><col name="el-table_1_column_1" width="5%"><col name="el-table_1_column_2" width="30%"><col name="el-table_1_column_3" width="15%"><col name="el-table_1_column_4" width="10%"><col name="el-table_1_column_4" width="15%"><col name="el-table_1_column_5" width="20%"></colgroup>
          <tbody v-for="(item, index) of tableData" :key="item.id">

              <tr class="el-table__row" style="animation: 1s ease 0s 1 normal none running treeTableShow;" @click="handleSelectionChange(index)">
                <td rowspan="1" colspan="1" class="el-table_1_column_1 is-center">
                  <div class="cell">
                     <el-checkbox v-model="item.checked"></el-checkbox>
                  </div>
                </td>
                <td rowspan="1" colspan="1" class="el-table_1_column_2 is-center">
                  <div class="cell flex flex-ver">
                    <span class="level1" v-if="item.list && item.list.length > 0" @click.stop="treeClick(index)">
                      <i class="icon-s" :class="[item.open?'icon-icon_suoduan':'icon-icon_zhankai']"></i>
                    </span>
                    <el-input size="small" v-model="item.categoryName" style="width: 200px;" placeholder="分类名称"/>
                  </div>
                </td>
                <td rowspan="1" colspan="1" class="el-table_1_column_3 is-center">
                  <div class="cell">
                     <i class="icon-icon_up icon-s" :class="index === 0?'icon-os':''" @click.stop="sortUp(index,1)"></i>
                     <i class="icon-icon_down icon-s" :class="index === tableData.length - 1?'icon-os':''" @click.stop="sortDown(index,1)"></i>
                  </div>
                </td>
                <td rowspan="1" colspan="1" class="el-table_1_column_4 is-center">
                  <div class="cell">
                    <el-switch
                      v-model="item.avaliable" class="js_switch_core" active-color="#E1BF7F" inactive-value="0" active-value="1">
                    </el-switch>
                  </div>
                </td>
                <td rowspan="1" colspan="1" class="el-table_1_column_5 is-center">
                  <div class="cell">{{item.createTime}}</div>
                </td>
                <td rowspan="1" colspan="1" class="el-table_1_column_6 is-center">
                  <div class="cell" v-if="permissions.business_product_category_del">
                    <el-button type="text" size="small" icon="el-icon-delete" @click.native.prevent="handleDel(index,1)">
                      删除
                    </el-button>
                  </div>
                </td>
              </tr>
              <!-- 子级 -->
              <template v-if="item.open">
                <tr class="el-table__row" style="animation: 1s ease 0s 1 normal none running treeTableShow;" v-for="(child, idx) of item.list" :key="child.id">
                  <td rowspan="1" colspan="1" class="el-table_1_column_1 is-center">
                    <div class="cell">
                       <span></span>
                    </div>
                  </td>
                  <td rowspan="1" colspan="1" class="el-table_1_column_2 is-center">
                    <div class="cell" style="padding-left: 32px;">
                      <el-input size="small" v-model="child.categoryName" placeholder="分类名称" style="width: 200px;" />
                    </div>
                  </td>
                  <td rowspan="1" colspan="1" class="el-table_1_column_3 is-center">
                    <div class="cell">
                      <i class="icon-icon_up icon-s" :class="idx === 0?'icon-os':''" @click.stop="sortUp(idx,2,index)"></i>
                      <i class="icon-icon_down icon-s" :class="idx === item.list.length - 1?'icon-os':''" @click.stop="sortDown(idx,2,index)"></i>
                    </div>
                  </td>
                  <td rowspan="1" colspan="1" class="el-table_1_column_4 is-center">
                    <div class="cell"></div>
                  </td>
                  <td rowspan="1" colspan="1" class="el-table_1_column_5 is-center">
                    <div class="cell">{{child.createTime}}</div>
                  </td>
                  <td rowspan="1" colspan="1" class="el-table_1_column_6 is-center">
                    <div class="cell" v-if="permissions.business_product_category_del">
                      <el-button type="text" size="small" icon="el-icon-delete" @click.native.prevent="handleDel(idx,2,index)">
                        删除
                      </el-button>
                    </div>
                  </td>
                </tr>
              </template>
          </tbody>
        </table>
      </div>


    </div>
  </div>
</basic-container>
</template>

<script>
  import { randomLenNum } from "@/util/util";
  import cgyApi from '@/api/business/shopCategory'
  import {mapGetters} from "vuex"
  export default {
    computed: {
      ...mapGetters(["businessUserInfo", "permissions"])
    },
    data() {
      return {
        nowRow:-1,
        tableData: []
      }
    },
    created() {
      this.getBusinessProductCategoryFirst()
    },
    methods: {
      //一,二级分类查询
      getBusinessProductCategoryFirst(){
        cgyApi.getBusinessProductCategoryFirst(this.businessUserInfo.businessId).then(res => {
          let list = res.data.data;
          list.forEach((item,i) => {
            item.checked = false
            item.level = 1
            item.id = item.scId
            item.open = false
            item.list.forEach((o,_i)=>{
              o.id = item.scId
              o.level = 2
            })
            item.list = item.list || []
          })
          this.tableData = list
        })
      },
      //保存
      saveData(){
        let isEmpty = false
        this.tableData.forEach((o,i) => {
          if(!o.categoryName){
            isEmpty = true
          }
          o.seqNo = i+1
          o.list.forEach((_o,j) => {
            if(!_o.categoryName){
              isEmpty = true
            }
            _o.seqNo = j+1
          })
        })
        if(isEmpty){
          this.$message('分类名称不能为空');
          return;
        }
        cgyApi.addBusinessProductCategory(this.tableData).then(res => {
          this.getBusinessProductCategoryFirst()
          this.$message({
            showClose: true,
            message: '新增成功',
            type: 'success'
          })
        })
      },
      //删除
      handleDel(index,level,pindex){
        let _this = this
        if(level === 1 && _this.tableData[index].list.length > 0){
          _this.$message('该分类下已经关联了发布商品不能删除，您可以编辑商品关联到其它分类也可以直接删除商品再删除商品分类');
          return
        }

        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          if(level === 1){
            let row = _this.tableData[index]
            if(row.scId){
              cgyApi.delObj({
                scId:row.scId
              }).then(response => {
                _this.tableData.splice(index, 1)
                _this.$message({
                  showClose: true,
                  message: '删除成功',
                  type: 'success'
                })
              })
            }else{
              _this.tableData.splice(index, 1)
            }
          }else{
            let row = _this.tableData[pindex].list[index]
            if(row.scId){
              cgyApi.delObj({
                scId:row.scId
              }).then(response => {
                // _this.tableData.splice(index, 1)
                _this.tableData[pindex].list.splice(index,1)
                _this.$message({
                  showClose: true,
                  message: '删除成功',
                  type: 'success'
                })
              })
            }else{
              _this.tableData[pindex].list.splice(index,1)
            }
          }

        })

      },
      //选择行
      handleSelectionChange(index){
        this.nowRow = index
        this.tableData.forEach((o,i) => {
          // 排他,每次选择时把其他选项都清除
          if (i !== index) {
            o.checked = false
          }else{
            o.checked = true
            o.open = true
          }
        })
      },
      //添加一级
      addFirstCategory(){
        let obj = {
          id:randomLenNum(6, true),
          categoryName:'',
          level: 1,
          list:[],
          avaliable:'1',
        }
        this.tableData.push(obj)
      },
      //添加二级
      addSecCategory(){
        if(this.nowRow < 0){
          this.$message.error('请先勾择一级分类再添加二级分类');
          return
        }
        let secObj = {
          id:randomLenNum(6, true),
          level:2,
          categoryName:''
        }
        let children = this.tableData[this.nowRow].list
        children.push(secObj)
        let obj = this.tableData[this.nowRow]
        obj.list = children
        this.$set(this.tableData,this.nowRow,obj)

      },
      // 展开/收起
      treeClick(index){
        this.tableData[index].open = !this.tableData[index].open
      },
      // 上移,下移开始
      swapItems(arr, index1, index2){
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
      },
      // 上移
      sortUp(index,level,idx){
        if (index === 0) {
          return
        }

        if(level == 2){
          this.swapItems(this.tableData[idx].list, index, index - 1);
        }else{
          this.swapItems(this.tableData, index, index - 1);
        }

      },
      //下移
      sortDown(index,level,idx){
        if (index === this.tableData.length - 1) {
          return
        }
        if(level === 2){
          if(index === this.tableData[idx].list.length - 1){
            return
          }
          this.swapItems(this.tableData[idx].list, index, index + 1);
        }else{
          this.swapItems(this.tableData, index, index + 1);
        }

      }
      // 上移,下移结束
    },
  }
</script>
