<!--
 * @FilePath: \vue-blog\src\mviews\ArticleList.vue
 * @Description: 移动端文章列表（虚拟列表）
-->
<template>
  <div class="blog-m-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <RecycleScroller
        ref="scroller"
        class="blog-m-scroller"
        :items="articleList"
        :item-size="100"
        key-field="id"
        v-slot="{ item }"
        @scroll.native="_onScrollThrottled"
      >
        <router-link :to="{ name: 'mArticle', params: { id: item.id } }">
          <ArticleItem :article="item" />
        </router-link>
      </RecycleScroller>
      <div v-if="finished && articleList.length" class="blog-m-finished">没有更多了</div>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from "@/components/mobile/ArticleItem.vue";
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import QS from "qs";

export default {
  name: "ArticleList",
  components: { ArticleItem, RecycleScroller },
  props: {
    columnId: {
      type: String,
    },
  },
  data() {
    return {
      articleList: [],
      columnArticleCache: [],
      loading: false,
      finished: false,
      refreshing: false,
      size: 10,
      page: 1,
      query: "",
    };
  },
  mounted() {
    this.$EventBus.$off("search-article", this.searchArticle);
    this.$EventBus.$on("search-article", this.searchArticle);
    this._onScrollThrottled = this._.throttle(this.onScroll, 100)
    this.onLoad();
  },
  watch: {
    columnId(newId) {
      if (!newId || newId.trim().length === 0) return;
      if (this.columnArticleCache[newId]) {
        this.articleList = this.columnArticleCache[newId];
        return;
      }
      this.refreshing = true;
      this.onRefresh();
    }
  },
  methods: {
    onScroll(e) {
      if (this.finished || this.loading) return;
      const el = e.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
        this.onLoad();
      }
    },
    onLoad() {
      if (this.loading || this.finished) return;
      this.loading = true;
      this.getArticles();
    },
    onRefresh() {
      this.page = 1;
      this.finished = false;
      this.articleList = [];
      this.loading = true;
      this.getArticles();
    },
    searchArticle(value) {
      this.query = value;
      this.refreshing = true;
      this.onRefresh();
    },
    cacheColumnList() {
      if (this.columnId) {
        this.columnArticleCache[this.columnId] = JSON.parse(
          JSON.stringify(this.articleList)
        );
      }
    },
    getQuery() {
      let column = this.columnId || undefined;
      let q = this.query || undefined;
      return JSON.parse(JSON.stringify({ column, q }));
    },
    getArticles() {
      let data = { page: this.page, size: this.size };
      let query = this.getQuery();
      if (Object.entries(query).length > 0) {
        data.query = QS.stringify(query);
      }
      this.$api({ type: "articles", data })
        .then((result) => {
          if (this.refreshing) {
            this.articleList = [];
            this.refreshing = false;
          }
          this.articleList.push(...result.list);
          this.cacheColumnList();
          this.page++;
          if (this.articleList.length >= result.total) {
            this.finished = true;
          }
          this.loading = false;
          // 数据不足一屏时自动继续加载
          this.$nextTick(() => {
            const el = this.$refs.scroller?.$el;
            if (el && !this.finished && el.scrollHeight <= el.clientHeight) {
              this.onLoad();
            }
          });
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.refreshing = false;
        });
    },
  },
};
</script>

<style lang="stylus">
.blog-m-list
  height 100%

.blog-m-scroller
  height calc(100vh - 105px)
  overflow-y auto

.blog-m-finished
  text-align center
  padding 12px 0
  font-size 12px
  color #8C7B6B
</style>
