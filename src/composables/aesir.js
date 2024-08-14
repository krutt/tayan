/* ~~/src/composables/aesir.js */

export const useAesir = () => {
  const rpcAuth = 'aesir:aesir'
  return {
    fastForward: async blocks => {
      if (!blocks) blocks = 100
      let { result } = await fetch('http://localhost:18443', {
        body: JSON.stringify({
          id: 'fastForwardNewAddress',
          jsonrpc: '1.0',
          method: 'getnewaddress',
          params: ['treasury', 'bech32'],
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
        .then(async response => await response.json())
      return await fetch('http://localhost:18443', {
        body: JSON.stringify({
          id: 'fastForward',
          jsonrpc: '1.0',
          method: 'generatetoaddress',
          params: [blocks, result],
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
        .then(async response => await response.json())
    },
    fetchBalance: async address => {
      if (!address || address.length == 0) return 0
      return await fetch('http://localhost:18443', {
        body: JSON.stringify({
          id: 'fetchBalance',
          jsonrpc: '1.0',
          method: 'scantxoutset',
          params: ['start', [`addr(${address})`]],
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
            return result.total_amount * 1e8
          }
        })
    },
    fetchUtxos: async address => {
      return await fetch('http://localhost:18443', {
        body: JSON.stringify({
          id: 'fetchBalance',
          jsonrpc: '1.0',
          method: 'scantxoutset',
          params: ['start', [`addr(${address})`]],
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
            return unspents.map(unspent => ({
              status: {
                block_height: unspent.height,
                block_time: 0,
              },
              txid: unspent.txid,
              value: unspent.amount * 1e8,
              vout: unspent.vout,
            }))
          }
        })
    },
    getBlockHeight: async () => {
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
    },
    pushTransaction: async rawTransaction => {
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
          return result  // txnHash
        })
    },
    tapFaucet: async address => {
      return await fetch('http://localhost:18443', {
        body: JSON.stringify({
          id: 'tapFaucet',
          jsonrpc: '1.0',
          method: 'generatetoaddress',
          params: [1, address],
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
    },
  }
}

export default useAesir
