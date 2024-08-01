<script setup>
import { DrawerDescription } from 'vaul-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({ class: { type: null, required: false } })

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <DrawerDescription
    v-bind="delegatedProps"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </DrawerDescription>
</template>
