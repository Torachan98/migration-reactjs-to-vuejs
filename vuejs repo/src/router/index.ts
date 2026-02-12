import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { useAuthStore } from '@/store/auth/auth'

import Login from '@/components/pages/auth/LoginPage.vue'
import SignUp from '@/components/pages/auth/SignUpPage.vue'
import Init from '@/components/pages/dashboards/InitPage.vue'
import Main from '@/components/pages/dashboards/MainPage.vue'
import Permissions from '@/components/pages/dashboards/PermissionPage.vue'
import NotFound from '@/components/pages/errors/NotFound.vue'
import Users from '@/components/pages/dashboards/UserPage.vue'
import Roles from '@/components/pages/dashboards/RolePage.vue'
import Services from '@/components/pages/dashboards/ServicePage.vue'
import UserDetail from '@/components/pages/details/UserDetail.vue'
import { AuthService } from '@/api/generated'
//import ForgotPassword from '@/pages/auth/ForgotPassword.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/sign-up',
    component: SignUp,
  },
  // {
  //   path: '/forgot-password',
  //   component: ForgotPassword,
  // },

  {
    path: '/',
    children: [
      {
        path: '',
        component: Main,
        meta: { requiresAuth: true, permissiond: {} },
        children: [
          {
            path: '',
            component: Init,
          },
          {
            path: 'users',
            component: Users,
          },
          {
            path: 'permissions',
            component: Permissions,
          },
          {
            path: 'roles',
            component: Roles,
          },
          {
            path: 'services',
            component: Services,
          },
          {
            path: 'user-detail/:id',
            component: UserDetail,
            props: true,
          },
          // {
          //   path: 'role-detail/:id',
          //   component: RoleDetail,
          //   props: true,
          // },
          // {
          //   path: 'service-detail/:id',
          //   component: ServiceDetail,
          //   props: true,
          // },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    const res = authStore.refreshToken()
    if (!res) {
      return { path: '/404', replace: true }
    }
  }
})

export default router
