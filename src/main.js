/*
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-21 16:21:16
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-21 14:51:16
 * @FilePath: \vue-blog\src\main.js
 * @Description: 项目入口文件，负责创建Vue根实例、全局配置、插件注册等核心初始化逻辑
 */

// 1. 导入Vue核心库（所有Vue项目的基础）
import Vue from 'vue'
// 2. 导入根组件（App.vue，项目的最外层组件）
import App from './App.vue'
// 3. 导入Vue Router实例（已在router/index.js中完成插件注册和路由规则配置）
import router from './router'
// 4. 导入Vuex仓库实例（已在store/index.js中完成插件注册和状态配置）
import store from './store'
// 5. 导入lodash工具库（全局挂载，方便所有组件使用）
import _ from 'lodash'

import '@/plugins/vant'        // 导入并注册Vant UI组件库
import '@/plugins/element'     // 导入并注册Element UI组件库
import '@/plugins/http'        // 导入并注册封装的HTTP请求工具（如axios）
import '@/plugins/vuescroll'   // 导入并注册自定义滚动插件
import '@/plugins/animate'     // 导入并注册动画相关插件

import 'element-ui/lib/theme-chalk/index.css';  // Element UI的核心样式（必须单独引入）
import '@/assets/css/global.styl'               // 项目自定义的全局样式（如通用样式、重置样式）
import 'element-ui/lib/theme-chalk/display.css';// Element UI的布局相关样式（如隐藏/显示类）

Vue.config.productionTip = false  // 关闭Vue的生产环境提示（减少控制台冗余信息）
Vue.prototype._ = _               // 把lodash挂载到Vue原型上，所有组件可通过this._使用
Vue.prototype.$EventBus = new Vue() // 全局挂载事件总线，用于非父子组件通信

new Vue({
  router,          
  store,           
  render: h => h(App) 
}).$mount('#app')  