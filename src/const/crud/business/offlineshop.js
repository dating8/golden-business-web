import {isvalidatemobile} from "@/util/validate";
var validPhone=(rule, value,callback)=>{
    if (!value){
        callback(new Error('请输入电话号'))
    }else  if (!isvalidatemobile(value)){
      callback(new Error('请输入正确的11位手机号码'))
    }else {
        callback()
    }
}
export const applyRules = {
	shopName: [
	  { required: true, message: "请输入品牌名称", trigger: "blur" }
	],
	telephone: [
	  { required: true, trigger: "blur", validator: validPhone }
	],
	mobile: [
	  { required: true, trigger: "blur", validator: validPhone }
	],
	seqNo: [
	  { required: true, message: "请输入排序", trigger: "blur" }
	],
  enable: [
    { required: true, message: '是否启用', trigger: 'change' }
  ],
  defultAddress:[
    {required: true, trigger: 'change'}
  ]
}
