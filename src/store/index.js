/*
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-26 15:48:53
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-21 14:43:19
 * @FilePath: \vue-blog\src\store\index.js
 * @Description: Vuex 核心仓库，管理全局状态（用户认证、Live2D显示、WebSocket连接等）
 */
// 导入Vue核心库
import Vue from 'vue'
// 导入Vuex状态管理库
import Vuex from 'vuex'
// 导入store.js库（用于本地存储，比原生localStorage更友好）
import store from 'store'
// 导入基础配置文件（包含TOKEN_NAME等常量）
import base from '@/config/base.config'
// 导入封装的HTTP请求工具
import http from '@/api/http'
// 导入socket.io客户端，用于WebSocket通信
import { io } from 'socket.io-client'
// 导入路由实例，用于路由跳转
import router from '../router'

// 导入模块化的Vuex模块：模态框管理、点赞管理
import modal from './modules/modal'
import like from './modules/like'

// 安装Vuex插件
Vue.use(Vuex)

// 从基础配置中解构TOKEN名称（用于本地存储的key）
const { TOKEN_NAME } = base
// 标记是否为主动退出登录（用于区分主动退出/异地登录）
let actMe = false

// 创建并导出Vuex仓库实例
export default new Vuex.Store({
  // 全局状态
  state: {
    token: store.get(TOKEN_NAME) || "",       // 用户令牌：优先从本地存储获取，无则为空
    userInfo: {},                             // 用户信息对象（包含昵称、ID等）
    uid: store.get('uid') || "",              // 用户ID：优先从本地存储获取，无则为空
    live2dDis: false                          // Live2D模型显示状态：false隐藏/true显示
  },
  // 计算属性（类似组件的computed，用于加工state数据）
  getters: {
    userInfo (state) {
      if (state.token) {
        return state.userInfo
      }
      return {}
    }
  },
  // 同步修改状态的方法（必须同步执行，不能写异步代码）
  mutations: { 
    /**
     * 显示Live2D模型
     * @param {Object} state - 仓库状态
     */
    RIGHT_LIVE2D_DIS (state) {
      state.live2dDis = true
    },
    /**
     * 隐藏Live2D模型
     * @param {Object} state - 仓库状态
     */
    LEFT_LIVE2D_DIS (state) {
      state.live2dDis = false
    },
    /**
     * 设置token到state（从本地存储同步）
     * @param {Object} state - 仓库状态
     */
    SET_TOKEN (state) {
      state.token = store.get(TOKEN_NAME)
    },
    /**
     * 清除token（清空state + 删除本地存储）
     * @param {Object} state - 仓库状态
     */
    CANCEL_TOKEN (state) {
      state.token = ""
      store.remove(TOKEN_NAME)
    },
    /**
     * 清除uid（清空state + 删除本地存储）
     * @param {Object} state - 仓库状态
     */
    CANCEL_UID (state) {
      state.uid = ""
      store.remove('uid')
    },
    /**
     * 设置用户信息到state
     * @param {Object} state - 仓库状态
     * @param {Object} userInfo - 接口返回的用户信息
     */
    SET_USERINFO (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  // 异步操作方法（可执行异步代码，最终通过mutation修改state）
  actions: { 
    /**
     * 登录操作
     * @param {Object} context - 仓库上下文（包含commit/dispatch等方法）
     */
    async login ({ dispatch, commit }) {
      // 触发设置token的mutation
      commit('SET_TOKEN')
      // 触发获取用户信息的action
      dispatch('getUserInfo')
    },
    /**
     * 退出登录操作
     * @param {Object} context - 仓库上下文
     */
    async logout ({ dispatch, commit }) {
      // 标记为主动退出
      actMe = true
      // 关闭WebSocket连接（如果存在）
      Vue.prototype.$ws?.close()
      // 清除token和uid
      commit('CANCEL_TOKEN')
      commit('CANCEL_UID')
    },
    /**
     * 建立WebSocket连接（用户上线）
     * @param {Object} context - 仓库上下文
     */
    async online ({ commit, getters }) {
      // 创建WebSocket连接：连接到聊天服务地址，指定传输方式为websocket
      Vue.prototype.$ws = io(process.env.VUE_APP_USER_CHAT_PATH, { transports: ['websocket'] })
      // 从getters获取用户ID和昵称
      let { _id, nickname } = getters.userInfo

      // 向服务端发送"online"事件，告知用户上线（携带用户ID和昵称）
      Vue.prototype.$ws.emit('online', { uid: _id, nickname })
      
      // 监听WebSocket断开连接事件
      Vue.prototype.$ws.on('disconnect', () => {
        // 清空全局WebSocket实例
        Vue.prototype.$ws = null
        // 默认提示语：主动退出
        let message = `再见 ${nickname}`

        // 非主动退出（异地登录），修改提示语
        if (!actMe) {
          message = `账号已在其他设备登录`
        }
        // 显示退出登录提示
        Vue.prototype.$notify.success({
          title: '退出登录',
          message
        })
        
        // 重置主动退出标记
        actMe = false
        
        // 如果当前不在首页，跳转到首页
        if (router.app._route.name !== 'index') {
          router.push('/index')
        }
        // 清除token（触发登出逻辑）
        commit('CANCEL_TOKEN')
      })
    },
    /**
     * 获取用户信息（登录后调用）
     * @param {Object} context - 仓库上下文
     */
    async getUserInfo ({ dispatch, commit }) {
      try {
        // 调用HTTP接口获取用户信息
        let userInfo = await http({ type: 'getUserInfo' })
        // 将用户信息存入state
        commit('SET_USERINFO', userInfo)
        // 显示登录成功提示
        Vue.prototype.$notify.success({
          title: '登录成功',
          message: `欢迎您 ${userInfo.nickname}`
        })
        // 触发建立WebSocket连接的action（用户上线）
        dispatch('online')
      } catch (err) {
        // 捕获接口请求错误并打印
        console.log(err)
      }
    }
  },
  // 模块化拆分：将modal/like的状态管理分离，降低耦合
  modules: {
    modal,  // 模态框状态管理模块
    like    // 点赞状态管理模块
  }
})