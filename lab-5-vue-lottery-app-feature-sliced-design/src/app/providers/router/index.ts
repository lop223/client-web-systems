import { createRouter, createWebHashHistory } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { pinia } from '@/stores/pinia'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/about/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/LoginView.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/pages/users/UsersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/users/:id',
      name: 'user-details',
      component: () => import('@/pages/user-details/UserDetailsView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: () => import('@/pages/user-edit/UserEditView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useSessionStore(pinia)

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'users' }
  }
})

export default router
