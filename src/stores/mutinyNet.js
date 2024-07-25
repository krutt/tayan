/* ~~/src/stores/mutinyNet.js */

// imports
import { defineStore, storeToRefs } from 'pinia'
import { ref } from '@vue/reactivity'
import { useAlby } from '@/stores/alby'

// store
export const useMutinyNet = defineStore('mutinyNet', () => {
  // stores
  let alby = useAlby()
  let { address } = storeToRefs(alby)
  let balance = ref(0)

  // funcs
  let fetchBalance = async () => {
    await fetch(`https://mutinynet.com/api/address/${address.value}/utxo`)
      .catch(console.error)
      .then(async response => {
        if (!!response) {
          let utxos = await response.json()
          let confirmedUtxos = utxos.filter(utxo => utxo.status.confirmed)
          if (confirmedUtxos.length == 0) return
          balance.value = confirmedUtxos.reduce((accum, utxo) => accum + utxo.value, 0)
        }
      })
  }

  let tapFaucet = async () => {
    await fetch('https://faucet.mutinynet.com/api/onchain', {
      body: JSON.stringify({ address: address.value, sats: 100000 }),
      headers: { 'Content-Type': 'application/json;' },
      method: 'POST',
    })
      .catch(console.error)
      .then(console.log)
  }

  return { balance, fetchBalance, tapFaucet }
})

export default useMutinyNet
