/*
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-26 17:40:56
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-23 07:56:20
 * @FilePath: \vue-blog\src\config\api.config.js
 * @Description: API接口配置文件，按业务模块分类管理
 */
export default {
  // ====================== 1. 用户相关接口 ======================
  'register': {
    url: 'admin/register',
    method: 'POST',
    rsaKey: 'password', // 密码字段需要RSA加密
    setToken: true,     // 接口返回后自动设置token
  },
  'getUserInfo': {
    url: '/user',
    method: 'GET',      // 获取当前登录用户信息
  },
  'putUserInfo': {
    url: '/user',
    method: 'PUT',      // 修改当前登录用户信息
  },
  'login': {
    url: 'admin/login',
    method: 'POST',
    rsaKey: 'password', // 密码字段需要RSA加密
    setToken: true      // 登录成功后自动设置token
  },

  // ====================== 2. 公共/辅助接口 ======================
  'pubKey': {
    url: '/keys',
    method: 'GET'       // 获取RSA加密公钥（支撑登录/注册密码加密）
  },
  'index': {
    url: '/index',
    method: 'GET',
    noMessage: true     // 接口请求失败时不弹出提示弹窗
  },

  // ====================== 3. 文章相关接口 ======================
  'articles': {
    url: '/api/rest/articles',
    method: 'GET'       // 获取文章列表
  },
  'getArticleById': {
    rest: true,         // 标识为RESTful风格接口
    url: '/api/rest/articles/:id', // 动态参数：文章ID
    method: 'GET'       // 根据ID获取单篇文章详情
  },
  'postArticle': {
    url: '/api/rest/articles',
    method: 'POST'      // 发布新文章
  },
  'uploadArticle': {
    url: '/upload/article',
    method: 'POST'      // 文章图片/附件上传
  },
  'articleLikes': {
    url: '/articles/likes',
    method: 'POST',     // 文章点赞/取消点赞
  },
  'postComment': {
    url: '/api/rest/comments',
    method: 'POST'      // 发布文章评论
  },

  // ====================== 4. 分类专栏相关接口 ======================
  'columns': {
    url: '/api/rest/columns',
    method: 'GET'       // 获取专栏列表
  },
  'postColumn': {
    url: '/api/rest/columns',
    method: 'POST'      // 创建新专栏
  },
}