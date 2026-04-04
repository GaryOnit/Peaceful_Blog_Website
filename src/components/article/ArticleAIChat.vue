<template>
  <el-card class="blog-ai-chat">
    <div class="blog-ai-chat__header">
      <span class="blog-ai-chat__title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="blog-ai-chat__icon">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 14.99 3 16.28L2 22L7.72 21C9.01 21.64 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#A0785A" opacity="0.15"/>
          <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 14.99 3 16.28L2 22L7.72 21C9.01 21.64 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="#A0785A" stroke-width="1.5" fill="none"/>
          <circle cx="8" cy="12" r="1.2" fill="#A0785A"/>
          <circle cx="12" cy="12" r="1.2" fill="#A0785A"/>
          <circle cx="16" cy="12" r="1.2" fill="#A0785A"/>
        </svg>
        问问 AI
      </span>
      <span class="blog-ai-chat__desc">基于本文内容回答你的问题</span>
    </div>

    <!-- 预设引导问题 -->
    <div v-if="!hasStarted" class="blog-ai-chat__presets">
      <div
        v-for="(q, idx) in presetQuestions"
        :key="idx"
        class="blog-ai-chat__preset-item"
        @click="sendPreset(q)"
      >
        <i class="el-icon-chat-dot-round"></i>
        {{ q }}
      </div>
    </div>

    <!-- 对话历史 -->
    <div v-if="hasStarted" ref="chatHistory" class="blog-ai-chat__history">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        class="blog-ai-chat__bubble-wrap"
        :class="msg.role === 'user' ? 'blog-ai-chat__bubble-wrap--user' : 'blog-ai-chat__bubble-wrap--ai'"
      >
        <div
          class="blog-ai-chat__bubble"
          :class="msg.role === 'user' ? 'blog-ai-chat__bubble--user' : 'blog-ai-chat__bubble--ai'"
        >
          <span v-if="msg.role === 'assistant' && idx === messages.length - 1 && isStreaming">
            {{ msg.content }}<span class="blog-ai-chat__cursor"></span>
          </span>
          <span v-else>{{ msg.content }}</span>
        </div>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="blog-ai-chat__input-wrap">
      <textarea
        ref="inputEl"
        v-model="inputText"
        class="blog-ai-chat__input"
        placeholder="针对本文提问..."
        rows="1"
        @keydown.enter.exact.prevent="handleSend"
        @keydown.shift.enter="allowNewline"
        @input="autoResize"
      ></textarea>
      <button
        class="blog-ai-chat__send-btn"
        :disabled="isStreaming || !inputText.trim()"
        @click="handleSend"
      >
        <i v-if="isStreaming" class="el-icon-loading"></i>
        <i v-else class="el-icon-s-promotion"></i>
      </button>
    </div>
  </el-card>
</template>

<script>
const BASE_URL = 'http://127.0.0.1:3000';

