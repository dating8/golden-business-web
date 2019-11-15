<template>
  <div style="height:100%">
    <basic-container>
      <div class="product-table">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd" style="margin-bottom: 20px;" v-if="permissions.business_freight_template_add">添加</el-button>
          <el-table
          ref="osTable" v-loading="listLoading"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{'background-color': '#f5f5f5'}">

          <el-table-column align='center'
            type="index"
            label="编号"
            width="65">
          </el-table-column>

          <el-table-column align='center'
            prop="templateName"
            label="模版名称">
          </el-table-column>

          <el-table-column
            align='center'
            prop="enable"
            label="状态"  width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enable"
                disabled class="js_switch_core" active-color="#E1BF7F" active-value="1">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column align='center'
            prop="defaultSet"
            label="默认模版">
            <template slot-scope="scope">
              <span>{{scope.row.defaultSet == '1'?'是':'否'}}</span>
            </template>
          </el-table-column>

          <el-table-column align='center'
            prop="feeCalcType"
            label="计价方式">
            <template slot-scope="scope">
              <span>{{scope.row.feeCalcType == 'W'?'按重量':'按数量'}}</span>
            </template>
          </el-table-column>

          <el-table-column align='center'
            prop="freeDelivery"
            label="是否包邮">
            <template slot-scope="scope">
              <span>{{scope.row.freeDelivery == '1'?'是':'否'}}</span>
            </template>
          </el-table-column>

          <el-table-column align='center'
            prop="createTime"
            label="添加时间">
          </el-table-column>

          <el-table-column label="管理" align='center'>
            <template slot-scope="scope">
              <el-button type="text"
                icon="el-icon-edit"
                size="mini" @click="handleEdit(scope.row,scope.$index)" v-if="permissions.business_freight_template_edit">编辑</el-button>
                <el-button type="text"
                  icon="el-icon-delete"
                  size="mini" @click="handleDel(scope.row,scope.$index)" v-if="permissions.business_freight_template_del">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div style="text-align: center;padding: 30px 0 20px;">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="page.pageSize"
            :total="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
          </el-pagination>

        </div>
      </div>
    </basic-container>

    <el-dialog :title="formStatu === 'add'?'添加物流模版':'编辑物流模版'" :visible.sync="dialogFormVisible" width="50%" center>
      <el-form :rules="applyRules"
             ref="applyForm"
             :model="applyForm"
             label-width="130px">

        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="模版名称:" prop="templateName">
              <el-input v-model="applyForm.templateName" placeholder="请输入模版名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="是否启用" prop="enable" class="tempRadio">
              <el-radio-group v-model="applyForm.enable">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="是否包邮" prop="freeDelivery" class="tempRadio">
              <el-radio-group v-model="applyForm.freeDelivery">
                <el-radio label="1">商家承担运费（包邮）</el-radio>
                <el-radio label="0">自定义运费</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="计价方式" prop="feeCalcType" class="tempRadio">
              <el-radio-group v-model="applyForm.feeCalcType">
                <el-radio label="W">按重量</el-radio>
                <el-radio label="C">按件数</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="设置为默认模版" prop="defaultSet" class="tempRadio">
              <el-radio-group v-model="applyForm.defaultSet">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <template v-if="applyForm.freeDelivery == '0'">
          <el-form-item label="是否支持保价" prop="hasInsurance">
            <el-row>
              <el-col :span="8">
                <el-radio-group v-model="applyForm.hasInsurance">
                  <el-radio label="0">否</el-radio>
                  <el-radio label="1">是</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="12">
                <div class="flex flex-ver" v-if="applyForm.hasInsurance == '1'">
                  <el-input v-model="applyForm.insuranceFee"></el-input>
                  <span class="f-s">元</span>
                </div>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item :label="applyForm.feeCalcType === 'W'?'重量':'件数'" prop="firstWeight">

              <div class="flex flex-ver">
                <el-input v-model="applyForm.firstWeight"></el-input>
                <span class="f-s">{{applyForm.feeCalcType === 'W'?'kg':'件'}}内</span>
                <el-input v-model="applyForm.firstWeightFee"></el-input>
                <span class="f-s">元</span>

                <span class="f-s">每增加</span>
                <el-input v-model="applyForm.additionalWeight"></el-input>
                <span class="f-s">{{applyForm.feeCalcType === 'W'?'kg':'件'}}</span>
                <span class="f-s">增加运费</span>
                <el-input v-model="applyForm.additionalWeightFee"></el-input>
                <span class="f-s">元</span>
              </div>

          </el-form-item>

          <div class="" style="margin-left: 130px;">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-button type="primary" @click="isSet = true" icon="el-icon-plus">指定地区添加运费</el-button>
              </el-col>
            </el-row>

            <el-row :gutter="10" v-if="isSet" style="margin-top: 20px;">
              <el-col :span="10">
                <el-select multiple v-model="checkList" value-key="item" placeholder="请选择区域" @change="handleFreightChange">

                　　<el-option v-for="item of addressOption" :key="item" :label="item" :value="item"></el-option>

                </el-select>
              </el-col>
            </el-row>

            <div style="margin-top: 15px;" v-if="FreightData.length > 0">
              <el-table
                :data="FreightData"
                style="width: 100%"
                :header-cell-style="{'background-color': '#f5f5f5'}">
                <el-table-column align='center' label="地区" prop="areaProvince"></el-table-column>

                <el-table-column align='center' :label="applyForm.feeCalcType === 'W'?item.label:item.label2" :prop="item.prop" v-for="item in FreightOption" :key="item.label">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row[item.prop]"/>
                  </template>
                </el-table-column>

                <el-table-column label="操作" align='center'>
                  <template slot-scope="scope">
                    <el-button type="text"
                              icon="el-icon-delete"
                              size="mini" @click="handleFreightDel(scope.row.areaProvince,scope.$index)">删除</el-button>
                  </template>
                </el-table-column>

              </el-table>
            </div>

          </div>
        </template>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import lsApi from '@/api/business/logistics'
  import {applyRules,applyForm,addressOption,FreightOption} from '@/const/crud/business/logistics'
  // import areaSelect from "@/components/area_select/area_select";
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters(['permissions', 'userInfo'])
    },
    // components: {
    //   areaSelect
    // },
    data() {
      return {
        formStatu:'add',
        listLoading:false,
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        applyForm,
        applyRules,
        addressOption,
        FreightOption,
        dialogFormVisible:false,
        checkList:[],
        isSet:false,//是否为指定地区添加邮费
        FreightData:[]
      }
    },
    created() {
      this.getFreightTemplateList()
    },
    methods:{
      //获取物流模板
      getFreightTemplateList(){
        this.listLoading = true
        lsApi.getFreightTemplateList({
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize,
          siteId:this.userInfo.siteId,
        }).then(response => {
          this.listLoading = false
          this.tableData = response.data.data.records
          // this.tableData = list
          this.page.total = response.data.data.total

        })
      },
      //页码改变
      handleCurrentChange(cpage){
        this.page.currentPage = cpage;
        this.getFreightTemplateList()
      },
      handleSizeChange(val){
        this.page.pageSize = val;
        this.getFreightTemplateList()
      },
      //新增
      handleAdd(){
        this.dialogFormVisible = true;
        this.formStatu = 'add';
        this.resetForm()
      },
      //编辑
      handleEdit(row, index){
        lsApi.getObj(row.ftId).then(res => {
          this.formStatu = 'edit'
          this.dialogFormVisible = true;

          this.$nextTick(()=>{
            let businessFreightAreaList = res.data.data.businessFreightAreaList
            if(businessFreightAreaList && businessFreightAreaList.length > 0){
              this.isSet = true
              this.checkList = res.data.data.businessFreightAreaList.map(o => o.areaProvince)
              this.FreightData = res.data.data.businessFreightAreaList
            }else{
              this.FreightData = []

            }
            this.applyForm = res.data.data.businessFreightTemplate
          })

        })

      },
      //新增数据
      submitData(){
        this.$refs.applyForm.validate(valid => {
          if (valid) {
            let form = {}
            if(this.FreightData.length > 0){
              this.applyForm.freightType = '2'
            }else{
              this.applyForm.freightType = '1'
            }
            this.applyForm.siteId = this.userInfo.siteId
            form.businessFreightAreaList = this.FreightData
            form.businessFreightTemplate = this.applyForm
            console.log(form)
            if(this.formStatu === 'add'){
              this.addFreightTemplate(form)
            }else{
              this.putObj(form)
            }
          }
        })
      },
      //新增数据
      addFreightTemplate(row){
        lsApi.addFreightTemplate(row).then(res =>{
          this.dialogFormVisible = false
          this.$message.success('添加成功')
          this.getFreightTemplateList()
          this.resetForm()
        })
      },
      //修改数据
      putObj(row){
        lsApi.putObj(row).then(res =>{
          this.dialogFormVisible = false
          this.$message.success('修改成功')
          this.getFreightTemplateList()
          this.resetForm()
        })
      },
      //删除数据
      handleDel(row, index){
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          lsApi.delObj(row.ftId).then(() => {
            this.getFreightTemplateList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      //指定地区添加邮费删除
      handleFreightDel(val,index){
        let delIndex = this.checkList.findIndex(o =>{
          return o === val
        })
        this.checkList.splice(delIndex,1)
        this.FreightData.splice(index,1)
      },
      //选择的指定地区添加邮费
      handleFreightChange(item){
        let arr = this.FreightData.map(it => it.areaProvince)
        var list1,list2;
        if(item.length > arr.length){
          list1 = arr
          list2 = item
        }else{
          list1 = item
          list2 = arr
        }
        // 首先构造Object
        let idSet = list1.reduce((acc, v) => {
            acc[v] = true;
            return acc;
        }, {});
        // 遍历list2，去掉在idSet中存在的id
        let result = list2.filter(v => !idSet[v]);

        let index = arr.indexOf(result[0])

        if(index > -1){
          this.FreightData.splice(index,1)
        }else{
          let obj = {
            firstWeight:'',
            firstWeightFreight:'',
            addtionalWeight:'',
            addtionalWeightFreight:'',
            areaProvince:result[0],
          }
          this.FreightData.push(obj)
        }

      },
      // 重置
      resetForm(){
        this.checkList = []
        this.FreightData = []
        this.applyForm = {
          enable:'1',//是否启用
          freeDelivery:'1',//是否包邮
          feeCalcType:'W',//计价方式
          defaultSet:'1',//设置为默认模板
          hasInsurance:'0',//是否支持保价
        }
        // this.$refs.applyForm.resetFields()
      }
    }
  }
</script>

<style scoped lang="scss">
  .product-table{
    padding: 20px 0 0 20px;
  }
  .f-s{
    margin: 0 10px;
    flex-shrink: 0;
  }
</style>
