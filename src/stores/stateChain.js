/* ~~/src/stores/stateChain.js */

// imports
import { defineStore } from 'pinia'
import { ref } from '@vue/reactivity'
import { useKeypair } from '@/composables/keypair'
import { useNostr } from '@/composables/nostr'

// store
export const useStateChain = defineStore('stateChain', () => {
  // consts
  const network = 'testnet'
  const relay = 'wss://nostrue.com'

  // refs
  let coins = ref([])
  let nprofile = ref('')
  let privateKey = ref('')
  let publicKey = ref('')
  let role = ref('operator')

  // funcs
  let fetchNProfile = () => {
    return localStorage.getItem('stateChainNProfile')
  }

  let fetchPrivateKey = () => {
    return localStorage.getItem('stateChainPrivateKey')
  }

  let fetchPublicKey = () => {
    return localStorage.getItem('stateChainPublicKey')
  }

  let initialize = () => {
    const { createNProfile } = useNostr()
    const { derivePublicKey, generatePrivateKey } = useKeypair()
    privateKey.value = generatePrivateKey()
    publicKey.value = derivePublicKey(privateKey.value)
    nprofile.value = createNProfile('nprofile', publicKey.value, [relay])
    storeNProfile(nprofile)
    storePrivateKey(privateKey.value)
    storePublicKey(publicKey.value)
  }

  let storeNProfile = value => {
    localStorage.setItem('stateChainNProfile', value)
  }

  let storePrivateKey = value => {
    localStorage.setItem('stateChainPrivateKey', value)
  }

  let storePublicKey = value => {
    localStorage.setItem('stateChainPublicKey', value)
  }

  return {
    fetchNProfile,
    fetchPrivateKey,
    fetchPublicKey,
    initialize,
    nprofile,
    privateKey,
    publicKey,
    storeNProfile,
    storePrivateKey,
    storePublicKey,
  }
})

export default useStateChain
