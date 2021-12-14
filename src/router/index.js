import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../pages/auth/Login.vue'),
  },
  {
    path: '/student',
    name: 'StudentDashboard',
    component: () => import('../pages/student/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    component: () => import('../pages/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    props: true,
    children: [
      {
        path: '',
        name: 'AdminOverview',
        component: () => import('../pages/admin/Overview.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('../pages/admin/users/UserList.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
        props: true,
      },
      {
        path: 'users/:id',
        name: 'UserDetail',
        component: () => import('../pages/admin/users/UserDetail.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
        props: true,
      },
    ],
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../pages/401.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Notfound',
    component: () => import('../pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    const profileData = localStorage.getItem('profile')

    // if not, redirect to login page.
    if (!profileData) {
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath },
      })
    } else {
      // Checking for admin permission
      if (to.matched.some((record) => record.meta.requiresAdmin)) {
        const profile = JSON.parse(profileData)

        if (!profile.is_admin) {
          next({
            path: '/unauthorized',
          })
        }
      }

      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
