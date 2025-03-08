<template>
  <div class="container">
    <div class="ai-chat-container" id="ai-chat">
      <!-- AI聊天界面将在这里显示 -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
// 在setup()顶部添加路由相关引用
import { useRoute } from 'vue-router';
const route = useRoute();
const isAIChatRoute = ref(true); // 根据实际路由逻辑修改

// 修改visibilitychange监听器
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isAIChatRoute.value) {
        reinitializeChatbot();
    }
});

// 添加状态追踪
const chatInitialized = ref(false);

// 修改初始化配置函数，确保配置能被正确重用
const initChatbotConfig = () => {
  window.CHATBOT_CONFIG = {
    endpoint: "http://121.41.108.215:8087/api/orders/chat",
    displayByDefault: true,
    container: '#ai-chat',
    aiChatOptions: {
      conversationOptions: {
        conversationStarters: [
          {prompt: '连衣裙的尺码标示不准，实际偏小一码怎么办？'},
          {prompt: '收到的外套颜色与网页展示差异大，能否换货？'},
          {prompt: '这件T恤领口变形了，能否退换？ '},
        ],
        // 确保每次都能正确加载历史记录
        history: JSON.parse(localStorage.getItem('chatHistory') || '[]')
      },
      displayOptions: {
        height: '100%',
        width: '100%',
        embedded: true
      },
      personaOptions: {
        assistant: {
          name: '你好，我是你的 AI 助手小内',
          avatar: 'https://img.alicdn.com/imgextra/i2/O1CN01Pda9nq1YDV0mnZ31H_!!6000000003025-54-tps-120-120.apng',
          tagline: '您可以尝试点击下方的快捷入口开启体验！',
        }
      }
    }
  };
};

// 改进保存对话记录的函数
const saveConversationHistory = () => {
  const chatContainer = document.querySelector('.webchat-container');
  if (chatContainer && window.chatbotInstance) {
    const history = window.chatbotInstance.getConversationHistory() || [];
    localStorage.setItem('chatHistory', JSON.stringify(history));
  }
};

// 改进初始化聊天机器人的函数
const initChatbot = () => {
  // 如果已经初始化过，直接返回
  if (chatInitialized.value) return;
  
  cleanup(); // 清理旧的聊天实例
  initChatbotConfig();

  const script = document.createElement('script');
  script.type = 'module';
  script.crossOrigin = true;
  script.src = 'https://g.alicdn.com/aliyun-documentation/web-chatbot-ui/0.0.24/index.js';

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.crossOrigin = true;
  link.href = 'https://g.alicdn.com/aliyun-documentation/web-chatbot-ui/0.0.24/index.css';

  document.head.appendChild(link);
  document.body.appendChild(script);

  script.onload = () => {
    chatInitialized.value = true;
    // 保存chatbot实例以便后续使用
      if (window.chatbot) {
        window.chatbotInstance = window.chatbot;
    }
  };
};

// 添加重新初始化函数
const reinitializeChatbot = () => {
  if (!document.querySelector('.webchat-container')) {
    chatInitialized.value = false;
    initChatbot();
  }
};

// 清理残留的DOM元素和脚本
const cleanup = () => {
  // 清理旧脚本
  document.querySelectorAll('script[src*="web-chatbot-ui"]').forEach(script => script.remove());
  document.querySelectorAll('link[href*="web-chatbot-ui"]').forEach(link => link.remove());
  // 清理聊天容器
  const chatContainer = document.querySelector('.webchat-container');
  if (chatContainer) chatContainer.remove();
};

onMounted(() => {
  initChatbot();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isAIChatRoute.value) {
      reinitializeChatbot();
    }
  });
});

// 改进组件卸载前的清理
onBeforeUnmount(() => {
  saveConversationHistory();
  document.removeEventListener('visibilitychange', reinitializeChatbot);
  cleanup();
  chatInitialized.value = false;
});
</script>

<style>
/* 调整容器样式 */
.container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 0;
  margin: 0;
}

/* 调整AI聊天容器样式 */
.ai-chat-container {
  flex: 1;
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
  border: none;
  box-shadow: none;
  padding-bottom: 50px !important; /* 为底部导航栏预留空间 */
}

/* 调整webchat容器样式 */
.webchat-container {
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100vh - 94px) !important; /* 减去导航栏和顶部标题栏的高度 */
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  overflow-y: auto !important;
}

/* 调整消息容器的内边距 */
.webchat-messages-container {
  max-height: 60vh !important; /* 限制消息区域高度 */
  overflow-y: auto !important;
  padding: 12px 16px !important;
}

/* 调整消息气泡的间距 */
.webchat-message {
  margin-bottom: 8px !important;
}

/* 调整输入框区域样式 */
.webchat-composer {
  position: relative !important;
  padding: 8px 16px !important;
  background-color: #fff !important;
  border-top: 1px solid #f0f0f0 !important;
  margin-top: auto !important; /* 自动调整顶部边距 */
}

/* 调整输入框本身的样式 */
.webchat-composer-input {
  width: 100% !important;
  padding: 8px 12px !important;
  border: 1px solid #e8e8e8 !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  background: #fff !important;
}

/* 调整快捷入口按钮容器样式 */
.webchat-quick-replies {
  padding: 4px 16px !important;
  margin-bottom: 8px !important;
}

/* 调整快捷入口按钮的样式 */
.webchat-quick-reply-button {
  margin: 2px !important;
  padding: 6px 12px !important;
  font-size: 14px !important;
}

/* 美化滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* 加载动画 */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 隐藏气泡提示 */
.webchat-bubble-tip {
  display: none !important;
}

/* 确保聊天框内容正确对齐 */
.webchat-messages-container {
  padding: 0 16px !important;
}

/* 自定义顶部标题栏样式 */
.webchat-header {
  background-color: #1890ff !important; /* 蓝色背景 */
  color: #ffffff !important; /* 白色文字 */
  height: 44px !important; /* 标准标题栏高度 */
  line-height: 44px !important;
  padding: 0 16px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  border-bottom: none !important;
}

/* 自定义关闭按钮样式 */
.webchat-header .webchat-close-button {
  color: #ffffff !important;
  opacity: 0.8 !important;
}

/* 自定义刷新按钮样式 */
.webchat-header .webchat-refresh-button {
  color: #ffffff !important;
  opacity: 0.8 !important;
}

/* 按钮悬停效果 */
.webchat-header .webchat-close-button:hover,
.webchat-header .webchat-refresh-button:hover {
  opacity: 1 !important;
}

/* 标题文字样式 */
.webchat-header-title {
  color: #ffffff !important;
  font-size: 16px !important;
}
</style>