export default {
  name: 'ArticleAIChat',
  props: {
    article: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      inputText: '',
      messages: [],
      isStreaming: false,
      hasStarted: false,
      presetQuestions: [
        '这篇文章的核心观点是什么？',
        '有没有相关的延伸阅读建议？',
        '文中有没有我需要提前了解的前置知识？'
      ]
    };
  },
  methods: {
    sendPreset(question) {
      this.inputText = question;
      this.handleSend();
    },
    handleSend() {
      const text = this.inputText.trim();
      if (!text || this.isStreaming) return;
      this.hasStarted = true;
      this.inputText = '';
      this.$nextTick(() => {
        if (this.$refs.inputEl) {
          this.$refs.inputEl.style.height = 'auto';
        }
      });
      this.messages.push({ role: 'user', content: text });
      this.messages.push({ role: 'assistant', content: '' });
      this.$nextTick(() => this.scrollToBottom());
      this.streamChat(text);
    },
    async streamChat() {
      this.isStreaming = true;
      const articleContext = this.article.content || '';
      const historyMessages = this.messages
        .slice(0, -1)
        .filter(m => m.content)
        .map(m => ({ role: m.role, content: m.content }));

      try {
        const response = await fetch(`${BASE_URL}/api/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: historyMessages,
            articleContext
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          this.messages[this.messages.length - 1].content = errData.message || '请求失败，请稍后重试';
          this.isStreaming = false;
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                this.messages[this.messages.length - 1].content += delta;
                this.$nextTick(() => this.scrollToBottom());
              }
            } catch (_) {}
          }
        }
      } catch (err) {
        this.messages[this.messages.length - 1].content = '网络错误，请检查连接后重试';
      } finally {
        this.isStreaming = false;
      }
    },
    scrollToBottom() {
      const el = this.$refs.chatHistory;
      if (el) el.scrollTop = el.scrollHeight;
    },
    autoResize(e) {
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    },
    allowNewline() {}
  }
};
</script>

<style lang="stylus" scoped>
warm-bg = #FDFBF7
warm-text = #3D2B1F
warm-secondary = #8C7B6B
warm-active = #A0785A
warm-active-hover = #8A6649
warm-border = #E8E0D5
warm-cream = #FBF7F2

.blog-ai-chat
  margin-bottom 24px

.blog-ai-chat__header
  display flex
  align-items center
  gap 12px
  margin-bottom 16px
  padding-bottom 14px
  border-bottom 1px solid warm-border

.blog-ai-chat__title
  display flex
  align-items center
  gap 6px
  font-family 'Playfair Display', 'Noto Serif SC', Georgia, serif
  font-size 18px
  font-weight 700
  color warm-text

.blog-ai-chat__icon
  flex-shrink 0

.blog-ai-chat__desc
  font-size 13px
  color warm-secondary

.blog-ai-chat__presets
  display flex
  flex-direction column
  gap 8px
  margin-bottom 16px

.blog-ai-chat__preset-item
  display flex
  align-items center
  gap 8px
  padding 10px 14px
  background-color warm-cream
  border 1px solid warm-border
  border-radius 8px
  color warm-active
  font-size 14px
  cursor pointer
  transition all 0.2s ease

  i
    color warm-active
    font-size 15px

  &:hover
    background-color warm-active
    color #fff
    border-color warm-active

    i
      color #fff

.blog-ai-chat__history
  max-height 400px
  overflow-y auto
  margin-bottom 16px
  display flex
  flex-direction column
  gap 12px
  padding-right 4px

  &::-webkit-scrollbar
    width 4px

  &::-webkit-scrollbar-thumb
    background-color warm-border
    border-radius 2px

.blog-ai-chat__bubble-wrap
  display flex

  &--user
    justify-content flex-end

  &--ai
    justify-content flex-start

.blog-ai-chat__bubble
  max-width 78%
  padding 10px 14px
  border-radius 12px
  font-size 14px
  line-height 1.7
  word-break break-word
  white-space pre-wrap

  &--user
    background-color warm-active
    color #fff
    border-bottom-right-radius 4px

  &--ai
    background-color #fff
    color warm-text
    border 1px solid warm-border
    border-bottom-left-radius 4px
    box-shadow 0 1px 4px rgba(160, 120, 90, 0.06)

.blog-ai-chat__cursor
  display inline-block
  width 2px
  height 14px
  background-color warm-active
  margin-left 2px
  vertical-align middle
  animation blink 0.8s step-end infinite

@keyframes blink
  0%, 100%
    opacity 1
  50%
    opacity 0

.blog-ai-chat__input-wrap
  display flex
  align-items flex-end
  gap 10px
  padding 10px 12px
  background-color warm-cream
  border 1px solid warm-border
  border-radius 10px
  transition border-color 0.2s

  &:focus-within
    border-color warm-active

.blog-ai-chat__input
  flex 1
  border none
  outline none
  background transparent
  resize none
  font-size 14px
  color warm-text
  font-family Georgia, 'Noto Serif SC', serif
  line-height 1.6
  min-height 24px
  max-height 120px
  overflow-y auto

  &::placeholder
    color warm-secondary

.blog-ai-chat__send-btn
  flex-shrink 0
  width 36px
  height 36px
  border none
  border-radius 8px
  background-color warm-active
  color #fff
  cursor pointer
  display flex
  align-items center
  justify-content center
  font-size 16px
  transition all 0.2s ease

  &:hover:not(:disabled)
    background-color warm-active-hover

  &:disabled
    background-color warm-border
    color warm-secondary
    cursor not-allowed
</style>
