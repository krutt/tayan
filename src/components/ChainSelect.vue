<script setup>
/* imports */
import { toast } from 'vue-sonner'

/* vectors */
import { BitcoinEmblem } from '@/assets/bitcoin.svg'
import { MutinyNet } from '@/assets/mutiny-net.svg'

defineEmits(['select-chain'])

let menuActive = ref(false)
let chainActive = ref([regtest, signet, mainnet])
let selectedChain = $chain()

// funcs
let selectNetwork = async chain => {
  menuActive.value = false
  if (['signet', 'regtest', 'mainnet'].includes(chain)) {
    selectedChain.value = chain
  }
  toast('Network changed', {description: `Currently using ${ selectedChain.value }`})
  emit('select-chain', selectedChain.value)
}

// lifecycle hooks
onMounted(async () => {
  if (!!selectedChain.value) {
    await selectNetwork(selectedChain.value)
  }
})
</script>
<template>
  <div class="h-10 w-10 mr-5">
    <div
      @click.prevent="menuActive = !menuActive"
      v-click-outside="
        () => {
          menuActive = false
        }
      "
      id="chainselect"
      :aria-expanded="!menuActive"
      aria-haspopup="true"
      class="active:ring-2 active:ring-indigo-500 active:ring-offset-2 active:ring-offset-gray-100 border-2 border-current min-h-full min-w-full mx-3 rounded-full shadow-sm"
    >
      <foundry-icon class="h-full w-full fill-current p-0.5" v-if="!selectedChain" />
      <nova-icon class="p-2 h-full w-full p-1" v-if="selectedChain == 'nova-chain'" />
      <bnb-icon
        class="h-full w-full"
        v-if="['bsc-mainnet', 'bsc-testnet'].includes(selectedChain)"
      />
      <stellar-icon class="h-full w-full p-1" v-if="selectedChain == 'stellar'" />
    </div>
    <div
      aria-labelledby="chainselect"
      aria-hidden="true"
      aria-orientation="vertical"
      class="absolute z-10 mt-2 w-50 origin-top-right rounded-md bg-base-300 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      :class="{ hidden: !menuActive }"
      role="menu"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <a
          @click.prevent="selectNetwork('anvil')"
          :class="{ hidden: !chainActive[0] }"
          class="text-current block px-4 py-2 text-sm hover:bg-slate-300 hover:text-gray-500"
          href="#"
          role="menuitem"
          tabindex="-1"
        >
          Aesir
        </a>
        <a
          @click.prevent="selectNetwork('nova-chain')"
          :class="{ hidden: !chainActive[3] }"
          class="text-current block px-4 py-2 text-sm hover:bg-slate-300 hover:text-gray-500"
          href="#"
          role="menuitem"
          tabindex="0"
        >
          <mutiny-net class="h-full w-5 float-left display-inline-block" />
          <span class="px-4">Mutiny Net</span>
        </a>
        <a
          @click.prevent="selectNetwork('stellar')"
          class="text-current block px-4 py-2 text-sm hover:bg-slate-300 hover:text-gray-500"
          href="#"
          role="menuitem"
          tabindex="1"
          >
          <bitcoin-emblem class="h-6 w-auto float-left display-inline-block" />
          <span class="px-4">Mainnet</span>
        </a>
      </div>
    </div>
  </div>
</template>
