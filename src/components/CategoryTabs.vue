<template>
  <div class="category-tabs">
    <div class="tabs">
      <button
        v-for="category in formattedCategories"
        :key="category.id"
        :class="{ 'active': activeCategory === category.id }"
        @click="activeCategory = category.id"
      >
        {{ category.name }}
      </button>
    </div>

    <div class="tab-content">
      <template v-for="category in formattedCategories" :key="category.id">
        <div 
          v-show="activeCategory === category.id"
          class="category-content"
        >
          <div
            v-for="product in category.products"
            :key="product.id"
            class="product-card"
            @click="goToDetail(product.id)"
          >
            <img :src="product.imageUrl" :alt="product.title" class="product-image" />
            <div class="product-info">
              <h3 class="product-title">{{ product.title }}</h3>
              <p class="product-price">¥{{ product.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const products = ref([])
const activeCategory = ref(1) // 默认选中男士分类

// 分类映射配置
const categoryMap = {
  1: { name: '男士', order: 1 },
  2: { name: '女士', order: 2 },
  3: { name: '儿童', order: 3 }
}

// 获取商品数据
const fetchProducts = async () => {
  try {
    const response = await axios.get('http://121.41.108.215:8087/api/products')
    products.value = response.data
  } catch (error) {
    console.error('商品数据获取失败:', error)
  }
}

// 处理后的分类数据
const formattedCategories = computed(() => {
  const grouped = {}
  
  // 按分类分组
  products.value.forEach(product => {
    const categoryId = product.categoryId
    if (!grouped[categoryId]) {
      grouped[categoryId] = {
        id: categoryId,
        name: categoryMap[categoryId].name,
        order: categoryMap[categoryId].order,
        products: []
      }
    }
    grouped[categoryId].products.push(product)
  })
  
  // 转换为数组并按order排序
  return Object.values(grouped).sort((a, b) => a.order - b.order)
})

// 初始化获取数据
fetchProducts()

// 跳转详情页
const goToDetail = (productId) => {
  router.push({ name: 'ProductDetail', params: { id: productId } })
}
</script>

<style scoped>
.category-tabs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
}

.tabs button {
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  background: #f5f5f5;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tabs button.active {
  background: #333;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tab-content {
  display: grid;
  gap: 30px;
}

.category-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.product-info {
  padding: 15px;
}

.product-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2; /* 添加标准属性 */
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 16px;
  color: #e4393c;
  font-weight: bold;
}

@media (max-width: 768px) {
  .tabs {
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .tabs button {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .category-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .product-image {
    height: 200px;
  }
}
</style>