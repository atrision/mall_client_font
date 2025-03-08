<!--
 * @Author: misuzu 1411498103@qq.com
 * @Date: 2025-03-03 17:36:31
 * @LastEditors: misuzu 1411498103@qq.com
 * @LastEditTime: 2025-03-05 14:03:52
 * @FilePath: \vite11\src\components\Navbar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="navbar">
    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      &lt; <!-- 显示 "<" 字符 -->
    </button>
    <!-- 显示当前路由的标题 -->
    <h1>{{ currentTitle }}</h1>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'Navbar',
  setup() {
    const route = useRoute();
    const router = useRouter();

    // 计算属性来获取当前路由的标题
    const currentTitle = computed(() => {
      return route.meta.title || '默认标题';
    });

    // 返回历史记录的方法
    const goBack = () => {
      router.back();
    };

    return {
      currentTitle,
      goBack
    };
  }
};
</script>

<style>
.navbar {
  background-color: #1890ff; /* 修改为蓝色背景 */
  color: #fff;
  padding: 10px 16px; /* 调整内边距使其更符合规范 */
  display: flex;
  align-items: center;
  height: 44px; /* 固定导航栏高度 */
  box-sizing: border-box;
  position: relative;
  z-index: 100;
}

.back-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 16px; /* 调整字体大小 */
  margin-right: 10px;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: 0.8; /* 添加透明度 */
  transition: opacity 0.2s; /* 添加过渡效果 */
}

.back-button:hover {
  cursor: pointer;
  opacity: 1; /* 悬停时不透明 */
}

h1 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}
</style>
