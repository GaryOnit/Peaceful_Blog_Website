<template>
  <div class="blog-chat">
    <div class="blog-chat--content">
      <div
        class="blog-chat--item"
        :class="chat.dis"
        v-for="chat in chatList"
        :key="chat.id"
      >
        <span v-if="chat.nickname && chat.type !== 'notice'" class="blog-chat--nickname">{{
          chat.nickname
        }}</span>
        
        <div class="blog-chat--main">
          <div class="blog-chat--box">
            <p class="blog-chat--msg" v-if="chat.msg">{{ chat.msg }}</p>
          </div>
          <span class="blog-chat--time" v-if="chat.time && chat.type !== 'notice'">{{ chat.time }}</span>
        </div>
      </div>
    </div>

    <div class="blog-chat--bottom">
      <el-input
        v-model="sendMsg"          
        placeholder="请输入内容..."
        @keydown.native.enter="clientChat"  
      ></el-input>
      <el-button type="primary" @click="clientChat">发送</el-button>
    </div>

    <el-dialog title="确认身份" :visible.sync="dialogVisible" width="320px" :close-on-click-modal="false">
      <div style="margin-bottom: 10px">请输入您的昵称:</div>
      <el-input v-model="nickname" placeholder="昵称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="enterChat" style="width: 100%">进入聊天室</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import formateDate from "@/util/formateDate";

export default {
  name: "SocketPage",
  data() {
    return {
      sendMsg: "",
      chatList: [],
      nickname: "",
      ws: null,
      dialogVisible: true,
    };
  },
  created() {
    this.initSocket();
    this.clientChat = this._.debounce(this._clientChat, 300, { leading: true, trailing: false })
  },
  beforeDestroy() {
    if(this.ws) this.ws.emit("leaveChat");
  },
  methods: {
    //登录 → 建立 WS
    //连接成功 → 触发 connect → 发 online 上线
    //进聊天室 → 发 enterChat
    //退聊天室 → 发 leaveChat
    //关闭 → 连接断开
    initSocket() {
      if (this.$ws) {
        this.ws = this.$ws;
        this.getUserInfo();
        this.ws.emit("enterChat", { uid: this.uid, nickname: this.nickname });
        this.dialogVisible = false;
      } else {
        this.ws = io(process.env.VUE_APP_USER_CHAT_PATH, {
          transports: ["websocket"],
        });
      }
      this.ws.on("chat", (data) => this.serverChat(data));
      this.ws.on("logout", (nickname) => this.serverLog({ nickname, isLogin: false }));
      this.ws.on("logged", (nickname) => this.serverLog({ nickname, isLogin: true }));
    },
    getUserInfo() {
      let userInfo = this.$store.getters.userInfo;
      if(userInfo) {
        this.nickname = userInfo.nickname;
        this.uid = userInfo._id;
      }
    },
    enterChat() {
      if(!this.nickname.trim()) return;
      this.ws.emit("enterChat", { nickname: this.nickname });
      this.dialogVisible = false;
    },
    addChat({
      type = "msg",
      msg = "",
      nickname = "",
      time = formateDate(),
      isMe = false,
    }) {
      let dis = "left";
      if (type === "notice") dis = "center";
      else if (isMe) dis = "right";
      
      let shortTime = "";
      if (time && time.includes(" ")) {
        shortTime = time.split(" ")[1].substring(0, 5);
      } else {
        shortTime = time; 
      }
      
      this.chatList.push({
        type, msg, nickname, isMe, dis,
        time: shortTime,
        id: Date.now() + Math.random()
      });
      
      this.$nextTick(() => {
        const container = this.$el.querySelector('.blog-chat--content');
        if(container) container.scrollTop = container.scrollHeight;
      });
    },
    clientChat() {},
    _clientChat() {
      if (!this.sendMsg.trim()) return;
      this.addChat({ isMe: true, msg: this.sendMsg, nickname: this.nickname });
      this.ws.emit("send", this.sendMsg);
      this.sendMsg = "";
    },
    serverChat({ msg = "", nickname = "xxx", time = "" }) {
      this.addChat({ nickname, msg, time });
    },
    serverLog({ nickname, isLogin }) {
      this.addChat({
        type: "notice",
        msg: `${nickname} ${isLogin ? '进入' : '离开'}了聊天室`,
      });
    }
  },
};
</script>

<style lang="stylus" scoped>
warm-bg         = #FDFBF7
warm-text       = #3D2B1F
warm-secondary  = #8C7B6B
warm-active     = #A0785A
warm-active-h   = #8B6549
warm-border     = #E8E0D5
warm-avatar-bg  = #F0E8DF
warm-time       = #C4B5A8

.blog-chat
  position relative
  display flex
  flex-direction column
  background-color #fff
  border 1px solid warm-border
  border-radius 12px
  width 680px            
  max-width 96vw
  margin 40px auto       
  height 600px           
  box-shadow 0 10px 30px rgba(61, 43, 31, 0.1)
  overflow hidden

.blog-chat::before
  content '聊天室'
  display flex
  align-items center
  padding 0 20px
  height 52px
  background warm-bg
  border-bottom 1px solid warm-border
  font-size 16px
  font-weight 700
  color warm-text

.blog-chat--content
  flex 1
  overflow-y auto
  padding 20px
  display flex
  flex-direction column
  align-items stretch
  gap 16px
  background-color #fff

.blog-chat--item
  display flex
  width 100%

.blog-chat--item.left
  flex-direction row
  justify-content flex-start

.blog-chat--item.right
  flex-direction row-reverse
  justify-content flex-start

// 【修正】系统通知完全居中
.blog-chat--item.center
  justify-content center
  margin 8px 0

.blog-chat--nickname
  flex-shrink 0
  display flex
  align-items center
  justify-content center
  width 36px
  height 36px
  border-radius 50%
  background warm-avatar-bg
  color warm-active
  font-size 12px
  font-weight 700
  margin 0 10px

.blog-chat--item.right .blog-chat--nickname
  background warm-active
  color #fff

.blog-chat--main
  display flex
  flex-direction column
  max-width 70%
  gap 3px

// 【修正】通知容器不限制最大宽度，且内部居中
.blog-chat--item.center .blog-chat--main
  max-width 100%
  align-items center

.blog-chat--box
  display flex
  flex-direction column
  padding 10px 14px
  border-radius 12px

.blog-chat--item.right .blog-chat--box
  background warm-active
  border 1px solid warm-active
  color #fff
  border-top-right-radius 2px
  align-items flex-end 

.blog-chat--item.left .blog-chat--box
  background #fdf9f5
  border 1px solid warm-border
  color warm-text
  border-top-left-radius 2px
  align-items flex-start

// 【修正】系统通知气泡
.blog-chat--item.center .blog-chat--box
  background warm-avatar-bg
  border none
  border-radius 20px
  padding 6px 20px
  .blog-chat--msg
    font-size 12px
    color warm-secondary
    white-space nowrap // 防止通知文字换行错位

.blog-chat--msg
  margin 0
  line-height 1.5
  font-size 14px
  word-break break-word

.blog-chat--time
  font-size 11px
  color warm-time
  opacity 0.8
  margin-top 2px

.blog-chat--item.right .blog-chat--time
  align-self flex-end 

.blog-chat--item.left .blog-chat--time
  align-self flex-start

.blog-chat--bottom
  display flex
  align-items center
  gap 12px
  padding 16px
  background warm-bg
  border-top 1px solid warm-border

::v-deep .el-input__inner
  border-color #D4B896
  border-radius 8px

.el-button--primary
  background-color warm-active
  border-color warm-active
  border-radius 8px
</style>