<script setup>
/* imports */
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Moon, Sun } from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'

/* composables */
let theme = useColorMode({ disableTransition: true })
</script>
<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" size="icon">
          <div v-if="theme == 'light'">
            <Moon />
          </div>
          <div v-else>
            <Sun class="dark:text-white" />
          </div>
          <span class="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="theme = 'light'"> Light </DropdownMenuItem>
        <DropdownMenuItem @click="theme = 'dark'"> Dark </DropdownMenuItem>
        <DropdownMenuItem @click="theme = 'system'"> System </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
