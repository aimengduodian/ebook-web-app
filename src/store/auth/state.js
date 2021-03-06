export default {
  // 权限控制 0.我要购买 1.我要发布
  flag: 0,
  // 个人用户信息
  user: {
    id: null,
    // 服务器用户的权限状态，0我要购买 1我要发布
    flag: null,
    // 是否为小卖部的店主(判断buildNumber是否为null)
    bossNumber: null,
    // 用户所在的寝楼
    buildingNum: null,
    // 用户所在的寝室
    buildingRoomNum: null,
    // 用户手机号
    userPhone: null,
    // 用户email
    email: null
  },
  // 图书电子辅导其他的页面信息，用于从详情页到编辑页面
  pageMsg: '',
  // 页眉布局信息, 页眉页脚是否显示
  layout: { header: true, footer: true },
  // 搜索参数
  searchParams: {}
}
