<script setup>
/* imports */
import { computed, defineProps } from 'vue'
import { ref } from '@vue/reactivity'
import { toSvg } from 'jdenticon'

let props = defineProps(['address'])
let identicon = computed(() => toSvg(props.address, 36))
</script>

<template>
  <div v-html="identicon" style="border: solid .1em #CCC; border-radius: 50%" />
</template>
