<template>
  <div class="basic-container business-basic-container"
       :class="{'basic-container--block':block}">
    <!-- <el-card> -->
      <slot></slot>
    <!-- </el-card> -->
  </div>
</template>

<script>
export default {
  name: "basicContainer",
  props: {
    block: {
      type: Boolean,
      default: false,
    }
  }
};
</script>

<style lang="scss">
.basic-container {
  padding: 0;
  margin-left: 10px;
  width: calc(100% - 10px);
  box-sizing: border-box;
  .el-card {
    width: 100%;
  }
  &:first-child {
    padding-top: 0;
  }
  &--block {
    height: 100%;
    .el-card {
      height: 100%;
    }
  }
}
</style>
