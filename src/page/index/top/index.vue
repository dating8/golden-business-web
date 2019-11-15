<template>
  <div class="avue-top flex">
    <div class="top-bar__left flex flex-1">
      <div class="top-bar_left_title">{{siteInfo.siteName}}</div>
    </div>

    <div class="top-bar__right">
      <!-- <el-tooltip v-if="showLock"
                  effect="dark"
                  content="锁屏"
                  placement="bottom">
      </el-tooltip>
      <el-tooltip v-if="showFullScren"
                  effect="dark"
                  :content="isFullScreen?'退出全屏':'全屏'"
                  placement="bottom">
        <div class="top-bar__item">
          <i :class="isFullScreen?'icon-tuichuquanping':'icon-quanping'"
             @click="handleScreen"></i>
        </div>
      </el-tooltip> -->
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="icon-icon_mine golden"></i>
          账号: {{userInfo.username}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item>
            <router-link to="/">首页</router-link>
          </el-dropdown-item> -->
          <el-dropdown-item>
            <router-link to="/info/index">个人信息</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout"
                            divided>退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapState} from "vuex";
  import {fullscreenToggel, listenfullscreen} from "@/util/util";
  import topMenu from "./top-menu";

  export default {
    components: {
      topMenu
    },
    name: "top",
    data() {
      return {};
    },
    filters: {},
    created() {
    },
    mounted() {
      listenfullscreen(this.setScreen);
    },
    computed: {
      ...mapState({
        showLock: state => state.common.showLock,
        showFullScren: state => state.common.showFullScren,
        showCollapse: state => state.common.showCollapse,
        showMenu: state => state.common.showMenu,
      }),
      ...mapGetters([
        "userInfo",
        "isFullScreen",
        "tagWel",
        "tagList",
        "isCollapse",
        "tag",
        "logsLen",
        "logsFlag",
        "website",
        "siteInfo"
      ])
    },
    methods: {
      handleScreen() {
        fullscreenToggel();
      },
      // setCollapse() {
      //   this.$store.commit("SET_COLLAPSE");
      // },
      setScreen() {
        this.$store.commit("SET_FULLSCREN");
      },
      logout() {
        this.$confirm("是否退出系统, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$store.dispatch("LogOut").then(() => {
            this.$router.push({path: "/login",query:{siteId: this.siteInfo.siteId}})
          });
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>
