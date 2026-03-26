<template>
  <div class="blog-login">
    <div class="blog-login__container">
      
      <div class="blog-login__left">
        <div class="blog-login__back" @click="$router.back()">
          <i class="el-icon-arrow-left"></i>
          <span>返回</span>
        </div>

        <div class="blog-login__content">
          <div class="blog-login__brand">
            <h1 class="blog-login__title">个人博客</h1>
            <p class="blog-login__slogan">分享技术，记录生活</p>
          </div>

          <div class="blog-login__tabs">
            <div 
              class="blog-login__tab-item" 
              :class="{ 'blog-login__tab-item--active': isLogin }" 
              @click="isLogin = true">登录</div>
            <div 
              class="blog-login__tab-item" 
              :class="{ 'blog-login__tab-item--active': !isLogin }" 
              @click="isLogin = false">注册</div>
          </div>

          <el-form :model="form" ref="loginForm" class="blog-login__form">
            <el-form-item>
              <el-input
                v-model="form.username"
                placeholder="用户名"
                prefix-icon="el-icon-user">
              </el-input>
            </el-form-item>

            <transition name="slide-fade">
              <el-form-item v-if="!isLogin" key="email">
                <el-input
                  v-model="form.email"
                  placeholder="邮箱地址"
                  prefix-icon="el-icon-message">
                </el-input>
              </el-form-item>
            </transition>

            <el-form-item>
              <el-input
                v-model="form.password"
                type="password"
                placeholder="密码"
                prefix-icon="el-icon-lock"
                show-password>
              </el-input>
            </el-form-item>

            <el-button type="primary" class="blog-login__submit-btn" @click="handleAction">
              {{ isLogin ? '登 录' : '注 册' }}
            </el-button>
          </el-form>
        </div>
      </div>

      <div class="blog-login__right">
        <img src="@/assets/img/login_cover.webp" class="blog-login__cover-img" alt="cover">
        <div class="blog-login__cover-overlay"></div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      isLogin: true,
      form: {
        username: '',
        password: '',
        email: ''
      }
    };
  },
  created() {
    if (this.$route.query.tab === 'register') {
      this.isLogin = false
    }
  },
  methods: {
    handleAction() {
      // 这里的字段映射可参考你的 QUE_MAP.js
      console.log('提交数据:', this.form);
    }
  }
};
</script>

<style lang="stylus" scoped>
// 颜色变量
warm-bg = #FDFBF7
warm-brown = #A0785A        // 品牌主色
warm-brown-hover = #8a6649  // 悬停深色
warm-deep = #3D2B1F         // 深棕色（用于厚实蒙版）
text-deep = #3D2B1F
text-light = #8C7B6B

.blog-login
  width 100vw
  height 100vh
  background-color warm-bg
  overflow hidden

  &__container
    display flex
    width 100%
    height 100%

  &__left
    flex 4
    min-width 480px
    position relative
    display flex
    align-items center
    justify-content center

  // 1. 返回按钮 hover 动画
  &__back
    position absolute
    top 40px
    left 40px
    display flex
    align-items center
    gap 8px
    color text-light
    cursor pointer
    font-size 18px
    transition all 0.3s cubic-bezier(0.4, 0, 0.2, 1) // 丝滑动画
    i 
      transition transform 0.3s ease
    &:hover
      color warm-brown
      i
        transform translateX(-5px) // 图标向左微动

  &__content
    width 100%
    max-width 420px
    padding 0 40px

  &__brand
    text-align center
    margin-bottom 50px
    .blog-login__title
      font-size 46px
      color text-deep
      font-family Georgia, serif
      margin 0 0 10px 0
    .blog-login__slogan
      font-size 16px
      color text-light

  &__tabs
    display flex
    justify-content center
    gap 60px
    margin-bottom 40px
    border-bottom 2px solid #E8E0D5

  &__tab-item
    padding-bottom 12px
    font-size 22px
    color text-light
    cursor pointer
    position relative
    transition 0.3s
    &--active
      color warm-brown
      font-weight 600
      &::after
        content ''
        position absolute
        bottom -2px
        left 0
        width 100%
        height 4px
        background-color warm-brown

  // 3. 登录按钮颜色及 hover 优化
  &__submit-btn
    width 100%
    height 58px
    font-size 20px
    background-color warm-brown
    border-color warm-brown
    border-radius 10px
    margin-top 20px
    letter-spacing 4px
    transition all 0.3s ease
    &:hover, &:focus
      background-color warm-brown-hover !important
      border-color warm-brown-hover !important
      box-shadow 0 8px 20px rgba(160, 120, 90, 0.3) // 增加光晕感
      transform translateY(-1px)

  &__right
    flex 6
    position relative
    background-color warm-deep // 增加一个深色背景底，防止图片加载时闪白
    @media (max-width: 900px)
      display none

  &__cover-img
    width 100%
    height 100%
    object-fit cover
    filter blur(1px) // 增加轻微模糊，提升质感，减少图片对文字的干扰

  // 4. 右侧“厚实”蒙版层
  &__cover-overlay
    position absolute
    inset 0
    // 使用深棕色 (`#3D2B1F`) 作为基色，并显著提升不透明度 (0.6 - 0.8)
    // 这种重度蒙版不仅压低亮度，更让图片看起来像是被“封存在琥珀”中，质感十足。
    background linear-gradient(to bottom right, rgba(61, 43, 31, 0.35), rgba(61, 43, 31, 0.45))
    pointer-events none // 确保不影响鼠标操作

// 邮箱输入框过渡动画
.slide-fade-enter-active
  transition all 0.4s cubic-bezier(0.4, 0, 0.2, 1)

.slide-fade-leave-active
  transition all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

.slide-fade-enter
  opacity 0
  transform translateY(-20px)

.slide-fade-leave-to
  opacity 0
  transform translateY(-10px)

</style>

<style lang="stylus">
/* 全局穿透部分 - 保持不变，已解决重叠问题 */
.blog-login
  .el-form-item
    margin-bottom 25px

  .el-input__inner
    height 58px !important
    line-height 58px !important
    border-radius 10px
    font-size 17px
    background-color #fff
    border-color #E8E0D5
    // 2. 解决图标重叠：增加左侧内边距 (padding-left)
    padding-left 55px !important 
    transition all 0.3s
    &:focus
      border-color #A0785A
  
  .el-input__prefix
    left 18px // 稍微调整图标位置
    .el-input__icon
      font-size 22px
      line-height 58px
      color #A0785A // 图标也换成主题色，更有整体感
</style>