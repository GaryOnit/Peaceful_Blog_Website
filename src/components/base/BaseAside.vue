<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-28 16:12:39
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-04-07 19:17:00
 * @FilePath: \vue-blog\src\components\base\BaseAside.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-aside width="100%">
    <el-card class="box-card blog-aside">

      <!-- 已登录 -->
      <template v-if="isLogin">
        <div class="blog-avatar">
          <img class="blog-avatar--pic"
               :src="userInfo.avatar"
               alt="">
        </div>
        <div class="blog-info">
          <h3 class="blog-info--nickname">{{ userInfo.nickname }}</h3>
          <div class="blog-info--state">
            <div class="blog-state--item">
              <span class="blog-state--count">{{ userInfo.articleCount }}</span>
              <span class="blog-state--name">文章</span>
            </div>
            <div class="blog-state--divider"></div>
            <div class="blog-state--item">
              <span class="blog-state--count">{{ userInfo.columnCount }}</span>
              <span class="blog-state--name">分类</span>
            </div>
          </div>
          <p class="blog-info--content">{{ userInfo.signature }}</p>
        </div>
      </template>

      <!-- 游客模式 -->
      <template v-else>
        <div class="blog-avatar blog-avatar--guest">
          <div class="blog-avatar--placeholder">游</div>
        </div>
        <div class="blog-info blog-info--guest">
          <h3 class="blog-info--nickname blog-info--guest-name">游客</h3>
          <p class="blog-info--guest-tip">登录后查看完整信息</p>
          <button class="blog-guest--btn"
                  @click="refreshModal('login')">登录 / 注册</button>
        </div>
      </template>

    </el-card>

    <!-- 最新资讯 -->
    <el-card class="box-card blog-news--card">
      <div class="blog-news--header">
        <span class="blog-news--title">最新资讯</span>
        <span class="blog-news--dot"></span>
      </div>
      <ul class="blog-news--list">
        <li v-for="item in newsList"
            :key="item.id"
            class="blog-news--item">
          <span class="blog-news--tag"
                :class="'blog-news--tag-' + item.type">{{ item.typeLabel }}</span>
          <span class="blog-news--text">{{ item.title }}</span>
          <span class="blog-news--time">{{ item.time }}</span>
        </li>
      </ul>
    </el-card>

    <!-- 分类列表 -->
    <el-card class="box-card blog-column--card">
      <div class="blog-column--header">
        <span class="blog-column--title">分类</span>
      </div>
      <ul class="blog-column--list">
        <li v-for="item in columns"
            :key="item.id"
            class="blog-column--item"
            @click="goToColumn(item.id)">
          <span class="blog-column--name">{{ item.name }}</span>
          <span class="blog-column--count">{{ item.aids.length }}</span>
        </li>
      </ul>
    </el-card>

  </el-aside>
</template>

