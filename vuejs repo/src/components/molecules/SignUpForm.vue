<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import InputLabel from '../atoms/InputLabel.vue'
import Select from '@/components/atoms/SelectBase.vue'
import type { UserDTO } from '@/api/generated'

type Props = {
  onSubmit: (user: UserDTO) => void
}

const props = defineProps<Props>()

const user = reactive<UserDTO>({})
const password = ref('')
const passwordText = ref('')
const isSamePassword = ref(true)

watch([password, passwordText], () => {
  isSamePassword.value = password.value === passwordText.value
})

const submit = (): boolean => {
  if (!isSamePassword.value) return false

  props.onSubmit({
    ...user,
    password: password.value,
  })

  return true
}

const isValid = (): boolean => {
  console.log(Boolean(user.email && user.userName && password.value && isSamePassword.value))
  return Boolean(user.email && user.userName && password.value && isSamePassword.value)
}

defineExpose({
  submit,
  isValid,
})
</script>

<template>
  <div class="flex flex-col py-3 px-4 gap-2">
    <h5 class="text-xl font-bold">Sign up</h5>

    <div class="flex flex-row gap-3">
      <InputLabel label="First Name" placeholder="First Name" v-model="user.firstName" />

      <InputLabel label="Middle Name" placeholder="Middle Name" v-model="user.middleName" />

      <InputLabel label="Last Name" placeholder="Last Name" v-model="user.lastName" />
    </div>

    <InputLabel
      label="Email"
      v-model="user.email"
      @update:modelValue="
        (val: string) => {
          user.userName = val?.split('@')[0]
        }
      "
    />

    <InputLabel label="Username" placeholder="Username" v-model="user.userName" />

    <div class="flex flex-row gap-3">
      <div class="grow-0">
        <InputLabel label="Code" placeholder="+84" />
      </div>

      <div class="grow">
        <InputLabel label="Phone" placeholder="0xxxxxxx" />
      </div>

      <div class="grow">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-gray-500">Country</label>
          <Select
            class="text-sm"
            :options="[
              { value: 'VN', label: 'Viet Nam' },
              { value: 'US', label: 'United States' },
              { value: 'JP', label: 'Japan' },
              { value: 'PH', label: 'Philipines' },
            ]"
            v-model="user.region"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2">
        <InputLabel
          label="Password"
          type="password"
          v-model="password"
          :class="!isSamePassword ? 'border border-red-500' : ''"
        />

        <InputLabel
          label="Re-password"
          type="password"
          v-model="passwordText"
          :class="!isSamePassword ? 'border border-red-500' : ''"
        />
      </div>

      <p v-if="!isSamePassword" class="text-red-400 font-bold">Password is not match</p>
    </div>
  </div>
</template>
