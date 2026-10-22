import { createRouter, createWebHashHistory } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { pinia } from '@/app/providers/pinia'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/ui/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/about/ui/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/ui/LoginView.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/pages/users/ui/UsersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/users/:id',
      name: 'user-details',
      component: () => import('@/pages/user-details/ui/UserDetailsView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: () => import('@/pages/user-edit/ui/UserEditView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found/ui/NotFoundView.vue'),
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
