/* ~~/src/stores/alby.js */

// imports
import { defineStore } from 'pinia'
import { ref } from '@vue/reactivity'
import { toast } from 'vue-sonner'

// store
export const useAlby = defineStore('alby', () => {
  // refs
  let address = ref('')
  let derivationPath = ref('')
  let publicKey = ref('')

  // funcs
  let connectWallet = async () => {
    if (typeof window.webbtc !== 'undefined') {
      await window.webbtc.enable()
      let response = await window.webbtc.getAddress()
      storeAddress(response.address)
      storeDerivationPath(response.derivationPath)
      storePublicKey(response.publicKey)
      toast.success('Connected', {
        description: 'Successfully connected Alby Wallet Extension',

      })
    }
  }

  let storeAddress = value => {
    address.value = value
    localStorage.setItem('address', value)
  }

  let storeDerivationPath = value => {
    derivationPath.value = value
    localStorage.setItem('derivationPath', value)
  }

  let storePublicKey = value => {
    publicKey.value = value
    localStorage.setItem('publicKey', value)
  }

  let unsetAddress = () => {
    address.value = null
    localStorage.removeItem('address')
  }
  let unsetDerivationPath = () => {
    derivationPath.value = null
    localStorage.removeItem('derivationPath')
  }
  let unsetPublicKey = () => {
    publicKey.value = null
    localStorage.removeItem('publicKey')
  }

  return {
    address,
    connectWallet,
    derivationPath,
    publicKey,
    storeAddress,
    storeDerivationPath,
    storePublicKey,
    unsetAddress,
    unsetDerivationPath,
    unsetPublicKey,
  }
})

export default useAlby
