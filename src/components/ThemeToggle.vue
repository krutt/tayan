<script setup>
/* imports */
import { Moon, Sun } from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'

/* composables */
let theme = useColorMode({ disableTransition: true })

/* functions */
let toggleTheme = () => (theme.value = theme.value !== 'dark' ? 'dark' : 'light')
</script>
<template>
  <div>
    <Button @click="toggleTheme" variant="outline" size="icon">
      <div v-if="theme == 'light'">
        <Moon />
      </div>
      <div v-else>
        <Sun class="dark:text-white" />
      </div>
      <span class="sr-only">Toggle theme</span>
    </Button>
  </div>
</template>
