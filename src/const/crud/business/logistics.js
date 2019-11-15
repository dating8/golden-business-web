export const applyRules = {
	templateName: [
	  { required: true, message: "模版名称", trigger: "blur" }
	],
	feeCalcType: [
	  { required: true, message: '', trigger: 'change' }
	],
  enable: [
    { required: true, message: '', trigger: 'change' }
  ],
  defaultSet: [
    { required: true, message: '', trigger: 'change' }
  ],
  hasInsurance: [
    { required: true, message: '', trigger: 'change' }
  ],
	firstWeight: [
	  { required: true, message: '重量不能为空', trigger: "blur" }
	],
  // firstWeightFee: [
  //   { required: true, message: '', trigger: "blur" }
  // ],
  // additionalWeight: [
  //   { required: true, message: '', trigger: "blur" }
  // ],
  // additionalWeightFee: [
  //   { required: true, message: '', trigger: "blur" }
  // ]
}
export const applyForm = {
  enable:'1',//是否启用
  freeDelivery:'1',//是否包邮
  feeCalcType:'W',//计价方式
  defaultSet:'1',//设置为默认模板
  hasInsurance:'0',//是否支持保价
}
export const FreightOption = [
  {
    label:'首重（kg）',
    label2:'首件',
    prop:'firstWeight',
    slot:true,
  },
  {
    label:'收费（元）',
    label2:'收费（元）',
    prop:'firstWeightFreight',
    slot:true,
  },
  {
    label:'续重（kg）',
    label2:'续件',
    prop:'addtionalWeight',
    slot:true,
  },
  {
    label:'续费（元）',
    label2:'续费（元）',
    prop:'addtionalWeightFreight',
    slot:true,
  }
]

export const addressOption = ['上海', '江苏', '浙江', '安徽','江西', '北京', '天津', '山西', '山东', '河北', '内蒙古自治区', '湖南', '湖北', '河南', '广东', '广西壮族自治区', '福建', '海南', '辽宁', '吉林', '黑龙江', '陕西', '新疆维吾尔自治区', '甘肃', '宁夏回族自治区', '青海省', '重庆', '云南', '贵州', '西藏自治区', '四川', '香港特别行政区', '澳门特别行政区', '台湾']
