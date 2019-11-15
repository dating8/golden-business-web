<template>
  <div style="display: flex">
    <el-select  v-model="caddress.sheng" style="flex: 1;" placeholder="省" @change="getCityData">
      <el-option
        v-for="item of addressArray"
        :key="item.areacode"
        :label="item.areaname"
        :value="item.areaname"
      >
      </el-option>
    </el-select>
    <el-select  v-model="caddress.shi" v-if="caddress.sheng" style="flex: 1;margin-left: 10px" placeholder="市"
               @change="getAreaData">
      <el-option
        v-for="item in cityArray"
        :key="item.areacode"
        :label="item.areaname"
        :value="item.areaname">
      </el-option>
    </el-select>
    <el-select  v-model="caddress.qu" v-if="caddress.shi" style="flex: 1;margin-left: 10px" placeholder="县"
               @change="onAreaChanged">
      <el-option
        v-for="item in areaArray"
        :key="item.areacode"
        :label="item.areaname"
        :value="item.areaname">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import {getAddress} from '@/api/login'
  // import addressArr from './address.json'// 使用说明：v-model时，必须传带有带有省，市，区拼音的字段
  export default {
    name: "area_select",
    //通过 model 选项配置子组件接收的 prop 名以及派发的事件名
    model: {
      prop: 'caddress',
      event: 'change',
    },
    props: {
      caddress: {
        type: Object,
        default: () => ({
          sheng: '',
          shi: '',
          qu: '',
        })
      },
    },
    data() {
      return {
        addressArray: [],//所有数据
        cityArray: [],
        areaArray: []
      }
    },
    created() {
      this.getAddressData();
    },
    methods: {
      getAddressData() {
        var that = this
        this.axios.get('/address.json').then(res => {
          that.addressArray = res.data.data;
          //默认值赋值获取城市数组
          if(that.caddress.sheng){
            for (let ad of that.addressArray) {
              if (ad.areaname === that.caddress.sheng) {
                that.cityArray = ad.subarea;
                //---
                //默认赋值获取区域数组
                if(that.caddress.shi){
                  for (let area of that.cityArray) {
                    if (area.areaname === that.caddress.shi) {
                      that.areaArray = area.subarea;
                      break;
                    }
                  }
                }
              }
            }
          }
        })

      },
      //选择省份
      getCityData(val) {
        //清空市，和区
        this.caddress.shi='';
        this.caddress.qu='';
        this.$emit('change', this.caddress);//发送改变
        for (let ad of this.addressArray) {
          if (ad.areaname === val) {
            this.cityArray = ad.subarea;
            return
          }
        }
      },
      getAreaData(val) {
        //清空区
        this.caddress.qu='';
        this.$emit('change', this.caddress);//发送改变
        for (let area of this.cityArray) {
          if (area.areaname === val) {
            this.areaArray = area.subarea;
            return
          }
        }
      },
      //地区数据变动后
      onAreaChanged(val) {
        this.$emit('change', this.caddress);//发送改变
      }
    }
  }
</script>

<style scoped>

</style>
