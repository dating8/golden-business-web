<template>
  <div class="exmamine-main">
    <div class="examineBox">
      <div class="exam-top"></div>
      <div class="exam-center flex flex-col flex-center">
        <p class="submit-text">恭喜您！您入驻资料提交成功，请耐心等待平台审核。</p>
        <p class="submit-text1">我们将在1-3个工作日完成入驻处理结果会以短信告知您。</p>
      </div>

    </div>

    <div class="exam-bottom">
      <div class="exam-head">
        <span>入驻进度</span>
        <span>提交日期</span>
        <span>提示</span>
      </div>
      <div class="exam-content">
        <span>提交申请入驻</span>
        <span>{{date}}</span>
        <span>您的入驻资料已提交至平台审核</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { nowDate } from "@/util/date";
  export default {
    name: "examine",
    data () {
      return {
        date:nowDate()
      };
    },
    created () {

    },
    mounted () { },
    methods: {
    }
  };
</script>

<style>

</style>
