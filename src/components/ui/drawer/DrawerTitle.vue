<script setup>
import { DrawerTitle } from 'vaul-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({ class: { type: null, required: false } })
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <DrawerTitle
    v-bind="delegatedProps"
    :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)"
  >
    <slot />
  </DrawerTitle>
</template>
