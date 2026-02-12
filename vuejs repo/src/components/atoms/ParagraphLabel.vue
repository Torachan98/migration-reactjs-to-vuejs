<script setup lang="ts">
import { useAttrs } from 'vue'

defineProps<{
  label?: string
}>()

const attrs = useAttrs()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-xs font-medium text-gray-500">
      {{ label }}
    </label>

    <textarea
      v-bind="attrs"
      :class="[
        'input w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
        attrs.class,
      ]"
    />
  </div>
</template>
