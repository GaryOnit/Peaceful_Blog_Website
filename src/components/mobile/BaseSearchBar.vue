<template>
  <div class="blog-m-searchbar">
    <!-- 默认头部：Logo + 搜索图标 + 菜单图标 -->
    <div class="blog-m-searchbar__bar">
      <span class="blog-m-searchbar__logo">博客</span>
      <div class="blog-m-searchbar__actions">
        <van-icon
          name="search"
          class="blog-m-searchbar__icon"
          @click="openSearch"
        />
        <van-icon
          name="wap-nav"
          class="blog-m-searchbar__icon"
          @click="toggleMenu"
        />
      </div>
    </div>

    <!-- 搜索输入框（展开态，覆盖头部） -->
    <transition name="blog-m-search-slide">
      <div v-show="showInput" class="blog-m-searchbar__input-wrap">
        <van-search
          ref="searchInput"
          v-model="value"
          shape="round"
          show-action
          placeholder="请输入搜索关键词"
          @search="onSearch"
        >
          <template #action>
            <span @click="onSearch">搜索</span>
          </template>
        </van-search>
        <van-icon name="cross" class="blog-m-searchbar__close" @click="closeSearch" />
      </div>
    </transition>

    <!-- 全宽下拉菜单 -->
    <transition name="blog-m-menu-slide">
      <div v-show="showMenu" class="blog-m-menu">
        <template v-if="isLoggedIn">
          <div class="blog-m-menu__user">
            <span class="blog-m-menu__avatar">{{ avatarLetter }}</span>
            <span class="blog-m-menu__nickname">{{ userInfo.nickname }}</span>
          </div>
          <div class="blog-m-menu__divider"></div>
          <div class="blog-m-menu__item" @click="goUserPage">个人信息</div>
          <div class="blog-m-menu__item blog-m-menu__item--danger" @click="handleLogout">退出登录</div>
        </template>
        <template v-else>
          <div class="blog-m-menu__item" @click="goLogin">登录</div>
          <div class="blog-m-menu__item" @click="goRegister">注册</div>
        </template>
      </div>
    </transition>

    <!-- 蒙版 -->
    <transition name="blog-m-mask-fade">
      <div v-show="showMenu" class="blog-m-mask" @click="closeMenu"></div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BaseSearchBar',
  data () {
    return {
      value: '',
      showInput: false,
      showMenu: false
    }
  },
  computed: {
    isLoggedIn () {
      return !!this.$store.getters.userInfo?.nickname
    },
    userInfo () {
      return this.$store.getters.userInfo || {}
    },
    avatarLetter () {
      return this.userInfo.nickname?.[0]?.toUpperCase() || '?'
    }
  },
  methods: {
    openSearch () {
      this.showInput = true
      this.$nextTick(() => {
        this.$refs.searchInput?.focus()
      })
    },
    closeSearch () {
      this.showInput = false
      this.value = ''
    },
    onSearch () {
      this.$EventBus.$emit('search-article', this.value)
      this.value = ''
      this.showInput = false
    },
    toggleMenu () {
      this.showMenu = !this.showMenu
    },
    closeMenu () {
      this.showMenu = false
    },
    goLogin () {
      this.closeMenu()
      this.$router.push({ name: 'mUser', query: { userFormType: 'login' } })
    },
    goRegister () {
      this.closeMenu()
      this.$router.push({ name: 'mUser', query: { userFormType: 'register' } })
    },
    goUserPage () {
      this.closeMenu()
      this.$router.push({ name: 'mUser' })
    },
    handleLogout () {
      this.closeMenu()
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style lang="stylus">
warm-bg       = #FDFBF7
warm-text     = #3D2B1F
warm-active   = #A0785A
warm-border   = #E8E0D5
warm-hover    = #F0E8DF
warm-secondary = #8C7B6B

.blog-m-searchbar
  position relative
  z-index 100

// ── 默认头部栏
.blog-m-searchbar__bar
  display flex
  align-items center
  justify-content space-between
  height 50px
  padding 0 16px
  background warm-bg
  border-bottom 1px solid warm-border

.blog-m-searchbar__logo
  font-family Georgia, 'Noto Serif SC', serif
  font-size 18px
  font-weight 700
  color warm-text
  letter-spacing 0.06em

.blog-m-searchbar__actions
  display flex
  align-items center
  gap 16px

.blog-m-searchbar__icon
  font-size 22px
  color warm-active
  cursor pointer

// ── 搜索输入框展开层
.blog-m-searchbar__input-wrap
  position absolute
  top 0
  left 0
  right 0
  display flex
  align-items center
  background warm-bg
  z-index 101
  padding-right 8px
  border-bottom 1px solid warm-border

  .van-search
    flex 1

.blog-m-searchbar__close
  font-size 20px
  color warm-secondary
  padding 0 8px
  cursor pointer

// ── 搜索展开动画
.blog-m-search-slide-enter-active,
.blog-m-search-slide-leave-active
  transition opacity 0.2s ease, transform 0.2s ease

.blog-m-search-slide-enter,
.blog-m-search-slide-leave-to
  opacity 0
  transform translateY(-6px)

// ── 全宽下拉菜单
.blog-m-menu
  position fixed
  top 50px
  left 0
  width 100%
  background warm-bg
  border-bottom 1px solid warm-border
  z-index 200
  box-shadow 0 4px 16px rgba(61, 43, 31, 0.1)

.blog-m-menu__user
  display flex
  align-items center
  gap 12px
  padding 16px
  background warm-hover

.blog-m-menu__avatar
  width 36px
  height 36px
  border-radius 50%
  background warm-active
  color #fff
  font-size 15px
  font-weight 700
  display flex
  align-items center
  justify-content center
  flex-shrink 0

.blog-m-menu__nickname
  font-size 15px
  color warm-text
  font-weight 600

.blog-m-menu__divider
  height 1px
  background warm-border

.blog-m-menu__item
  padding 16px
  font-size 15px
  color warm-text
  cursor pointer
  transition background-color 0.15s ease
  &:active
    background-color warm-hover

.blog-m-menu__item--danger
  color #C0392B

// ── 菜单展开动画
.blog-m-menu-slide-enter-active,
.blog-m-menu-slide-leave-active
  transition opacity 0.25s ease, transform 0.25s ease

.blog-m-menu-slide-enter,
.blog-m-menu-slide-leave-to
  opacity 0
  transform translateY(-8px)

// ── 蒙版
.blog-m-mask
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  background rgba(0, 0, 0, 0.3)
  z-index 199

.blog-m-mask-fade-enter-active,
.blog-m-mask-fade-leave-active
  transition opacity 0.25s ease

.blog-m-mask-fade-enter,
.blog-m-mask-fade-leave-to
  opacity 0
</style>
