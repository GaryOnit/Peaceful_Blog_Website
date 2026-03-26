<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-10-02 16:19:23
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-21 16:10:48
 * @FilePath: \vue-blog\src\components\article\ArticleBarInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="blog-article--info">
    <span class="blog-info--item">
      作者: {{info.nickname}}
    </span>
    <span class="blog-info--item">
      <i class="el-icon-time"></i> {{info.date}}
    </span>
    <div class="hidden-xs-only">
      <!-- 点赞按钮：点击触发like方法，点赞图标根据isLike动态添加active类（高亮） -->
      <span class="blog-info--item"
            @click="like">
        <i class="el-icon-star-on blog-info-like"
           :class="{active:isLike}"></i> {{likeNum}}
      </span>
      <span class="blog-info--item">
        <i class="el-icon-view"></i> {{info.hit_num}}
      </span>
      <span class="blog-info--item">
        <i class="el-icon-edit-outline"></i> {{info.comment_num}}
      </span>
    </div>
  </div>
</template>

<script>
// 导入Vuex命名空间辅助函数，用于映射命名空间模块内的getters/actions
import { createNamespacedHelpers } from 'vuex'    
// 针对like命名空间模块，解构映射getters和actions的方法
const { mapGetters, mapActions } = createNamespacedHelpers('like')

export default {
  name: 'ArticleBarInfo',
  props: {
    info: {
      type: Object
    },
    id:{
      type: String
    }
  },
  data () {
    return {
      // 存储组件挂载时的初始点赞状态，用于点赞数计算
      initLike: false
    };
  },
  computed:{
    // 计算属性：当前文章是否被点赞，调用like模块的checkLike方法（映射自isLike getter）
    isLike () {
      let aid = this.id
      return this.checkLike(aid)
    },
    // 计算属性：动态计算展示的点赞数，处理点赞/取消点赞时的即时数值变化
    likeNum () {
      let temp = this.isLike? 0 : -1 
      return Math.max(this.info.like_num + !this.initLike + temp, 0)
    },
    // 映射like命名空间的getters
    ...mapGetters({
      checkLike: 'isLike'
    })
  },
  mounted () {
    // 组件挂载时记录初始点赞状态，作为点赞数计算的基准
    this.initLike = this.isLike
  },
  methods: {
    // 点赞/取消点赞核心方法
    like () {
      // 未登录校验：无token时提示登录并终止操作
      if (!localStorage.getItem("ua_token")) {
        this.$notify.warning({
          title: "通知",
          message: "请先登录",
        });
        return;
      }
      // 三元表达式判断操作类型：已点赞则调用pullLike（取消），未点赞则调用pushLike（点赞），传入文章ID
      this[this.isLike ? 'pullLike' : 'pushLike']({ aid: this.id })
      // 调用sendLikes方法，向服务端同步点赞/取消点赞状态
      this.sendLikes({ aid: this.id })
    },
    // 映射like命名空间的actions：pullLike(取消点赞)、pushLike(点赞)、sendLikes(同步服务端)
    ...mapActions(['pullLike', 'pushLike', 'sendLikes'])
  },
};
</script>

<style lang="stylus">
.blog-info-like.active
  color #409EFF
</style>