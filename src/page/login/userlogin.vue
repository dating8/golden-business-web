<template>
  <el-form class="login-form"
           :rules="loginRules"
           ref="loginForm"
           :model="loginForm"
           label-width="0">
    <el-form-item prop="username">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.username"
                auto-complete="off"
                placeholder="请输入用户名">
        <i slot="prefix"
           class="icon-icon_account" :class="loginForm.username?'icon-active':''"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                :type="passwordType"
                v-model="loginForm.password"
                auto-complete="off"
                placeholder="请输入密码">
        <!-- <i class="el-icon-view el-input__icon"
           slot="suffix"
           @click="showPassword"></i> -->
        <i slot="prefix" class="icon-icon_password" :class="loginForm.password?'icon-active':''"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-row :span="24">
        <el-col :span="16">
          <el-input size="small"
                    @keyup.enter.native="handleLogin"
                    :maxlength="code.len"
                    v-model="loginForm.code"
                    auto-complete="off"
                    placeholder="请输入验证码">
			<i slot="prefix" class="icon-icon_Verificationcode" :class="loginForm.code?'icon-active':''"></i>
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <span class="login-code-img"
                  @click="refreshCode"
                  v-if="code.type == 'text'">{{code.value}}</span>
            <img :src="code.src"
                 class="login-code-img"
                 @click="refreshCode"
                 v-else/>
          </div>
        </el-col>
      </el-row>

    </el-form-item>

    <el-form-item class="login-item">
      <el-button type="primary"
                 size="small"
                 @click.native.prevent="handleLogin"
                 class="login-submit">立即登录</el-button>
    </el-form-item>
    <div class="flex">
    <el-checkbox
                  v-model="checked"
                  class="rememberme flex-1"
              >记住密码</el-checkbox>
      <span class="register-text" @click="toRegister">注册</span>
    </div>
  </el-form>
</template>

<script>
import { randomLenNum } from "@/util/util";
import { mapGetters } from "vuex";
export default {
  name: "userlogin",
  data () {

    return {
      loginForm: {
        username: "",
        password: "",
        code: "",
        redomStr: ""
      },
      checked: true,
      code: {
        src: "/code",
        value: "",
        len: 4,
        type: "image"
      },
      loginRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码长度为4位", trigger: "blur" }
        ]
      },
      passwordType: "password"
    };
  },
  created () {
    this.refreshCode();
  },
  mounted () {
    this.getCookie()
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  props: [],
  methods: {
    //设置cookie
    setCookie(c_name, c_pwd, exdays) {
        var exdate = new Date(); //获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
        //字符串拼接cookie
        window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
        window.document.cookie = "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
    },
    //读取cookie
    getCookie: function() {
        if (document.cookie.length > 0) {
            var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
            for (var i = 0; i < arr.length; i++) {
                var arr2 = arr[i].split('='); //再次切割
                //判断查找相对应的值
                if (arr2[0] == 'userName') {
                  //  console.log(arr2[1])
                    this.loginForm.username = arr2[1]; //保存到保存数据的地方
                } else if (arr2[0] == 'password') {
                  // console.log(arr2[1])
                    this.loginForm.password = arr2[1];
                }
            }
             this.checked = true;
        }
    },
    //清除cookie
    clearCookie: function() {
        this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
    },
    refreshCode () {
      this.loginForm.code = ''
      this.loginForm.randomStr = randomLenNum(this.code.len, true)
      this.code.type === 'text'
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}?randomStr=${this.loginForm.randomStr}`)
    },
    showPassword () {
      this.passwordType == ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const self = this;
          self.$store.dispatch("LoginByUsername", this.loginForm).then(() => {

            if (self.checked == true) {
                //传入账号名，密码，和保存天数3个参数
                self.setCookie(self.loginForm.username, self.loginForm.password, 7);
            }else {
              console.log("清空Cookie");
              //清空Cookie
              self.clearCookie();
          }
            self.$router.push({ path: self.tagWel.value });
          }).catch(()=>{
            self.refreshCode()
          })

        }
      });
    },
    toRegister() {
      this.$emit('toRegister')
    }
  }
};
</script>

<style>
</style>