<script>
import { mapGetters } from 'vuex'
import MIXIN from '@/core/mixin'
export default {
  name: 'BaseAside',
  mixins: [MIXIN],
  data () {
    return {
      columns: [],
      newsList: [
        { id: 1, type: 'tech', typeLabel: '技术', title: 'Vue 3.5 正式发布，响应式性能大幅提升', time: '今天' },
        { id: 2, type: 'ai', typeLabel: 'AI', title: 'GPT-5 开放公测，多模态能力再度突破', time: '昨天' },
        { id: 3, type: 'tech', typeLabel: '技术', title: 'Vite 6.0 发布，冷启动速度提升 40%', time: '2天前' },
        { id: 4, type: 'life', typeLabel: '生活', title: '如何在高强度工作中保持创造力', time: '3天前' },
        { id: 5, type: 'ai', typeLabel: 'AI', title: 'GitHub Copilot 新增代码审查功能', time: '4天前' }
      ]
    }
  },
  computed: {
    isLogin () {
      return !!this.$store.state.token
    },
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getColumns();
  },
  methods: {
    goToColumn(columnId) {
      this.$router.push({ name: 'index', query: { columnId } }).catch(err => {});
    },
    async getColumns() {
      try {
        let columns = await this.$api({ type: 'columns' });
        this.columns = columns.list;
      } catch (err) {
        console.log(err);
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/base.styl'

warm-text = #3D2B1F
warm-secondary = #8C7B6B
warm-active = #A0785A
warm-border = #E8E0D5
warm-bg = #FDFBF7

.blog-aside
  width 80%
  max-width 240px
  text-align center

/* 已登录 - 头像 */
.blog-avatar
  position relative
  width 96px
  margin 0 auto 14px

.blog-avatar--pic
  width 96px
  height 96px
  border-radius 50%
  display block
  object-fit cover
  border 3px solid warm-bg
  box-shadow 0 0 0 2px warm-active, 0 6px 20px rgba(160, 120, 90, 0.22)
  transition transform 0.3s ease, box-shadow 0.3s ease
  &:hover
    transform scale(1.04)
    box-shadow 0 0 0 2px warm-active, 0 8px 28px rgba(160, 120, 90, 0.32)

/* 已登录 - 信息区 */
.blog-info
  padding-top 0

.blog-info--nickname
  font-size 17px
  font-weight 600
  color warm-text
  letter-spacing 0.04em
  margin 0 0 14px

/* 统计区：文章 | 分类 */
.blog-info--state
  display flex
  align-items center
  justify-content center
  border-top 1px solid warm-border
  border-bottom 1px solid warm-border
  padding 12px 0
  margin-bottom 14px

.blog-state--item
  flex 1
  display flex
  flex-direction column
  align-items center
  gap 3px

.blog-state--divider
  width 1px
  height 28px
  background-color warm-border
  flex-shrink 0

.blog-state--count
  font-size 20px
  font-weight 700
  color warm-text
  line-height 1

.blog-state--name
  font-size 11px
  color warm-secondary
  letter-spacing 0.06em

/* 个性签名 */
.blog-info--content
  font-size 12px
  color warm-secondary
  line-height 1.75
  text-align left
  margin 0
  padding 0 4px 0 10px
  border-left 2px solid warm-active
  font-style italic

/* 最新资讯卡片 */
.blog-news--card
  width 80%
  max-width 240px
  margin-top 16px
  text-align left

.blog-news--header
  display flex
  align-items center
  justify-content space-between
  margin-bottom 12px

.blog-news--title
  font-size 13px
  font-weight 600
  color warm-text
  letter-spacing 0.05em

.blog-news--dot
  width 6px
  height 6px
  border-radius 50%
  background-color warm-active
  animation blog-news-pulse 2s ease-in-out infinite

@keyframes blog-news-pulse
  0%, 100%
    opacity 1
    transform scale(1)
  50%
    opacity 0.4
    transform scale(0.7)

.blog-news--list
  list-style none
  margin 0
  padding 0
  display flex
  flex-direction column
  gap 10px

.blog-news--item
  display flex
  flex-direction column
  gap 3px
  padding-bottom 10px
  border-bottom 1px solid warm-border
  &:last-child
    border-bottom none
    padding-bottom 0

.blog-news--tag
  display inline-block
  padding 1px 6px
  border-radius 3px
  font-size 10px
  font-weight 600
  letter-spacing 0.04em
  align-self flex-start

.blog-news--tag-tech
  background-color rgba(160, 120, 90, 0.12)
  color warm-active

.blog-news--tag-ai
  background-color rgba(100, 140, 180, 0.12)
  color #5a8aaa

.blog-news--tag-life
  background-color rgba(100, 160, 100, 0.12)
  color #5a8a5a

.blog-news--text
  font-size 12px
  color warm-text
  line-height 1.5
  overflow hidden
  display -webkit-box
  -webkit-line-clamp 2
  -webkit-box-orient vertical

.blog-news--time
  font-size 11px
  color #b0a090

/* 分类列表卡片 */
.blog-column--card
  width 80%
  max-width 240px
  margin-top 16px
  text-align left

.blog-column--header
  margin-bottom 12px

.blog-column--title
  font-size 13px
  font-weight 600
  color warm-text
  letter-spacing 0.05em

.blog-column--list
  list-style none
  margin 0
  padding 0
  display flex
  flex-direction column
  gap 8px

.blog-column--item
  display flex
  justify-content space-between
  align-items center
  padding 8px 12px
  border-radius 6px
  background-color warm-bg
  cursor pointer
  transition all 0.2s ease

  &:hover
    background-color warm-active
    transform translateX(4px)

    .blog-column--name
      color #FFFFFF

    .blog-column--count
      background-color rgba(255, 255, 255, 0.3)
      color #FFFFFF

.blog-column--name
  font-size 13px
  color warm-text
  transition color 0.2s ease

.blog-column--count
  font-size 11px
  color warm-secondary
  background-color #E8E0D5
  padding 2px 8px
  border-radius 10px
  min-width 24px
  text-align center
  transition all 0.2s ease

.blog-avatar--placeholder
  width 100px
  height 100px
  border-radius 50%
  margin 0 auto
  background-color #e8e0d5
  color #8c7b6b
  font-size 36px
  font-weight 600
  display flex
  align-items center
  justify-content center

.blog-info--guest-name
  color #8c7b6b

.blog-info--guest-tip
  font-size 13px
  color #b0a090
  margin 4px 0 16px

.blog-guest--btn
  display inline-block
  padding 7px 20px
  border 1px solid #a0785a
  border-radius 20px
  background-color transparent
  color #a0785a
  font-size 13px
  cursor pointer
  transition color 0.2s, background-color 0.2s
  &:hover
    background-color #a0785a
    color #fff
</style>
