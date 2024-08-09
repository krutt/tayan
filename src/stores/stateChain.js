/* ~~/src/stores/stateChain.js */

// imports
import { Address, Signer, Tap, Tx } from '@cmdcode/tapscript'
const {
  combineTwoPublicKeys,
  derivePublicKey,
  generatePrivateKey,
  generatePrivateKeyAvoidingPrefix,
  subtractTwoPrivateKeys,
} = useKeypair()
const { createNProfile } = useNostr()

// store
export const useStateChain = defineStore('stateChain', () => {
  // consts
  const network = 'regtest'
  const relay = 'wss://nostrue.com'
  const txfee = 500
  const { pushTransaction } = useAesir()

  // state
  let state = {}

  // refs
  let address = ref('')
  let coins = ref([])
  let nprofile = ref('')
  let privateKey = ref('')
  let publicKey = ref('')
  let role = ref('operator')
  let userId = ref('')

  // funcs
  let deposit = async utxo => {}

  let depositToStatechain = async utxo => {
    let amount = utxo.value
    if (amount - txfee < 0) return
    amount -= txfee

    // let multiplier = Math.floor(amount / 830)
    let multisigs = []
    for (let i = 0; i < 1; i++) {
      // TODO: replace 1 with amount of vtxos to create
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
            scriptPubKey: Address.toScriptPubKey(address.value),
            value: utxo.value,
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
    for (let i = 0; i < 1; i++) {
      // TODO: replace 1 with amount of vtxos to create
      let vtxo = {
        stateId: userId.value,
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
        label: '',
      }
      let numberOfStatuses = 2 // TODO: depends on amount of vtxos to create, multiples of two
      // receiveCoins([vtxo], i + 1, numberOfStatuses, true)
    }
    let signature = Signer.taproot.sign(privateKey.value, fundingTxData, 0)
    fundingTxData.vin[0].witness = [signature]
    let rawTransaction = Tx.encode(fundingTxData).hex
    await pushTransaction(rawTransaction)
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
    privateKey.value = fetchPrivateKey() || generatePrivateKey()
    publicKey.value = derivePublicKey(privateKey.value).substring(2)
    address.value = Address.fromScriptPubKey([1, privateKey.value], network)
    nprofile.value = createNProfile('nprofile', publicKey.value, [relay])
    storeNProfile(nprofile)
    storePrivateKey(privateKey.value)
    storePublicKey(publicKey.value)
    userId.value = makeUser()
    toast('Disposable statechain created', {
      description: `Statechain created under nprofile:${nprofile.value.substring(0, 20)}…`,
    })
  }

  let makeCoin = messageId => {
    let coinId = generatePrivateKey().substring(0, 32)
    let privkey = generatePrivateKeyAvoidingPrefix('00')
    let pubkey = derivePublicKey(privkey)
    let parityByte = pubkey.substring(0, 2)
    pubkey = pubkey.substring(2)
    let aValue = generatePrivateKey().substring(0, 62)
    let valueToKeep = subtractTwoPrivateKeys(privkey, aValue)
    privkey = null
    // update state
    state[userId.value]['vtxos'][coinId] = {
      valueToKeep,
      numberOfTimesSigned: 0,
      parityByte,
      pubkey,
    }
    // TODO: persist state
    return { aValue, coinId, parityByte, pubkey }
  }

  let makeUser = () => {
    let stateId = generatePrivateKey().substring(0, 32)
    let receiverPrivateKey = generatePrivateKey()
    let receiverPublicKey = derivePublicKey(receiverPrivateKey).substring(2)
    let address = Address.fromScriptPubKey([1, receiverPublicKey], network)
    // update state
    state[stateId] = {
      address,
      receiverPrivateKey,
      receiverPublicKey,
      relay,
      role: 'user',
      trustedOperators: [],
      utxos: {},
      vtxos: {},
    }
    return stateId
    // TODO: persist state
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
    address,
    deposit,
    depositToStatechain,
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
