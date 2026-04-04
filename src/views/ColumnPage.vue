<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-10-04 15:46:37
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-04-04 16:43:28
 * @FilePath: \vue-blog\src\views\ColumnPage.vue
 * @Description: 专栏列表页 —— 卡片瀑布流布局（重构自词云）
-->
<template>
  <div class="blog-column-page">

    <!-- 页面标题区 -->
    <div class="blog-column-page__header">
      <h1 class="blog-column-page__title">全部专栏</h1>
      <p class="blog-column-page__subtitle">共 {{ columns.length }} 个专栏</p>
    </div>

    <!-- 骨架屏（加载中） -->
    <div v-if="loading" class="blog-column-grid">
      <div
        v-for="n in 6"
        :key="'sk-' + n"
        class="blog-column-card blog-column-card--skeleton"
      >
        <div class="blog-column-card__sk-title"></div>
        <div class="blog-column-card__sk-count"></div>
        <div class="blog-column-card__sk-bar"></div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="sortedColumns.length === 0" class="blog-column-empty">
      暂无专栏
    </div>

    <!-- 专栏卡片网格 -->
    <div v-else class="blog-column-grid">
      <div
        v-for="col in sortedColumns"
        :key="col.id"
        class="blog-column-card"
        @click="goColumn(col.id)"
      >
        <div class="blog-column-card__name">{{ col.name }}</div>
        <div class="blog-column-card__count">{{ col.count }} 篇文章</div>
        <div class="blog-column-card__bar-wrap">
          <div
            class="blog-column-card__bar-fill"
            :style="{ width: barWidth(col.count) }"
          ></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'ColumnPage',
  data () {
    return {
      columns: [],
      loading: true
    }
  },
  computed: {
    // 按文章数量从多到少排序，同时把 aids.length 提炼为 count
    sortedColumns () {
      return this.columns
        .map(item => ({
          id: item.id,
          name: item.name,
          count: item.aids ? item.aids.length : 0
        }))
        .sort((a, b) => b.count - a.count)
    },
    // 文章数最大值，用于计算进度条比例（保底为 1 防止除零）
    maxCount () {
      if (!this.sortedColumns.length) return 1
      return this.sortedColumns[0].count || 1
    }
  },
  created () {
    this.getColumns()
  },
  mounted () {
    this.$EventBus.$on('updateView', this.onUpdateView)
  },
  beforeDestroy () {
    this.$EventBus.$off('updateView', this.onUpdateView)
  },
  methods: {
    // EventBus 监听回调，单独定义以便精准注销
    onUpdateView () {
      this.getColumns()
    },
    // 计算单张卡片进度条宽度百分比
    barWidth (count) {
      return (count / this.maxCount * 100).toFixed(1) + '%'
    },
    // 跳转到对应专栏（与原代码路由参数保持一致）
    goColumn (id) {
      this.$router.push({ name: 'index', query: { columnId: id } })
    },
    // 保留原有请求逻辑
    async getColumns () {
      this.loading = true
      try {
        let columns = await this.$api({ type: 'columns' })
        this.columns = columns.list
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
warm-bg        = #FDFBF7
warm-text      = #3D2B1F
warm-secondary = #8C7B6B
warm-active    = #A0785A
warm-border    = #E8E0D5
warm-cream     = #FBF7F2

// ── 页面容器
.blog-column-page
  padding 36px 28px 48px
  min-height 80vh
  background warm-bg

// ── 标题区
.blog-column-page__header
  margin-bottom 36px
  text-align center

.blog-column-page__title
  font-family 'Noto Serif SC', Georgia, serif
  font-size 26px
  font-weight 700
  color warm-text
  margin 0 0 8px
  letter-spacing 0.04em

.blog-column-page__subtitle
  font-size 13px
  color warm-secondary
  margin 0

// ── 网格容器
.blog-column-grid
  display grid
  grid-template-columns repeat(3, 1fr)
  gap 20px
  @media (max-width 900px)
    grid-template-columns repeat(2, 1fr)
  @media (max-width 600px)
    grid-template-columns 1fr

// ── 专栏卡片基础
.blog-column-card
  display flex
  flex-direction column
  gap 10px
  padding 22px 20px 16px
  background warm-cream
  border 1px solid warm-border
  border-radius 10px
  cursor pointer
  transition transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease
  &:hover
    transform translateY(-4px)
    border-color warm-active
    box-shadow 0 6px 20px rgba(160, 120, 90, 0.13)

// ── 专栏卡片子元素
.blog-column-card__name
  font-family 'Noto Serif SC', Georgia, serif
  font-size 16px
  font-weight 600
  color warm-text
  line-height 1.5
  word-break break-word

.blog-column-card__count
  font-size 12px
  color warm-secondary

.blog-column-card__bar-wrap
  margin-top auto
  height 3px
  background warm-border
  border-radius 2px
  overflow hidden

.blog-column-card__bar-fill
  height 100%
  background warm-active
  border-radius 2px
  transition width 0.45s ease

// ── 骨架屏变体
.blog-column-card--skeleton
  pointer-events none
  animation blog-skeleton-pulse 1.6s ease-in-out infinite

.blog-column-card__sk-title
  height 17px
  width 62%
  background warm-border
  border-radius 4px

.blog-column-card__sk-count
  height 12px
  width 38%
  background warm-border
  border-radius 4px

.blog-column-card__sk-bar
  height 3px
  width 100%
  background warm-border
  border-radius 2px
  margin-top auto

// ── 空状态
.blog-column-empty
  min-height 220px
  display flex
  align-items center
  justify-content center
  font-size 15px
  color warm-secondary
  letter-spacing 0.05em

// ── 骨架屏动画
@keyframes blog-skeleton-pulse
  0%, 100%
    opacity 1
  50%
    opacity 0.45
</style>
