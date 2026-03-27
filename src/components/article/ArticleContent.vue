<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-10-02 16:17:56
 * @LastEditors: Garyonit 3253975221@qq.com
 * @LastEditTime: 2025-10-02 17:32:25
 * @FilePath: \vue-blog\src\components\article\ArticleContent.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-card>
    <div v-if="loading" class="blog-article--loading">
      <i class="el-icon-loading"></i>
    </div>
    <div v-else class="blog-article typo">
      <h3 class="blog-article--title">{{article.title}}</h3>
      <ArticleBarInfoVue   v-if="article.id && info" 
                          :info="info" 
                          :id="article.id" />
      <div class="blog-article--content"
           v-html="article.content">
      </div>
      <div class="blog-article--tags" v-if="article.column">
        <span class="blog-article--tag">{{ article.column.name }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import ArticleBarInfoVue from './ArticleBarInfo.vue';

export default {
  name:'ArticleContent',
  data() {
    return {};
  },
  props:{
    loading: {
      type: Boolean,
      default: false
    },
    article: {
      type: Object,
      default: function () {
        return {
          title: '默认标题',
          date: "默认日期",
          like_num: 0,
          hit_num: 0,
          comment_num: 0,
          content: ''
        }
      }
    }
  },
  computed:{
    info(){
      let { like_num, hit_num, comment_num, date } = this.article
      return {
        like_num, hit_num, comment_num, date, nickname: this.nickname
      }
    },
    nickname(){
      return this.article?.author?.nickname || '默认名称'
    },

  },
  components:{
    ArticleBarInfoVue
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="stylus">
@import '~@/assets/css/typo.styl'
@import '~@/assets/css/base.styl'

.blog-article
  padding 32px
  font-size 16px
  background-color transparent

.blog-article--loading
  display flex
  justify-content center
  align-items center
  min-height 400px
  font-size 48px
  color #A0785A

  i
    animation rotate 1s linear infinite

@keyframes rotate
  from
    transform rotate(0deg)
  to
    transform rotate(360deg)

.blog-article--title
  font-size 32px
  line-height 1.4
  margin 0 0 24px 0
  color #3D2B1F
  font-family 'Playfair Display', 'Noto Serif SC', Georgia, serif
  font-weight 700
  word-break break-word
  letter-spacing 0.5px

.blog-article--info
  padding 20px 24px
  background-color #FDFBF7
  border-radius 8px
  display flex
  justify-content space-between
  align-items center
  color #8C7B6B
  margin-bottom 32px
  border 1px solid #E8E0D5

  @media screen and (max-width 768px)
    flex-direction column
    align-items flex-start
    gap 12px

.blog-info--item
  padding 0 8px
  font-size 14px
  transition color 0.2s ease

  i
    margin-right 4px

.blog-article--content
  padding 24px 0
  line-height 1.8
  color #3D2B1F
  font-family Georgia, 'Noto Serif SC', serif
  letter-spacing 0.3px

.blog-article img
  display block
  width 70%
  max-width 100%
  margin 20px auto
  border-radius 8px

.blog-article--tags
  margin-top 32px
  padding-top 24px
  border-top 1px solid #E8E0D5

.blog-article--tag
  display inline-block
  padding 8px 16px
  background-color #FDFBF7
  color #A0785A
  border-radius 20px
  font-size 14px
  font-weight 500
  border 1px solid #E8E0D5
  transition all 0.3s ease

  &:hover
    background-color #A0785A
    color #FFFFFF
    border-color #A0785A
</style>