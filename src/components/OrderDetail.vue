<template>
  <div class="order-detail-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="order-content">
      <!-- 订单头信息 -->
      <div class="order-header">
        <h2>订单号：{{ order.id }}</h2>
        <p class="status">状态：{{ statusText }}</p>
        <p class="total-amount">总金额：¥{{ order.totalAmount.toFixed(2) }}</p>
        <p class="order-time">下单时间：{{ formatDate(order.createdAt) }}</p>
      </div>

      <!-- 商品列表 -->
      <div class="items-list">
        <div v-for="item in orderItems" :key="item.id" class="order-item">
          <img :src="item.product.imageUrl" class="product-image">
          <div class="product-info">
            <h3>{{ item.product.title }}</h3>
            <p>单价：¥{{ item.unitPrice.toFixed(2) }}</p>
            <p>数量：{{ item.quantity }}</p>
            <p class="item-total">小计：¥{{ (item.unitPrice * item.quantity).toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button v-if="order.orderStatus === 0" @click="payOrder" class="pay-button">立即支付</button>
        <button @click="router.push('/')" class="back-button">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const order = ref({})
const orderItems = ref([])
const loading = ref(true)
const error = ref(null)
const token = ref(localStorage.getItem('token'))
let checkInterval = null // 用于保存轮询定时器

// 状态映射
const statusMap = {
  0: '待支付',
  1: '已支付',
  2: '已发货',
  3: '已完成',
  4: '已取消'
}

// 获取订单详情
const fetchOrder = async () => {
  try {
    const response = await axios.get(`http://121.41.108.215:8087/api/orders/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    order.value = response.data.order
    orderItems.value = response.data.items.map(item => ({
      ...item,
      product: {
        title: item.title,
        imageUrl: item.imageUrl,
        price: item.unitPrice
      }
    }))
  } catch (err) {
    error.value = '获取订单详情失败'
    if (err.response?.status === 401) {
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const payOrder = async () => {
  try {
    const paymentWindow = window.open(
      `http://121.41.108.215:8087/alipay/pay?orderId=${order.value.id}`,
      '_blank',
      'width=600,height=800'
    );

    // 支付窗口关闭检测
    const checkWindowClosed = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(checkInterval); // 停止轮询
        clearInterval(checkWindowClosed); // 停止窗口检测
        checkPaymentFinalStatus(); // 最终状态检查
      }
    }, 1000);

    // 支付状态轮询（优化版）
    checkInterval = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://121.41.108.215:8087/api/orders/${order.value.id}`,
          { headers: { Authorization: `Bearer ${token.value}` } }
        );
        
        if (response.data.order.orderStatus === 1) {
          handlePaymentSuccess(paymentWindow);
        }
      } catch (err) {
        console.error('支付状态检查失败:', err);
      }
    }, 3000);

    // 10分钟超时（兜底逻辑）
    const timeoutTimer = setTimeout(() => {
      handlePaymentTimeout();
    }, 600000);

    // 成功处理函数
    const handlePaymentSuccess = (window) => {
      clearInterval(checkInterval);
      clearTimeout(timeoutTimer);
      clearInterval(checkWindowClosed);
      order.value.orderStatus = 1;
      alert('支付成功');
      window?.close();
    }

    // 超时处理函数
    const handlePaymentTimeout = () => {
      clearInterval(checkInterval);
      clearInterval(checkWindowClosed);
      alert('支付超时，请检查支付状态');
    }

    // 最终状态检查（防止窗口意外关闭）
    const checkPaymentFinalStatus = async () => {
      const response = await axios.get(
        `http://121.41.108.215:8087/api/orders/${order.value.id}`,
        { headers: { Authorization: `Bearer ${token.value}` } }
      );
      if (response.data.order.orderStatus === 1) {
        order.value.orderStatus = 1;
        alert('支付成功');
      }
    }

  } catch (err) {
    alert('支付请求失败：' + (err.response?.data?.message || '未知错误'));
  }
}

onMounted(() => {
  if (!token.value) {
    router.push('/login')
  } else {
    fetchOrder()
  }
})

// 计算属性
const statusText = computed(() => statusMap[order.value.orderStatus] || '未知状态')
</script>

<style scoped>
.order-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.order-header {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.status {
  color: #e4393c;
  font-size: 18px;
  font-weight: bold;
}

.items-list {
  display: grid;
  gap: 20px;
}

.order-item {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.product-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-right: 30px;
  border-radius: 6px;
}

.item-total {
  color: #e4393c;
  font-weight: bold;
}

.action-buttons {
  margin-top: 40px;
  text-align: center;
}

.pay-button {
  padding: 12px 40px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  margin-right: 20px;
}

.back-button {
  padding: 12px 40px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
}
</style>