<script setup lang="ts">
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Toggle from '@vueform/toggle'

import Button from '@/components/atoms/ButtonBase.vue'
import InputLabel from '@/components/atoms/InputLabel.vue'
import Select from '@/components/atoms/SelectBase.vue'
import DatePicker from '@/components/atoms/DatePicker.vue'
import DateTimePicker from '@/components/atoms/DateTimePicker.vue'
import MultiSelect from '@/components/atoms/MultipleSelect.vue'
import ServiceSelector, { type SelectedService } from '@/components/atoms/ServicesSelector.vue'

import type { PermissionDTO, RoleDTO, RoleResponse, ServiceDTO, UserDTO } from '@/api/generated'

type ServiceProps = {
  pageNum: number
  pageSize: number
  totalItems: number
  services: ServiceDTO[]
}

type UserProps = {
  user: UserDTO
  pageNum: number
  pageSize: number
  totalItems: number
}

type Props = {
  user: UserProps
  roles: RoleDTO[]
  service: ServiceProps
  permissions: PermissionDTO[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'cancel', value: boolean): void
  (e: 'changePage', value: number): void
  (e: 'update:user', value: UserProps): void
}>()

const isHint = ref(false)

const updateUser = (payload: Partial<UserDTO>) => {
  emit('update:user', {
    ...props.user,
    user: {
      ...props.user.user,
      ...payload,
    },
  })
}
</script>

<template>
  <div class="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
    <div class="space-y-6 px-6 py-6">
      <div class="flex items-center gap-6">
        <div class="relative">
          <img
            src="/src/assets/default_logo.jpg"
            class="h-24 w-24 rounded-full border object-cover"
          />
          <label
            class="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            <FontAwesomeIcon icon="pen" />
            <input type="file" hidden accept="image/*" />
          </label>
        </div>
        <div class="text-sm text-gray-500">Upload avatar (JPG, PNG, max 2MB)</div>
      </div>

      <div>
        <h3 class="mb-3 text-sm font-semibold uppercase text-gray-700">
          <FontAwesomeIcon icon="user" /> Basic Information
        </h3>

        <div class="mb-3 flex gap-3">
          <InputLabel
            label="First name"
            :model-value="props.user.user.firstName"
            @update:model-value="(v) => updateUser({ firstName: v })"
          />
          <InputLabel
            label="Middle name"
            :model-value="props.user.user.middleName"
            @update:model-value="(v) => updateUser({ middleName: v })"
          />
          <InputLabel
            label="Last name"
            :model-value="props.user.user.lastName"
            @update:model-value="(v) => updateUser({ lastName: v })"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputLabel
            label="Username"
            :model-value="props.user.user.userName"
            @update:model-value="(v) => updateUser({ userName: v })"
          />

          <InputLabel
            label="Email"
            :model-value="props.user.user.email"
            @update:model-value="(v) => updateUser({ email: v })"
          />

          <div class="flex gap-2">
            <InputLabel
              class="w-[50px]"
              label="Code"
              :model-value="props.user.user.phoneCode"
              @update:model-value="(v) => updateUser({ phoneCode: v })"
            />
            <InputLabel
              class="flex-1"
              label="Phone"
              :model-value="props.user.user.phone"
              @update:model-value="(v) => updateUser({ phone: v })"
            />
          </div>

          <div>
            <label class="text-xs font-medium text-gray-500">Country</label>
            <Select
              class="text-sm"
              :model-value="props.user.user.region"
              :options="[
                { value: 'VN', label: 'Viet Nam' },
                { value: 'US', label: 'United States' },
                { value: 'JP', label: 'Japan' },
                { value: 'PH', label: 'Philippines' },
              ]"
              @update:model-value="(v: string) => updateUser({ region: v })"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 class="mb-3 text-sm font-semibold uppercase text-gray-700">
          <FontAwesomeIcon icon="sliders" /> Config
        </h3>

        <div class="divide-y rounded-lg border">
          <div class="grid grid-cols-3 gap-4 px-4 py-3">
            <dt class="self-center text-sm font-medium text-gray-500">Change Password?</dt>
            <dd class="col-span-2">
              <Toggle
                :model-value="props.user.user.isRequiredChangePassword"
                @update:model-value="(v: boolean) => updateUser({ isRequiredChangePassword: v })"
              />
            </dd>
          </div>

          <div class="grid grid-cols-3 gap-4 px-4 py-3">
            <dt class="self-center text-sm font-medium text-gray-500">Password</dt>
            <dd class="col-span-2 flex gap-2">
              <InputLabel
                class="flex-1"
                :type="isHint ? 'text' : 'password'"
                :disabled="props.user.user.isRequiredChangePassword"
                :model-value="props.user.user.password"
                @update:model-value="(v) => updateUser({ password: v })"
              />
              <Button @click="isHint = !isHint">Show</Button>
            </dd>
          </div>

          <div class="grid grid-cols-3 gap-4 px-4 py-3">
            <dt class="self-center text-sm font-medium text-gray-500">Password Expired?</dt>
            <dd class="col-span-2">
              <Toggle
                :model-value="props.user.user.isPasswordExpired"
                @update:model-value="(v: boolean) => updateUser({ isPasswordExpired: v })"
              />
            </dd>
          </div>

          <div class="grid grid-cols-3 gap-4 px-4 py-3">
            <dt class="self-center text-sm font-medium text-gray-500">Expiration Date</dt>
            <dd class="col-span-2">
              <DateTimePicker
                :disabled="!props.user.user.isPasswordExpired"
                :model-value="props.user.user.expirationDate"
                @update:model-value="(v: string) => updateUser({ expirationDate: v })"
              />
            </dd>
          </div>
        </div>
      </div>

      <div>
        <h3 class="mb-3 text-sm font-semibold uppercase text-gray-700">
          <FontAwesomeIcon icon="gears" /> Access Control
        </h3>

        <MultiSelect
          label="Roles"
          :options="roles.map((r) => ({ label: r.name ?? '', value: r.guid ?? '' }))"
          :value="props.user.user.roles?.map((r) => r.guid ?? '') ?? []"
          @change="
            (v: string[]) => {
              const roleItems = v.map((item) => {
                const roleItem = roles.find((s) => s.guid === item)
                return {
                  guid: roleItem?.guid ?? '',
                  role: roleItem?.name ?? '',
                  value: roleItem?.role ?? '',
                  permissions: [],
                } as RoleResponse
              })

              updateUser({ roles: roleItems })
            }
          "
        />

        <MultiSelect
          label="Permissions"
          :options="permissions.map((p) => ({ label: p.name ?? '', value: p.guid ?? '' }))"
          :value="props.user.user.permissions ?? []"
          @change="(v: string[]) => updateUser({ permissions: v })"
        />

        <ServiceSelector
          :services="
            service.services !== null
              ? service.services?.map((s) => {
                  return {
                    id: s.guid ?? '',
                    name: s.name ?? '',
                  }
                })
              : []
          "
          :page-num="service.pageNum"
          :page-size="service.pageSize"
          :total="service.totalItems"
          :selected="props.user.user.services as SelectedService[]"
          @page-change="emit('changePage', $event)"
        >
          <template #datePicker="{ value, update }">
            <DatePicker :value="value" @update="update" />
          </template>
        </ServiceSelector>
      </div>
    </div>

    <div class="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
      <Button class="bg-gray-400" @click="emit('cancel', false)">
        <FontAwesomeIcon icon="x" />
      </Button>

      <Button class="bg-blue-600 text-white">
        <FontAwesomeIcon icon="user-plus" />
      </Button>
    </div>
  </div>
</template>
