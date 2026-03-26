<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-28 16:12:39
 * @LastEditors: Garyonit 3253975221@qq.com
 * @LastEditTime: 2025-09-29 19:46:59
 * @FilePath: \vue-blog\src\components\card\CardArticleItem.vue
-->
<template>
  <router-link class="blog-content--item"
               :to="{ name: 'article', params: { id: article.id } }"
               v-if="article">
    <el-image class="blog-item--illu"
              :src="article.cover"
              fit="cover">
      <div slot="error"
           class="blog-item--illu-fallback">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
    <div class="blog-item--body">
      <div>
        <h3 class="blog-item--title">{{ article.title }}</h3>
        <p class="blog-item--meta">{{ article.date }} · {{ nickname }}</p>
        <p class="blog-item--desc">{{ content }}</p>
      </div>
      <div class="blog-item--footer">
        <div class="blog-item--tags">
          <span class="blog-tags--hit">浏览 ({{ article.hit_num }})</span>
          <span class="blog-tags--like">点赞 ({{ article.like_num }})</span>
          <span class="blog-tags--comment">评论 ({{ article.comment_num }})</span>
        </div>
        <span class="blog-read-more">阅读全文 →</span>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'CardArticleItem',
  props: {
    article: {
      type: Object
    }
  },
  data () {
    return {}
  },
  computed: {
    content () {
      let content = this.article.content.match(/>([^<>]+)</)?.[1]
      return content || '默认内容'
    },
    nickname () {
      return this.article.author?.nickname || '默认昵称'
    },
    like_num () {
      return this.article?.like_num
    }
  },
  methods: {}
}
</script>

<style lang="stylus">
warm-text = #3D2B1F
warm-secondary = #8C7B6B
warm-active = #A0785A
warm-border = #E8E0D5

.blog-content--item
  display flex
  gap 16px
  background-color #fff
  border-radius 8px
  border 1px solid warm-border
  box-shadow 0 1px 4px rgba(180, 160, 130, 0.08)
  padding 16px
  margin-bottom 16px
  text-decoration none
  transition box-shadow 0.25s
  &:hover
    box-shadow 0 4px 16px rgba(180, 160, 130, 0.18)

.blog-item--illu
  width 200px
  min-width 200px
  height 140px
  border-radius 6px
  overflow hidden
  flex-shrink 0

.blog-item--illu-fallback
  width 100%
  height 100%
  display flex
  align-items center
  justify-content center
  background-color #f5f0ea
  color #d0c0b0
  font-size 32px

.blog-item--body
  flex 1
  display flex
  flex-direction column
  justify-content space-between
  min-width 0

.blog-item--title
  font-size 18px
  font-weight 600
  color warm-text
  margin 0 0 8px
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

.blog-item--meta
  font-size 13px
  color warm-secondary
  margin 0 0 10px

.blog-item--desc
  font-size 14px
  color warm-secondary
  line-height 1.6
  overflow hidden
  display -webkit-box
  -webkit-line-clamp 2
  -webkit-box-orient vertical
  margin 0

.blog-item--footer
  display flex
  justify-content space-between
  align-items center
  margin-top 12px

.blog-item--tags
  display flex
  gap 10px

.blog-tags--hit, .blog-tags--like, .blog-tags--comment
  font-size 12px
  color #b0a090

.blog-read-more
  display inline-flex
  align-items center
  gap 6px
  padding 5px 14px
  font-size 12px
  font-weight 500
  letter-spacing 0.08em
  color warm-active
  border 1px solid warm-active
  border-radius 20px
  white-space nowrap
  transition color 0.25s, background-color 0.25s, transform 0.2s

.blog-content--item:hover .blog-read-more
  background-color warm-active
  color #fff
  transform translateX(2px)
</style>
