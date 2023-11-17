import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/pages/Home.vue'),
    children:[
      {
        path: '/search',
        component: () => import('@/pages/SearchResult.vue'),
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/pages/Login.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
