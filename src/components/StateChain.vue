<!-- ~~/src/components/StateChain.vue -->

<script setup>
/* components */
import { BadgePercent, Bitcoin } from 'lucide-vue-next'

/* composables */
let { fastForward, fetchUtxos, tapFaucet } = useAesir()

/* emits & props */
defineEmits(['appendToWithdrawal', 'commitState', 'unilateralExit'])
let props = defineProps({
  address: String,
  nevents: Array,
  nprofile: String,
})

/* stores */
let stateChain = useStateChain()
let userAddress = storeToRefs(useAlby()).address

/* refs */
let utxos = ref([])
let sutxos = ref([])
let vtxos = storeToRefs(stateChain).vtxos

/* lifecycles */
onMounted(async () => {
  utxos.value = await fetchUtxos(userAddress.value)
  sutxos.value = await fetchUtxos(stateChain.address)
})

/* functions */
let depositAndUpdateStatechainUtxos = async utxo => {
  await stateChain.deposit(utxo)
  sutxos.value = sutxos.value.filter(sutxo => sutxo.txid != utxo.txid)
}

let tapFaucetAndUpdateUtxos = async () => {
  await tapFaucet(props.address)
  sutxos.value = await fetchUtxos(props.address)
  await fastForward()
}
</script>

<template>
  <card>
    <card-header>
      <card-title> Statechain </card-title>
      <card-description v-if="props.address">
        The deposit address for the Statechain is {{ stateChain.address }}
        <br />
        <span v-if="props.address">
          You are an operator to the Statechain. Right-click on any of your UTXO to deposit to the
          Statechain.
        </span>
        <span v-else>
          You are a user to the Statechain. Right-click on any of your UTXO to deposit to the
          Statechain.
        </span>
        <Button @click="tapFaucetAndUpdateUtxos" variant="link"
          >Tap faucet to give starting fund to the Statechain.</Button
        >
      </card-description>
    </card-header>
    <card-content>
      <resizable-panel-group direction="horizontal">
        <resizable-panel>
          <h2 class="ml-4">
            Bitcoin UTXOs
          </h2>
          <h3 class="ml-4">
            Original. Pure. Classy.
          </h3>
          <div class="grid grid-cols-2 lg:grid-cols-3 min-w-96 mr-32 w-11/12">
            <card class="m-2 max-w-60 md:basis-1/2 lg:basis-1/3" v-for="(utxo, index) in sutxos">
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
                  <context-menu-item @click="depositAndUpdateStatechainUtxos(utxo)" inset>
                    Deposit to Statechain
                  </context-menu-item>
                </context-menu-content>
              </context-menu>
            </card>
          </div>
        </resizable-panel>
        <resizable-handle with-handle />
        <resizable-panel>
          <h2 class="ml-4">
            Statechain UTXOs
          </h2>
          <h3 class="ml-4">
            Faster and cheaper but more scaleable.
          </h3>
          <div class="grid grid-cols-2 lg:grid-cols-3 min-w-96 mr-32 w-11/12">
            <card class="m-2 max-w-60 md:basis-1/2 lg:basis-1/3" v-for="(vtxo, index) in vtxos">
              <card-content class="aspect-square items-center justify-center p-6">
                <BadgePercent :size="100" class="py-4" />
                <span class="break-all font-semibold select-none text-md lg:text-xl">{{
                  vtxo.txid
                }}</span>
              </card-content>
            </card>
          </div>
        </resizable-panel>
      </resizable-panel-group>
    </card-content>
    <card-footer class="justify-between space-x-2">
      <drawer class="md:w-1/3 w-full">
        <drawer-trigger class="dark:text-white">
          <Button variant="ghost"> Show User UTXOs </Button>
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
      <Button @click="$emit('unilateralExit')" :disabled="true" variant="outline">
        One-sided withdraw
      </Button>
      <Button @click="$emit('appendToWithdrawal')" :disabled="true" variant="ghost">
        Add to withdrawal
      </Button>
      <Button @click="$emit('commitState')" :disabled="true" variant="secondary">
        Commit state
      </Button>
    </card-footer>
  </card>
</template>
