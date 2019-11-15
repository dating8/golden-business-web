  <template>
    <div class="login-container flex flex-col">
      <div class="login-weaper flex-1" :style="{backgroundImage: 'url(' + portal.bizBgImageUrl + ')'}">
        <div class="register-top-right flex flex-ver">
          <img class="img" :src="portal.logoUrl" alt="">
          <p class="title flex-1">壹号珠宝商家入驻流程</p>
        </div>

        <div class="register-weaper" :class="step != 2?'rh':''">
          <div class="register-process">
            <span :class="index < step?'active':''" v-for="(item, index) of process" :key="index">{{item}}</span>
          </div>
          <!-- 第一个页面 -->
          <firstPage @changeStep="tapStep" :siteId="siteId" v-show="step == 1"></firstPage>
          <!-- 第二个页面 -->
          <basicData @changeStep="tapStep" v-show="step == 2"></basicData>
          <!-- 第三个页面 -->
          <shopInfo @changeStep="tapStep" :siteId="siteId" v-if="step == 3"></shopInfo>
          <!-- 第四个提交审核页面 -->
          <submitExamine v-show="step == 4"></submitExamine>
        </div>
      </div>
    </div>
  </template>
<script>
  import '@/styles/register.scss'
  import firstPage from "./submitFirstPage";
  import basicData from "./submitBasicData";
  import shopInfo from "./submitShopInfo";
  import submitExamine from "./submitExamine";
  import {dateFormat} from "@/util/date";
  import {validatenull} from "@/util/validate";
  import regApi from '@/api/register'
  import {mapGetters} from "vuex"
  export default {
    name: "register",
    components: {
      firstPage, basicData, shopInfo, submitExamine
    },
    data() {
      return {
        step: 1,
        siteId: '',
        process: ['商家注册','基础资料认证','商家店铺信息','等待平台审核'],
        form: {},
      };
    },
    watch: {},
    created() {
      this.siteId = this.$route.query.siteId //获取链接参数
    },
    mounted() {
    },
    computed: {
        ...mapGetters(["portal"])
    },
    props: [],
    methods: {
      tapStep(val,obj){
        // 提交进入提交成功页面之前提交数据,提交成功才能进入成功页面
        this.form = Object.assign({},this.form,obj)
        if(val == 4){
          regApi.submitBusinessUserInfo(this.form).then(res => {
            this.$message.success('提交成功');
            this.step = 4
          })
        }else{
          this.step = val
        }

      }
    }
  };
</script>
