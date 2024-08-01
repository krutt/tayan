/* ~~/src/stores/stateChain.js */

// imports
import { Address, Signer, Tap, Tx } from '@cmdcode/tapscript'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from '@vue/reactivity'
import { toast } from 'vue-sonner'
import { useAlby } from '@/stores/alby'
import { useKeypair } from '@/composables/keypair'
import { useNostr } from '@/composables/nostr'

// store
export const useStateChain = defineStore('stateChain', () => {
  // consts
  const network = 'testnet'
  const relay = 'wss://nostrue.com'
  const txfee = 500

  // refs
  let { address } = storeToRefs(useAlby())
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
    for (let i = 0; i < 1; i++) {  // TODO: replace 1 with amount of vtxos to create
      let multisigPrivkey = generatePrivateKey()
      let multisigPubkey = derivePublicKey(multisigPrivkey).substring(2)
      let multisigPubkeyWithParity = derivePublicKey(multisigPrivkey) // TODO: check if necessary
      let messageId = generatePrivateKey().substring(0, 32)
      let { aValue, coinId, parityByte } = makeCoin(messageId)
      let operatorMultisigPubkey = publicKey.value
      // create multisig
      let script = [multisigPubkey, 'OP_CHECKSIGVERIFY', operatorMultisigPubkey, 'OP_CHECKSIG']
      let backupPubkey = combineTwoPublicKeys(
        parityByte + operatorMultisigPubkey,
        multisigPubkeyWithParity
      ).substring(2)
      let tapTree = [Tap.encodeScript(script)]
      let [tpubkey] = Tap.getPubKey(backupPubkey, { tree: tapTree })
      let multisig = Address.p2tr.fromPubKey(tpubkey, network)
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
            scriptPubKey: Address.toScriptPubKey(address.value),
          },
        },
      ],
      vout: [],
    })

    for (let i = 0; i < multisigs.length; i++) {
      fundingTxData.vout.push({
        scriptPubKey: Address.toScriptPubKey(multisigs[i].multisig),
        value: multisigs[i].amount,
      })
    }
    let fundingTxid = Tx.util.getTxid(fundingTxData)
    // create vtxos
    for (let i = 0; i < 1; i++) {  // TODO: replace 1 with amount of vtxos to create
      let vtxo = {
        stateId: '',  // TODO: that's the current state
        type: 'statecoin',
        operator: nprofile.value,
        operatorMultisigPubkey: multisigs[i].operatorMultisigPubkey,
        parityByte: multisigs[i].parityByte,
        coinId: multisigs[i].coinId,
        fundingTxid,
        vout: i,
        aValue: multisigs[i].aValue,
        withdrawSignatures: [],
        priorTransactions: [],
        privateKey: multisigs[i].multisigPrivkey,
        amount,
        multisig: multisigs[i].multisig,
        script: multisigs[i].script,
        label: ''
      }
      let numberOfStatuses = 2  // TODO: depends on amount of vtxos to create, multiples of two
      // receiveCoins([vtxo], i + 1, numberOfStatuses, true)
    }
    let signature = Signer.taproot.sign(privateKey.value, fundingTxData, 0)
    fundingTxData.vin[0].witness = [signature]
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
    publicKey.value = derivePublicKey(privateKey.value).substring(2)
    nprofile.value = createNProfile('nprofile', publicKey.value, [relay])
    storeNProfile(nprofile)
    storePrivateKey(privateKey.value)
    storePublicKey(publicKey.value)
    toast('Disposable statechain created', {
      description: `Statechain created under nprofile:${nprofile.value.substring(0, 20)}…`,
    })
  }

  let makeCoin = messageId => {
    const {
      derivePublicKey,
      generatePrivateKey,
      generatePrivateKeyAvoidingPrefix,
      subtractTwoPrivateKeys,
    } = useKeypair()
    let coinId = generatePrivateKey().substring(0, 32)
    let privateKey = generatePrivateKeyAvoidingPrefix('00')
    let publicKey = derivePublicKey(privateKey)
    let parityByte = publicKey.substring(0, 2)
    publicKey = publicKey.substring(2)
    let aValue = generatePrivateKey().substring(0, 62)
    let valueToKeep = subtractTwoPrivateKeys(privateKey, aValue)
    privateKey = null
    // TODO: save state
    return { aValue, coinId, parityByte, publicKey }
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
