<template>
  <div>
    <!-- <basic-container> -->
      <div class="wel-banner">
        <el-row :gutter="10">
          <el-col :span="8">
            <div class="flex">
              <div class="nav-left flex flex-center" style="background: #4189DD;">
                <span class="nav-circle"><i class="icon-icon_logistics1 icon"></i></span>
              </div>
              <div class="nav-right">
                <div class="nav-right-top">
                  <i class="triangle" style="border-bottom: 10px solid #4189DD;"></i>
                </div>
                <div class="nav-right-bottom flex flex-center flex-col">
                  <span>待发货订单</span>
                  <span>69013</span>
                </div>

              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="flex">
              <div class="nav-left flex flex-center" style="background: #F5B704;">
                <span class="nav-circle"><i class="icon-icon_order1 icon"></i></span>
              </div>
              <div class="nav-right">
                <div class="nav-right-top">
                  <i class="triangle" style="border-bottom: 10px solid #F5B704;"></i>
                </div>
                <div class="nav-right-bottom flex flex-center flex-col">
                  <span>昨日订单</span>
                  <span>138923</span>
                </div>

              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="flex">
              <div class="nav-left flex flex-center" style="background: #61B8A5;">
                <span class="nav-circle"><i class="icon-icon_data icon"></i></span>
              </div>
              <div class="nav-right">
                <div class="nav-right-top">
                  <i class="triangle" style="border-bottom: 10px solid #61B8A5;"></i>
                </div>
                <div class="nav-right-bottom flex flex-center flex-col">
                  <span>在售商品数量</span>
                  <span>863</span>
                </div>

              </div>
            </div>
          </el-col>
        </el-row>
        <div style="margin: 20px 0;">
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="wel-box-card">
                <div class="header flex">
                  <i class="icon-icon_notice1 wel-icon"></i>
                  <span class="flex-1">通知</span>
                  <el-button type="text" class="wel-more">更多>></el-button>
                </div>
                <div class="card-item">
                  <div class="item flex flex-ver" v-for="o of 3" :key="o">
                    <span class="item-circle"></span>
                    <span class="item-content">Label让我认同与我偶遇他惹我认同与地方规划局官方的洒567893456789儿童椅第三方共和国范德萨电饭锅和水电费规划局股份的</span>
                    <span class="item-time">2019-06-02 3：12</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="store-code">
                <div class="store-title">正在输入旗舰店</div>
                <div class="store-img"></div>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="business-rank">
          <el-row>
            <el-col :span="24">
              <div class="wel-box-card">
                <div class="header flex">
                  <i class="icon-icon_notice1 wel-icon"></i>
                  <span class="flex-1">商品销量排行</span>
                  <div class="rank-nav">
                    <span class="active">今日</span>
                    <span>昨日</span>
                    <span>最近7天</span>
                    <span>本月</span>
                  </div>
                </div>
                <div class="rank-table">
                  <el-table :header-cell-style="{
    'background-color': '#efefef'}"
                  :data="tableData"
                  style="width: 100%">
                  <el-table-column align='center'
                    type="index"
                    label="TOP"
                    width="65">
                      <template slot-scope="scope">
                        <span v-if="scope.$index == 0">
                          <!-- <i class="icon-icon_list_one"></i> -->
                          <svg class="icon1" aria-hidden="true">
                        　　<use xlink:href="#icon-icon_list_one"></use>
                      　　</svg>
                        </span>
                        <span v-if="scope.$index == 1">
                          <svg class="icon1" aria-hidden="true">
                        　　<use xlink:href="#icon-icon_list_two"></use>
                      　　</svg>
                        </span>
                        <span v-if="scope.$index == 2">
                          <svg class="icon1" aria-hidden="true">
                        　　<use xlink:href="#icon-icon_list_three"></use>
                      　　</svg>
                        </span>
                        <span v-if="scope.$index > 2">{{scope.$index + 1}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column align='center'
                    prop="name"
                    label="商品名称"
                    width="160">
                  </el-table-column>
                  <el-table-column align='center'
                    prop="zip"
                    label="销售数量" width="160">
                  </el-table-column>
                  <el-table-column align='center'
                    prop="date"
                    label="交易时间"
                    width="160">
                  </el-table-column>
                  <el-table-column label="">

                  </el-table-column>
                </el-table>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

    <!-- </basic-container> -->
  </div>
</template>

<script>
  export default {
    name: 'wel',
    data() {
      return {
         tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          zip: 200333,
        }, {
          date: '2016-05-04',
          name: '王小虎',
          zip: 200333,
        }, {
          date: '2016-05-01',
          name: '王小虎',
          zip: 200333,
        }, {
          date: '2016-05-03',
          name: '王小虎',
          zip: 200333,
        }],
      }
    },
    computed: {

    },
    methods: {

    }
  }
</script>

<style scoped="scoped" lang="scss">
  .wel-banner{
    margin-left: 10px;
    margin-right: 30px;
    .nav-left{
      width: 45%;
      height:120px;
      border-radius: 5px 0px 0px 5px;
      .nav-circle{
        width: 60px;
        height: 60px;
        line-height: 60px;
        background: rgba(255,255,255,0.05);
        border-radius: 100%;
        color: #fff;
        text-align: center;
      }
    }
    .nav-right{
      width: 55%;
      .nav-right-top{
        height: 10px;
        position: relative;
        .triangle{
          width: 0;
          height: 0;
          border-right: 10px solid transparent;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .nav-right-bottom{
        height: 110px;
        background: #fff;
        border-radius: 0px 5px 5px 0px;
      }
    }
    .wel-box-card{
      color: #262626;
      background: #fff;
      border-radius: 5px;
      .header{
        padding: 16px 18px;
        border-bottom: 1px solid #e9e9e9;
        .wel-icon{
          margin-right: 14px;
          color: #E1BF7F;
          font-size: 24px !important;
          vertical-align: middle;
        }
      }
      .card-item{
        padding: 0 20px;
        .item{
          padding: 10px 0;
          border-bottom: 1px solid #e9e9e9;
          font-size: 13px;
          color: #818181;
          .item-circle{
            width: 14px;
            height: 14px;
            border: 1px solid #E1BF7F ;
            border-radius: 100%;
            flex-shrink:0;
            margin-right: 18px;
          }
          .item-content{
            line-height: 22px;
          }
          .item-time{
            padding-left: 20px;
            color: #666;
            flex-shrink: 0;
          }
          &:last-child{
            border-bottom: none;
          }
        }
      }

      .wel-more{
        line-height: 24px;
        padding:0;
        font-size: 13px;
        color: #262626;
      }
      .rank-table{

      }
    }
    .store-code{
      padding: 20px 70px;
      background: #fff;
      border-radius: 5px;
      .store-title{
        font-size: 16px;
        color: #262626;
      }
      .store-img{
        width: 144px;
        height: 144px;
        background: #D8D8D8;
        margin-top: 30px;
      }
    }

    .rank-nav{
      font-size:12px;
      color: #818181;
      span{
        margin: 0 20px;
        cursor: pointer;
        &.active{
          color: #E1BF7F;
          border-bottom: 2px solid #E1BF7F;
        }
      }

    }
  }

</style>
