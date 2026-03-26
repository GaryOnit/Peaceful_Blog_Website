<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-27 15:56:06
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-25 10:56:25
 * @FilePath: \vue-blog\src\views\ArticleList.vue
-->
<template>
  <div class="article-wrap">
    <div v-if="hasArticle">
      <div v-if="isLoading" class="blog-article--skeleton">
        <div v-for="n in 3" :key="'skeleton-' + n" class="skeleton-card"></div>
      </div>
      <transition-group
        v-else
        name="article-list"
        tag="div"
        class="blog-article--list"
        appear
      >
        <CardArticleItemVue v-for="(item, index) in articles"
                            :key="item.id"
                            :article="item"
                            :style="{ transitionDelay: `${index * 50}ms` }" />
      </transition-group>
      <BasePaginationVue :total="total"
                         :page="page"
                         :size="size"
                         @change="handlePageChange" />
    </div>
    <article v-else
             class="blog-content-never">
      <h3 class="blog-item--title">很遗憾 没有找到对应的文章</h3>
      <el-button type="primary"
                 @click="routeEditor">去写一篇吧</el-button>
    </article>
  </div>
</template>

<script>
import CardArticleItemVue from '@/components/card/CardArticleItem.vue'
import BasePaginationVue from '@/components/base/BasePagination.vue'
import QS from 'qs'

export default {
  name: 'ArticleList',
  inject: ['closeLoadClock'],
  data () {
    return {
      articles: [],
      total: 0,
      page: 1,
      size: 8,
      q: '',
      isLoading: false
    }
  },
  props: {
    loading: {
      type: Boolean
    },
    columnId: {
      type: String
    }
  },
  components: {
    CardArticleItemVue,
    BasePaginationVue
  },
  computed: {
    hasArticle () {
      return this.articles.length > 0
    }
  },
  watch: {
    loading (load) {
      if (load) {
        this.getArticles()
      }
    }
  },
  created () {
    this.getArticles()
  },
  mounted () {
    this.$EventBus.$on('activeSearch', (q) => {
      this.q = q
      this.resetArticles()
      this.getArticles()
    })
  },
  methods: {
    routeEditor () {
      let columnId = this.columnId
      this.$router.push({ name: 'editor', query: { columnId } })
    },
    getQuery () {
      let column = this.$route.query?.columnId
      let q = this.q || undefined
      let query = JSON.parse(JSON.stringify({ column, q }))
      return query
    },
    resetArticles () {
      this.page = 1
      this.total = 0
      this.articles = []
    },
    handlePageChange (newPage) {
      this.page = newPage
      this.getArticles()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    getArticles () {
      this.isLoading = true
      let data = { size: this.size, page: this.page }
      let query = this.getQuery()
      if (Object.entries(query).length > 0) {
        data.query = QS.stringify(query)
      }
      this.$api({ type: 'articles', data }).then(result => {
        this.articles = result.list
        this.total = result.total
        this.closeLoadClock()
        this.isLoading = false
      }).catch(err => {
        this.$notify.success({
          title: '获取失败',
          message: err.message
        })
        this.isLoading = false
      })
    }
  }
}
</script>

<style lang="stylus">
warm-border = #E8E0D5

.article-wrap
  padding 4px 0

.blog-content-never
  display flex
  flex-direction column
  justify-content center
  align-items center
  height 400px
  gap 20px

.blog-content-never .blog-item--title
  font-size 16px
  color #8C7B6B

.blog-article--skeleton
  padding 4px 0

.skeleton-card
  height 172px
  background-color #fff
  border 1px solid warm-border
  border-radius 8px
  margin-bottom 16px
  position relative
  overflow hidden
  &::before
    content ''
    position absolute
    top 0
    left -100%
    width 100%
    height 100%
    background linear-gradient(90deg, transparent, rgba(160, 120, 90, 0.08), transparent)
    animation skeleton-shimmer 1.5s infinite

@keyframes skeleton-shimmer
  0%
    left -100%
  100%
    left 100%

.blog-article--list
  padding 4px 0

.article-list-enter-active
  transition opacity 0.4s ease, transform 0.4s ease

.article-list-enter
  opacity 0
  transform translateY(20px)

.article-list-leave-active
  transition opacity 0.25s ease

.article-list-leave-to
  opacity 0
</style>
