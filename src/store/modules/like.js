/*
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-10-18 15:43:57
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-21 15:56:57
 * @FilePath: \vue-blog\src\store\modules\like.js
 * @Description: Vuex 点赞模块，管理用户文章点赞状态（本地存储+接口同步）
 */
// 导入store.js库（封装localStorage，处理本地存储）
import store from 'store'
// 导入基础配置（包含点赞列表本地存储的key）
import base from '@/config/base.config'
// 导入Vue核心库（用于调用全局封装的API）
import Vue from 'vue'

// 从基础配置中解构点赞列表的本地存储名称
const { LIKES_NAME } = base

export default {  
  namespaced: true,
  state: {
    // 优先从本地存储获取点赞列表，无则初始化为空数组
    likes: store.get(LIKES_NAME) || []    
  },
  // 模块内的计算属性（加工state数据，供组件使用）
  getters: {
    /**
     * 判断指定文章是否被当前用户点赞
     * @param {Object} state - 模块内状态
     * @param {String/Number} aid - 文章ID
     * @returns {Boolean} - 点赞返回true，未点赞返回false
     */
    isLike: state => (aid) => {
      // 检查文章ID是否在点赞列表中，转换为布尔值返回
      return !!(state.likes.includes(aid))
    }
  },
  // 同步修改状态的方法（仅能在本模块内通过commit调用）
  mutations: {
    /**
     * 更新state中的点赞列表（从本地存储同步）
     * @param {Object} state - 模块内状态
     */
    CHANGE_LIKES (state) {
      state.likes = store.get(LIKES_NAME)
    }
  },
  // 异步/复杂逻辑处理方法（可调用mutation、接口请求等）
  actions: {
    /**
     * 提交点赞（添加文章ID到点赞列表）
     * @param {Object} context - 模块上下文（包含commit方法）
     * @param {Object} payload - 入参对象，包含aid（文章ID）
     */
    pushLike ({ commit }, payload) {    
      // 解构获取文章ID
      let { aid } = payload   
      // 校验文章ID是否有效
      if (aid) {
        // 从本地存储获取当前点赞列表，无则初始化为空数组
        let localLikes = store.get(LIKES_NAME) || []
        // 查找文章ID在列表中的索引
        let idx = localLikes.indexOf(aid)
        // 若未点赞（索引为-1），则添加到列表
        if (idx === -1) {
          localLikes.push(aid)
        }
        // 更新本地存储的点赞列表
        store.set(LIKES_NAME, localLikes)
        // 提交mutation，同步更新state中的点赞列表
        commit('CHANGE_LIKES')      
      }
    },
    /**
     * 取消点赞（从点赞列表移除文章ID）
     * @param {Object} context - 模块上下文
     * @param {Object} payload - 入参对象，包含aid（文章ID）
     */
    pullLike ({ commit }, payload) {    
      let { aid } = payload   
      if (aid) {
        let localLikes = store.get(LIKES_NAME) || []
        let idx = localLikes.indexOf(aid)
        // 若已点赞（索引不为-1），则从列表移除
        if (idx !== -1) {
          localLikes.splice(idx, 1)
        }
        // 更新本地存储
        store.set(LIKES_NAME, localLikes)
        // 同步更新state
        commit('CHANGE_LIKES')    
      }
    },
    /**
     * 发送点赞/取消点赞请求到后端（同步服务端状态）
     * @param {Object} context - 模块上下文（包含根状态rootState）
     * @param {Object} params - 入参，包含aid（文章ID）
     * @returns {Promise} - 返回接口请求Promise
     */
    async sendLikes ({ rootState }, { aid }) {    
      // 从根状态获取当前用户ID（跨模块获取状态）
      const uid = rootState.uid
      // 调用全局封装的API，发送点赞请求（携带文章ID和用户ID）
      return Vue.prototype.$api({ 
        type: 'articleLikes', 
        data: { 
          aid,
          uid
        }
      })
    }
  },
}