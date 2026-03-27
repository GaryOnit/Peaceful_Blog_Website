<template>
  <el-card v-if="commentLength">
    <div class="blog-comment blog-comment--list">
      <h3>评论列表</h3>
      <ul>
        <CommentItemVue v-for="comment in comments"
                        :key="comment.id"
                        :uid="comment.uid"
                        :content="comment.content"
                        :date="comment.date" />
      </ul>
    </div>
  </el-card>  
</template>

<script>
import CommentItemVue from './CommentItem.vue';

export default {
  name:'CommentList',
  data() {
    return {};
  },
  props:{
    comments:{
      type: Array
    }
  },
  components:{
    CommentItemVue
  },
  computed:{
    commentLength () {
      return this.comments?.length || 0
    },
    uid () {
      return this.comments
    }
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="stylus" scoped>
warm-bg = #FDFBF7
warm-border = #E8E0D5
warm-text = #3D2B1F
warm-secondary = #8C7B6B

.blog-comment--list
  padding 24px

  h3
    margin 0 0 20px 0
    font-size 20px
    color warm-text
    font-family Georgia, 'Noto Serif SC', serif
    font-weight 600

  ul
    list-style none
    padding 0
    margin 0

</style>