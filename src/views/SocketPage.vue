<template>
  <div class="blog-chat">
    <!-- 聊天消息展示区域 -->
    <div class="blog-chat--content">
      <!-- 循环渲染聊天消息项：dis控制消息对齐方向（左/右/居中） -->
      <div
        class="blog-chat--item"
        :class="chat.dis"
        v-for="chat in chatList"
        :key="chat.id"
      >
        <!-- 发送者昵称（非系统通知时显示） -->
        <span v-if="chat.nickname" class="blog-chat--nickname">{{
          chat.nickname
        }}</span>
        <!-- 消息内容容器 -->
        <div class="blog-chat--box">
          <!-- 消息发送时间 -->
          <span class="blog-chat--time" v-if="chat.time">{{ chat.time }}</span>
          <!-- 消息正文 -->
          <p class="blog-chat--msg" v-if="chat.msg">{{ chat.msg }}</p>
        </div>
      </div>
    </div>

    <!-- 消息输入与发送区域 -->
    <div class="blog-chat--bottom">
      <el-input
        v-model="sendMsg"          
        placeholder="请输入内容"
        @keydown.native.enter="clientChat"  
      ></el-input>
      <el-button type="primary" @click="clientChat">发送消息</el-button>
    </div>

    <!-- 昵称输入弹窗：进入聊天室时先输入昵称 -->
    <el-dialog title="欢迎聊天" :visible.sync="dialogVisible" width="30%">
      输入昵称:
      <el-input v-model="nickname"> </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="enterChat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入socket.io客户端（用于建立WebSocket连接）
import { io } from "socket.io-client";
// 导入日期格式化工具（处理消息时间显示）
import formateDate from "@/util/formateDate";

