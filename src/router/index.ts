import { nextTick } from 'process';
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
      },
      {
        path: '/claimScholar',
        component: () => import('@/pages/ClaimScholar.vue'),
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
  return doc.startViewTransition(async () => {
    await push(to);
  }).updateCallbackDone
}
// const back = router.back;
// router.back = () => {
//   let doc = document as any;
//   doc.startViewTransition(async () => {
//     history.back();
//   })
// }
// router.back = back;
export default router;
