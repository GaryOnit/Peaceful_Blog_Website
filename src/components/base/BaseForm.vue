<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-26 15:48:53
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-21 14:13:01
 * @FilePath: \vue-blog\src\components\base\BaseForm.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <!-- Element UI 表单容器：绑定表单数据对象，ref用于获取表单实例 -->
    <el-form :model="form" ref="elForm">
      <!-- 循环渲染表单项：根据formData配置动态生成 -->
      <el-form-item
        v-for="item in formData"      
        :key="item['query']"          
        :label="item.label"          
        label-width="100px"          
        :rules="validateData[item['query']]"  
        :prop="item['query']"         
      >
        <!-- 头像上传组件：当配置项type为avatar时渲染 -->
        <el-upload
          v-if="item.type === 'avatar'"
          class="avatar-uploader"    
          ref="upload"                
          :headers="{                 
            Authorization: `Bearer ${$store.state.token}`,
          }"
          :data="{ uid: $store.state.uid }"  
          :action="userFileAction"    
          :show-file-list="false"  
          :on-success="handleAvatarSuccess" 
          :on-error="handleAvatarError"      
          :before-upload="beforeAvatarUpload"
        >
          <!-- 已上传头像显示：当form中存在avatar字段时渲染 -->
          <el-image
            style="width: 100px; height: 100px"
            v-if="form[item['query']]"
            :src="form[item['query']]"
            class="avatar"
            fit="fit"               
          ></el-image>
          <!-- 未上传时显示加号图标 -->
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <!-- 文本/密码输入框：当配置项type为text/password时渲染 -->
        <el-input
          v-if="['text', 'password'].includes(item.type)"
          v-model="form[item['query']]" 
          :type="item.type"              
          :disabled="item.readonly"       
          :placeholder="item.placeholder"
          :name="item['query']"          
          autocomplete="off"            
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入表单配置文件（不同类型表单的字段、类型、标签等配置）
import FORM_DATA from "@/config/form.config";
// 导入表单校验规则配置文件
import VALIDATE_DATA from "@/config/validate.config";
// 导入进度条插件：用于文件上传时的进度展示
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default {
  // 组件名称
  name: "BaseForm",
  // 组件内部数据
  data() {
    return {
      form: {},  // 表单数据对象：存储所有表单项的输入值
    };
  },
  // 父组件传入的props
  props: {    
    // 表单类型：由父组件(BaseModal)传入，用于匹配对应的表单配置
    type: {
      type: String,
    },
  },
  // 组件创建完成钩子
  created(){
    // 如果是用户信息表单：从Vuex中获取用户信息并初始化表单
    if (this.type === 'userInfo') {   
      this.form = Object.fromEntries(
        // 过滤用户信息：只保留form.config中配置的字段
        Object.entries(this.$store.getters.userInfo).filter(([key]) => {
          return FORM_DATA['userInfo'].find(item => {
            return key === item['query']
          })
        })
      )
    }
  },
  // 组件方法
  methods: {
    /**
     * 初始化表单
     * 1. 清空表单数据对象
     * 2. 重置表单校验状态
     */
    initForm() {
      this.form = {};
      this.resetForm();
    },

    /**
     * 重置表单
     * 调用Element UI表单的resetFields方法，重置字段值和校验状态
     */
    resetForm() {
      this.$refs["elForm"].resetFields();
    },

    /**
     * 头像上传成功回调
     * @param {Object} res - 接口返回的响应数据
     */
    handleAvatarSuccess(res) {
      // 将上传成功后的图片链接更新到表单中
      this.form.avatar = res.data.fileURL;
      // 停止进度条
      NProgress.done();
    },

    /**
     * 头像上传失败回调
     * @param {Error} err - 上传错误信息
     */
    handleAvatarError(err) {
      // 显示错误提示
      this.$notify.error({
        title: "上传失败",
        message: JSON.parse(err.message)?.message,
      });
    },

    /**
     * 头像上传前的校验
     * @param {File} file - 待上传的文件对象
     * @returns {Boolean} - 校验通过返回true，否则返回false
     */
    beforeAvatarUpload(file) {
      let { size, type } = file;
      let sizePass = true, typePass = true;
      
      // 校验文件类型：必须是图片
      sizePass = /image/g.test(type); 
      // 校验文件大小：不超过5M
      typePass = size < 5 * 1024 * 1024; 

      // 大小校验失败
      if (!sizePass ) {
        this.$notify.error({
          title: "上传错误",
          message: "文件不得大于5M",
        });
        // 终止上传
        this.$refs.upload[0].abort(file);
        return false;
      }
      // 类型校验失败
      if (!typePass) {
        this.$notify.error({
          title: "上传错误",
          message:  "请选择图片文件",
        });
        // 终止上传
        this.$refs.upload[0].abort(file);
        return false;
      }
      // 校验通过，启动进度条
      NProgress.start();
    },
  },
  // 计算属性
  computed: {
    /**
     * 获取当前类型的表单配置
     * 根据父组件传入的type，从FORM_DATA中匹配对应的表单字段配置
     */
    formData() {
      return FORM_DATA[this.type];
    },

    /**
     * 获取表单校验规则
     * 从VALIDATE_DATA中获取所有字段的校验规则
     */
    validateData() {
      return VALIDATE_DATA;
    },

    /**
     * 表单值的双向绑定（供父组件使用）
     * get：返回当前表单数据
     * set：触发自定义事件，将表单数据传递给父组件
     */
    formValue: {
      get() {
        return this.form;
      },
      set(value) {
        this.$emit("update:form", value);
      },
    },

    /**
     * 用户文件上传接口地址
     * 从环境变量中获取，便于不同环境（开发/生产）切换
     */
    userFileAction () {
      return process.env.VUE_APP_USER_UPLOAD_PATH
    }
  },
  // 监听属性
  watch: {
    /**
     * 监听表单类型变化
     * 当父组件传入的type改变时，重新初始化表单
     */
    type() {
      this.initForm(); //modal类型改变时重置一切
    },
  },
};
</script>

<style lang="stylus">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>