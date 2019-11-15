<template>
  <div class="avue-logo flex flex-ver">
    <img class="top-img" :src="siteInfo.siteLogoUrl" alt="" v-if="!isCollapse">
      <!-- <div class="avue-breadcrumb" @click="setCollapse" >
        <transition name="fade">
          <template v-if="keyCollapse">
            <svg class="svg" aria-hidden="true" key="0">
              <use xlink:href="#icon-icon_function"></use>
        　　</svg>
          </template>
        </transition>
        <transition-group name="fade">
          <template v-if="!keyCollapse">
            <svg class="svg" aria-hidden="true" key="1">
              <use xlink:href="#icon-icon_functionshrinkage"></use>
        　　</svg>
          </template>
        </transition-group>
      </div> -->

    <transition name="fade">
      <div class="avue-breadcrumb" @click="setCollapse" v-if="keyCollapse" key="0">
        <svg class="svg" aria-hidden="true">
          <use xlink:href="#icon-icon_function"></use>
    　　</svg>
      </div>
      <!-- <span v-if="keyCollapse"
            class="avue-logo_subtitle"
            key="0">
        {{website.logo}}
      </span> -->
    </transition>
    <transition-group name="fade">
      <template v-if="!keyCollapse">
        <div class="avue-breadcrumb" @click="setCollapse" key="1">
            <svg class="svg" aria-hidden="true">
              <use xlink:href="#icon-icon_functionshrinkage"></use>
        　　</svg>
          </div>
      </template>
    </transition-group>
 </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "logo",
  data() {
    return {
    };
  },
  created() {},
  computed: {
    ...mapState({
      showCollapse: state => state.common.showCollapse,
    }),
    ...mapGetters(["website", "keyCollapse","isCollapse","siteInfo"])
  },
  methods: {
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
  }

};
</script>

<style lang="scss">
.fade-leave-active{
  transition: all 0.2s;
}
.fade-enter-active {
  transition: all 1.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.avue-logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 190px;
  height: 70px;
  background-color: #20222a;
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);
  z-index: 1024;
  .top-img{
    width: 100px;
  }
}
</style>
