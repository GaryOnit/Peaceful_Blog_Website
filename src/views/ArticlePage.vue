<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-22 19:14:58
 * @LastEditors: Garyonit 3253975221@qq.com
 * @LastEditTime: 2025-10-02 17:15:56
 * @FilePath: \vue-blog\src\views\Article.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="blog-article-page">
    <div class="blog-article-page__container">
      <ArticleContentVue :article="article" :loading="loading" />
      <CommentTextAreaVue :aid="article.id" />
      <CommentListVue :comments="article.comments" />
    </div>
    <BaseCircleMenuVue :circleMenuList="circleMenuList" />
  </div>
</template>

<script>
import ArticleContentVue from '@/components/article/ArticleContent.vue';
import CommentListVue from '@/components/comment/CommentList.vue';
import CommentTextAreaVue from '@/components/comment/CommentTextArea.vue';
import BaseCircleMenuVue from '@/components/base/BaseCircleMenu.vue';

export default {
  name:'ArticlePage',
  data() {
    return {
      id:'',
      article:{},
      loading: true,
      circleMenuList: [
        { icon: 'el-icon-edit-outline', handler: 'handlerFocusTextarea' },
        { icon: 'el-icon-top', handler: 'scrollToTop', noAuth: true },
        { icon: 'el-icon-star-on', exce: true }
      ]
    };
  },
  components:{
    ArticleContentVue,CommentListVue,CommentTextAreaVue,BaseCircleMenuVue
  },
  provide () {
    return {
      getArticleById: this.getArticleById
    }
  },
  created(){
    this.id = this.$route.params.id
    this.getArticleById()
  },
  mounted() {},
  methods: {
    handlerFocusTextarea() {
      this.$EventBus.$emit('focusTextarea');
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async getArticleById () {
      this.loading = true;
      try {
        this.article = await this.$api({ type: 'getArticleById', data: { id: this.id } })
      } catch (err) {
        this.$notify.success({
          title: '获取失败',
          message: err.message
        })
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/base.styl'

.blog-article-page
  min-height 100vh
  background-color #FDFBF7
  padding 32px 0

  &__container
    max-width area-width
    margin 0 auto
    padding 0 24px

    @media screen and (max-width 768px)
      padding 0 16px

  >>> .el-card
    margin-bottom 24px
    border-radius 12px
    border none
    background-color #FFFFFF
    box-shadow 0 2px 12px rgba(160, 120, 90, 0.08)
    transition all 0.3s ease

    &:hover
      box-shadow 0 4px 20px rgba(160, 120, 90, 0.12)
</style>