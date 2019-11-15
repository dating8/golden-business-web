<template>
  <basic-container>
    <div class="product-table">
      <el-table
      ref="priceTable"
      :data="tableData"
      style="width: 100%"
      @row-click="handleSelectionChange" :header-cell-style="{
    'background-color': '#f5f5f5'}">

      <el-table-column align='center'
        prop="productFinenessName"
        label="成色"
        width="120">
      </el-table-column>

      <el-table-column align='center'
        prop="useSgeRealPrice"
        label="是否用上交所实时金价">

        <template slot-scope="scope">
          <div v-show="scope.row.productFinenessId === productFinenessId">
            <el-radio-group v-model="scope.row.useSgeRealPrice">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </div>
          <span  v-show="scope.row.productFinenessId !== productFinenessId">{{scope.row.useSgeRealPrice == '1'?'是':'否'}}</span>
        </template>
      </el-table-column>

      <el-table-column align='center'
        prop="baseGoldPrice"
        label="金价（/g)">
        <template slot-scope="scope">
          <el-input size="small" v-model.number="scope.row.baseGoldPrice" v-if="scope.row.productFinenessId === productFinenessId && scope.row.useSgeRealPrice == 0"/>
          <span v-else>{{scope.row.baseGoldPrice}}</span>
        </template>
      </el-table-column>

      <el-table-column align='center'
        prop="floatingPrice1"
        label="价格浮动方案1（/g)">
        <template slot-scope="scope">
          <el-input size="small" v-model.number="scope.row.floatingPrice1" v-if="scope.row.productFinenessId === productFinenessId"/>
          <span v-else>+{{scope.row.floatingPrice1}}</span>
        </template>
      </el-table-column>

      <el-table-column align='center'
        prop="floatingPrice2"
        label="价格浮动方案2（/g)">
        <template slot-scope="scope">
          <el-input size="small" v-model.number="scope.row.floatingPrice2" v-if="scope.row.productFinenessId === productFinenessId"/>
          <span v-else>+{{scope.row.floatingPrice2}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align='center' v-if="permissions.business_gold_price_edit">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-if="scope.row.productFinenessId === productFinenessId" @click.stop="handleEdit(scope.row,scope.$index)">保存</el-button>
        	<el-button type="text" v-else
        	  icon="el-icon-edit"
        	  size="mini" @click="productFinenessId = scope.row.productFinenessId">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </basic-container>
</template>

<script>
  import gpApi from '@/api/business/goldprice'
  import {mapGetters} from "vuex"
  export default {
    computed: {
      ...mapGetters(["businessUserInfo", "permissions"])
    },
    data() {
      return {
        tableData: [],
        productFinenessId: '',
      }
    },
    created() {
      this.getGoldPriceList()
    },
    methods:{
      //获取金价设置列表
      getGoldPriceList(){
        gpApi.getGoldPriceList(this.businessUserInfo.businessId).then(res => {
          let list = res.data.data;
          this.tableData = list
        })
      },
      //编辑
      handleEdit(row, index){
        this.productFinenessId = ''
        gpApi.putObj(row).then(res => {
          this.getGoldPriceList()
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
        })
      },
      //点击行
      handleSelectionChange(row){
        if(!this.permissions.business_gold_price_edit){
          return
        }
        this.productFinenessId = row.productFinenessId
      }
    }
  }
</script>

<style scoped lang="scss">
  .product-table{
    padding: 20px 0 0 20px;
  }
</style>
