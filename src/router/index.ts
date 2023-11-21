import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/pages/Home.vue'),
    children: [
      {
        path: '/search',
        component: () => import('@/pages/SearchResult.vue'),
      },
      {
        path: '/scholarHome',
        component: () => import('@/pages/ScholarHome.vue'),
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/pages/Login.vue'),
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
const push = router.push;
router.push = (to) => {
  let doc = document as any;
  let ret = doc.startViewTransition(() => {
    push(to);
  }).updateCallbackDone
  return ret;
}
export default router;
