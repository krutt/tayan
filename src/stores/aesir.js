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
        id: 'fetchBalance',
        jsonrpc: '1.0',
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
          let unspents = result.unspents.filter(unspent => unspent.amount > 0)
          if (unspents.length == 0) return
          utxos.value = unspents.map(unspent => ({
            status: {
              block_height: unspent.height,
              block_time: 0,
            },
            txid: unspent.txid,
            value: unspent.amount * 1e8,
            vout: unspent.vout,
          }))
          balance.value = result.total_amount * 1e8
        }
      })
  }

  let getBlockHeight = async () => {
    return await fetch('http://localhost:18443', {
      body: JSON.stringify({
        id: 'getBlockHeight',
        jsonrpc: '1.0',
        method: 'getblockchaininfo',
        params: [],
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
        let { result } = await response.json()
        return result.blocks
      })
  }

  let pushTransaction = async rawTransaction => {
    return await fetch('http://localhost:18443', {
      body: JSON.stringify({
        id: 'pushTransaction',
        jsonrpc: '1.0',
        method: 'sendrawtransaction',
        params: [rawTransaction],
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
        let { error, result } = await response.json()
        if (!!error) {
          console.error(error.code, error.message)
          return
        }
        console.log(result)
        return result
      })
  }

  let tapFaucet = async () => {
    await fetch('http://localhost:18443', {
      body: JSON.stringify({
        id: 'tapFaucet',
        jsonrpc: '1.0',
        method: 'generatetoaddress',
        params: [1, address.value],
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
        return Number(await response.json())
      })
  }

  return { balance, fetchBalance, getBlockHeight, pushTransaction, tapFaucet, utxos }
})

export default useAesir
