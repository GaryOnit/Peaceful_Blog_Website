<template>
  <el-card>
    <div class="blog-comment blog-comment--editor">
      <template v-if="isLoggedIn">
        <h3 class="blog-comment--title">发表评论</h3>
        <textarea ref="textarea"
                  class="blog-comment--input"
                  v-model="commentVal"
                  name="comment"
                  placeholder="写下你的想法..."
                  autofocus></textarea>
        <el-button type="primary"
                   @click="submitComment">提交</el-button>
      </template>
      <div v-else class="blog-comment--mask">
        <p class="blog-comment--mask-text">登录后即可发表评论</p>
        <div class="blog-comment--mask-buttons">
          <el-button type="primary" @click="goToLogin">登录</el-button>
          <el-button @click="goToRegister">注册</el-button>
        </div>
      </div>
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
  created () {
    this.submitComment = this._.debounce(this._submitComment, 1000, { leading: true, trailing: false })
  },
  computed:{
    ...mapState(['uid']),
    isLoggedIn() {
      return !!localStorage.getItem('ua_token');
    }
  },
  mounted () {
    this.$EventBus.$on('focusTextarea', () => {
      this.focusTextarea()
    })
  },
  methods: {
    goToLogin() {
      this.$router.push({
        path: '/auth',
        query: { redirect: this.$route.fullPath }
      });
    },
    goToRegister() {
      this.$router.push({
        path: '/auth',
        query: { redirect: this.$route.fullPath, tab: 'register' }
      });
    },
    focusTextarea(){
      this.$refs['textarea']?.focus()
    },
    async submitComment () {},
    async _submitComment () {
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
  gap 20px
  padding 32px

.blog-comment--title
  margin 0 0 8px 0
  font-size 22px
  color warm-text
  font-family Georgia, 'Noto Serif SC', serif
  font-weight 600
  letter-spacing 0.5px

.blog-comment--input
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

>>> .el-button--primary
  background-color warm-active
  border-color warm-active
  border-radius 10px
  padding 12px 32px
  font-size 16px
  font-weight 600
  font-family 'PingFang SC', 'Microsoft YaHei', sans-serif
  letter-spacing 1px
  transition all 0.3s ease

  &:hover, &:focus
    background-color #8C6A4E
    border-color #8C6A4E

  &:active
    background-color #7A5D43
    border-color #7A5D43

.blog-comment--mask
  display flex
  flex-direction column
  align-items center
  justify-content center
  min-height 240px
  padding 40px

.blog-comment--mask-text
  font-size 18px
  color warm-secondary
  margin-bottom 24px
  font-family Georgia, 'Noto Serif SC', serif

.blog-comment--mask-buttons
  display flex
  gap 16px

  >>> .el-button
    border-radius 10px
    padding 12px 32px
    font-size 16px
    font-weight 600
    letter-spacing 1px

  >>> .el-button--primary
    background-color warm-active
    border-color warm-active

    &:hover, &:focus
      background-color #8C6A4E
      border-color #8C6A4E

  >>> .el-button--default
    color warm-active
    border-color warm-border

    &:hover, &:focus
      color #8C6A4E
      border-color #8C6A4E
</style>