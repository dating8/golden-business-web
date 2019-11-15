  <template>
    <div class="login-container flex flex-col" @keyup.enter.native="handleLogin">
      <!-- <div class="login-top flex flex-ver">
        <img class="img"
             src="/img/logo.png"
             alt="">
        <p class="title flex-1">{{website.infoTitle}}</p>
        <div class="login-top-right" @click="toRegister">
          <i class="icon-icon_merchants golden"></i>
          <span class="title">商家入驻</span>
        </div>
      </div> -->
      <div class="login-weaper flex-1" :style="{backgroundImage: 'url(' + portal.bizBgImageUrl + ')'}">
        <div class="login-top-right" @click="toRegister">
          <i class="icon-icon_merchants golden"></i>
          <span class="title">商家入驻</span>
        </div>
        <div class="login-border">
          <div class="login-title">{{website.infoTitle}}</div>
          <div class="login-main">
            <userLogin v-if="activeName==='user'" @toRegister="toRegister"></userLogin>
          </div>
        </div>
      </div>
    </div>
  </template>
<script>
  import '@/styles/login.scss'
  import userLogin from "./userlogin";
  import {mapGetters} from "vuex";
  import {getStore, setStore} from "@/util/store";
  import {dateFormat} from "@/util/date";
  import {validatenull} from "@/util/validate";

  export default {
    name: "login",
    components: {
      userLogin
    },
    data() {
      return {
        activeName: "user",
      };
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["website", "portal"])
    },
    props: [],
    methods: {
      toRegister() {
        this.$router.push({path:'/register',query: {siteId:this.$route.query.siteId}})
      }
    }
  };
</script>
