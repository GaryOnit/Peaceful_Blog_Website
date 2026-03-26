<template>
  <div class="blog-pagination"
       v-if="totalPages > 1">
    <div class="blog-page--progress">
      <div class="blog-page--fill"
           :style="{ width: fillWidth }"></div>
      <span class="blog-page--counter">{{ page }} / {{ totalPages }}</span>
    </div>
    <div class="blog-page--controls">
      <button class="blog-page--btn"
              :class="{ 'is-disabled': page <= 1 }"
              @click="go(page - 1)">
        <i class="el-icon-arrow-left"></i>
      </button>
      <template v-for="(item, idx) in pageItems">
        <span v-if="item === '...'"
              :key="'ellipsis-' + idx"
              class="blog-page--ellipsis">…</span>
        <button v-else
                :key="item"
                class="blog-page--btn"
                :class="{ 'is-active': item === page }"
                @click="go(item)">{{ item }}</button>
      </template>
      <button class="blog-page--btn"
              :class="{ 'is-disabled': page >= totalPages }"
              @click="go(page + 1)">
        <i class="el-icon-arrow-right"></i>
      </button>
      <span class="blog-page--total">共 {{ total }} 篇</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasePagination',
  props: {
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 8
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.total / this.size) || 1
    },
    fillWidth () {
      return (this.page / this.totalPages * 100).toFixed(1) + '%'
    },
    pageItems () {
      const n = this.totalPages
      const p = this.page
      if (n <= 7) {
        return Array.from({ length: n }, (_, i) => i + 1)
      }
      if (p <= 4) {
        return [1, 2, 3, 4, 5, '...', n]
      }
      if (p >= n - 3) {
        return [1, '...', n - 4, n - 3, n - 2, n - 1, n]
      }
      return [1, '...', p - 1, p, p + 1, '...', n]
    }
  },
  methods: {
    go (target) {
      if (target < 1 || target > this.totalPages || target === this.page) return
      this.$emit('change', target)
    }
  }
}
</script>

<style lang="stylus">
warm-secondary = #8C7B6B
warm-active = #A0785A
warm-border = #E8E0D5

.blog-pagination
  padding 20px 0 8px
  user-select none

.blog-page--progress
  position relative
  width 100%
  height 3px
  background-color warm-border
  border-radius 2px
  margin-bottom 16px
  overflow visible

.blog-page--fill
  height 100%
  border-radius 2px
  background linear-gradient(90deg, #C8A882, warm-active)
  transition width 0.4s cubic-bezier(0.4, 0, 0.2, 1)

.blog-page--counter
  position absolute
  right 0
  top -10px
  transform translateX(50%)
  font-size 11px
  color warm-secondary
  white-space nowrap

.blog-page--controls
  display flex
  align-items center
  justify-content center
  gap 4px

.blog-page--btn
  min-width 34px
  height 34px
  padding 0 8px
  border 1px solid warm-border
  border-radius 6px
  background-color #fff
  color warm-secondary
  font-size 14px
  cursor pointer
  display inline-flex
  align-items center
  justify-content center
  transition color 0.2s, background-color 0.2s, border-color 0.2s, box-shadow 0.2s
  &:hover
    color warm-active
    border-color warm-active
    box-shadow 0 2px 6px rgba(160, 120, 90, 0.12)
  &.is-active
    background-color warm-active
    color #fff
    border-color warm-active
    box-shadow 0 2px 8px rgba(160, 120, 90, 0.28)
    font-weight 600
  &.is-disabled
    color warm-border
    pointer-events none
    &:hover
      border-color warm-border
      box-shadow none

.blog-page--ellipsis
  width 34px
  height 34px
  display inline-flex
  align-items center
  justify-content center
  color warm-secondary
  font-size 14px

.blog-page--total
  margin-left 12px
  font-size 12px
  color warm-secondary
  letter-spacing 0.03em
</style>
