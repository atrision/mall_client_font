<template>
  <div class="product-detail-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <!-- 商品详情 -->
    <div v-else class="product-detail">
      <h1 class="product-title">{{ product.title }}</h1>
      
      <div class="product-image-container">
        <img 
          :src="product.imageUrl" 
          :alt="product.title"
          class="product-image"
        >
      </div>
      
      <div class="product-info">
        <p class="price">¥{{ product.price.toFixed(2) }}</p>
        <p v-if="product.rate" class="rating">评分：★{{ product.rate.toFixed(1) }}</p>
        
        <div class="action-buttons">
          <button 
            @click="addToCart"
            class="add-to-cart"
            :disabled="isAddingToCart"
          >
            {{ isAddingToCart ? '添加中...' : '加入购物车' }}
          </button>
          <button @click="goBack" class="back-button">返回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const token = ref(localStorage.getItem('token'))

// 商品数据相关
const product = ref({})
const loading = ref(true)
const error = ref(null)

// 购物车相关
const isAddingToCart = ref(false)

// 获取商品详情
const fetchProduct = async () => {
  try {
    const response = await axios.get(`http://121.41.108.215:8087/api/products/${route.params.id}`)
    product.value = response.data
  } catch (err) {
    console.error('获取商品失败:', err)
    error.value = '商品信息加载失败'
  } finally {
    loading.value = false
  }
}

/// 加入购物车（修改后）
const addToCart = async () => {
  try {
    isAddingToCart.value = true
    await axios.post('http://121.41.108.215:8087/api/cart', 
      {
        productId: product.value.id,
        quantity: 1
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    )
    alert('已加入购物车')
  } catch (err) {
    if (err.response?.status === 401) {
      handleUnauthorized()
    }
  } finally {
    isAddingToCart.value = false
  }
}

function handleUnauthorized() {
  // 提示用户未授权
  alert('您未登录或权限不足，请先登录！');

  // 清除可能存储的token
  localStorage.removeItem('token');

  // 跳转到登录页面
  router.push('/login');
}


// 初始化
onMounted(() => {
  fetchProduct()
})

const goBack = () => router.go(-1)
</script>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.product-image-container {
  position: relative;
  padding-top: 100%;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
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
  padding: 20px;
}

.product-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
}

.price {
  font-size: 24px;
  color: #e4393c;
  font-weight: bold;
  margin-bottom: 15px;
}

.rating {
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

button {
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart {
  background: #28a745;
  color: white;
}

.add-to-cart:hover:not(:disabled) {
  background: #218838;
}

.add-to-cart:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.back-button {
  background: #6c757d;
  color: white;
}

.back-button:hover {
  background: #5a6268;
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
  
  .product-title {
    font-size: 22px;
  }
  
  button {
    padding: 10px 20px;
  }
}
</style>