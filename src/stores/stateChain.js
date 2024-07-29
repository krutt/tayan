/* ~~/src/stores/stateChain.js */

// imports
import { Address, Tap, Tx } from '@cmdcode/tapscript'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from '@vue/reactivity'
import { toast } from 'vue-sonner'
import { useKeypair } from '@/composables/keypair'
import { useMutinyNet } from '@/stores/mutinyNet'
import { useNostr } from '@/composables/nostr'

// store
export const useStateChain = defineStore('stateChain', () => {
  // consts
  const network = 'testnet'
  const relay = 'wss://nostrue.com'
  const txfee = 500

  // refs
  let { address } = storeToRefs(useMutinyNet())
  let coins = ref([])
  let nprofile = ref('')
  let privateKey = ref('')
  let publicKey = ref('')
  let role = ref('operator')

  // funcs
  let deposit = utxo => {
    let amount = utxo.value
    if (amount - txfee < 0) return
    amount -= txfee

    // let multiplier = Math.floor(amount / 830)
    let multisigs = []
    const { combineTwoPublicKeys, derivePublicKey, generatePrivateKey } = useKeypair()
    for (let i = 0; i < 1; i++) {
      let multisigPrivkey = generatePrivateKey()
      let multisigPubkey = derivePublicKey(multisigPrivkey)
      let multisigPubkeyWithParity = derivePublicKey(multisigPrivkey) // TODO: check if necessary
      let messageId = generatePrivateKey().substring(0, 32)
      let aValue = '' // TODO: calculate by operator
      let parityByte = '' // TODO: calculate by operator
      let operatorMultisigPubkey = publicKey.value
      let coinId = '' // TODO: calculate by operator
      // create multisig
      let script = [multisigPubkey, 'OP_CHECKSIGVERIFY', operatorMultisigPubkey, 'OP_CHECKSIG']
      let backupPubkey = combineTwoPublicKeys(
        parityByte + operatorMultisigPubkey,
        multisigPubkeyWithParity
      ).substring(2)
      let tapTree = [Tap.encodeScript(script)]
      let [tpubkey] = Tap.getPubKey(backupPubkey, { tree: tapTree })
      let multisig = Address.p2tr.fromPubkey(tpubkey, network)
      multisigs.push({
        multisig,
        script,
        aValue,
        operatorMultisigPubkey,
        coinId,
        multisigPrivkey,
        amount,
        parityByte,
      })
    }

    // create backout transaction
    let fundingTxData = Tx.create({
      vin: [
        {
          txid: utxo.txid,
          vout: utxo.vout,
          prevout: {
            value: utxo.value,
            scriptPubKey: Address.toScriptPubKey(address),
          },
        },
      ],
      vout: [],
    })

    for (let i = 0; i < multisigs.length; i++) {
      fundingTxData.vout.push({
        scriptPubKey: Address.toScriptPubKey(multisigs[i].multisig),
        value: multisigs[i],
      })
    }
    let fundingTxid = Tx.util.getTxid(fundingTxData)
  }

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
    privateKey.value = fetchPrivateKey() || generatePrivateKey()
    publicKey.value = derivePublicKey(privateKey.value)
    nprofile.value = createNProfile('nprofile', publicKey.value, [relay])
    storeNProfile(nprofile)
    storePrivateKey(privateKey.value)
    storePublicKey(publicKey.value)
    toast('Disposable statechain created', {
      description: `Statechain created under nprofile:${nprofile.value.substring(0, 20)}…`,
    })
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
    deposit,
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
