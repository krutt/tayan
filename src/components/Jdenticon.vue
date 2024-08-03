<script setup>
import { toSvg } from 'jdenticon'

let props = defineProps(['address'])
let identicon = computed(() => toSvg(props.address, 36))
</script>

<template>
  <div v-html="identicon" style="border: solid 0.1em #ccc; border-radius: 50%" />
</template>
