<template>
  <div class="login-container">
    <h2>登录</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">登录</button>
      <p>
        没有账号？
        <router-link to="/register">立即注册</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

const login = async () => {
  try {
    const response = await axios.post('http://121.41.108.215:8087/api/login', {
      username: username.value,
      password: password.value
    });

    const token = response.data.token;
    localStorage.setItem('token', token); // 存储 Token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // 关键设置
    router.push('/profile');
    alert('登录成功！');
  } catch (error) {
    console.error('登录失败:', error);
    alert('用户名或密码错误，请重新输入！');
  }
};
</script>

<style scoped>
.login-container {
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

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

p {
  text-align: center;
  margin-top: 10px;
}

a {
  color: #007bff;
  text-decoration: none;
}
</style>