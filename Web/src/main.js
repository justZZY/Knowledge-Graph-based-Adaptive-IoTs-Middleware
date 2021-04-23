// eslint-disable-next-line no-unused-vars
import $ from 'jquery'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vueParticles from 'vue-particles'
import Vcomp from './components/index'
import Toast from './components/toast'
import VueAxios from 'vue-axios'
import axios from 'axios'
import dataV from '@jiaminghi/data-view'
import echarts from 'echarts'
import {get,post} from "@/api/request";
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/styles/base.scss'
import '@/assets/styles/common.scss'
import '@/assets/iconfont/iconfont.css'
import '@/assets/scss/style.scss'
// 引入vue-awesome
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/index.js'
import qs from "qs"
// 引入视频播放器
import VueVideoPlayer from 'vue-video-player';
import 'video.js/dist/video-js.css';

Vue.use(vueParticles)
Vue.use(Vcomp)
Vue.use(VueAxios, axios)
Vue.use(dataV)
Vue.use(echarts)
Vue.use(ElementUI);
Vue.use(VueVideoPlayer)

Vue.component('icon', Icon)

Vue.config.productionTip = false
Vue.prototype.$Toast = Toast
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$qs = qs


router.beforeEach((to, from, next) => {
	if (to.meta.title) {
		document.title = to.meta.title;
	}
	next();
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
