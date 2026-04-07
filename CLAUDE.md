# 项目概述

这是一个基于 **Vue 2** 的个人博客全栈项目，当前任务是对前端页面进行样式重构（现有样式较简陋），并添加若干新功能。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 2（v2.6.14，Options API） |
| 路由 | Vue Router v3.5.1 |
| 状态管理 | Vuex v3.6.2（使用 mapGetters / mapActions） |
| UI 组件库（桌面） | Element UI v2.15.14（`el-image`、`el-button`、`el-form`、`el-upload`、`el-menu` 等） |
| UI 组件库（移动） | Vant v2.13.9 |
| CSS 预处理器 | Stylus v0.54.8（缩进语法，无花括号） |
| 构建工具 | Vue CLI v5.0.0 |
| HTTP 客户端 | axios v1.12.2 |
| 富文本编辑器 | wangeditor v4.7.15 |
| 实时通信 | socket.io-client v3.1.1 |
| 动画库 | animate.css v4.1.1 |
| 工具库 | lodash（全局挂载为 `this._`） |
| 其他组件 | vue-circle-menu v1.1.1、vue-wordcloud v1.1.1、nprogress v0.2.0 |

---

## 目录结构约定

```
src/
├── api/               # 封装的http请求模块
├── assets/
│   ├── css/           # 全局 Stylus 样式（global.styl / base.styl / main.styl / typo.styl）
│   └── img/           # 静态图片资源
├── components/        # 公共小组件
│   ├── article/       # ArticleBarInfo.vue、ArticleContent.vue、ArticleAIChat.vue
│   ├── base/          # BaseHeader / BaseAside / BaseForm / BaseModal / BaseCircleMenu / BasePagination
│   ├── card/          # CardArticleItem.vue（文章预览卡片）
│   ├── comment/       # CommentList / CommentItem / CommentTextArea
│   ├── editor/        # EditorColumnTag.vue
│   ├── mobile/        # 移动端专属组件（ArticleItem / BaseNavBar / BaseSearchBar 等）
│   └── user/          # UserImgAvatar.vue、UserLoginHead.vue
├── config/            # 页面配置文件（表单配置、API 配置等）
├── core/              # 核心工具和 mixin
├── mviews/            # 移动端页面
├── plugins/           # 插件注册（element.js / vant.js / http.js / vuescroll.js / animate.js）
├── router/            # Vue Router 模块
├── static/            # 静态资源
├── store/             # Vuex 模块
│   └── modules/
│       ├── like.js    # 文章点赞状态
│       └── modal.js   # 弹窗状态
├── util/              # 前端加密和日期格式转换函数
├── views/             # 桌面端页面主体组件
│   ├── HomePage.vue
│   ├── ArticleList.vue
│   ├── ArticlePage.vue
│   ├── ColumnPage.vue
│   ├── EditorPage.vue
│   ├── UserPage.vue
│   ├── SocketPage.vue
│   └── LoginView.vue  # 沉浸式全屏登录/注册页（路由：/auth）
├── App.vue
└── main.js
```


---

## 样式规范（重构核心）

### 使用 Stylus 缩进语法
```stylus
// ✅ 正确
.blog-avatar-img
  width 40px
  border-radius 50%

// ❌ 错误（不要用花括号和分号）
.blog-avatar-img {
  width: 40px;
}
```

### 设计风格：温暖极简博客风

整体定位是**现代、克制、有温度**的内容型博客，追求"纸质书页"般的阅读氛围。

- 字体：衬线体（Georgia / Noto Serif SC）强调人文质感
- 布局：大量留白，低密度，避免视觉噪音
- 圆角：约 `8px ~ 12px`，细边框
- 交互：按钮、头像、图标等可交互元素统一配有 `transition` 过渡动画（`0.2s ~ 0.3s`）
- Element UI 覆盖：将默认蓝色主题替换为暖棕色系（`#A0785A`）

### 主题色板（已落地，所有组件统一使用）

