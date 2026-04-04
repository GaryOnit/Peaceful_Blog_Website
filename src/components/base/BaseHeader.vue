<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-28 16:07:25
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-04-04 16:44:33
 * @FilePath: \vue-blog\src\components\base\BaseHeader.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-row class="blog-header--wrap"
          :class="{ 'is-scrolled': isScrolled }"
          type="flex"
          justify="flex-wrap"
          align="center">
    <el-col :span="2"
            :offset="1"
            :xs="{span:24}"
            class="blog-logo--wrap">
      <div class="blog-head--logo">
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 100 100"
             class="blog-head--logo-svg">
          <path fill="#D97757"
                d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
        </svg>
      </div>
    </el-col>
    <el-col class="hidden-xs-only"
            :span="10"
            :offset="2">
      <nav class="blog-head--menu">
        <router-link class="blog-menu--item" to="/index">首页</router-link>
        <router-link class="blog-menu--item" to="/column">分类</router-link>
        <!-- <router-link class="blog-menu--item" to="/album">相册</router-link> -->
        <router-link class="blog-menu--item" to="/socket">聊天室</router-link>
        <router-link v-if="$store.state.userInfo.nickname"
                     class="blog-menu--item"
                     to="/user">个人信息</router-link>
      </nav>
    </el-col>
    <el-col :span="4"
            class="hidden-xs-only">
      <div class="blog-search--wrap">
        <i class="blog-search--icon el-icon-search"
           v-if="!searchOpen"
           @click="toggleSearch"></i>
        <div class="blog-search--box"
             :class="{ 'is-open': searchOpen }">
          <div class="blog-search--input-wrap">
            <input ref="searchInput"
                   v-model="searchVal"
                   class="blog-search--input"
                   placeholder="搜索文章"
                   @keyup.enter="activeSearch"
                   @keydown="handleSearchKeydown"
                   @blur="handleSearchBlur" />
            <i class="blog-search--close el-icon-close"
               @click="toggleSearch"></i>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="2"
            :offset="2"
            class="hidden-xs-only blog-login--col">
      <component :is="loginComponent"></component>
    </el-col>
  </el-row>
</template>

<script>
import UserImgAvatarVue from '@/components/user/UserImgAvatar'
import UserLoginHeadVue from '@/components/user/UserLoginHead'
import { mapGetters } from 'vuex'
export default {
  name: 'BaseHeader',
  components: {
    UserImgAvatarVue, UserLoginHeadVue
  },
  data () {
    return {
      searchVal: '',
      isScrolled: false,
      searchOpen: false,
      rafId: null
    }
  },
  created () {
    let isLogin = this.$store.state.token
    let nickname = this.userInfo?.nickname
    if (isLogin && !nickname) {
      this.$store.dispatch('getUserInfo', false)
    }
  },
  mounted () {
    this._onScroll = () => {
      if (this.rafId) return
      this.rafId = requestAnimationFrame(() => {
        this.isScrolled = window.scrollY > 60
        this.rafId = null
      })
    }
    window.addEventListener('scroll', this._onScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this._onScroll)
    if (this.rafId) cancelAnimationFrame(this.rafId)
  },
  watch: {
  },
  computed: {
    loginComponent () {
      return this.$store.state.token ? 'UserImgAvatarVue' : 'UserLoginHeadVue'
    },
    ...mapGetters(['userInfo'])
  },
  methods: {
    activeSearch () {
      this.$EventBus.$emit('activeSearch', this.searchVal)
      this.searchVal = ''
    },
    toggleSearch () {
      this.searchOpen = !this.searchOpen
      if (this.searchOpen) {
        this.$nextTick(() => this.$refs.searchInput.focus())
      }
    },
    handleSearchBlur () {
      setTimeout(() => { this.searchOpen = false }, 150)
    },
    handleSearchKeydown (e) {
      if (e.key === 'Escape') this.searchOpen = false
    }
  }
}
</script>

<style lang="stylus">
warm-bg = #FDFBF7
warm-border = #E8E0D5
warm-shadow = rgba(180, 160, 130, 0.08)
warm-text = #3D2B1F
warm-secondary = #8C7B6B
warm-active = #A0785A
warm-font = Georgia, 'Noto Serif SC', serif

.blog-header--wrap
  background-color warm-bg
  border-bottom 1px solid warm-border
  box-shadow 0 1px 4px warm-shadow
  height 64px
  transition height 0.25s ease, box-shadow 0.25s ease
  &.is-scrolled
    height 48px
    font-size 0.9em
    box-shadow 0 2px 8px warm-shadow

.blog-logo--wrap
  display flex
  align-items center
  height 100%

.blog-head--logo
  width 36px
  height 36px
  display flex
  align-items center
  justify-content center

.blog-head--logo-svg
  width 36px
  height 36px
  transition transform 0.3s ease
  &:hover
    transform rotate(20deg) scale(1.1)

.blog-head--menu
  display flex
  align-items center
  height 64px
  transition height 0.25s ease

.blog-menu--item
  display flex
  align-items center
  height 64px
  padding 0 16px
  color warm-secondary
  font-family warm-font
  text-decoration none
  border-bottom 2px solid transparent
  transition color 0.25s, border-bottom-color 0.25s, height 0.25s
  &:hover
    color warm-text
    border-bottom-color warm-active
  &.router-link-active
    color warm-text
    border-bottom-color warm-active

.blog-header--wrap.is-scrolled .blog-head--menu
  height 48px

.blog-header--wrap.is-scrolled .blog-menu--item
  height 48px

.blog-search--wrap
  display flex
  align-items center
  justify-content flex-end
  height 64px
  transition height 0.25s ease

.blog-header--wrap.is-scrolled .blog-search--wrap
  height 48px

.blog-search--icon
  font-size 18px
  color warm-secondary
  cursor pointer
  transition color 0.2s
  &:hover
    color warm-text

.blog-search--box
  max-width 0
  opacity 0
  overflow hidden
  transition max-width 0.3s ease, opacity 0.25s ease
  &.is-open
    max-width 240px
    opacity 1

.blog-search--input-wrap
  position relative
  display flex
  align-items center

.blog-search--input
  width 200px
  height 32px
  padding 0 32px 0 12px
  border 1px solid warm-border
  border-radius 16px
  background-color #fff
  color warm-text
  font-size 13px
  outline none
  transition border-color 0.2s
  &::placeholder
    color warm-secondary
  &:focus
    border-color warm-active

.blog-search--close
  position absolute
  right 10px
  top 50%
  transform translateY(-50%)
  font-size 14px
  color warm-secondary
  cursor pointer
  transition color 0.2s
  &:hover
    color warm-text

.blog-header--login
  display flex
  align-items center
  color warm-secondary
  font-family warm-font
  & span
    cursor pointer
    transition color 0.2s
    &:hover
      color warm-active

.blog-login--col
  display flex
  align-items center
  height 64px
  transition height 0.25s ease

.blog-header--wrap.is-scrolled .blog-login--col
  height 48px
</style>
