export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    title: '用户登录',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { title: '登录', path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    title: '功能菜单集合',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      { title: '主数据注册', path: '/masterDataRegister', component: './MasterDataRegister' },
      { title: '数据模型UI管理', path: '/dataModelUiConfig', component: './DataModelUiConfig' },
      { title: '主数据维护', path: '/masterDataMaintain', component: './MasterDataMaintain' },
      { title: '主数据分享', path: '/dataShare', component: './DataShare' },
      { title: '主数据分享关系图', path: '/dataSharedDiagram', component: './DataSharedDiagram' },
      { title: '数据字典', path: '/dataDict', component: './PageWidget/DataDict' },
      {
        path: '/language',
        title: '语言类型',
        component: './Language',
      },
      {
        path: '/semanteme',
        title: '译文',
        component: './Semanteme',
      },
      {
        path: '/demo',
        title: '树表测试',
        component: './demo',
      },
      {
        path: '/ledgerAccount',
        title: '总账科目',
        component: './PageWidget/LedgerAccount',
      },
      {
        path: '/supplier',
        title: '供应商',
        component: './PageWidget/Supplier',
      },
      {
        path: '/customer',
        title: '客户',
        component: './PageWidget/Customer',
      },
      {
        path: '/personnel',
        title: '公司员工',
        component: './PageWidget/Personnel',
      },
      {
        path: '/wbsProject',
        title: 'wbs项目',
        component: './PageWidget/WBSProject',
      },
      {
        path: '/corpPaymentBankAccount',
        title: '公司付款帐号',
        component: './PageWidget/CorpPaymentBankAccount',
      },
      {
        path: '/corporationProject',
        title: '公司项目',
        component: './PageWidget/CorpProject',
      },
      {
        path: '/innerOrder',
        title: '内部订单',
        component: './PageWidget/InnerOrder',
      },
      {
        path: '/profitCenter',
        title: '利润中心',
        component: './PageWidget/ProfitCenter',
      },
      {
        path: '/imprestEmployee',
        title: '备用金员工',
        component: './PageWidget/ImprestEmployee',
      },
      {
        path: '/tableDesigner',
        title: '利润中心',
        component: './Designer',
      },
    ],
  },
];
