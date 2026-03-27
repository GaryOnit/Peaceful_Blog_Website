<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-10-02 16:25:47
 * @LastEditors: Garyonit 3253975221@qq.com
 * @LastEditTime: 2025-11-09 16:39:47
 * @FilePath: \vue-blog\src\components\comment\CommentItem.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <li class="blog-comment--item">
    <div class="blog-comment--user blog-line blog-line--row ">
      <div class="blog-comment--avatar">
        <img :src="uid?.avatar || ''"
             alt="用户头像">
      </div>
      <span class="blog-comment--name">{{uid?.nickname || '匿名用户'}}</span>
    </div>
    <p class="blog-comment-content">{{content}}</p>
    <p class="blog-comment-date">{{date}}</p>
  </li>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    uid: {
      type: Object,
      default: null
    },
    content: {
      type: String
    },
    date: {
      type: String
    }
  },
  data () {
    return {

    };
  },
  mounted () {},
  methods: {},
};
</script>

<style lang="stylus" scoped>
warm-bg = #FDFBF7
warm-border = #E8E0D5
warm-text = #3D2B1F
warm-secondary = #8C7B6B

.blog-comment--item
  padding 24px
  margin-bottom 16px
  background-color warm-bg
  border none
  border-radius 10px
  box-shadow 0 2px 8px rgba(160, 120, 90, 0.06)
  transition all 0.3s ease

  &:hover
    box-shadow 0 4px 16px rgba(160, 120, 90, 0.12)
    transform translateY(-2px)

  &:last-child
    margin-bottom 0

.blog-comment--user
  display flex
  align-items center
  margin-bottom 12px

.blog-comment--avatar
  width 40px
  height 40px
  border-radius 50%
  overflow hidden
  flex-shrink 0
  border 2px solid #E8E0D5
  transition border-color 0.3s ease

  img
    width 100%
    height 100%
    object-fit cover

.blog-comment--name
  margin-left 12px
  font-size 15px
  font-weight 500
  color warm-text

.blog-comment-content
  padding 12px 0
  font-size 15px
  line-height 1.7
  color warm-text
  word-wrap break-word
  word-break break-word
  font-family Georgia, 'Noto Serif SC', serif

.blog-comment-date
  text-align right
  font-size 13px
  color warm-secondary
</style>