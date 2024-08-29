import layout from '@/layout'
export default {
  // 路由信息
  path: '/department',
  name: 'department',
  component: layout, // 一级路由
  children: [{
    path: '', // 二级路由地址为空时 表示 /department 显示一级路由 + 二级路由
    component: () => import('@/views/department'),
    meta: {
      // 路由元信息 存储数据的
      icon: 'tree', // 图标
      title: '组织' // 标题
    }
  }]
}
