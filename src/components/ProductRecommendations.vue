<template>
  <div class="product-recommendations">
    <h2 class="section-title">热门推荐</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="product-grid">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="product-card"
        @click="viewDetail(product.id)"
      >
        <div class="image-container">
          <img 
            :src="product.imageUrl" 
            :alt="product.title"
            class="product-image"
          >
        </div>
        <div class="product-info">
          <h3 class="product-title">{{ product.title }}</h3>
          <div class="price-rating">
            <span class="price">¥{{ product.price.toFixed(2) }}</span>
            <span v-if="product.rate" class="rating">
              ★{{ product.rate.toFixed(1) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const products = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get('http://121.41.108.215:8087/api/products/top-rated')
    products.value = response.data
  } catch (err) {
    console.error('获取推荐商品失败:', err)
    error.value = '无法加载推荐商品，请稍后重试'
  } finally {
    loading.value = false
  }
})

const viewDetail = (productId) => {
  router.push({ name: 'ProductDetail', params: { id: productId } })
}
</script>

<style scoped>
.product-recommendations {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.section-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 40px;
  color: #333;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 0 20px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.image-container {
  position: relative;
  padding-top: 100%; /* 保持1:1比例 */
  background: #f5f5f5;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 16px;
}
.product-title {
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2; /* 添加标准属性 */
  -webkit-box-orient: vertical;
}

.price-rating {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 18px;
  color: #e4393c;
  font-weight: bold;
}

.rating {
  background: #ffd700;
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 0;
  }
  
  .product-card {
    border-radius: 8px;
  }
  
  .product-title {
    font-size: 14px;
  }
  
  .price {
    font-size: 16px;
  }
}
</style>