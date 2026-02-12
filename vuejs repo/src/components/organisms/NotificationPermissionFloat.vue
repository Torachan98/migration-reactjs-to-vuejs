<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getToken } from 'firebase/messaging'
import { jwtDecode } from 'jwt-decode'

import NotificationPromptCard from '@/components/molecules/NotificationPromptCard.vue'
import { fetchMessaging } from '@/fcmService'

import { useAuthStore } from '@/store/auth/auth'
import { useUserStore } from '@/store/user/user'

const STORAGE_KEY = 'notification_prompt_status'

enum STATUS_NOTIFICATION_FLOAT {
  ACCEPT = 'accepted',
  BLOCK = 'blocked',
  DISMISS = 'dismissed',
}

const authStore = useAuthStore()
const userStore = useUserStore()

const visible = ref<boolean>(false)

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (
    (!stored && Notification.permission === 'default') ||
    stored === STATUS_NOTIFICATION_FLOAT.DISMISS
  ) {
    visible.value = true
  }
})

const requestPermissionAndToken = async (): Promise<void> => {
  const permission = await Notification.requestPermission()

  if (permission !== 'granted') {
    localStorage.setItem(STORAGE_KEY, STATUS_NOTIFICATION_FLOAT.DISMISS)
    return
  }

  const messaging = await fetchMessaging()

  if (!messaging) return

  const fcmToken = await getToken(messaging)

  const decoded = jwtDecode<{ userId: string }>(authStore.token)

  await userStore.fetchUserById(decoded.userId)

  if (!userStore.user) return

  await userStore.updateUser({
    ...userStore.user,
    fcmToken,
  })
}

const handleAllow = async (): Promise<void> => {
  try {
    await requestPermissionAndToken()
    localStorage.setItem(STORAGE_KEY, STATUS_NOTIFICATION_FLOAT.ACCEPT)
  } catch {
    localStorage.setItem(STORAGE_KEY, STATUS_NOTIFICATION_FLOAT.BLOCK)
  } finally {
    visible.value = false
  }
}

const handleDismiss = (): void => {
  localStorage.setItem(STORAGE_KEY, STATUS_NOTIFICATION_FLOAT.DISMISS)
  visible.value = false
}
</script>

<template>
  <div v-if="visible" class="fixed bottom-6 right-6 z-50 animate-fade-in">
    <NotificationPromptCard @allow="handleAllow" @dismiss="handleDismiss" />
  </div>
</template>
