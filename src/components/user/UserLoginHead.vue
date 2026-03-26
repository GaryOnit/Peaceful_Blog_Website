<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-26 18:12:32
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-26 21:25:02
 * @FilePath: \vue-blog\src\components\user\UserLoginHead.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="blog-header--login">
    <span @click="goLogin">登录</span>/ <span @click="goRegister">注册</span>
  </div>
</template>

<script>
export default {
  name: 'UserLoginHead',
  methods: {
    goLogin() {
      this.$router.push({
        path: '/auth',
        query: { redirect: this.$route.fullPath }
      })
    },
    goRegister() {
      this.$router.push({
        path: '/auth',
        query: { redirect: this.$route.fullPath, tab: 'register' }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>