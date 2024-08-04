/* ~~/src/stores/aesir.js */

export const useAesir = defineStore('aesir', () => {
  let { address } = storeToRefs(useAlby())
  let balance = ref(0)
  let rpcAuth = 'aesir:aesir'
  let utxos = ref([])

  // funcs
  let fetchBalance = async () => {
    await fetch('http://localhost:18443', {
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: 'fetchBalance',
        method: 'scantxoutset',
        params: ['start', [`addr(${address.value})`]],

      }),
      credentials: 'same-origin',
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization: `Basic ${btoa(rpcAuth)}`,
        'Content-Type': 'application/json;',
      },
      method: 'POST',
    })
      .catch(console.error)
      .then(async response => {
        if (!!response) {
          let { result } = await response.json()
          utxos.value = result.unspents.filter(unspent => unspent.amount > 0)
          if (utxos.value.length == 0) return
          balance.value = result.total_amount
        }
      })
  }

  let getBlockHeight = async () => {
    return await fetch('http://localhost:18443', {
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: 'getBlockHeight',
        method: 'getblockchaininfo',
        params: [],
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization: `Basic ${btoa(rpcAuth)}`,
        'Content-Type': 'application/json;',
      },
      method: 'POST',
    })
      .catch(console.error)
      .then(async response => {
        let { result } = await response.json()
        return result.blocks
      })
  }

  let tapFaucet = async () => {
    await fetch('http://localhost:18443', {
      body: JSON.stringify(
        {
          jsonrpc: '1.0',
          id: 'tapFaucet',
          method: 'generatetoaddress',
          params: [100, address.value],
        }
      ),
      credentials: 'same-origin',
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization: `Basic ${btoa(rpcAuth)}`,
        'Content-Type': 'application/json;',
      },
      method: 'POST',
    })
      .catch(console.error)
      .then(async response => {
        return Number(await response.json())
      })
  }

  return { balance, fetchBalance, getBlockHeight, tapFaucet, utxos }
})

export default useMutinyNet
