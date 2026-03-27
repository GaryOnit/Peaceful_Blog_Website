<template>
  <el-card>
    <div class="blog-comment blog-comment--editor">
      <textarea ref="textarea"
                class="blog-comment--input"
                v-model="commentVal"
                name="comment"
                autofocus></textarea>
      <el-button type="primary"
                 @click="submitComment">提交</el-button>
    </div>
  </el-card>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'CommentTextArea',
  inject: ['getArticleById'],         //inject 调用父组件的 getArticleById方法
  props: {
    aid: {
      type: String
    }
  },
  data () {
    return {
      commentVal: ''
    };
  },
  computed:{
    ...mapState(['uid'])
  },
  mounted () {
    this.$EventBus.$on('focusTextarea', () => {
      this.focusTextarea()
    })
  },
  methods: {
    focusTextarea(){
      this.$refs['textarea']?.focus()
    },
    async submitComment () {
      if (this.commentVal.trim().length === 0) {
        this.$notify.info({
          title: '请填写评论内容',
        })
        this.focusTextarea()
        return
      }
      try {
        await this.$api({ type: 'postComment', data: { aid: this.aid, content: this.commentVal, uid: this.uid } })
        this.$notify.success({
          title: '评论成功',
        })
        this.commentVal = ''
        this.getArticleById()
      } catch (err) {
        this.$notify.error({
          title: '评论失败',
          message: err.message
        })
      }
    }
  },
};
</script>

<style lang="stylus" scoped>
warm-bg = #FDFBF7
warm-border = #E8E0D5
warm-shadow = rgba(180, 160, 130, 0.08)
warm-text = #3D2B1F
warm-secondary = #8C7B6B
warm-active = #A0785A

.blog-comment--editor
  display flex
  flex-direction column
  gap 16px
  padding 24px

.blog-comment--input
  width 100%
  min-height 140px
  padding 16px
  border 2px solid warm-border
  border-radius 8px
  font-size 15px
  line-height 1.6
  color warm-text
  background-color warm-bg
  resize vertical
  transition all 0.3s ease
  font-family Georgia, 'Noto Serif SC', serif

  &:focus
    outline none
    border-color warm-active
    box-shadow 0 0 0 3px warm-shadow

  &::placeholder
    color warm-secondary

</style>