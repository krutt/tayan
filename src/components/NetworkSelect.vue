<script setup>
/* vectors */
import AesirCrest from '@/assets/aesir.svg'
import BitcoinEmblem from '@/assets/bitcoin.svg'
import MutinyNet from '@/assets/mutiny-net.svg'

defineEmits(['select-network'])
let selectedNetwork = ref('signet')

// funcs
let selectNetwork = network => {
  selectedNetwork.value = network
  toast('Network changed', { description: `Currently using ${selectedNetwork.value}` })
  emit('select-network', selectedNetwork.value)
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
    <dropdown-menu as-child>
      <dropdown-menu-trigger
        class="active:ring-2 active:ring-[#619B8A] active:ring-offset-2 active:ring-offset-[#A1C181] border-2 border-current min-h-full min-w-full mr-4 overflow-hidden rounded-full shadow-sm"
      >
        <aesir-crest class="h-full w-full fill-current" v-if="selectedNetwork == 'regtest'" />
        <bitcoin-emblem class="h-full w-full fill-current" v-if="selectedNetwork == 'mainnet'" />
        <mutiny-net class="h-full w-full fill-current" v-if="selectedNetwork == 'signet'" />
      </dropdown-menu-trigger>
      <dropdown-menu-content align="end">
        <dropdown-menu-label>My Account</dropdown-menu-label>
        <dropdown-menu-separator />
        <dropdown-menu-item @click.prevent="selectNetwork('mainnet')" disabled="true">
          <bitcoin-emblem class="h-8 w-8 mr-2" />
          Mainnet
        </dropdown-menu-item>
        <dropdown-menu-item @click.prevent="selectNetwork('signet')">
          <mutiny-net class="h-8 w-8 mr-2" />
          Signet
        </dropdown-menu-item>
        <dropdown-menu-item @click.prevent="selectNetwork('regtest')">
          <aesir-crest class="h-8 w-8 mr-2" />
          Regtest
        </dropdown-menu-item>
      </dropdown-menu-content>
    </dropdown-menu>
  </div>
</template>
