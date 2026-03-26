/*
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-10-06 18:51:27
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-23 07:51:21
 * @FilePath: \vue-blog\src\store\modules\modal.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default{
  namespaced: true,
  state:{
    isShow: false,
    type: ''
  },
  mutations:{
    // 关闭
    CLOSE(state){
      state.isShow = false
    },
    // 开启
    OPEN(state){
      state.isShow = true
    },
    // 改变弹窗类型
    CHANGE_TYPE(state, payload){
      state.type = payload.type
    }
  },
  actions:{
    close({commit}){
      commit('CLOSE')
    },
    // 根据调用时传入的参数渲染对应的弹窗
    open({commit}, type){
      commit('CHANGE_TYPE', {type})
      commit('OPEN')
    }, 
  }
}