export default {
  name: "SocketPage",
  data() {
    return {
      sendMsg: "",          // 输入框待发送的消息内容
      chatList: [],         // 聊天消息列表（存储所有聊天记录）
      nickname: "",         // 用户昵称（聊天室显示用）
      ws: null,             // WebSocket实例
      dialogVisible: true,  // 昵称输入弹窗是否显示（默认显示）
    };
  },
  // 组件创建完成钩子：初始化WebSocket连接
  created() {
    // 初始化 Socket 连接
    this.initSocket();
  },
  // 组件销毁前钩子：清理WebSocket连接，避免内存泄漏
  beforeDestroy() {
    // 向服务端发送离开聊天室事件，关闭socket连接
    this.ws.emit("leaveChat");
  },
  methods: {
    /**
     * 初始化WebSocket连接
     * 1. 优先复用全局已有的WebSocket实例（this.$ws）
     * 2. 无全局实例则新建连接
     * 3. 监听服务端推送的各类事件（聊天消息、用户登录/登出）
     */
    initSocket() {
      // 如果全局已有WebSocket实例（从Vue原型获取），复用该实例
      if (this.$ws) {
        this.ws = this.$ws;
        // 获取Vuex中存储的用户信息（昵称/ID）
        this.getUserInfo();
        // 向服务端发送进入聊天室事件，携带用户ID和昵称
        this.ws.emit("enterChat", { uid: this.uid, nickname: this.nickname });
        // 关闭昵称输入弹窗
        this.dialogVisible = false;
      } else {
        // 无全局实例时，新建WebSocket连接（从环境变量获取服务端地址）
        this.ws = io(process.env.VUE_APP_USER_CHAT_PATH, {
          transports: ["websocket"], // 指定传输方式为websocket
        });
      }

      // 监听服务端推送的"chat"事件（接收其他用户发送的消息）
      this.ws.on("chat", (data) => {
        this.serverChat(data);
      });

      // 监听服务端推送的"logout"事件（用户离开聊天室通知）
      this.ws.on("logout", (nickname) => {
        this.serverLog({ nickname, isLogin: false });
      });

      // 监听服务端推送的"logged"事件（用户进入聊天室通知）
      this.ws.on("logged", (nickname) => {
        this.serverLog({ nickname, isLogin: true });
      });
    },

    /**
     * 从Vuex获取用户信息（昵称/ID）
     * 用于已登录用户自动填充昵称，无需手动输入
     */
    getUserInfo() {
      let { nickname, _id } = this.$store.getters.userInfo;
      this.nickname = nickname; // 赋值给组件内昵称变量
      this.uid = _id;           // 存储用户ID（用于标识唯一用户）
    },

    /**
     * 确认进入聊天室（昵称输入弹窗的确定按钮）
     * 向服务端发送进入聊天室事件，关闭弹窗
     */
    enterChat() {
      this.ws.emit("enterChat", { nickname: this.nickname });
      this.dialogVisible = false;
    },

    /**
     * 登录聊天室（预留方法，当前代码未使用）
     */
    login() {
      this.ws.emit("login", this.nickname);
      this.dialogVisible = false;
    },
    // 添加对话到对话列表中
    addChat({
      type = "msg",
      msg = "",
      nickname = "",
      time = formateDate(),
      isMe = false,
    }) {
      // 消息对齐方向：left(他人)/center(系统通知)/right(自己)
      let dis = "left";
      if (type === "notice") {
        dis = "center";
      }
      if (isMe) {
        dis = "right";
      }
      // 将消息添加到列表，用于页面渲染
      this.chatList.push({
        type,
        msg,
        nickname,
        time,
        isMe,
        dis,
      });
    },

    /**
     * 客户端发送消息（点击发送按钮/按回车键触发）
     */
    clientChat() {
      // 从输入框中获取信息
      let msg = this.sendMsg;
      // 避免发送空消息
      if (!msg.trim()) return;
      // 添加自己的消息到列表（标记isMe=true，右对齐）
      this.addChat({
        isMe: true,
        msg,
        nickname: this.nickname,
      });
      // 向服务端发送"send"事件，传递消息内容
      this.ws.emit("send", msg);
      // 清空输入框
      this.sendMsg = "";
    },

    /**
     * 接收服务端推送的聊天消息
     * @param {Object} data - 服务端推送的消息数据（msg/nickname/time）
     */
    serverChat({ msg = "", nickname = "xxx", time = "" }) {
      // 将服务端消息添加到本地列表（左对齐）
      this.addChat({
        nickname,
        msg,
        time,
      });
    },

    /**
     * 处理系统通知（用户进入/离开聊天室）
     * @param {Object} params - 通知参数
     * @param {String} params.nickname - 触发事件的用户昵称
     * @param {Boolean} params.isLogin - true=进入/false=离开
     */
    serverLog({ nickname, isLogin }) {
      let state = isLogin ? "进入" : "离开";
      let msg = `${nickname} ${state}了聊天室`;
      // 添加系统通知到列表（居中显示）
      this.addChat({
        type: "notice",
        msg,
      });
    },

    /**
     * 提交编辑器内容（预留方法，当前代码未使用）
     */
    submitEditor() {
      this.ws.emit("send", this.sendMsg);
    },
  },
};
</script>

<style lang="stylus" >
.blog-chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 90%;
  height: 80vh;
  padding: 20px 0 0;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 30px rgba(122, 122, 122, 0.8) inset;
  border-radius: 22px 22px 0 0;
}

.blog-chat--content {
  padding: 0 15px;
}

.blog-chat--item {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.blog-chat--item.left {
  justify-content: flex-start;
}

.blog-chat--item.right {
  justify-content: flex-start;
  flex-direction: row-reverse;
}

.blog-chat--box {
  display: flex;
  flex-direction: column;
  margin: 25px;
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
}

.blog-chat--nickname {
  flex: 0 0 auto;
}

.blog-chat--time {
  font-size: 12px;
}

.blog-chat--msg {
  padding: 6px 0 0;
  line-height: 1.5;
  font-size: 14px;
}

.blog-chat--notice {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  line-height: 20px;
}

.blog-chat--bottom {
  display: flex;
  background-color: #888;
  padding: 20px 10px;
}
</style>