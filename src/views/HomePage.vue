<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-22 19:13:51
 * @LastEditors: Garyonit 3253975221@qq.com
 * @LastEditTime: 2025-11-09 16:29:25
 * @FilePath: \vue-blog\src\views\HomePage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="blog-page">
    <el-container class="blog-container">
      <el-header class="blog-header">
        <BaseHeaderVue />
      </el-header>
      <el-container class="blog-middle">
        <el-row class="blog-middle--wrap"
                type="flex"
                justify="flex-wrap"
                align="top">
          <el-col :span="6"
                  class="hidden-md-and-down blog-aside--col">
            <BaseAsideVue />
          </el-col>
          <el-col :span="24"
                  :lg="{span:18}">
            <el-main class="blog-main">
              <router-view v-if="isRouteLoading"
                           :loading="loading"></router-view>
            </el-main>
          </el-col>
          <el-col :span="2"
                  class="blog-circle-menu--col"
                  v-if="circleMenuList.length > 0">
            <BaseCircleMenuVue :circleMenuList="circleMenuList" />
          </el-col>
        </el-row>
      </el-container>
    </el-container>
    <BaseModalVue />
  </div>
</template>

<script>
import BaseModalVue from '@/components/base/BaseModal'
import BaseHeaderVue from '@/components/base/BaseHeader.vue'
import BaseAsideVue from '@/components/base/BaseAside.vue'
import BaseCircleMenuVue from '@/components/base/BaseCircleMenu'
import circleMenuConfig from '@/config/circleMenu.config'

export default {
  name: 'HomePage',
  data () {
    return {
      loading: false,
      circleMenuList: [],
      isRouteLoading: true
    }
  },
  components: {
    BaseModalVue, BaseHeaderVue, BaseAsideVue, BaseCircleMenuVue,
  },
  created () {
    this.circleMenuList = circleMenuConfig['index']?.() || []
  },
  provide () {
    return {
      'closeLoadClock': this.closeLoadClock
    }
  },
  watch: {
    $route (to) {
      this.circleMenuList = circleMenuConfig[to.name]?.() || []
      this.loading = true
      this.reload()
    }
  },
  methods: {
    closeLoadClock () {
      this.loading = false
    },
    reload () {
      this.isRouteLoading = false
      this.$nextTick(function () {
        this.isRouteLoading = true
      })
    }
  }
}
</script>

<style lang="stylus">
.blog-container
  min-height 100vh
.blog-header
  position sticky
  top 0
  z-index 100
  padding 0
.blog-middle
  padding 20px
  background-color #f1f1f1
  min-height calc(100vh - 64px)
.el-main.blog-main
  padding 0 20px
.blog-middle--wrap
  max-width 1440px
  margin 0 auto
  width 100%
.blog-aside--col
  position sticky
  top 80px
  align-self flex-start
.blog-circle-menu--col
  padding 0
  overflow visible
</style>