| 变量名（Stylus 局部变量） | 色值 | 用途 |
|---|---|---|
| `warm-bg` | `#FDFBF7` | 页面背景，米白/暖白 |
| `warm-text` | `#3D2B1F` | 正文主色，深棕黑 |
| `warm-secondary` | `#8C7B6B` | 次要文字、占位符、图标 |
| `warm-active` | `#A0785A` | 主色调，按钮/激活态/下划线 |
| `warm-active-hover` | `#8A6649` | 主色 hover 深色 |
| `warm-border` | `#E8E0D5` | 边框、分割线 |
| `warm-cream` | `#FBF7F2` | 卡片/组件背景，略深于页面 |
| 点赞激活色 | `#C8825A` | 暖橙棕，情感反馈专用 |

> 新增颜色时优先从以上色板中选取。确实需要新色时，选用低饱和度暖色调，保持整体一致性。

### 命名约定（BEM 风格）
- 沿用现有 `.blog-` 前缀命名空间
- 格式：`.blog-[模块]--[状态/子元素]`，例如：
  - `.blog-header--login`
  - `.blog-avatar-img`
  - `.blog-login__submit-btn`（新页面也可用 `__` 双下划线子元素写法）

---

## 组件规范

### Vue 2 Options API 结构顺序
```javascript
export default {
  name: '',
  components: {},
  props: {},
  data() { return {} },
  computed: {},
  watch: {},
  methods: {}...
}
```

### Vuex 使用方式
- 使用 `mapGetters` 映射 state 的只读数据
- 使用 `mapActions` 映射方法
- **不要**在组件内直接使用 `this.$store.state` 修改状态

### Element UI 组件
- 继续使用 Element UI 已有组件，不要引入其他新的桌面端 UI 库
- **移动端**已引入 Vant，移动端组件（`/components/mobile/`、`/mviews/`）可使用 Vant 组件
- 如果两者都没有合适组件，可以自行编写，但样式须与整体风格一致

### 响应式设计
- 桌面端使用 Element UI 的响应式栅格（`el-row`、`el-col`）及 `.hidden-xs-only` 等辅助类
- 移动端有独立页面目录 `/mviews/` 和独立组件目录 `/components/mobile/`
- `App.vue` 中通过 `navigator.userAgent` 检测移动设备并自动跳转移动端路由（`/m/...`）

---

## 禁止修改的范围

- `public/index.html`
- 任何 `.env` 配置文件
- `src/store/modules/` 下的 `like.js` 和 `modal.js`（**不得修改状态结构和 action 名称**）

---

## 新增功能开发原则

1. **不破坏现有 props 接口**：修改已有组件时，对外暴露的 props 名称和类型不得更改
2. **复用优先**：新功能尽量复用现有组件和 Vuex getter，避免重复造轮子
3. **每个功能单独分支**：建议按功能粒度 commit，方便回滚

---

## 验证流程

每次完成一个组件或页面的改动后，验证：

```bash
# 确保编译无报错
npm run serve

```

---

## 参考：已重构的关键组件

### ArticleAIChat（`src/components/article/ArticleAIChat.vue`）
- 插入位置：`ArticlePage.vue` 中，正文（`ArticleContentVue`）下方、评论输入框（`CommentTextAreaVue`）上方
- 接收 prop：`article`（完整文章对象），内部使用 `article.content`（HTML）作为上下文
- **预设引导问题**：组件初始展示 3 个快捷问题，点击后直接发送，发送后隐藏
- **流式输出**：使用原生 `fetch` + `ReadableStream` 读取后端 SSE，逐字追加到 AI 气泡；回复中光标闪烁
- **多轮对话**：每次请求携带完整 `messages` 历史
- **输入框**：Enter 发送，Shift+Enter 换行，自适应高度（max 120px）；发送中按钮 loading 并禁用
- **气泡样式**：用户消息靠右暖棕色背景，AI 消息靠左白色卡片；历史区域 max-height 400px 内滚动
- **后端接口**：直接 `fetch('http://127.0.0.1:3000/api/ai/chat')`，不经过 `$api` 封装（SSE 需原生 fetch）