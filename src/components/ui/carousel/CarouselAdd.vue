<script setup>
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useCarousel } from './useCarousel'

defineEmits(['notifyAdd'])
const props = defineProps({
  class: { type: null, required: false },
})

const { orientation, canAdd } = useCarousel()
</script>

<template>
  <Button
    :disabled="!canAdd"
    :class="
      cn(
        'touch-manipulation absolute h-8 w-8 rounded-full p-0',
        orientation === 'horizontal'
          ? '-right-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        props.class
      )
    "
    variant="outline"
    @click="$emit('notifyAdd')"
  >
    <slot>
      <Plus class="h-4 w-4 text-current" />
      <span class="sr-only">Add Item</span>
    </slot>
  </Button>
</template>
