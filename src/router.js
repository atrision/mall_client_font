import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Cart from './views/Cart.vue';
import Orders from './views/Orders.vue';
import Profile from './views/Profile.vue';
import ProductDetail from './components/ProductDetail.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import OrderDetail from './components/OrderDetail.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页', requiresAuth: false }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { title: '购物车', requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: { title: 'ai客服', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: '我', requiresAuth: true }
  }, {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册', requiresAuth: false }
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: { title: '产品详情', requiresAuth: false } // 假设产品详情不需要认证
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: { title: '订单详情', requiresAuth: true }
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;


  // 路由鉴权逻辑
  if (requiresAuth && !isLoggedIn) {
    alert('请先登录！');
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    });
  } else if ((to.name === 'Login' || to.name === 'Register') && isLoggedIn) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;