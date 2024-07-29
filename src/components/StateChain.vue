<!-- ~~/src/components/StateChain.vue -->
<script setup>
/* imports */
import { onMounted, ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useMutinyNet } from '@/stores/mutinyNet'

/* components */
import { BadgePercent, Bitcoin } from 'lucide-vue-next'
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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

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
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <Carousel :opts="{ align: 'start' }" class="mx-20 relative w-auto">
            <CarouselContent>
              <CarouselItem
                class="md:basis-1/2 lg:basis-1/3"
                key="utxo.txid"
                v-for="(utxo, index) in utxos"
              >
                <div class="p-1">
                  <Card class="max-w-60">
                    <CardContent
                      class="flex flex-col aspect-square items-center justify-center p-6"
                    >
                      <Bitcoin :size="100" class="py-4" />
                      <span class="break-all font-semibold select-none text-md lg:text-xl">{{
                        utxo.txid
                      }}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselAdd disabled="true" />
          </Carousel>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel>
          <Carousel :opts="{ align: 'start' }" class="mx-20 relative w-auto">
            <CarouselContent>
              <CarouselItem
                class="md:basis-1/2 lg:basis-1/3"
                key="utxo.txid"
                v-for="(utxo, index) in utxos"
              >
                <div class="p-1">
                  <Card class="max-w-60">
                    <CardContent
                      class="flex flex-col aspect-square items-center justify-center p-6"
                    >
                      <BadgePercent :size="100" class="py-4" />
                      <span class="break-all font-semibold select-none text-md lg:text-xl">{{
                        utxo.txid
                      }}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselAdd disabled="true" />
          </Carousel>
        </ResizablePanel>
      </ResizablePanelGroup>
    </CardContent>
    <CardFooter class="justify-between space-x-2">
      <Button @click="$emit('unilateralExit')" variant="outline"> One-sided withdraw </Button>
      <Button @click="$emit('appendToWithdrawal')" variant="secondary"> Add to withdrawal </Button>
      <Button @click="$emit('commitState')"> Commit state </Button>
    </CardFooter>
  </Card>
</template>
