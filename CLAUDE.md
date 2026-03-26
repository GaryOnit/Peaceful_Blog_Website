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
│   ├── article/       # ArticleBarInfo.vue、ArticleContent.vue
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
│   └── SocketPage.vue
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

### 设计风格目标
- 整体风格：**现代、简洁、有层次感**，适合博客类内容站点
- 配色：优先复用项目现有主题色；如需新增，选用低饱和度、易于阅读的配色
- 交互：按钮、头像、图标等可交互元素需有 `transition` 过渡动画（建议 `0.2s ~ 0.3s`）

### 全局样式变量（`src/assets/css/base.styl`）

```stylus
header-height = 60px
area-width = 1200px
radius-theme-size = 4px
padding-space = 8px
font-size-h = 12px
font-size-p = 16px

bg-theme-color = #f0f1f5           // 页面浅灰背景
bg-reverse-color = #2D2F33        // Header 深色背景
line-theme-color = rgb(85,85,85)
line-reverse-color = #ffffff
font-theme-color = rgb(85,85,85)  // 正文主色
font-modifier-color = rgb(153,153,153)  // 次要文字
font-title-color = #555

// 辅助色板
bg-color-red = #FF4E50
bg-color-orange = #FA6900
bg-color-blue = #69D2E7
bg-color-green = #A7DBD8
```

新增颜色时从以上色板中优先选取，保持整体色调一致。

### 命名约定（BEM 风格）
- 沿用现有 `.blog-` 前缀命名空间
- 格式：`.blog-[模块]--[状态/子元素]`，例如：
  - `.blog-header--login`
  - `.blog-avatar-img`
  - `.blog-header--logout`

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

- `src/store/` 下的所有 Vuex 模块（**不得修改状态结构和 action 名称**）
- `src/router/` 路由配置文件
- `public/index.html`
- 任何 `.env` 配置文件

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

## 参考：现有组件示例（UserImgAvatar）

该组件位于 `src/components/user/UserImgAvatar.vue`，功能是：
- 用户登录后在右上角显示头像（`el-image` 组件，圆形裁剪）
- 点击退出登录图标（SVG）触发 Vuex `logout` action

重构时可以以此为参考，了解项目的代码风格和组件粒度。