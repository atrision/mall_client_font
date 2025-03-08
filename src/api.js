import axios from 'axios';

// 设置默认请求头
axios.defaults.baseURL = 'http://121.41.108.215:8087/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
// axios配置文件中添加
axios.defaults.withCredentials = true;

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token'); // 清除Token
      alert('您的登录已过期，请重新登录！');
      window.location.href = '/login'; // 重定向到登录页面
    }
    return Promise.reject(error);
  }
);

export default axios;