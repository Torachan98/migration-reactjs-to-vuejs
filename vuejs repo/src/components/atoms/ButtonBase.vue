<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isTransparent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isTransparent: false,
})

const buttonClass = computed(() => [
  'rounded-lg py-2 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer',
  props.isTransparent ? 'bg-transparent' : 'bg-blue-600',
  props.isTransparent ? 'hover:bg-transparent' : 'hover:bg-blue-700',
])
</script>

<template>
  <button v-bind="$attrs" :class="buttonClass">
    <slot />
  </button>
</template>
