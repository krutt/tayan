/* ~~/src/composables/mutinyNet.js */

export const useMutinyNet = () => {
  return {
    fetchBalance: async address => {
      return await fetch(`https://mutinynet.com/api/address/${address}/utxo`)
        .catch(console.error)
        .then(async response => {
          if (!!response) {
            data = await response.json()
            utxos = data.filter(utxo => utxo.status.confirmed)
            if (utxos.length == 0) return
            return utxos.reduce((accum, utxo) => accum + utxo.value, 0)
          }
        })
    },
    fetchUtxos: async address => {
      return await fetch(`https://mutinynet.com/api/address/${address}/utxo`)
        .catch(console.error)
        .then(async response => {
          if (!!response) {
            data = await response.json()
            return data.filter(utxo => utxo.status.confirmed)
          }
        })
    },
    getBlockHeight: async () => {
      return await fetch('https://mutinynet.com/api/blocks/tip/height')
        .catch(console.error)
        .then(async response => {
          return Number(await response.json())
        })
    },
    tapFaucet: async address => {
      return await fetch('https://faucet.mutinynet.com/api/onchain', {
        body: JSON.stringify({ address, sats: 100000 }),
        headers: { 'Content-Type': 'application/json;' },
        method: 'POST',
      })
        .catch(console.error)
        .then(console.log)
    },
  }
}

export default useMutinyNet
