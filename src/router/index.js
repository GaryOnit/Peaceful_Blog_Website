/*
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-10-02 14:05:55
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-21 15:04:38
 * @FilePath: \vue-blog\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 引入vuex的store
import store from '@/store'

//PC views
import HomePage from '../views/HomePage.vue'
import ArticlePage from '../views/ArticlePage.vue'
import ArticleList from '../views/ArticleList.vue'
import ColumnPage from '../views/ColumnPage.vue'
import EditorPage from '../views/EditorPage.vue'
import UserPage from '../views/UserPage'
import SocketPage from '../views/SocketPage.vue'
import LoginView from '../views/LoginView.vue'

//mobile views
import MHome from '../mviews/MHomePage'
import MArticleList from '../mviews/ArticleList'
import MArticle from '../mviews/ArticlePage'
import MColumn from '../mviews/ColumnPage.vue'
import MUserPage from '../mviews/MUserPage.vue'

Vue.use(VueRouter)

// 定义路由规则数组（包含桌面/移动端）
const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: LoginView
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/index',
    component: HomePage,
    children: [
      {
        path: '/index',
        name: 'index',
        component: ArticleList,
        props: (route) => ({
          columnId: route.query.columnId
        })
      },
      {
        path: '/column',
        name: 'column',
        component: ColumnPage,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/article/:id',
        name: 'article',
        component: ArticlePage
      },
      {
        path: '/editor',
        name: 'editor',
        component: EditorPage,
      },
      {
        path: '/user',
        name: 'user',
        component: UserPage,
      },
      {
        path: '/socket',
        name: 'socket',
        component: SocketPage
      },
    ]
  },
  {
    path: '/m',
    name: 'mHome',
    redirect: '/m/articles',
    component: MHome,
    children: [
      {
        path: 'articles',
        name: 'mArticleList',
        component: MArticleList,
        meta: {
          headType: 'SearchBar'
        }
      },
      {
        path: 'article/:id',
        name: 'mArticle',
        component: MArticle,
        meta: {
          headType: 'NavBar',
          title: '文章',
          button: '评论',
          buttonHandler: 'show-comment-action'
        }
      },
      {
        path: 'column',
        name: 'mColumn',
        component: MColumn,
        meta: {
          headType: 'NavBar',
          title: '分类'
        }
      },
      {
        path: 'user',
        name: 'mUser',
        component: MUserPage,
        meta: {
          headType: 'NavBar',
          title: '个人信息'
        },
        props: (route) => {
          return {
            userFormType: route.query.userFormType || 'login'
          }
        }
      }
    ]
  }
]

// 创建Vue Router实例，传入路由规则数组
const router = new VueRouter({
  routes 
})

// 设置路由守卫
// 路由跳转前执行，用于权限校验、加载状态控制等）
router.beforeEach((to, from, next) => {
  // 启动NProgress进度条
  NProgress.start()
  
  // 获取目标路由的meta.requiresAuth属性，判断该路由是否需要登录权限
  let useAuth = to.meta.requiresAuth 
  
  // 权限校验逻辑：需要登录但未登录（无token）
  if (useAuth && !store.state.token) {
    Vue.prototype.$notify.warning({
      title: '通知',
      message: `请先登录`
    })
    NProgress.done()
    next('/index') 
    return
  }
  // 允许跳转到目标路由
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router