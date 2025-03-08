<template>
  <div>
    <Carousel />
    <div class="spacer"></div> <!-- 添加一个间隔元素 -->
    <ProductRecommendations />
    <CategoryTabs />
  </div>
</template>

<script setup>
import Carousel from '../components/Carousel.vue';
import ProductRecommendations from '../components/ProductRecommendations.vue';
import CategoryTabs from '../components/CategoryTabs.vue';
</script>

<style>
/* 可以添加首页的样式 */

/* 为轮播图和商品推荐之间添加间隔 */
.spacer {
  height: 20px; /* 你可以根据需要调整间隔大小 */
}

/* 如果需要，也可以为 Carousel、ProductRecommendations 或 CategoryTabs 添加特定的样式 */

</style>
