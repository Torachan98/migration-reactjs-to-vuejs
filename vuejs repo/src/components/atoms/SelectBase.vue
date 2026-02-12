<script setup lang="ts">
import { useAttrs } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

type Option = {
  label: string
  value: string | number
}

defineProps<{
  options: Option[]
}>()

const attrs = useAttrs()
</script>

<template>
  <div :class="['relative inline-block', attrs.class]">
    <select
      v-bind="attrs"
      :class="[
        'w-full appearance-none border p-2 pr-10 rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
      ]"
    >
      <option v-for="o in options" :key="o.value" :value="o.value">
        {{ o.label }}
      </option>
    </select>

    <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
      <FontAwesomeIcon icon="caret-down" />
    </span>
  </div>
</template>
