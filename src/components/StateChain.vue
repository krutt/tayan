<!-- ~~/src/components/StateChain.vue -->
<script setup>
/* components */
import { BadgePercent, Bitcoin } from 'lucide-vue-next'

defineEmits(['appendToWithdrawal', 'commitState', 'unilateralExit'])
let props = defineProps({
  nevents: Array,
  nprofile: String,
})

// stores
let mutinyNet = useAesir()
let stateChain = useStateChain()

// refs
let { utxos } = storeToRefs(mutinyNet)
let mutxos = ref([])
let vtxos = ref([])

// funcs
let { fetchBalance } = mutinyNet

// lifecycles
onMounted(async () => await fetchBalance())
</script>

<template>
  <card>
    <card-header>
      <card-title> Statechain </card-title>
      <card-description v-if="props.nprofile">
        The deposit address for the Statechain is {{ stateChain.address }}
        <span v-if="props.nprofile">
          You are an operator to the Statechain. Right-click on any of your UTXO to deposit to the
          Statechain.
        </span>
        <span v-else>
          You are a user to the Statechain. Right-click on any of your UTXO to deposit to the
          Statechain.
        </span>
      </card-description>
    </card-header>
    <card-content>
      <resizable-panel-group direction="horizontal">
        <resizable-panel>
          <carousel :opts="{ align: 'start' }" class="min-w-96 mr-10 relative w-11/12">
            <carousel-content>
              <carousel-item
                class="md:basis-1/2 lg:basis-1/3"
                key="index"
                v-for="(utxo, index) in mutxos"
              >
                <div class="p-1">
                  <context-menu>
                    <context-menu-trigger>
                      <card class="max-w-60">
                        <card-content
                          class="flex flex-col aspect-square items-center justify-center p-6"
                        >
                          <Bitcoin :size="100" class="py-4" />
                          <span class="break-all font-semibold select-none text-md lg:text-xl">
                            Amount:
                            <br />
                            {{ utxo.value }}
                          </span>
                        </card-content>
                      </card>
                    </context-menu-trigger>
                    <context-menu-content class="w-64">
                      <context-menu-label class="font-semibold select-none">
                        Block:&nbsp;
                        {{ utxo.status.block_height }}
                      </context-menu-label>
                      <context-menu-label class="font-semibold select-none">
                        Time:&nbsp;
                        {{ new Date(utxo.status.block_time * 1_000) }}
                      </context-menu-label>
                      <context-menu-label class="break-all font-semibold select-none">
                        UXID:&nbsp;
                        {{ utxo.txid }}
                      </context-menu-label>
                      <context-menu-separator />
                      <context-menu-item @click="stateChain.depositToStatechain(utxo)" inset>
                        Deposit to Statechain
                      </context-menu-item>
                    </context-menu-content>
                  </context-menu>
                </div>
              </carousel-item>
            </carousel-content>
          </carousel>
        </resizable-panel>
        <resizable-handle with-handle />
        <resizable-panel>
          <carousel :opts="{ align: 'start' }" class="min-w-96 mr-32 relative w-10/12">
            <carousel-content>
              <carousel-item
                class="md:basis-1/2 lg:basis-1/3"
                key="index"
                v-for="(vtxo, index) in vtxos"
              >
                <div class="p-1">
                  <card class="max-w-60">
                    <card-content
                      class="flex flex-col aspect-square items-center justify-center p-6"
                    >
                      <BadgePercent :size="100" class="py-4" />
                      <span class="break-all font-semibold select-none text-md lg:text-xl">{{
                        vtxo.txid
                      }}</span>
                    </card-content>
                  </card>
                </div>
              </carousel-item>
            </carousel-content>
            <carouselAdd disabled="true" v-if="vtxos.length" />
          </carousel>
        </resizable-panel>
      </resizable-panel-group>
    </card-content>
    <card-footer class="justify-between space-x-2">
      <Button @click="$emit('unilateralExit')" variant="outline"> One-sided withdraw </Button>
      <Button @click="$emit('appendToWithdrawal')" variant="secondary"> Add to withdrawal </Button>
      <Button @click="$emit('commitState')"> Commit state </Button>
      <drawer class="md:w-1/3 w-full">
        <drawer-trigger class="dark:text-white">
          <Button> Deposit to Statechain </Button>
        </drawer-trigger>
        <drawer-content class="flex items-center justify-center py-2 space-x-2">
          <drawer-header class="dark:text-white">
            <drawer-title> Select which UTXO to deposit to Statechain </drawer-title>
            <drawer-description>
              Right-click and select deposit to statechain when ready.
            </drawer-description>
          </drawer-header>
          <carousel :opts="{ align: 'start' }" class="min-w-96 mr-10 relative w-11/12">
            <carousel-content>
              <carousel-item
                class="md:basis-1/2 lg:basis-1/3"
                key="index"
                v-for="(utxo, index) in utxos"
              >
                <div class="p-1">
                  <context-menu>
                    <context-menu-trigger>
                      <card class="max-w-60">
                        <card-content
                          class="flex flex-col aspect-square items-center justify-center p-6"
                        >
                          <Bitcoin :size="100" class="py-4" />
                          <span class="break-all font-semibold select-none text-md lg:text-xl">
                            Amount:
                            <br />
                            {{ utxo.value }}
                          </span>
                        </card-content>
                      </card>
                    </context-menu-trigger>
                    <context-menu-content class="w-64">
                      <context-menu-label class="font-semibold select-none">
                        Block:&nbsp;
                        {{ utxo.status.block_height }}
                      </context-menu-label>
                      <context-menu-label class="font-semibold select-none">
                        Time:&nbsp;
                        {{ new Date(utxo.status.block_time * 1_000) }}
                      </context-menu-label>
                      <context-menu-label class="break-all font-semibold select-none">
                        UXID:&nbsp;
                        {{ utxo.txid }}
                      </context-menu-label>
                      <context-menu-separator />
                      <context-menu-item @click="stateChain.deposit(utxo)" inset>
                        Deposit to Statechain
                      </context-menu-item>
                    </context-menu-content>
                  </context-menu>
                </div>
              </carousel-item>
            </carousel-content>
          </carousel>
          <drawer-footer>
            <drawer-close>
              <Button class="dark:border-white dark:text-white" variant="outline"> Close </Button>
            </drawer-close>
          </drawer-footer>
        </drawer-content>
      </drawer>
    </card-footer>
  </card>
</template>
