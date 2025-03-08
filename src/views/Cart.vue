<template>
  <div class="cart-container">
    <h1 class="cart-title">我的购物车</h1>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <!-- 购物车内容 -->
    <div v-else>
      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>您的购物车还是空的哦~</p>
        <button @click="goShopping" class="go-shopping">去逛逛</button>
      </div>
      
      <div v-else>
        <div class="cart-items">
          <div 
            v-for="item in cartItems"
            :key="item.id"
            class="cart-item"
          >
            <div class="item-info">
              <img 
                :src="item.product.imageUrl" 
                :alt="item.product.title"
                class="product-image"
              >
              <div class="product-details">
                <h3 class="product-title">{{ item.product.title }}</h3>
                <p class="product-price">¥{{ item.product.price.toFixed(2) }}</p>
              </div>
            </div>
            
            <div class="quantity-control">
              <button 
                @click="updateQuantity(item.id, item.quantity - 1)"
                :disabled="item.quantity <= 1"
              >-</button>
              <input 
                type="number" 
                v-model.number="item.quantity"
                @change="updateQuantity(item.id, item.quantity)"
                min="1"
              >
              <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
            </div>
            
            <div class="item-actions">
              <p class="total-price">¥{{ (item.product.price * item.quantity).toFixed(2) }}</p>
              <button 
                @click="removeItem(item.id)"
                class="remove-button"
              >删除</button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>共 {{ totalQuantity }} 件商品</span>
            <span>总计：</span>
            <span class="total-amount">¥{{ totalPrice.toFixed(2) }}</span>
          </div>
          <!-- 添加清空购物车按钮 -->
          <button 
            @click="clearCart"
            class="clear-cart-button"
          >清空购物车</button>
          <button 
            @click="checkout"
            class="checkout-button"
          >去结算</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const cartItems = ref([])
const loading = ref(true)
const error = ref(null)
const token=ref(localStorage.getItem('token'))

// 获取购物车数据
const fetchCart = async () => {
  try {
    const response = await axios.get('http://121.41.108.215:8087/api/cart',{

      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    cartItems.value = response.data.map(item => ({
      ...item,
      product: {
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl
      }
    }))
  } catch (err) {
    if(err.response && err.response.status === 401){
      handleUnauthorized()
    }
  } finally {
    loading.value = false  // 确保无论成功失败都会关闭loading
  }
}

// 更新数量
// 更新数量（修改后）
const updateQuantity = async (itemId, newQuantity) => {
  try {
    newQuantity = Math.max(1, newQuantity)  // 确保最小值为1
    
    await axios.put(`http://121.41.108.215:8087/api/cart/${itemId}`, 
      { quantity: newQuantity },
      { headers: { Authorization: `Bearer ${token.value}` } }
    )

    // 更新本地数据（新增部分）
    const index = cartItems.value.findIndex(item => item.id === itemId)
    if (index !== -1) {
      cartItems.value[index].quantity = newQuantity
    }
  } catch (err) {
    if (err.response?.status === 401) {
      handleUnauthorized()
    }
    console.error('更新数量失败:', err)
  }
}

// 删除商品（修改后）
const removeItem = async (itemId) => {
  try {
    await axios.delete(`http://121.41.108.215:8087/api/cart/${itemId}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    
    // 从本地数组中移除
    cartItems.value = cartItems.value.filter(item => item.id !== itemId)
  } catch (err) {
    if (err.response?.status === 401) {
      handleUnauthorized()
    }
    console.error('删除失败:', err)
  }
}

// 清空购物车（修改后）
const clearCart = async () => {
  try {
    await axios.delete('http://121.41.108.215:8087/api/cart', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    
    // 清空本地数组
    cartItems.value = []
  } catch (err) {
    if (err.response?.status === 401) {
      handleUnauthorized()
    }
    console.error('清空失败:', err)
  }
}

// 新增处理未授权逻辑
const handleUnauthorized = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

// 在onMounted添加token验证
onMounted(() => {
  if (!token.value) {
    router.push('/login')
  } else {
    fetchCart()
  }
})

// 结算
const checkout = async () => {
  try {
    const response = await axios.post('http://121.41.108.215:8087/api/orders', {}, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    // 清空本地购物车数据
    cartItems.value = []
    
    // 跳转到订单详情页
    router.push(`/orders/${response.data.id}`)
    
  } catch (err) {
    if (err.response) {
      if (err.response.status === 400) {
        alert(err.response.data)
      } else if (err.response.status === 401) {
        handleUnauthorized()
      }
    }
    console.error('结算失败:', err)
  }
}

// 计算属性
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + item.product.price * item.quantity
  }, 0)
})

const totalQuantity = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})



const goShopping = () => {
  router.push('/')
}
</script>


<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.cart-title {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 40px;
}

.go-shopping {
  padding: 12px 30px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
}

.cart-items {
  display: grid;
  gap: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.item-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-control button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: #f8f9fa;
  cursor: pointer;
}

.quantity-control input {
  width: 60px;
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.remove-button {
  padding: 6px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cart-summary {
  margin-top: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 18px;
}

.total-amount {
  color: #e4393c;
  font-weight: bold;
}

.checkout-button {
  width: 100%;
  padding: 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .item-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>