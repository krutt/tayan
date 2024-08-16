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

export const useStateChain = defineStore('stateChain', () => {
  const network = 'regtest'
  const relay = 'wss://nostrue.com'
  const txfee = 500
  const { pushTransaction } = useAesir()

  /* state */
  let state = {}

  /* refs */
  let address = ref('')
  let coins = ref([])
  let nprofile = ref('')
  let privateKey = ref('')
  let publicKey = ref('')
  let role = ref('operator')
  let userId = ref('')

  /* functions */
  let deposit = async utxo => {
    let amount = utxo.value
    if (amount - txfee < 0) return
    amount -= txfee

    let divisor = 3 // TODO: allow customization
    let quotient = Math.floor(amount / divisor)
    let glutton = quotient + (amount % divisor)
    let decomposed = [glutton, ...Array(divisor - 1).fill(quotient)]
    let multisigs = []
    for (let i = 0; i < decomposed.length; i++) {
      let multisigPrivkey = generatePrivateKey()
      let multisigPubkeyWithParity = derivePublicKey(multisigPrivkey)
      let multisigPubkey = multisigPubkeyWithParity.substring(2)
      let messageId = generatePrivateKey().substring(0, 32)
      let { aValue, coinId, parityByte, pubkey } = makeCoin(messageId)  // TODO: done by operator via nostr
      let operatorMultisigPubkey = pubkey
      // create multisig
      let script = [multisigPubkey, 'OP_CHECKSIGVERIFY', operatorMultisigPubkey, 'OP_CHECKSIG']
      let backupPubkey = combineTwoPublicKeys(
        parityByte + operatorMultisigPubkey,
        multisigPubkeyWithParity
      ).substring(2)
      let tapTree = [Tap.encodeScript(script)]
      let [tapPubKey] = Tap.getPubKey(backupPubkey, { tree: tapTree })
      let multisig = Address.p2tr.fromPubKey(tapPubKey, network)
      multisigs.push({
        amount: decomposed[i],
        multisig,
        script,
        aValue,
        operatorMultisigPubkey,
        coinId,
        multisigPrivkey,
        parityByte,
      })
    }

    // create backout transaction
    let fundingTxData = Tx.create({
      vin: [
        {
          prevout: {
            scriptPubKey: Address.toScriptPubKey(address.value),
            // scriptPubKey: ['OP_1', publicKey.value],
            value: utxo.value,
          },
          txid: utxo.txid,
          vout: utxo.vout,
        },
      ],
      vout: [],
    })

    for (let multisig of multisigs) {
      fundingTxData.vout.push({
        scriptPubKey: Address.toScriptPubKey(multisig.multisig),
        value: multisig.amount,
      })
    }
    let fundingTxid = Tx.util.getTxid(fundingTxData)

    // create vtxos
    for (let i = 0; i < multisigs.length; i++) {
      let coin = {
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
        amount: multisigs[i].amount,
        multisig: multisigs[i].multisig,
        script: multisigs[i].script,
        label: '',
      }
      let numberOfStatuses = decomposed.length * 2
      await receiveCoins([coin], decomposed.length + i + 1, numberOfStatuses, true)
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
    address.value = Address.fromScriptPubKey([1, publicKey.value], network)
    nprofile.value = createNProfile('nprofile', publicKey.value, [relay])
    storeNProfile(nprofile.value)
    storePrivateKey(privateKey.value)
    storePublicKey(publicKey.value)
    loadState()
    userId.value = makeUser()
    toast('Disposable statechain created', {
      description: `Statechain created under nprofile:${nprofile.value.substring(0, 20)}…`,
    })
  }

  let loadState = () => {
    let saved = localStorage.getItem('state')
    if (!!saved) {
      state = JSON.parse(saved)
    } else {
      state = {}
    }
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
    persistState()
    return { aValue, coinId, parityByte, pubkey }
  }

  let makeUser = () => {
    let stateId = generatePrivateKey().substring(0, 32)
    let receiverPrivateKey = generatePrivateKey()
    let receiverPublicKey = derivePublicKey(receiverPrivateKey).substring(2)
    let receiver = Address.fromScriptPubKey([1, receiverPublicKey], network)
    // update state
    state[stateId] = {
      address: receiver,
      receiverPrivateKey,
      receiverPublicKey,
      relay,
      role: 'user',
      trustedOperators: [],
      utxos: {},
      vtxos: {},
    }
    persistState()
    return stateId
  }

  let persistState = () => {
    localStorage.setItem('state', JSON.stringify(state))
  }

  let receiveCoins = async (coins, status_index, numberOfStatuses, trusted = false) => {
    for (let coin of coins) {
      let { amount, fundingTxid, multisig, script, vout, withdrawSignatures } = coin
      let withdrawalTxData = Tx.create({
        vin: [
          {
            prevout: {
              scriptPubKey: Address.toScriptPubKey(multisig),
              value: amount,
            },
            txid: fundingTxid,
            vout,
          },
        ],
        vout: [
          {
            scriptPubKey: Address.toScriptPubKey(multisig),
            value: amount - 500,
          },
        ],
      })
      let target = Tap.encodeScript(script)
      let sighash = Signer.taproot.hash(withdrawalTxData, 0, { extension: target }).hex
      let initiateWithdrawalTxid = Tx.util.getTxid(withdrawalTxData)
      let lockingPeriod = 2016
      if (lockingPeriod - 3 * withdrawSignatures.length < 3) {
        // TODO: abort
        continue
      }
      let sequenceNumber = lockingPeriod - 3 * withdrawSignatures.length
      let withdrawalTxData2 = Tx.create({
        vin: [
          {
            prevout: {
              scriptPubKey: Address.toScriptPubKey(multisig),
              value: amount - 500,
            },
            txid: initiateWithdrawalTxid,
            vout: 0,
          },
        ],
        vout: [
          {
            scriptPubKey: Address.toScriptPubKey(/* address */),
            value: amount - 500,
          },
        ],
      })
      let sighash2 = Signer.taproot.hash(withdrawalTxData2, 0, {
        extension: target,
        sigflag: 128 | 3,
      }).hex
      // transferCoin(...)  // TODO: done by operator via nostr
    }
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
    fetchNProfile,
    fetchPrivateKey,
    fetchPublicKey,
    initialize,
    nprofile,
    persistState,
    privateKey,
    publicKey,
    receiveCoins,
    storeNProfile,
    storePrivateKey,
    storePublicKey,
  }
})

export default useStateChain
