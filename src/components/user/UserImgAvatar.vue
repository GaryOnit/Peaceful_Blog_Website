<template>
  <div class="blog-user--wrap"
       @mouseenter="menuOpen = true"
       @mouseleave="menuOpen = false">
    <el-image class="blog-avatar-img"
              :src="src"
              fit="cover"></el-image>
    <i class="el-icon-caret-bottom blog-avatar--caret"></i>

    <transition name="dropdown">
      <div v-show="menuOpen"
           class="blog-user--dropdown">
        <div class="blog-dropdown--name">{{ userInfo.nickname }}</div>
        <div class="blog-dropdown--divider"></div>
        <div class="blog-dropdown--item" @click.stop="">
          <span>大模型助力</span>
        </div>
        <div class="blog-dropdown--item" @click.stop="">
          <span>友情链接</span>
        </div>
        <div class="blog-dropdown--item" @click.stop="handleLogout">
          <span>退出登录</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "UserImgAvatar",
  data() {
    return {
      menuOpen: false
    };
  },
  computed: {
    src() {
      return this.userInfo?.avatar || "";
    },
    ...mapGetters(["userInfo"]),
  },
  methods: {
    handleLogout() {
      this.menuOpen = false;
      this.logout();
    },
    ...mapActions(["logout"]),
  },
};
</script>

<style lang="stylus">
warm-text      = #3D2B1F
warm-secondary = #8C7B6B
warm-active    = #A0785A
warm-border    = #E8E0D5
warm-cream     = #FBF7F2

.blog-user--wrap
  position relative
  display inline-flex
  align-items center
  gap 5px
  cursor pointer

.blog-avatar-img
  width 34px
  height 34px
  border-radius 50%
  border 2px solid warm-border
  box-shadow 0 0 0 1.5px warm-active
  flex-shrink 0
  transition transform 0.2s

.blog-user--wrap:hover .blog-avatar-img
  transform scale(1.05)

.blog-avatar--caret
  font-size 12px
  color warm-secondary
  transition color 0.2s, transform 0.2s

.blog-user--wrap:hover .blog-avatar--caret
  color warm-active
  transform rotate(180deg)

.blog-user--dropdown
  position absolute
  top calc(100% + 6px)
  right 0
  min-width 148px
  background-color warm-cream
  border 1px solid warm-border
  border-radius 10px
  box-shadow 0 8px 28px rgba(60, 40, 20, 0.13), 0 2px 8px rgba(60, 40, 20, 0.07)
  overflow hidden
  z-index 200
  &::before
    content ''
    position absolute
    top -5px
    right 14px
    width 8px
    height 8px
    background-color warm-cream
    border-top 1px solid warm-border
    border-left 1px solid warm-border
    transform rotate(45deg)

.blog-dropdown--name
  padding 10px 16px 8px
  font-size 12px
  color warm-secondary
  letter-spacing 0.04em
  white-space nowrap

.blog-dropdown--divider
  height 1px
  background-color warm-border
  margin 0 10px

.blog-dropdown--item
  display flex
  align-items center
  gap 8px
  padding 9px 16px
  font-size 13px
  color warm-text
  cursor pointer
  transition background-color 0.18s, color 0.18s
  span
    color inherit
  &:hover
    background-color warm-active
    color #fff

.dropdown-enter-active, .dropdown-leave-active
  transition opacity 0.18s ease, transform 0.18s ease

.dropdown-enter, .dropdown-leave-to
  opacity 0
  transform translateY(-6px)
</style>
