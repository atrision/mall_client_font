<!--
 * @Author: misuzu 1411498103@qq.com
 * @Date: 2025-03-03 17:36:31
 * @LastEditors: misuzu 1411498103@qq.com
 * @LastEditTime: 2025-03-05 17:44:49
 * @FilePath: \vite11\src\components\Carousel.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="carousel-container">
    <a v-for="(image, index) in images" :key="image.id" :href="image.linkUrl" target="_blank" class="carousel-slide" :style="{ display: index === currentIndex ? 'block' : 'none' }">
      <img :src="image.imageUrl" :alt="image.title" />
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const images = ref([]);
const currentIndex = ref(0);

onMounted(async () => {
  try {
    const response = await axios.get('http://121.41.108.215:8087/api/banners'); // 修改为Spring Boot后端的API端点
    images.value = response.data;
    console.log('Banners loaded:', images.value);
    startCarousel(); // 开始轮播
  } catch (error) {
    console.error('Failed to load banners:', error);
    console.error('Error response:', error.response);
  }
});

const startCarousel = () => {
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
  }, 3000); // 每3秒切换一次图片
};
</script>

<style>
.carousel-container {
  position: relative;
  width: 100%;
  max-width: 600px; /* Adjust as needed */
  margin: auto;
  overflow: hidden;
}

.carousel-slide {
  display: none; /* Hide all slides by default */
}

.carousel-slide img {
  width: 100%;
  display: block;
}

/* Show the first slide */
.carousel-slide:first-child {
  display: block;
}

/* Add more styles for navigation buttons, indicators, etc. */
</style>
