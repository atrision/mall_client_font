<template>
  <div class="register-container">
    <h2>注册</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <button type="submit">注册</button>
      <p>
        已有账号？
        <router-link to="/login">登录</router-link>
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
const email = ref('');

// Register.vue
const register = async () => {
  try {
    const response = await axios.post('http://121.41.108.215:8087/api/auth', {
      username: username.value,
      password: password.value,
      email: email.value
    });

    // 注册成功后直接自动登录
    const loginResponse = await axios.post('http://121.41.108.215:8087/api/login', {
      username: username.value,
      password: password.value
    });

    localStorage.setItem('token', loginResponse.data.token);
    localStorage.setItem('currentUser', JSON.stringify(loginResponse.data.user));
    router.push('/profile');
    alert('注册并登录成功！');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert('注册失败：用户名已存在或输入无效！');
    } else {
      console.error('注册失败:', error);
      alert('注册失败，请稍后再试！');
    }
  }
};
</script>

<style scoped>
.register-container {
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