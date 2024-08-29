import layout from '@/layout'
export default {
  path: '/employee',
  name: 'employee',
  component: layout,
  children: [{
    path: '',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  },
  {
    path:'/employee/detail/:id?',
    component:()=>import('@/views/employee/detail/'),
    meta:{
      title:'员工详情',
    },
    hidden:true
  }
]
}
