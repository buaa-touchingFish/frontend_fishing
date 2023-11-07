import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    path: '/scholarHome',
    component: () => import('@/pages/ScholarHome.vue'),
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
