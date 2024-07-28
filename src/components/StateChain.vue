<!-- ~~/src/components/StateChain.vue -->
<script setup>
/* imports */
import { ref, watchEffect } from 'vue'

/* components */
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Carousel, CarouselAdd, CarouselContent, CarouselItem } from '@/components/ui/carousel'

defineEmits(['appendToWithdrawal', 'commitState', 'unilateralExit'])
let props = defineProps({
  nevents: Array,
  nprofile: String,
})

// refs
let count = ref(1)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle> Statechain </CardTitle>
      <CardDescription v-if="props.nprofile">
        You are an operator to the Statechain
      </CardDescription>
      <CardDescription v-else> You are a user to the Statechain </CardDescription>
    </CardHeader>
    <CardContent>
      <Carousel :opts="{ align: 'start' }" class="mr-20 relative w-auto">

        <CarouselContent>
          <CarouselItem class="lg:basis-1/3" key="index" v-for="(_, index) in count">
            <div class="p-1">
              <Card>
                <CardContent class="flex aspect-square items-center justify-center p-6">
                  <span class="text-3xl font-semibold">{{ index + 1 }}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselAdd @notify-add="count++" />
      </Carousel>
    </CardContent>
    <CardFooter class="justify-between space-x-2">
      <Button @click="$emit('unilateralExit')" variant="outline"> One-sided withdraw </Button>
      <Button @click="$emit('appendToWithdrawal')" variant="secondary"> Add to withdrawal </Button>
      <Button @click="$emit('commitState')"> Commit state </Button>
    </CardFooter>
  </Card>
</template>
