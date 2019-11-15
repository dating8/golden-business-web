<template>
  <div class="register-main">
    <el-form class="register-form" autocomplete="off"
             :rules="registerRules"
             ref="registerForm"
             :model="registerForm"
             label-width="100px">
      <el-form-item prop="mobile" label="电话:">
        <el-input @keyup.enter.native="handleSubmit"
                  v-model="registerForm.mobile"
                  auto-complete="off"
                  placeholder="请输入手机号">
        </el-input>
      </el-form-item>

      <el-form-item prop="code" label="图片验证码:">
        <el-row :span="24">
          <el-col :span="16">
            <el-input @keyup.enter.native="handleSubmit"
                      :maxlength="code.len"
                      v-model="registerForm.code"
                      auto-complete="off"
                      placeholder="请输入验证码">
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

      <el-form-item prop="sendcode" class="smsCode" label="短信验证码:">
        <el-row :gutter="10">
          <el-col :span="15">
            <el-input v-model="registerForm.sendcode" auto-complete="new-sendcode" placeholder="请输入短线验证码" autocomplete="off"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="button" @click="sendcode" :disabled="disabled" v-if="disabled==false" class="sendBtn" :loading="sendloading">获取验证码
            </el-button>
            <el-button type="button" @click="sendcode" :disabled="disabled" v-if="disabled==true" class="sendBtn">{{btntxt}}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item prop="password" label="密码:">
        <el-input auto-complete="new-password" @keyup.enter.native="handleSubmit"
                  type="password"
                  v-model="registerForm.password"
                  placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <el-form-item prop="checkPass" label="确认密码:">
        <el-input auto-complete="new-checkPass" @keyup.enter.native="handleSubmit"
                  type="password"
                  v-model="registerForm.checkPass"
                  placeholder="两次密码输入必须一致">
        </el-input>
      </el-form-item>

      <el-form-item prop="inviteCode" label="邀请码:">
        <el-input @keyup.enter.native="handleSubmit"
                  v-model="registerForm.inviteCode"
                  auto-complete="off"
                  placeholder="必须填写6位数邀请码">
        </el-input>
      </el-form-item>
		<div class="flex">
			<el-checkbox v-model="checked" class="rememberme">已阅读并同意</el-checkbox>
      <span style="color:#E1BF7F" @click="dialogVisible = true">《供应商入驻协议》</span>
		</div>
      <el-form-item class="login-item">
        <el-button type="primary"
                   size="small"
                   @click.native.prevent="handleSubmit"
                   class="login-submit" :loading="formload">提交</el-button>
      </el-form-item>

      <div class="hasnum" @click="toLogin">已有账号去登录>></div>

    </el-form>

    <el-dialog
      :title="protocol.title"
      :visible.sync="dialogVisible"
      width="50%"
      center @close="tapClose" lock-scroll>
      <div class="avue-crud__dialog avue-crud__dialog--overflow" style="padding-bottom: 25px" v-html="protocol.content"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tapClose">同 意</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { randomLenNum } from "@/util/util";
import {isvalidatemobile} from "@/util/validate";
import regApi from '@/api/register'
var validPhone=(rule, value,callback)=>{
      if (!value){
          callback(new Error('请输入电话号码'))
      }else  if (!isvalidatemobile(value)){
        callback(new Error('请输入正确的11位手机号码'))
      }else {
          callback()
      }
  }

export default {
  name: "firstPage",
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      isCheck:false,
      isSubmit:false,
      dialogVisible:false,
      registerForm: {
        mobile: "",
        code: "",
        sendcode: "",
        password: "",
        checkPass: "",
        inviteCode: "",
        redomStr: "",
      },
      checked: true,
      code: {
        src: "/code",
        value: "",
        len: 4,
        type: "image"
      },
      registerRules: {
        mobile: [
          { required: true, trigger: 'blur', validator: validPhone }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码长度为4位", trigger: "blur" }
        ],
        sendcode: [
          { required: true, message: "请输入短信验证码", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        checkPass: [
          { validator: validatePass, trigger: 'blur' }
        ]

      },
      disabled: false,
      time: 0,
      btntxt: "重新发送",
      formload:false,
      sendloading:false,
      protocol: {}
    };
  },
  created () {
    this.refreshCode()
    this.getProtocol()
  },
  mounted () { },
  computed: {

  },
  props: {
    siteId:{
      type: String,
      default: ''
    }
  },
  methods: {
    //手机验证发送验证码
    sendcode() {
        const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
        if (this.registerForm.mobile == '' || !reg.test(this.registerForm.mobile)) {
            this.$message({
                message:'请输入正确的手机号',
                center: true
            })
            return
        }else{
          this.sendloading = true
          regApi.sendSmsCode({phoneNum: this.registerForm.mobile+'',siteId:this.siteId}).then(res => {
              this.sendloading = false
              if(res.data.data === '手机号已经注册,请登录'){
                this.$message({
                    message: res.data.data,
                    center:true
                });
              }else{
                this.$message({
                    message: '发送成功',
                    type: 'success',
                    center:true
                });
              }
              this.time = 60;
              this.disabled = true;
              this.timer();
          }).catch(error => {

          })
        }
    },
    //60S倒计时
    timer() {
        if (this.time > 0) {
            this.time--;
            this.btntxt = this.time + "s";
            setTimeout(this.timer, 1000);
        } else {
            this.time = 0;
            this.btntxt = "获取验证码";
            this.disabled = false;
        }
    },
    refreshCode () {
      this.registerForm.code = ''
      this.registerForm.randomStr = randomLenNum(this.code.len, true)
      this.code.type === 'text'
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}?randomStr=${this.registerForm.randomStr}`)
    },
    //关闭协议
    tapClose(){
      this.dialogVisible = false
      this.isCheck = true
      if(this.isSubmit){
        //如果已经提交进入下一步注册页面
        this.$emit('changeStep', 2, this.registerForm)
      }
    },
    handleSubmit () {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          const self = this;
          if(!this.checked){
            this.$message('请阅读并勾选协议');
            return
          }
          this.registerForm.userType = 3
          this.registerForm.siteId = this.siteId
          // 效验验证码
          console.log(this.registerForm,'提交')
          this.formload = true
          regApi.ckeckImgCode({code: this.registerForm.code, randomStr: this.registerForm.randomStr}).then(res => {
            regApi.verificationCode({verificationCode: this.registerForm.sendcode}).then(res => {
                if(!this.isCheck){
                  this.dialogVisible = true
                }
                this.isSubmit = true
                if(this.isCheck){
                  //如果已经查看过协议就直接进入下一步，否则停留在此页面
                  this.$emit('changeStep', 2,this.registerForm)
                }
                this.formload = false
            }).catch(error => {
              this.formload = false
            })
          }).catch(error => {
            this.formload = false
            this.refreshCode()
          })
        }
      });
    },
    //去登录
    toLogin () {
      // this.$emit('changeStep', 2)
      this.$router.go(-1)
    },
    //获取协议内容
    getProtocol() {
      regApi.getProtocol(1,this.siteId).then(res => {
        this.protocol = res.data.data
      })
    }
  }
};
</script>

<style>
</style>
