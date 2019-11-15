var checkPhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('手机号不能为空'));
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的手机号'));
    }
  }
};
var checkCardnum = (rule, value, callback) => {
  setTimeout(() => {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(!reg.test(value)){
      callback(new Error('身份证输入不合法'));
    }else{
      callback();
    }
  }, 1000);
};
export const registerRules = {
	companyContact: [
	    { required: true, message: '请输入公司联系人', trigger: 'blur' },
	],
	companyContactPhone: [
		{ required: true, validator: checkPhone, trigger: 'blur' }
	],
	companyContactQq: [
		{ required: true, message: '公司联系人微信/QQ号', trigger: 'change' }
	],

  companyName: [
  	{ required: true, message: '请选择公司名称', trigger: 'blur' }
  ],
  companyRegisteredCapital: [
      { required: true, message: '请输入注册资本', trigger: 'blur' },
  ],
  companyLegalPersonName: [
  	{ required: true, message: '请输入法人姓名', trigger: 'blur' }
  ],
  companyLegalPersonIdcard: [
  	{ required: true, message: '请输入法人身份证号码', trigger: 'blur' },
    { validator: checkCardnum, trigger: 'blur' }
  ],
  companyBusinessLicenceCopy:[
    { required: true, message: '请营业执照副本' }
  ],
  companyLegalPersonIdcardPic1:[
    { required: true, message: '请上传法人身份证正面照' }
  ],
  companyLegalPersonIdcardPic2:[
    { required: true, message: '请上传法人身份证反面照' }
  ],

  bankName: [
  	{ required: true, message: '请输入开户银行名', trigger: 'blur' }
  ],
  bankAccountName: [
  	{ required: true, message: '请输入银行开户行', trigger: 'blur' }
  ],
  bankAccountNumber: [
  	{ required: true, message: '请输入银行开户账号', trigger: 'blur' }
  ],
  bankAddress: [
  	{ required: true, message: '请输入开户行银行所在地', trigger: 'blur' }
  ]
}
export const registerForm = {
  companyContact:'',//公司联系人
  companyContactPhone:'',//公司联系人手机
  companyContactQq :'',//公司联系人微信/QQ号
  companyContactEmail:'',//公司联系人email

  companyName:'',//公司名称
  companyRegisteredCapital:'',//注册资本
  companyLegalPersonName:'',//法人性名
  companyLegalPersonIdcard:'',//法人身份证号码
  companyBusinessLicenceCopy:'',//营业执照副本
  companyOfficialWebsite:'',//公司官网
  companyBusinessAddress:'',//营业执照地址
  companyFormationDate:'',//成立时间
  companyBusinessTerm:'',//营业期限
  companyLegalPersonIdcardPic1:'',//法人身份证正面照
  companyLegalPersonIdcardPic2:'',//法人身份证反面照

  bankName:'',//开户银行名
  bankAccountName:'',//银行开户行
  bankAccountNumber:'',//银行开户账号
  bankAddress:'',//开户行银行所在地
}
