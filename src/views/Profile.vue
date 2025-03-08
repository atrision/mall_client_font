<template>
  <div class="personal-center">
    <div v-if="isLoggedIn">
      <h2>用户信息</h2>
      <p><strong>用户名：</strong> {{ userInfo.username }}</p>
      <p><strong>邮箱：</strong> {{ userInfo.email }}</p>
      <button @click="logout">退出登录</button>
    </div>
    <div v-else>
      <p>您尚未登录，请先登录。</p>
      <router-link to="/">登录</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const isLoggedIn = ref(false);
const userInfo = ref(null);
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  try {
    const response = await axios.get('http://121.41.108.215:8087/api/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    userInfo.value = response.data;
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    isLoggedIn.value = true;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    logout();
  }
});

// 退出登录
// Profile.vue
const logout = async () => {
  try {
    await axios.post('http://121.41.108.215:8087/api/logout');
  } catch (error) {
    // 即使后端无处理，前端仍需清除Token
  }
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  delete axios.defaults.headers.common['Authorization'];
  router.push('/login');
};
</script>
<style scoped>
.personal-center {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
}

p {
  margin-bottom: 10px;
}

button {
  padding: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #a71d2a;
}

a {
  color: #007bff;
  text-decoration: none;
}
</style>