<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-10-03 18:00:28
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-21 16:03:42
 * @FilePath: \vue-blog\src\components\base\BaseCircleMenu.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="blog-circle-menu">
    <transition-group tag="div" class="blog-tag-body" appear name="circle">
      <el-button
        v-for="item in menuList"
        :key="item.icon"
        size="medium"
        class="blog-btn-menu"
        @click="clickMenu(item)"
        :icon="item.icon"
        circle
      ></el-button>
      <el-button
        v-if="exceMenu"
        key="likes"
        size="medium"
        class="blog-btn-menu"
        :class="{ active: isLike }"
        @click="handlerArticleLike"
        :icon="exceMenu.icon"
        circle
      ></el-button>
    </transition-group>
  </div>
</template>

<script>
import MIXIN from "@/core/mixin";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions } = createNamespacedHelpers("like");

export default {
  name: "BaseCircleMenu",
  mixins: [MIXIN],
  props: {
    circleMenuList: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {
    menuList() {
      return this.circleMenuList.filter((item) => {
        return !item.exce; //menuList只保留没有exce属性的
      });
    },
    exceMenu() {
      return this.circleMenuList.filter((item) => {
        return item.exce;
      })[0];
    },
    isLike() {
      let aid = this.$route.params.id;
      // 只需要文章id, uid会自己去rootState拿的
      return this.checkLike(aid);
    },
    ...mapGetters({
      checkLike: "isLike",
    }),
  },
  mounted() {},
  methods: {
    async handlerArticleLike() {
      if (!localStorage.getItem("ua_token")) {
        this.$notify.warning({
          title: "通知",
          message: "请先登录",
        });
        return; // 直接返回，不执行点赞操作
      }

      let aid = this.$route.params.id;
      this[this.isLike ? "pullLike" : "pushLike"]({ aid });
      await this.sendLikes({ aid });
    },
    handlerFocusTextarea() {
      this.$EventBus.$emit("focusTextarea");
    },
    addColumn() {
      this.refreshModal("column"); //添加分类
    },
    clickMenu(item) {
      if (!localStorage.getItem("ua_token")) {
        this.$notify.warning({
          title: "通知",
          message: "请先登录",
        });
        return;
      }
      let { route, handler } = item;
      if (route) {
        this.$router.push(route); //切换到指定路由
      }
      if (handler) {
        this[handler] && this[handler](); //执行相应的handler
      }
    },
    ...mapActions(["pullLike", "pushLike", "sendLikes"]),
  },
};
</script>

<style lang="stylus">
warm-active  = #A0785A
warm-border  = #E8E0D5
warm-cream   = #FBF7F2
rope-color   = #C8B8A8

// 固定容器（绳子 + 门牌）
.blog-circle-menu
  position fixed
  right 24px
  top 50%
  transform translateY(-50%)
  display flex
  flex-direction column
  align-items center
  z-index 50
  // 绳子：容器上方的细线（从透明渐变到绳色）
  &::before
    content ''
    display block
    width 2px
    height 36px
    background linear-gradient(to bottom, transparent 0%, rope-color 100%)
    border-radius 1px
  // 挂钩小圆点
  &::after
    content ''
    display block
    width 8px
    height 8px
    border-radius 50%
    background-color rope-color
    margin-top -4px

// 门牌胶囊容器
.blog-tag-body
  display flex
  flex-direction column
  align-items center
  background-color warm-cream
  border 1px solid warm-border
  border-radius 36px
  padding 14px 10px
  box-shadow 0 8px 32px rgba(120, 90, 60, 0.14), 0 2px 8px rgba(120, 90, 60, 0.08)

// 圆形菜单按钮
.el-button--medium.blog-btn-menu
  width 46px
  height 46px
  font-size 20px
  margin 6px 0 !important
  padding 0
  background-color warm-cream
  border 1px solid warm-border
  color warm-active
  transition color 0.22s, background-color 0.22s, border-color 0.22s, box-shadow 0.22s, transform 0.18s
  &:hover
    background-color warm-active
    border-color warm-active
    color #fff
    transform scale(1.08)
    box-shadow 0 4px 12px rgba(160, 120, 90, 0.28)
  &:active, &:focus
    outline 0
    background-color warm-active
    border-color warm-active
    color #fff

// 点赞激活态（暖橙色）
.el-button--medium.blog-btn-menu.active
  background-color #C8825A
  border-color #C8825A
  color #fff
  box-shadow 0 3px 10px rgba(200, 130, 90, 0.35)

// 入场动画：从右侧淡入 + 弹性缩放
.circle-enter-active
  transition opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)

.circle-leave-active
  transition opacity 0.25s ease, transform 0.25s ease

.circle-enter
  opacity 0
  transform translateX(40px) scale(0.7)

.circle-leave-to
  opacity 0
  transform scale(0.7)
</style>