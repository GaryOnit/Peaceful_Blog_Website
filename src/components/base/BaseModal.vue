<!--
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-23 16:17:39
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-21 13:56:09
 * @FilePath: \vue-blog\src\components\base\BaseModal.vue
 * @Description: 基础模态框组件，封装了Element UI的Dialog，集成表单功能和按钮操作
-->
<template>
  <div>
    <!-- Element UI 对话框组件 -->
    <el-dialog 
      :title="title"          
      :visible.sync="isShow"  
      :width="width"          
      :before-close="close">  
      
      <!-- 基础表单组件：根据formType条件渲染，ref用于获取表单实例 -->
      <BaseFormVue  
        ref="form"
        :type="type"
        v-if="formType" />

      <!-- 对话框底部插槽：自定义按钮区域 -->
      <div slot="footer" class="dialog-footer">
        <!-- 循环渲染按钮：按钮配置从modal.config获取 -->
        <el-button 
          v-for="btn in btns"
          :key="btn.targetName"
          @click="btnHandler(btn.targetName,btn.isSubmit)">{{btn.name}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入模态框配置文件（包含标题、宽度、按钮、表单类型等配置）
import MODAL_DATA from '@/config/modal.config'
// 导入Vuex命名空间辅助函数，用于模块化调用
import { createNamespacedHelpers } from 'vuex'
// 导入基础表单组件
import BaseFormVue from './BaseForm.vue'
// 创建modal模块的Vuex辅助函数（映射state和actions）
const { mapState, mapActions } = createNamespacedHelpers('modal')

export default {
  name: 'BaseModal',
  components: {
    BaseFormVue
  },
  data () {
    return {
      
    };
  },
  // 计算属性
  computed: {
    // 映射Vuex中modal模块的状态：isShow(显示状态)、type(模态框类型)
    ...mapState(['isShow', 'type']),
    
    // 模态框标题：根据type从配置文件获取，无配置则用默认标题
    title () {
      return MODAL_DATA[this.type]?.title ?? '默认标题'
    },
    
    // 模态框宽度：根据type从配置文件获取，无配置则默认60%
    width () {
      return MODAL_DATA[this.type]?.width ?? '60%'
    },
    
    // 表单类型：用于渲染对应类型的表单，无配置则不渲染表单
    formType () {
      return MODAL_DATA[this.type]?.formType
    },
    
    // 表单数据：预留的表单初始数据（当前代码未使用）
    formData () {
      return MODAL_DATA[this.type]?.formData
    },
    
    // 按钮配置：从配置文件获取，无配置则使用默认的取消/提交按钮
    btns () {
      return MODAL_DATA[this.type]?.btns ?? [{
        targetName: 'close',  // 按钮对应的方法名
        name: '取消'          // 按钮显示文本
      },
      {
        targetName: 'confirm',// 按钮对应的方法名
        name: '提交',         // 按钮显示文本
        isSubmit:true         // 是否为提交按钮（需要表单验证）
      }]
    }
  },
  // 组件方法
  methods: {
    // 映射Vuex中modal模块的方法：close(关闭)、open(打开)
    ...mapActions(['close', 'open']),
    
    /**
     * 按钮点击处理函数
     * @param {String} action - 按钮对应的方法名（如close/confirm）
     * @param {Boolean} isSubmit - 是否为提交按钮（是否需要表单验证）
     */
    btnHandler (action, isSubmit) {
      // 如果是提交按钮，执行表单提交逻辑
      if(isSubmit){
        this.submitForm(this.type)
        return
      }
      // 非提交按钮，直接执行对应的方法（如close）
      this[action] && this[action]()
    },
    
    /**
     * 表单提交处理函数
     * 1. 验证表单合法性
     * 2. 合法则调用接口提交数据
     * 3. 提交成功后关闭模态框，触发视图更新
     * 4. 失败则重置表单
     */
    submitForm () {
      // 无表单类型时直接返回
      if (!this.formType) {
        return false
      }
      
      // 获取表单组件实例（BaseFormVue）
      let refForm = this.$refs['form']
      // 获取Element UI的ElForm实例，执行表单验证
      refForm.$refs['elForm'].validate(async (valid) => {
        // 表单验证通过
        if (valid) {
          try {
            // 调用API提交表单数据：根据formType调用对应接口，传入表单数据
            await this.$api({ type: this.formType, data: refForm.form })
            // 提交成功，关闭模态框
            this.close()
            // 如果需要更新视图，通过事件总线触发updateView事件
            if (this.needUpdate) {
              this.$EventBus.$emit('updateView')
            }
          } catch (err) {
            // 提交失败，重置表单字段
            refForm.$refs['elForm'].resetFields()
          }
        } else {
          // 表单验证失败，返回false
          return false;
        }
      });
    },
  },
};
</script>

<style lang="stylus">
warm-text = #3D2B1F
warm-secondary = #8C7B6B
warm-active = #A0785A
warm-border = #E8E0D5
warm-cream = #FBF7F2

// 遮罩层垂直居中（不加 !important，否则会覆盖 v-show 的 display:none）
.el-dialog__wrapper
  display flex
  align-items center
  justify-content center

.el-dialog
  margin 0 auto !important
  width 440px !important
  border-radius 12px !important
  overflow hidden
  box-shadow 0 24px 64px rgba(60, 40, 20, 0.16), 0 4px 20px rgba(60, 40, 20, 0.08) !important

// 标题栏
.el-dialog__header
  background-color warm-cream !important
  border-bottom 1px solid warm-border !important
  padding 18px 24px 16px !important

.el-dialog__title
  font-size 15px !important
  font-weight 600 !important
  color warm-text !important
  letter-spacing 0.05em

// 关闭按钮
.el-dialog__headerbtn
  top 15px !important
  right 18px !important
  .el-dialog__close
    color warm-secondary !important
    font-size 17px
    transition color 0.2s
    &:hover
      color warm-active !important

// 内容区
.el-dialog__body
  background-color #fff !important
  padding 24px !important
  color warm-text

// 底部按钮区
.el-dialog__footer
  background-color warm-cream !important
  border-top 1px solid warm-border !important
  padding 14px 24px !important

// 按钮行均匀分散
.dialog-footer
  display flex
  justify-content space-between
  align-items center

// 所有按钮等宽
.dialog-footer .el-button
  flex 1
  border-radius 8px
  padding 9px 0
  font-size 13px
  background-color #fff
  border-color warm-border
  color warm-secondary
  transition background-color 0.2s, border-color 0.2s, color 0.2s
  &:not(:last-child)
    margin-right 12px
  &:hover
    border-color warm-active
    color warm-active
    background-color #fff

// 提交按钮（最后一个）
.dialog-footer .el-button:last-child
  background-color warm-active
  border-color warm-active
  color #fff
  &:hover
    background-color #8a6649
    border-color #8a6649
    color #fff
</style>