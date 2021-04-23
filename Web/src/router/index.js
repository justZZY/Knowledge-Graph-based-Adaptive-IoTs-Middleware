import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录界面'
    }
  },
  {
    path: '/login',
    redirect: '/'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '酷屏首页统计图'
    }
  },
  {
    path: '/brand',
    name: 'brand',
    component: () => import('@/views/brand/index.vue'),
    meta: {
      title: '公司品牌介绍'
    }
  },
  {
    path: '/datav',
    name: 'datav',
    component: () => import('@/views/datav/index.vue'),
    meta: {
      title: 'Middleware Access'
    }
  },
  {
    path: '/dataentry',
    name: 'dataentry',
    component: () => import('@/views/MetalDataEntry/index.vue'),
    meta: {
      title: '合金表单录入'
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
