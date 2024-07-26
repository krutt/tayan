/* ~~/src/stores/stateChain.js */

// imports
import { defineStore } from 'pinia'
import { ref } from '@vue/reactivity'
import { useKeypair } from '@/composables/keypair'

// store
export const useStateChain = defineStore('stateChain', () => {
  // consts
  const network = 'testnet'

  // refs
  let privateKey = ref('')
  let state = ref({})

  // funcs
  let initialize = () => {
    const { generatePrivateKey } = useKeypair()
    privateKey.value = generatePrivateKey()
    storePrivateKey(privateKey.value)
  }

  let fetchPrivateKey = () => {
    return localStorage.getItem('stateChainPrivateKey')
  }

  let storePrivateKey = value => {
    localStorage.setItem('stateChainPrivateKey', value)
  }

  return { initialize, state }
})

export default useStateChain
