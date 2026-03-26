/*
 * @Author: Garyonit 3253975221@qq.com
 * @Date: 2025-09-26 18:57:03
 * @LastEditors: kusachan 3253975221@qq.com
 * @LastEditTime: 2026-03-21 14:33:44
 * @FilePath: \vue-blog\src\core\mixin.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  data () {
    return {

    }
  },
  methods: {
    refreshModal (type) {
      this.$store.dispatch('modal/open', type)
    }
  }
}
