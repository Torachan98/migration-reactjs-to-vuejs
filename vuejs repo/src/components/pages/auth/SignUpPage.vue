<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

import LoadingBar from '@/components/atoms/StepLoadingBar.vue'
import OtpForm from '@/components/molecules/OtpForm.vue'
import SignUpForm from '@/components/molecules/SignUpForm.vue'
import Button from '@/components/atoms/ButtonBase.vue'
import type { UserDTO } from '@/api/generated'

enum StepForm {
  FORGOT_PASSWORD = 'forgot-password',
  SIGN_UP = 'sign-up',
  OTP_PROCESS = 'otp-process',
}

const step = ref<StepForm>(StepForm.SIGN_UP)
const stepProcess = ref(1)
const minutes = ref(0)
const otpCode = ref('')

const signUpRef = ref<{ isValid: () => boolean } | null>(null)

let intervalId: number | null = null

const startCountdown = (): void => {
  stopCountdown()

  intervalId = window.setInterval(() => {
    if (minutes.value <= 1) {
      minutes.value = 0
      stopCountdown()
      return
    }
    minutes.value -= 1
  }, 1000)
}

const stopCountdown = (): void => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const handleSubmit = (): void => {
  if (step.value === StepForm.SIGN_UP) {
    const isSuccess = signUpRef.value?.isValid()
    debugger
    if (isSuccess) {
      stepProcess.value += 1
      step.value = StepForm.OTP_PROCESS
    }
    return
  }
}

const handleResend = (): void => {
  minutes.value = 50
  startCountdown()
}

const handleOtpComplete = (val: string): void => {
  otpCode.value = val
}

const handleSignUpSubmit = (user: UserDTO): void => {
  console.log(user)
}

watch(step, () => {
  minutes.value = 50
  startCountdown()
})

onMounted(() => {
  minutes.value = 50
  startCountdown()
})

onUnmounted(() => {
  stopCountdown()
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg p-4 space-y-6">
      <div class="space-y-2">
        <LoadingBar :steps="2" :current-step="stepProcess" />
        <p class="text-sm text-gray-500 text-right">Step {{ stepProcess }} of 2</p>
      </div>

      <div class="relative">
        <div v-if="step === StepForm.SIGN_UP" class="animate-fadeIn">
          <SignUpForm ref="signUpRef" :on-submit="handleSignUpSubmit" />
        </div>

        <div v-else-if="step === StepForm.OTP_PROCESS">
          <div class="text-center py-3">
            <p>
              Enter your code which already sent from email
              <br />
              Your code only valid at: 00:{{ minutes < 10 ? `0${minutes}` : minutes }}
            </p>
          </div>

          <div class="animate-fadeIn">
            <OtpForm @complete="handleOtpComplete" />
          </div>
        </div>
      </div>

      <div class="flex flex-row gap-2 justify-end">
        <Button
          class="px-2"
          :disabled="step === StepForm.OTP_PROCESS && otpCode === ''"
          @click="handleSubmit"
        >
          {{ step === StepForm.SIGN_UP ? 'Submit' : 'OK' }}
        </Button>

        <Button
          v-if="step === StepForm.OTP_PROCESS"
          class="px-2"
          :disabled="minutes !== 0"
          @click="handleResend"
        >
          Resent email
        </Button>
      </div>
    </div>
  </div>
</template>
