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
      <ArticleContentVue :article="article" />
      <CommentTextAreaVue :aid="article.id" />
      <CommentListVue :comments="article.comments" />
    </div>
  </div>
</template>

<script>
import ArticleContentVue from '@/components/article/ArticleContent.vue';
import CommentListVue from '@/components/comment/CommentList.vue';
import CommentTextAreaVue from '@/components/comment/CommentTextArea.vue';

export default {
  name:'ArticlePage',
  data() {
    return {
      id:'',
      article:{}
    };
  },
  components:{
    ArticleContentVue,CommentListVue,CommentTextAreaVue
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
    async getArticleById () {
      try {
        this.article = await this.$api({ type: 'getArticleById', data: { id: this.id } })
      } catch (err) {
        this.$notify.success({
          title: '获取失败',
          message: err.message
        })
      }
    }
  },
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/base.styl'

.blog-article-page
  min-height 100vh
  background-color bg-theme-color
  padding 20px 0

  &__container
    max-width area-width
    margin 0 auto
    padding 0 20px

    @media screen and (max-width 768px)
      padding 0 12px

  // 子组件间距
  >>> .el-card
    margin-bottom 20px
    border-radius 8px
    border none
    box-shadow 0 2px 8px rgba(0, 0, 0, 0.06)
    transition all 0.3s ease

    &:hover
      box-shadow 0 4px 16px rgba(0, 0, 0, 0.1)
</style>