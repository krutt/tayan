<!-- ~~/src/components/StateChain.vue -->
<script setup>
/* imports */
import { onMounted, ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useMutinyNet } from '@/stores/mutinyNet'

/* components */
import { Bitcoin } from 'lucide-vue-next'
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

// stores
let mutinyNet = useMutinyNet()

// refs
let { utxos } = storeToRefs(mutinyNet)

// funcs
let { fetchBalance } = mutinyNet

// lifecycles
onMounted(async () => {
  console.log(utxos.value)
  await fetchBalance()
  console.log(utxos.value)
})
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
          <CarouselItem class="lg:basis-1/3" key="utxo.txid" v-for="(utxo, index) in utxos">
            <div class="p-1">
              <Card class="max-w-xs">
                <CardContent class="flex flex-col aspect-square items-center justify-center p-6">
                  <Bitcoin :size="100" class="py-4" />
                  <span class="break-all font-semibold text-xl">{{ utxo.txid }}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselAdd disabled="true" />
      </Carousel>
    </CardContent>
    <CardFooter class="justify-between space-x-2">
      <Button @click="$emit('unilateralExit')" variant="outline"> One-sided withdraw </Button>
      <Button @click="$emit('appendToWithdrawal')" variant="secondary"> Add to withdrawal </Button>
      <Button @click="$emit('commitState')"> Commit state </Button>
    </CardFooter>
  </Card>
</template>
