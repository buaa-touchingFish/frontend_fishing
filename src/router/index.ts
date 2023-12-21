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
      },
      {
        path: '/userCenter',
        component: () => import('@/pages//user/UserCenter.vue'),
      },
      {
        path: '/detail',
        component: () => import('@/pages/Detail.vue'),
      },
      {
        path: '/collect',
        component: () => import('@/pages/user/Collect.vue'),
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    path: '/test',
    component: () => import('@/pages/test.vue')
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
// router.beforeEach(() => {
//   let pro = new Promise((re) => {
//     let r = router as any;
//     r["re"] = re;
//   });
//   let doc = document as any;
//   doc.startViewTransition(async () => {
//     await pro;
//   });
// })
router.afterEach(() => {
  let r = router as any;
  if (r["re"] != undefined) {
    r["re"]();
    r["re"] = undefined;
  }
})



export default router;
